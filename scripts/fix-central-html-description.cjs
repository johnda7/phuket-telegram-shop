require('dotenv').config();

const ADMIN_API_TOKEN = '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';
const SHOP_NAME = 'phuket-telegram-shop-117ck';

async function shopifyAdminRequest(query, variables = {}) {
  const response = await fetch(
    `https://${SHOP_NAME}.myshopify.com/admin/api/2025-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const data = await response.json();
  
  if (data.errors) {
    console.error('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2));
    throw new Error('GraphQL request failed');
  }

  return data;
}

async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;

  const data = await shopifyAdminRequest(query, { handle });
  return data.data.productByHandle;
}

async function updateProductDescription(productId, html) {
  const mutation = `
    mutation updateProduct($id: ID!, $descriptionHtml: String!) {
      productUpdate(input: {
        id: $id,
        descriptionHtml: $descriptionHtml
      }) {
        product {
          id
          title
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: productId,
    descriptionHtml: html
  };

  const data = await shopifyAdminRequest(mutation, variables);

  if (data.data.productUpdate.userErrors.length > 0) {
    console.error('❌ User Errors:', data.data.productUpdate.userErrors);
    throw new Error('Failed to update product');
  }

  return data.data.productUpdate.product;
}

async function main() {
  console.log('🚀 Обновляем описание Central Festival с HTML форматированием...\n');

  const handle = 'central-phuket-floresta';

  // HTML описание с правильным форматированием
  const htmlDescription = `
<p><strong>Central Festival Phuket — крупнейший ТРЦ Пхукета</strong></p>

<p>Два крыла — Floresta и Festival — соединены крытым переходом. 300+ магазинов, рестораны, фуд-корты, кинотеатр, детские зоны и аквариум. Комфортно в жару благодаря кондиционерам.</p>

<h2>CENTRAL FESTIVAL:</h2>
<ul>
<li><strong>Масс-маркет бренды:</strong> Zara, H&M, Uniqlo, Nike, Apple реселлер, Sephora</li>
<li><strong>Еда:</strong> 2 фуд-корта + рестораны международной кухни</li>
<li><strong>Развлечения:</strong> кинотеатр Major Cineplex, детские зоны</li>
</ul>

<h2>CENTRAL FLORESTA:</h2>
<ul>
<li><strong>Люксовые бутики премиум-класса:</strong> Louis Vuitton, Prada, Gucci, Balenciaga, Celine, Bvlgari, Tiffany & Co</li>
<li>Магазины игрушек и детской одежды</li>
<li>Товары для дома, лавки с сувенирами</li>
<li>Продуктовый супермаркет Tops Market</li>
<li><strong>Океанариум Aquaria Phuket</strong> — крупнейший на острове</li>
<li><strong>Музей 3D-оптических иллюзий</strong> AR TRICK EYE</li>
<li>Морской ресторан Su Va Na с видом на море</li>
</ul>

<h2>УДОБСТВА:</h2>
<ul>
<li>Бесплатный WI-FI по всей территории</li>
<li>Портативные зарядные станции для телефонов</li>
<li>Пункты обмена валют и банкоматы</li>
<li>Эксклюзивный лаундж для VIP-гостей</li>
<li>Багги-сервис для перемещения между корпусами</li>
<li>Возврат НДС (Tax Free) для туристов</li>
<li>Большая бесплатная парковка на 3000+ мест</li>
</ul>

<h2>КАК ДОБРАТЬСЯ:</h2>
<p><strong>Адрес:</strong> 74/5 Vichitsongkram Rd, Wichit, Mueang Phuket District, Phuket 83000</p>
<ul>
<li>Из Патонга: 20 минут на машине или тук-туке (300-400 бат)</li>
<li>Из аэропорта: 40 минут (600-800 бат на такси)</li>
</ul>

<h2>ВРЕМЯ РАБОТЫ:</h2>
<p><strong>Ежедневно:</strong> 10:00 — 22:00</p>
<p>Рестораны и кафе работают до 23:00</p>
  `.trim();

  try {
    // 1. Получаем ID продукта
    console.log(`📦 Получаем продукт: ${handle}...`);
    const product = await getProductByHandle(handle);
    
    if (!product) {
      throw new Error(`Продукт с handle "${handle}" не найден`);
    }

    console.log(`✅ Найден: ${product.title} (${product.id})\n`);

    // 2. Обновляем описание
    console.log('📝 Обновляем описание с HTML...');
    const updated = await updateProductDescription(product.id, htmlDescription);

    console.log(`\n✅ УСПЕШНО ОБНОВЛЕНО!`);
    console.log(`📦 Продукт: ${updated.title}`);
    console.log(`🆔 ID: ${updated.id}`);
    console.log(`\n📄 HTML Preview (первые 200 символов):`);
    console.log(updated.descriptionHtml.substring(0, 200) + '...');

  } catch (error) {
    console.error('\n❌ ОШИБКА:', error.message);
    process.exit(1);
  }
}

main();

