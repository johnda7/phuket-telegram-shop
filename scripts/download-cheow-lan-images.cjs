const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/cheow-lan-lake';

const images = [
  'bang-tong-main.jpg',
  'cheow-lan-1.jpg',
  'cheow-lan-2.jpg',
  'cheow-lan-main.jpg',
  'guilin-rocks-2.jpg',
  'guilin-rocks-main.jpg',
  'safari-lake-2.jpg',
  'safari-lake-main.jpg',
  'samet-nangshe-2.jpg',
  'samet-nangshe-main.jpg'
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'cheow-lan-lake');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(filename) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/${filename}`;
    const filepath = path.join(outputDir, filename);
    
    console.log(`📥 Downloading: ${filename}...`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(filepath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ Downloaded: ${filename} (${sizeKB} KB)`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`📦 Downloading ${images.length} images for Cheow Lan Lake tour...\n`);
  
  let successful = 0;
  let failed = 0;
  
  for (const image of images) {
    try {
      await downloadImage(image);
      successful++;
    } catch (err) {
      console.error(`❌ Failed: ${image} - ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successful}/${images.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${images.length}`);
  }
}

downloadAll();
