// Проверяем Robinson Lifestyle Phuket в Shopify
// Используем встроенный fetch

const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const STOREFRONT_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json';

const query = `
query {
  product(handle: "robinson-lifestyle-phuket") {
    id
    title
    handle
    descriptionHtml
    productType
    tags
    images(first: 10) {
      edges {
        node {
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
`;

async function checkRobinson() {
  try {
    console.log('🔍 Проверяем Robinson Lifestyle Phuket...\n');
    
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

    if (data.data && data.data.product) {
      const product = data.data.product;
      console.log('🏢 Robinson Lifestyle Phuket:');
      console.log('   ID:', product.id);
      console.log('   Title:', product.title);
      console.log('   Handle:', product.handle);
      console.log('   Type:', product.productType);
      console.log('   Tags:', product.tags.join(', '));
      console.log('   Images:', product.images.edges.length);
      console.log('   Description length:', product.descriptionHtml ? product.descriptionHtml.length : 0);
      console.log('   Metafields:');
      if (product.metafields && product.metafields.length > 0) {
        product.metafields.forEach(meta => {
          if (meta && meta.key) {
            console.log(`     ${meta.key}: ${meta.value}`);
          }
        });
      } else {
        console.log('     Нет metafields');
      }
      
      console.log('\n📝 Описание:');
      console.log(product.descriptionHtml);
    } else {
      console.log('❌ Product not found or error:', data);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

checkRobinson();
