#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// GitHub raw base URL
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/dostoprimechatelnosti-phuketa';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'dostoprimechatelnosti-phuketa');

// 📸 17 IMAGES FOR DOSTOPRIMECHATELNOSTI PHUKETA TOUR (из static.ts)
const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/big-buddha-viewpoint.jpg`, output: 'big-buddha-viewpoint.jpg' },
  { url: `${GITHUB_RAW_BASE}/wat-chalong-main.jpg`, output: 'wat-chalong-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/wat-chalong-1.jpg`, output: 'wat-chalong-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/wat-chalong-2.jpg`, output: 'wat-chalong-2.jpg' },
  { url: `${GITHUB_RAW_BASE}/old-town-main.jpg`, output: 'old-town-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/old-town-1.jpg`, output: 'old-town-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/promthep-cape-main.jpg`, output: 'promthep-cape-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/karon-viewpoint-main.jpg`, output: 'karon-viewpoint-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/karon-viewpoint-1.jpg`, output: 'karon-viewpoint-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/karon-viewpoint-2.jpg`, output: 'karon-viewpoint-2.jpg' },
  { url: `${GITHUB_RAW_BASE}/rang-hill-main.jpg`, output: 'rang-hill-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/rang-hill-1.jpg`, output: 'rang-hill-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/windmill-viewpoint-main.jpg`, output: 'windmill-viewpoint-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/windmill-viewpoint-1.jpg`, output: 'windmill-viewpoint-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/windmill-viewpoint-2.jpg`, output: 'windmill-viewpoint-2.jpg' },
  { url: `${GITHUB_RAW_BASE}/elephant-feeding-main.jpg`, output: 'elephant-feeding-main.jpg' },
  { url: `${GITHUB_RAW_BASE}/elephant-feeding-1.jpg`, output: 'elephant-feeding-1.jpg' }
];

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Main download function
async function downloadAll() {
  console.log('📥 Starting download of Достопримечательности Пхукета images...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const { url, output } of IMAGES) {
    const filePath = path.join(OUTPUT_DIR, output);
    
    try {
      console.log(`📤 [${successCount + failCount + 1}/${IMAGES.length}] Downloading: ${output}...`);
      await downloadFile(url, filePath);
      
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Downloaded: ${output} (${sizeKB} KB)`);
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to download ${output}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successCount}/${IMAGES.length}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${IMAGES.length}`);
  }
  
  if (successCount === IMAGES.length) {
    console.log('\n🎉 All images downloaded successfully!');
    console.log(`📁 Saved to: ${OUTPUT_DIR}`);
  }
}

// Run download
downloadAll().catch(console.error);
