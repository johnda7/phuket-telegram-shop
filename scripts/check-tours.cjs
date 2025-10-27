// Проверяем туры в Shopify
// Используем встроенный fetch

const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const STOREFRONT_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json';

const query = `
query {
  products(first: 10, query: "product_type:Excursions") {
    edges {
      node {
        id
        title
        handle
        productType
        tags
      }
    }
  }
}
`;

async function checkTours() {
  try {
    console.log('🔍 Проверяем туры в Shopify...\n');
    
    const response = await fetch(STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GraphQL ошибки:', data.errors);
      return;
    }

    if (data.data && data.data.products && data.data.products.edges) {
      console.log('🎯 Туры в Shopify:');
      data.data.products.edges.forEach(({ node }) => {
        console.log(`- ${node.title} (${node.handle})`);
        console.log(`  Теги: ${node.tags.join(', ')}`);
      });
      console.log(`\n📊 Всего туров: ${data.data.products.edges.length}`);
    } else {
      console.log('❌ Нет туров или ошибка:', data);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

checkTours();
