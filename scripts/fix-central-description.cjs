// Исправляем описание Central Phuket Floresta

const ADMIN_TOKEN = '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';
const ADMIN_URL = 'https://phuket-telegram-shop-117ck.myshopify.com/admin/api/2025-07/graphql.json';

const mutation = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        handle
        description
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const variables = {
  input: {
    id: "gid://shopify/Product/7972352950326",
    metafields: [
      {
        namespace: "custom",
        key: "description",
        value: `Central Phuket Floresta – самый большой торговый центр на острове с широким ассортиментом брендов и бесспорно одно из лучших мест для шоппинга на Пхукете. Он состоит из двух корпусов: Central Festival и Central Floresta.

**Central Festival:**
- Международные бренды: Zara, H&M, Uniqlo, Nike, Adidas
- Косметика: Sephora, Boots
- Электроника: Apple, Samsung, Sony
- Супермаркет Tops Market

**Central Floresta:**
- Люксовые бутики: Prada, Gucci, Louis Vuitton, Chanel
- Ювелирные магазины
- Премиум рестораны

**Развлечения:**
- Кинотеатр SF Cinema
- Детская игровая зона
- Аквариум
- Фуд-корт с тайской и международной кухней

**Удобства:**
- Бесплатная парковка
- Бесплатный Wi-Fi
- Банкоматы
- Обмен валюты
- Кондиционеры`,
        type: "multi_line_text_field"
      }
    ]
  }
};

async function fixCentralDescription() {
  try {
    console.log('🔧 Исправляем описание Central Phuket Floresta...\n');
    
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables
      })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL ошибки:', data.errors);
      return;
    }

    if (data.data.productUpdate.userErrors.length > 0) {
      console.error('❌ Ошибки обновления:', data.data.productUpdate.userErrors);
      return;
    }

    console.log('✅ Описание Central Phuket Floresta успешно обновлено!');
    console.log(`   ID: ${data.data.productUpdate.product.id}`);
    console.log(`   Handle: ${data.data.productUpdate.product.handle}`);
    console.log(`   Новое описание: ${data.data.productUpdate.product.description.substring(0, 100)}...`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

fixCentralDescription();
