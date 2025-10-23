#!/usr/bin/env node

/**
 * 🚀 ЗАГРУЗКА ИЗОБРАЖЕНИЙ ПХИ-ПХИ В SHOPIFY
 * 
 * Загружает все 17 изображений из src/assets/phi-phi-tour/
 * и добавляет их к существующему продукту "Пхи-Пхи 2 дня / 1 ночь"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shopify credentials
const SHOP_URL = 'phuket-telegram-shop-117ck.myshopify.com';
const ADMIN_API_TOKEN = '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';
const PRODUCT_ID = 'gid://shopify/Product/7971955343414';

// Папка с изображениями
const IMAGES_DIR = path.join(__dirname, '../src/assets/phi-phi-tour');

// Список изображений с описаниями
const images = [
  { file: 'maya-bay-1.jpg', alt: 'Бухта Майя Бэй - Пхи-Пхи' },
  { file: 'maya-bay-2.jpg', alt: 'Бухта Майя - вид сверху' },
  { file: 'maya-bay-3.jpg', alt: 'Майя Бэй - кристально чистая вода' },
  { file: 'maya-bay-4.jpg', alt: 'Пляж Майя Бэй' },
  { file: 'mayabay-1.jpg', alt: 'Майя Бэй панорама' },
  { file: 'mayabay-2.jpg', alt: 'Майя Бэй - белый песок' },
  { file: 'mayabay-3.jpg', alt: 'Майя Бэй скалы' },
  { file: 'mayabay-5.jpg', alt: 'Майя Бэй лодки' },
  { file: 'mayabay-6.jpg', alt: 'Майя Бэй туристы' },
  { file: 'pileh-lagoon.jpg', alt: 'Лагуна Пиле - изумрудная вода' },
  { file: 'viking-cave.jpg', alt: 'Пещера Викингов' },
  { file: 'bamboo-island.webp', alt: 'Остров Бамбу - белоснежный пляж' },
  { file: 'fire-show-1.jpg', alt: 'Огненное шоу на Пхи-Пхи' },
  { file: 'fire-show-2.jpg', alt: 'Файер-шоу вечером' },
  { file: 'fire-show-3.jpg', alt: 'Ночное огненное представление' },
  { file: 'rang-yai-1.jpg', alt: 'Остров Ранг Яй' },
  { file: 'rang-yai-2.jpg', alt: 'Ранг Яй пляж' }
];

/**
 * GraphQL запрос для добавления изображения к продукту
 */
async function addImageToProduct(imageUrl, altText) {
  const query = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          ... on MediaImage {
            id
            image {
              url
              altText
            }
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    productId: PRODUCT_ID,
    media: [
      {
        mediaContentType: 'IMAGE',
        originalSource: imageUrl,
        alt: altText
      }
    ]
  };

  const response = await fetch(`https://${SHOP_URL}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();
  
  if (result.data?.productCreateMedia?.mediaUserErrors?.length > 0) {
    throw new Error(result.data.productCreateMedia.mediaUserErrors[0].message);
  }

  return result.data.productCreateMedia.media[0];
}

/**
 * Загружает файл в Shopify Files и возвращает URL
 */
async function uploadFileToShopify(filePath, filename) {
  const fileBuffer = fs.readFileSync(filePath);
  
  // Шаг 1: Создаём staged upload
  const stagedUploadQuery = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const stagedUploadVariables = {
    input: [
      {
        resource: 'PRODUCT_IMAGE',
        filename: filename,
        mimeType: filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
        httpMethod: 'POST'
      }
    ]
  };

  const stagedResponse = await fetch(`https://${SHOP_URL}/admin/api/2025-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_API_TOKEN
    },
    body: JSON.stringify({ 
      query: stagedUploadQuery, 
      variables: stagedUploadVariables 
    })
  });

  const stagedResult = await stagedResponse.json();
  
  if (stagedResult.data?.stagedUploadsCreate?.userErrors?.length > 0) {
    throw new Error(stagedResult.data.stagedUploadsCreate.userErrors[0].message);
  }

  const stagedTarget = stagedResult.data.stagedUploadsCreate.stagedTargets[0];
  
  // Шаг 2: Загружаем файл на URL от Shopify
  const formData = new FormData();
  
  // Добавляем параметры из staged target
  stagedTarget.parameters.forEach(param => {
    formData.append(param.name, param.value);
  });
  
  // Добавляем сам файл
  formData.append('file', fileBuffer, {
    filename: filename,
    contentType: filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
  });

  await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData
  });

  // Возвращаем resourceUrl для использования в productCreateMedia
  return stagedTarget.resourceUrl;
}

/**
 * Основная функция
 */
async function uploadAllImages() {
  console.log('🚀 ЗАГРУЗКА ИЗОБРАЖЕНИЙ ПХИ-ПХИ В SHOPIFY');
  console.log('📦 Продукт ID:', PRODUCT_ID);
  console.log('📁 Папка:', IMAGES_DIR);
  console.log('🖼️  Всего изображений:', images.length);
  console.log('─'.repeat(60));

  let uploaded = 0;
  let errors = 0;

  for (const image of images) {
    try {
      const filePath = path.join(IMAGES_DIR, image.file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Пропущено (файл не найден): ${image.file}`);
        continue;
      }

      console.log(`📤 Загружаю: ${image.file}...`);
      
      // Шаг 1: Загружаем файл в Shopify Files
      const resourceUrl = await uploadFileToShopify(filePath, image.file);
      console.log(`   ✅ Файл загружен в Shopify`);
      
      // Шаг 2: Добавляем изображение к продукту
      await addImageToProduct(resourceUrl, image.alt);
      console.log(`   ✅ Изображение добавлено к продукту: ${image.alt}`);
      
      uploaded++;
      
      // Задержка между запросами (1 сек)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Ошибка при загрузке ${image.file}:`, error.message);
      errors++;
    }
  }

  console.log('─'.repeat(60));
  console.log('📊 СТАТИСТИКА:');
  console.log(`   ✅ Загружено: ${uploaded}`);
  console.log(`   ❌ Ошибок: ${errors}`);
  console.log(`   📁 Всего: ${images.length}`);
  console.log('─'.repeat(60));

  if (uploaded > 0) {
    console.log('🎉 Готово! Изображения добавлены к продукту Пхи-Пхи!');
    console.log('');
    console.log('🔗 Проверь продукт:');
    console.log(`   https://admin.shopify.com/store/phuket-telegram-shop-117ck/products/${PRODUCT_ID.split('/').pop()}`);
  }
}

// Запуск
uploadAllImages().catch(console.error);
