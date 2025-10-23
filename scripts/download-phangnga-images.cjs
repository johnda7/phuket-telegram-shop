const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/phang-nga-skywalk';

const images = [
  'baby-elephant.jpg',
  'bamboo-rafting.jpg',
  'elephant-bathing.jpg',
  'sarasin-bridge.jpg',
  'temple-main.jpg',
  'waterfall.jpg',
  'zoo.jpg'
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'phang-nga-skywalk');

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
  console.log(`📦 Downloading ${images.length} images for Phang Nga Skywalk tour...\n`);
  
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
