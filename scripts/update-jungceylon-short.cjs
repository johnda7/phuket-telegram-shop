const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';

async function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: '/admin/api/2025-07/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function updateJungceylon() {
  try {
    console.log('🔄 Обновляем Jungceylon с коротким описанием...');
    
    // Получаем ID продукта
    const getProductQuery = `query { productByHandle(handle: "jungceylon-shopping-center") { id title } }`;
    const productResult = await makeGraphQLRequest(getProductQuery);
    
    if (!productResult.data.productByHandle) {
      console.log('❌ Продукт не найден');
      return;
    }
    
    const productId = productResult.data.productByHandle.id;
    console.log('Product ID:', productId);
    
    // Короткое описание
    const shortDescription = `🛍️ Jungceylon Shopping Center (Джангцелон)

Крупнейший торговый центр в самом центре Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.

⭐ Рейтинг: 4.6/5
💰 Ценовой уровень: $$
📍 Район: Патонг
🕐 Часы работы: 11:00-23:00 ежедневно
🚗 Парковка: Бесплатная

Магазины: H&M, Zara, Uniqlo, Adidas, Nike, Sephora, Boots, Watsons
Еда: Тайская, китайская, японская, европейская кухня, Starbucks, McDonald's
Развлечения: Major Cineplex (кино), боулинг, детские зоны

Обязательно к посещению: Major Cineplex - современные залы с 3D фильмами

Удобства: Wi-Fi, парковка, фуд-корт, кино, боулинг, детские зоны

Планируете поездку? Забронируйте тур с гидом, арендуйте авто или обменяйте валюту!`;
    
    const mutation = `mutation {
      productUpdate(input: {
        id: "${productId}",
        description: ${JSON.stringify(shortDescription)}
      }) {
        product { id title }
        userErrors { field message }
      }
    }`;
    
    console.log('Executing mutation...');
    const updateResult = await makeGraphQLRequest(mutation);
    
    if (updateResult.data.productUpdate.userErrors.length > 0) {
      console.log('❌ Ошибки:', updateResult.data.productUpdate.userErrors);
    } else {
      console.log('✅ Jungceylon успешно обновлен!');
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

updateJungceylon();
