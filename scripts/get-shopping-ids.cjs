// Получаем ID всех торговых центров для обновления

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

const handles = [
  'central-phuket-floresta',
  'jungceylon-shopping-center', 
  'premium-outlet-phuket',
  'big-c-supercenter-phuket',
  'tesco-lotus-phuket',
  'robinson-lifestyle-phuket'
];

async function getProductIds() {
  console.log('🔍 Получаем ID торговых центров...\n');
  
  for (const handle of handles) {
    const query = `
      query {
        productByHandle(handle: "${handle}") {
          id
          title
          handle
        }
      }
    `;

    try {
      const response = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_TOKEN
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error(`❌ Ошибка для ${handle}:`, data.errors);
        continue;
      }

      if (data.data.productByHandle) {
        console.log(`✅ ${data.data.productByHandle.title}`);
        console.log(`   Handle: ${data.data.productByHandle.handle}`);
        console.log(`   ID: ${data.data.productByHandle.id}`);
        console.log('');
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

getProductIds().catch(console.error);
