// Скрипт для загрузки всех торговых центров Пхукета в Shopify
// Исправленная версия согласно AI_AGENT_SHOPIFY_GUIDE.md

const https = require('https');

const SHOPIFY_STORE = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const SHOPIFY_API_VERSION = '2025-07';

const shoppingCenters = [
  {
    title: "Central Phuket Floresta",
    handle: "central-phuket-floresta",
    description: "Central Phuket – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.<br><br><strong>Central Festival:</strong><br>- Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas<br>- Косметика: Sephora, Boots<br>- Электроника: Apple, Samsung, Sony<br>- Супермаркет Tops Market<br><br><strong>Central Floresta:</strong><br>- Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel<br>- Ювелирные магазины<br>- Премиум рестораны<br><br><strong>Развлечения:</strong><br>- Кинотеатр SF Cinema<br>- Детская игровая зона<br>- Аквариум<br>- Фуд-корт с тайской и международной кухней<br><br><strong>Удобства:</strong><br>- Бесплатная парковка<br>- Бесплатный Wi-Fi<br>- Банкоматы<br>- Обмен валюты<br>- Кондиционеры",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:PhuketTown", "shopping", "mall", "luxury", "popular"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.8904,98.2924", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.6", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["wifi", "parking", "food-court", "cinema", "kids-zone", "aquarium", "atm", "currency-exchange"]), type: "json" }
    ]
  },
  {
    title: "Jungceylon Shopping Center",
    handle: "jungceylon-shopping-center",
    description: "Jungceylon – крупнейший торговый центр в Патонге, расположенный в самом сердце туристической зоны. Идеальное место для шоппинга после пляжа.<br><br><strong>Магазины:</strong><br>- Супермаркет Big C Extra<br>- Магазины одежды: Uniqlo, H&M, Zara<br>- Электроника: Power Buy, Banana IT<br>- Косметика: Boots, Watsons<br>- Сувениры и подарки<br><br><strong>Развлечения:</strong><br>- Кинотеатр SF Cinema<br>- Боулинг<br>- Детская игровая зона<br>- Фуд-корт с разнообразной кухней<br><br><strong>Особенности:</strong><br>- Расположен рядом с пляжем Патонг<br>- Много ресторанов и кафе<br>- Вечерние шоу и мероприятия<br>- Близко к ночной жизни Патонга",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:Patong", "shopping", "mall", "tourist", "beach-nearby"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.4", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "Patong", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "11:00-23:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["wifi", "parking", "food-court", "cinema", "bowling", "atm"]), type: "json" }
    ]
  },
  {
    title: "Premium Outlet Phuket",
    handle: "premium-outlet-phuket",
    description: "Premium Outlet Phuket – это рай для любителей скидок, предлагающий широкий ассортимент брендовой одежды, обуви и аксессуаров со скидками до 70%.<br><br><strong>Магазины:</strong><br>- Международные бренды: Nike, Adidas, Levi's, Guess, Lacoste<br>- Тайские бренды<br>- Спортивные товары<br>- Товары для дома<br><br><strong>Особенности:</strong><br>- Скидки круглый год<br>- Большая территория с открытыми галереями<br>- Кафе и рестораны<br>- Бесплатная парковка",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:Thalang", "shopping", "outlet", "discounts", "brands"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.9300,98.3700", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.2", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "Thalang", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "10:00-21:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["parking", "cafe", "restaurants", "wifi"]), type: "json" }
    ]
  },
  {
    title: "Big C Supercenter Phuket",
    handle: "big-c-supercenter-phuket",
    description: "Big C Supercenter – один из крупнейших гипермаркетов на Пхукете, предлагающий широкий ассортимент продуктов питания, бытовой химии, одежды и электроники по доступным ценам.<br><br><strong>Что здесь есть:</strong><br>- Продуктовый супермаркет<br>- Отделы одежды и обуви<br>- Электроника и бытовая техника<br>- Фуд-корт<br>- Аптека<br><br><strong>Особенности:</strong><br>- Низкие цены<br>- Большой выбор местных продуктов<br>- Удобное расположение<br>- Бесплатная парковка",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:PhuketTown", "shopping", "supermarket", "groceries", "budget"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.8900,98.3800", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.0", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "09:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["parking", "food-court", "atm", "pharmacy"]), type: "json" }
    ]
  },
  {
    title: "Tesco Lotus Phuket",
    handle: "tesco-lotus-phuket",
    description: "Tesco Lotus – еще один крупный гипермаркет на Пхукете, предлагающий широкий выбор товаров от продуктов питания до электроники. Отличное место для ежедневных покупок.<br><br><strong>Что здесь есть:</strong><br>- Продуктовый супермаркет<br>- Отделы одежды и обуви<br>- Электроника<br>- Фуд-корт<br>- Банки и банкоматы<br><br><strong>Особенности:</strong><br>- Большой выбор товаров<br>- Удобное расположение<br>- Доступные цены<br>- Бесплатная парковка",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:PhuketTown", "shopping", "supermarket", "groceries", "everyday"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.9000,98.3700", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.1", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "09:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["parking", "food-court", "atm", "bank"]), type: "json" }
    ]
  },
  {
    title: "Robinson Lifestyle Phuket",
    handle: "robinson-lifestyle-phuket",
    description: "Robinson Lifestyle Phuket – современный торговый центр, предлагающий широкий выбор магазинов, ресторанов и развлечений. Идеально подходит для семейного отдыха и шоппинга.<br><br><strong>Что здесь есть:</strong><br>- Магазины одежды и аксессуаров<br>- Рестораны и кафе<br>- Кинотеатр<br>- Детская игровая зона<br>- Супермаркет Tops Market<br><br><strong>Особенности:</strong><br>- Современный дизайн<br>- Уютная атмосфера<br>- Разнообразие магазинов<br>- Бесплатная парковка",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:PhuketTown", "shopping", "mall", "lifestyle", "family"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.8800,98.3900", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.3", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "PhuketTown", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "10:00-22:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["parking", "wifi", "food-court", "cinema", "kids-zone", "atm"]), type: "json" }
    ]
  },
  {
    title: "Patong Night Market",
    handle: "patong-night-market",
    description: "Patong Night Market – один из самых популярных ночных рынков на Пхукете, расположенный в самом сердце Патонга. Здесь можно найти всё: от традиционных тайских сувениров до модной одежды и аксессуаров.<br><br><strong>Что здесь есть:</strong><br>- Тайские сувениры и подарки<br>- Одежда и аксессуары<br>- Украшения и бижутерия<br>- Тайская еда и напитки<br>- Массаж и спа-услуги<br><br><strong>Особенности:</strong><br>- Работает до поздней ночи<br>- Можно торговаться<br>- Атмосфера настоящего Таиланда<br>- Близко к пляжу Патонг",
    productType: "place",
    vendor: "PhuketDa Insider",
    tags: ["place", "category:shopping", "district:Patong", "shopping", "market", "night", "souvenirs", "bargaining"],
    metafields: [
      { namespace: "place_info", key: "coordinates", value: "7.8965,98.2965", type: "single_line_text_field" },
      { namespace: "place_info", key: "rating", value: "4.3", type: "number_decimal" },
      { namespace: "place_info", key: "district", value: "Patong", type: "single_line_text_field" },
      { namespace: "place_info", key: "hours", value: "18:00-02:00 ежедневно", type: "single_line_text_field" },
      { namespace: "place_info", key: "amenities", value: JSON.stringify(["food", "massage", "souvenirs", "bargaining"]), type: "json" }
    ]
  }
];

function shopifyAdminRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    const options = {
      hostname: SHOPIFY_STORE,
      path: `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.errors) {
            reject(new Error(`GraphQL Errors: ${JSON.stringify(jsonData.errors)}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function checkProductExists(handle) {
  const query = `
    query productByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;
  const response = await shopifyAdminRequest(query, { handle });
  return response.data.productByHandle;
}

async function createProduct(productData) {
  console.log(`\n📦 Создаём продукт: ${productData.title}...`);

  const mutation = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: productData.title,
    handle: productData.handle,
    descriptionHtml: productData.description,
    productType: productData.productType,
    vendor: productData.vendor,
    tags: productData.tags,
    status: 'ACTIVE'
  };

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.data?.productCreate?.userErrors?.length > 0) {
    console.error('❌ Ошибки:', result.data.productCreate.userErrors);
    return null;
  }

  const product = result.data.productCreate.product;
  console.log(`✅ Продукт создан: ${product.title}`);
  
  return product;
}

async function updateProduct(productId, productData) {
  console.log(`\n🔄 Обновляем продукт: ${productData.title}...`);

  const mutation = `
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    id: productId,
    title: productData.title,
    handle: productData.handle,
    descriptionHtml: productData.description,
    productType: productData.productType,
    vendor: productData.vendor,
    tags: productData.tags,
    status: 'ACTIVE'
  };

  const result = await shopifyAdminRequest(mutation, { input });
  
  if (result.data?.productUpdate?.userErrors?.length > 0) {
    console.error('❌ Ошибки:', result.data.productUpdate.userErrors);
    return null;
  }

  const product = result.data.productUpdate.product;
  console.log(`✅ Продукт обновлён: ${product.title}`);
  
  return product;
}

async function addMetafields(productId, metafields) {
  console.log(`\n📝 Добавляем ${metafields.length} метаполей...`);

  // Создаем metafields по одному
  for (const metafield of metafields) {
    // Экранируем значение для GraphQL
    const escapedValue = metafield.value.replace(/"/g, '\\"');
    
    const mutation = `
      mutation {
        metafieldsSet(metafields: [{
          ownerId: "${productId}",
          namespace: "${metafield.namespace}",
          key: "${metafield.key}",
          value: "${escapedValue}",
          type: "${metafield.type}"
        }]) {
          metafields {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const result = await shopifyAdminRequest(mutation);
      
      if (result.data?.metafieldsSet?.userErrors?.length > 0) {
        console.error(`  ❌ ${metafield.key}:`, result.data.metafieldsSet.userErrors);
      } else {
        console.log(`  ✅ ${metafield.key}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`  ❌ ${metafield.key}:`, error.message);
    }
  }
}

async function main() {
  console.log('🛍️ Загружаем торговые центры Пхукета в Shopify...\n');

  for (const center of shoppingCenters) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📦 Обрабатываем: ${center.title}`);
      
      let product;
      const existing = await checkProductExists(center.handle);

      if (existing) {
        console.log(`⚠️  Продукт уже существует: ${center.title}`);
        product = await updateProduct(existing.id, center);
      } else {
        product = await createProduct(center);
      }

      if (!product) {
        console.error(`❌ Не удалось обработать ${center.title}`);
        continue;
      }

      // Add/Update metafields
      await addMetafields(product.id, center.metafields);

      console.log(`✨ ${center.title} успешно обработан.`);

    } catch (error) {
      console.error(`❌ Ошибка при обработке ${center.title}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Загрузка завершена!');
  console.log('='.repeat(60));
  console.log(`\n💡 Проверьте: http://localhost:8080/category/shopping\n`);
}

main().catch(console.error);
