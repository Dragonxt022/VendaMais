const { Product, Category, Supplier, Company } = require('../models');

async function seed() {
  try {
    console.log('--- Iniciando Seeder de Produtos ---');

    // Busca dados base
    const company = await Company.findOne();
    if (!company) throw new Error('Nenhuma empresa encontrada. Rode as migrações/seeds base primeiro.');

    const categories = await Category.findAll({ where: { company_id: company.id } });
    const suppliers = await Supplier.findAll({ where: { company_id: company.id } });

    if (categories.length === 0 || suppliers.length === 0) {
      throw new Error('Certifique-se de ter ao menos uma categoria e um fornecedor cadastrados.');
    }

    const prefixes = ['Açaí', 'Suco', 'Lanche', 'Sobremesa', 'Bebida', 'Combo', 'Adicional', 'Extra'];
    const names = ['Pequeno', 'Médio', 'Grande', 'Premium', 'Especial', 'Tropical', 'Artesanal', 'Gourmet'];
    
    const products = [];
    const count = 1000;

    console.log(`Gerando ${count} produtos...`);

    for (let i = 1; i <= count; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const nameSuffix = names[Math.floor(Math.random() * names.length)];
      
      const price = (Math.random() * (50 - 5) + 5).toFixed(2);
      const cost = (price * (0.4 + Math.random() * 0.2)).toFixed(2);
      
      products.push({
        company_id: company.id,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        supplier_id: suppliers[Math.floor(Math.random() * suppliers.length)].id,
        name: `${prefix} ${nameSuffix} #${i}`,
        sku: `SKU-${1000 + i}`,
        description: `Descrição detalhada do produto ${i} para fins de teste de performance e listagem.`,
        price: price,
        cost: cost,
        stock_quantity: Math.floor(Math.random() * 100),
        min_stock: Math.floor(Math.random() * 20),
        manage_stock: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Inserindo no banco de dados...');
    await Product.bulkCreate(products);

    console.log('--- Seeder concluído com sucesso! ---');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao rodar seeder:', error);
    process.exit(1);
  }
}

seed();
