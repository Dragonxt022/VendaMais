const { Company, User } = require('../models');
const bcrypt = require('bcryptjs');

async function seedBase() {
  try {
    console.log('Criando empresa base...');
    
    // Criar empresa
    const company = await Company.create({
      name: 'VendaMais Demo',
      cnpj: '12345678000195',
      plan: 'pro',
      status: 'active'
    });
    
    console.log('Criando usuário admin...');
    
    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      name: 'Administrador',
      email: 'admin@vendamais.com',
      password_hash: hashedPassword,
      role: 'admin',
      company_id: company.id
    });
    
    console.log('Empresa e usuário criados com sucesso!');
    console.log('Empresa: ' + company.name + ' (ID: ' + company.id + ')');
    console.log('Usuário: ' + user.email + ' (ID: ' + user.id + ')');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar dados base:', error);
    process.exit(1);
  }
}

seedBase();