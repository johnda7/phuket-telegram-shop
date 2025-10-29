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
    console.log('🔄 Обновляем Jungceylon с текстовым описанием...');
    
    // Получаем ID продукта
    const getProductQuery = `query { productByHandle(handle: "jungceylon-shopping-center") { id title } }`;
    const productResult = await makeGraphQLRequest(getProductQuery);
    
    if (!productResult.data.productByHandle) {
      console.log('❌ Продукт не найден');
      return;
    }
    
    const productId = productResult.data.productByHandle.id;
    console.log('Product ID:', productId);
    
    // Простое текстовое описание
    const textDescription = `🛍️ Jungceylon Shopping Center (Джангцелон) - Крупнейший торговый центр в самом центре Патонга

⭐ Рейтинг: 4.6/5
💰 Ценовой уровень: $$
📍 Район: Патонг
🕐 Часы работы: 11:00-23:00 ежедневно
🚗 Парковка: Бесплатная

О торговом центре:
Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.

🛒 Магазины и бутики:
• H&M, Zara, Uniqlo, Adidas, Nike
• Sephora, Boots, Watsons
• Магазины техники, аксессуары

🍽️ Еда и напитки:
• Тайская, китайская, японская, европейская кухня
• Starbucks, McDonald's, местные кафе

⭐ Обязательно к посещению:
🎬 Major Cineplex - Современные залы с 3D фильмами и комфортными креслами

Удобства:
📶 Wi-Fi | 🅿️ Парковка | 🍽️ Фуд-корт | 🎬 Кино | 🎳 Боулинг | 👶 Детские зоны

Планируете поездку?
🏝️ Туры с гидом | 🚗 Аренда авто | 💱 Обмен валюты

Jungceylon — это не просто торговый центр, это центр жизни Патонга. Здесь можно провести целый день: пошопиться, поесть, развлечься и отдохнуть в прохладе кондиционеров.`;
    
    const mutation = `mutation {
      productUpdate(input: {
        id: "${productId}",
        description: ${JSON.stringify(textDescription)}
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
      console.log('✅ Jungceylon успешно обновлен с текстовым описанием!');
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

updateJungceylon();
