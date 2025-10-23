#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// GitHub raw base URL
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'pearls-andaman-sea');

// 📸 8 IMAGES FOR 4 PEARLS ANDAMAN SEA TOUR
const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/pearls-1-CIQDkV1S.jpg`, output: 'pearls-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-2-lTnf7Dxc.jpg`, output: 'pearls-2.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-3-79DtICyZ.jpg`, output: 'pearls-3.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-4-p7zrpIz2.jpg`, output: 'pearls-4.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-5-CszFmGGp.jpg`, output: 'pearls-5.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-6-CIe3WiIL.jpg`, output: 'pearls-6.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-7-C8avj7R6.jpg`, output: 'pearls-7.jpg' },
  { url: `${GITHUB_RAW_BASE}/pearls-8-Of51NOPk.jpg`, output: 'pearls-8.jpg' }
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
  console.log('📥 Starting download of 4 Pearls Andaman Sea images...\n');
  
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
