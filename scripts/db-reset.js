const { sequelize, Company, User, Category, Supplier } = require('../src/models');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    console.log('--- RESETANDO BANCO DE DADOS (DROP & CREATE) ---');
    
    // 1. Force sync (drops and recreates tables)
    await sequelize.sync({ force: true });
    console.log('✅ Tabelas recriadas com sucesso.');

    // 2. Base Company
    const company = await Company.create({
      name: 'VendaMais Demo',
      cnpj: '12345678000195',
      plan: 'pro',
      status: 'active'
    });
    console.log('✅ Empresa demo criada.');

    // 3. Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Administrador',
      email: 'admin@vendamais.com',
      password_hash: hashedPassword,
      role: 'admin',
      company_id: company.id
    });

    // 4. Test User (Gerente)
    const gerentePassword = await bcrypt.hash('teste123', 10);
    await User.create({
      name: 'Gerente Teste',
      email: 'gerente@teste.com',
      password_hash: gerentePassword,
      role: 'gerente',
      company_id: company.id
    });
    console.log('✅ Usuários base criados (admin@vendamais.com / gerente@teste.com).');

    // 5. Default Category & Supplier (needed for product seeder)
    const category = await Category.create({
      name: 'Geral',
      color: '#orange',
      company_id: company.id
    });
    
    const supplier = await Supplier.create({
      name: 'Fornecedor Padrão',
      company_id: company.id
    });
    console.log('✅ Categoria e Fornecedor base criados.');

    console.log('\n--- RESET CONCLUÍDO ---');
    console.log('Acesse com: gerente@teste.com / teste123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  }
}

reset();
