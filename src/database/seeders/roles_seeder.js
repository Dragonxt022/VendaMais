const { User, Company, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Check if company exists
    let company = await Company.findOne({ where: { cnpj: '00.000.000/0001-91' } });
    if (!company) {
      company = await Company.create({
        name: 'Empresa Teste SaaS',
        cnpj: '00.000.000/0001-91',
        plan: 'pro',
        status: 'active'
      });
    }

    const password = await bcrypt.hash('123456', 12);

    const users = [
      {
        name: 'Admin Global',
        email: 'admin@vendamais.com',
        password_hash: password,
        role: 'admin',
        company_id: company.id
      },
      {
        name: 'Gerente da Loja',
        email: 'gerente@teste.com',
        password_hash: password,
        role: 'gerente',
        company_id: company.id
      },
      {
        name: 'Colaborador Vendas',
        email: 'colab@teste.com',
        password_hash: password,
        role: 'colaborador',
        company_id: company.id
      },
      {
        name: 'Cliente Final',
        email: 'cliente@teste.com',
        password_hash: password,
        role: 'usuario',
        company_id: company.id
      }
    ];

    for (const u of users) {
      const exists = await User.findOne({ where: { email: u.email } });
      if (!exists) {
        await User.create(u);
        console.log(`Usuário criado: ${u.name} (${u.role})`);
      } else {
        await User.update({ role: u.role }, { where: { email: u.email } });
        console.log(`Usuário atualizado: ${u.name} (${u.role})`);
      }
    }

    console.log('Seed de roles concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  }
}

seed();
