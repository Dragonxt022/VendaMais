const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    return build();
  }

  if (user.role === 'admin') {
    can('manage', 'all');
  } else if (user.role === 'gerente' || user.role === 'user') {
    // Gerente (SaaS user) or legacy 'user' role has full access to their company's data
    can('manage', 'all', { company_id: user.company_id });
    
    // But cannot touch global catalog unless allowed
    cannot('manage', 'GlobalProduct');
    can('read', 'GlobalProduct');
  } else if (user.role === 'colaborador') {
    // Colaborador (employees) can manage operational data
    can('read', 'all', { company_id: user.company_id });
    can('manage', 'Product', { company_id: user.company_id });
    can('manage', 'StockMovement', { company_id: user.company_id });
    can('manage', 'Category', { company_id: user.company_id });
    can('manage', 'Supplier', { company_id: user.company_id });
    
    // Cannot manage company profile or other users (usually)
    cannot('manage', 'Company');
    cannot('manage', 'User');
    can('read', 'Company', { id: user.company_id });
    can('read', 'User', { id: user.id }); // Can read own profile
  } else if (user.role === 'usuario') {
    // Usuario (customer) can only browse products
    can('read', 'Product', { company_id: user.company_id });
    can('read', 'Category', { company_id: user.company_id });
  }

  return build();
}

module.exports = { defineAbilitiesFor };
