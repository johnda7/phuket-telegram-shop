const fs = require('fs');
const path = require('path');
const https = require('https');

// Shopify credentials
const SHOPIFY_DOMAIN = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = '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';
const PRODUCT_ID = '7971956260918'; // 11 островов мега

// Path to images
const IMAGES_DIR = path.join(__dirname, '..', 'src', 'assets', 'eleven-islands-mega');

// List of image files (8 images)
const IMAGE_FILES = [
  'hero-1.jpg',
  'eleven-1.jpg',
  'maya-bay1.jpg',
  'pileh-lagoon.jpg',
  'viking-cave.jpg',
  'koh-panyi.jpg',
  'canoeing-talu-island.jpg',
  'phi-phi-don.jpg'
];

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to upload image to Shopify
function uploadImageToShopify(imageData, filename) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      image: {
        attachment: imageData,
        filename: filename
      }
    });

    const options = {
      hostname: SHOPIFY_DOMAIN,
      path: `/admin/api/2025-07/products/${PRODUCT_ID}/images.json`,
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
        if (res.statusCode === 200 || res.statusCode === 201) {
          const jsonResponse = JSON.parse(responseData);
          resolve(jsonResponse.image);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
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

// Main upload function
async function uploadAllImages() {
  console.log('📤 Starting upload to Shopify...');
  console.log(`Product ID: ${PRODUCT_ID}`);
  console.log(`Images to upload: ${IMAGE_FILES.length}\n`);

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < IMAGE_FILES.length; i++) {
    const filename = IMAGE_FILES[i];
    const filepath = path.join(IMAGES_DIR, filename);

    try {
      // Check if file exists
      if (!fs.existsSync(filepath)) {
        console.log(`❌ File not found: ${filename}`);
        failedCount++;
        continue;
      }

      // Read file and convert to base64
      const imageBuffer = fs.readFileSync(filepath);
      const base64Image = imageBuffer.toString('base64');

      console.log(`📤 [${i + 1}/${IMAGE_FILES.length}] Uploading: ${filename}...`);

      // Upload to Shopify
      const result = await uploadImageToShopify(base64Image, filename);
      console.log(`✅ Uploaded: ${filename} (ID: ${result.id})`);

      successCount++;

      // Delay 2 seconds between uploads (Shopify rate limit: 2 requests/second)
      if (i < IMAGE_FILES.length - 1) {
        await delay(2000);
      }

    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
      failedCount++;
    }
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${successCount}/${IMAGE_FILES.length}`);
  if (failedCount > 0) {
    console.log(`❌ Failed: ${failedCount}/${IMAGE_FILES.length}`);
  }

  if (successCount === IMAGE_FILES.length) {
    console.log('\n🎉 All images uploaded successfully!');
  }
}

// Run the upload
uploadAllImages().catch(error => {
  console.error('❌ Upload script error:', error);
  process.exit(1);
});
