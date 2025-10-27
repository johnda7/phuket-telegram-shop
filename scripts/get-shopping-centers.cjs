// Используем встроенный fetch

const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const STOREFRONT_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json';

const query = `
query {
  products(first: 20, query: "product_type:Information") {
    edges {
      node {
        id
        title
        handle
        description
        images(first: 5) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        metafields(identifiers: [
          {namespace: "custom", key: "rating"}
          {namespace: "custom", key: "price_level"}
          {namespace: "custom", key: "working_hours"}
          {namespace: "custom", key: "coordinates"}
          {namespace: "custom", key: "district"}
        ]) {
          key
          value
        }
      }
    }
  }
}
`;

async function getShoppingCenters() {
  try {
    console.log('🔍 Получаем список торговых центров...\n');
    
    const response = await fetch(STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL ошибки:', data.errors);
      return;
    }

    console.log('=== ТОРГОВЫЕ ЦЕНТРЫ В SHOPIFY ===\n');
    
    data.data.products.edges.forEach(({node}, index) => {
      console.log(`${index + 1}. ${node.title}`);
      console.log(`   Handle: ${node.handle}`);
      console.log(`   ID: ${node.id}`);
      console.log(`   Фото: ${node.images.edges.length} шт`);
      console.log(`   Описание: ${node.description ? 'Есть' : 'Нет'}`);
      
      // Показываем metafields
      if (node.metafields && node.metafields.length > 0) {
        console.log('   Metafields:');
        node.metafields.forEach(meta => {
          if (meta && meta.key) {
            console.log(`     ${meta.key}: ${meta.value}`);
          }
        });
      }
      
      console.log('');
    });

    console.log(`\n📊 Всего торговых центров: ${data.data.products.edges.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

getShoppingCenters();
