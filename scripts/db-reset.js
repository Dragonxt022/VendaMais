const { sequelize, Company, User, Category, Supplier, AccountCategory } = require('../src/models');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    console.log('--- RESETANDO BANCO DE DADOS (DROP & CREATE) ---');
    console.log(`Dialeto ativo: ${sequelize.getDialect()}`);

    await sequelize.sync({ force: true });
    console.log('Tabelas recriadas com sucesso.');

    const company = await Company.create({
      name: 'VendaMais Demo',
      cnpj: '12345678000195',
      plan: 'pro',
      status: 'active'
    });
    console.log('Empresa demo criada.');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Administrador',
      email: 'admin@vendamais.com',
      password_hash: hashedPassword,
      role: 'admin',
      company_id: company.id
    });

    const gerentePassword = await bcrypt.hash('teste123', 10);
    await User.create({
      name: 'Gerente Teste',
      email: 'gerente@teste.com',
      password_hash: gerentePassword,
      role: 'gerente',
      company_id: company.id
    });
    console.log('Usuarios base criados (admin@vendamais.com / gerente@teste.com).');

    await Category.create({
      name: 'Geral',
      color: '#orange',
      company_id: company.id
    });

    await Supplier.create({
      name: 'Fornecedor Padrao',
      company_id: company.id
    });
    await AccountCategory.create({
      name: 'Outro',
      description: 'Categoria padrao para contas a pagar',
      color: '#94a3b8',
      company_id: company.id
    });
    console.log('Categoria, Fornecedor e Categoria de Contas base criados.');

    console.log('\n--- RESET CONCLUIDO ---');
    console.log('Acesse com: gerente@teste.com / teste123');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar banco:', error);
    process.exit(1);
  }
}

reset();
