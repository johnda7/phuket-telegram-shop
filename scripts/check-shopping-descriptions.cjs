// Проверяем описания всех торговых центров

const STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';
const STOREFRONT_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/api/2025-07/graphql.json';

const handles = [
  'central-phuket-floresta',
  'jungceylon-shopping-center', 
  'premium-outlet-phuket',
  'big-c-supercenter-phuket',
  'tesco-lotus-phuket',
  'robinson-lifestyle-phuket'
];

async function checkDescriptions() {
  console.log('🔍 Проверяем описания торговых центров...\n');
  
  for (const handle of handles) {
    const query = `
      query {
        productByHandle(handle: "${handle}") {
          id
          title
          handle
          description
          descriptionHtml
        }
      }
    `;

    try {
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
        console.error(`❌ Ошибка для ${handle}:`, data.errors);
        continue;
      }

      if (data.data.productByHandle) {
        const product = data.data.productByHandle;
        console.log(`\n📦 ${product.title}`);
        console.log(`   Handle: ${product.handle}`);
        console.log(`   ID: ${product.id}`);
        
        if (product.description) {
          console.log(`   Описание (plain): ${product.description.substring(0, 100)}...`);
        } else {
          console.log(`   ❌ Нет описания (plain)`);
        }
        
        if (product.descriptionHtml) {
          console.log(`   Описание (HTML): ${product.descriptionHtml.substring(0, 100)}...`);
        } else {
          console.log(`   ❌ Нет описания (HTML)`);
        }
        
        // Проверяем уникальность описания
        if (product.description && product.description.includes('Central Phuket')) {
          console.log(`   ✅ Описание соответствует: Central Phuket`);
        } else if (product.description && product.description.includes('Jungceylon')) {
          console.log(`   ✅ Описание соответствует: Jungceylon`);
        } else if (product.description && product.description.includes('Premium Outlet')) {
          console.log(`   ✅ Описание соответствует: Premium Outlet`);
        } else if (product.description && product.description.includes('Big C')) {
          console.log(`   ✅ Описание соответствует: Big C`);
        } else if (product.description && product.description.includes('Tesco Lotus')) {
          console.log(`   ✅ Описание соответствует: Tesco Lotus`);
        } else if (product.description && product.description.includes('Robinson Lifestyle')) {
          console.log(`   ✅ Описание соответствует: Robinson Lifestyle`);
        } else {
          console.log(`   ❌ Описание не соответствует названию!`);
        }
      } else {
        console.log(`❌ Не найден: ${handle}`);
      }

    } catch (error) {
      console.error(`❌ Ошибка для ${handle}:`, error.message);
    }

    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

checkDescriptions().catch(console.error);
