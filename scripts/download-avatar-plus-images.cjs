const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/avatar-plus-hangdong';

const images = [
  'avatar-main.jpg',
  'avatar-01.jpg',
  'avatar-02.jpg',
  'benyaran-waterfall.jpg',
  'benyaran-waterfall2.jpg',
  'elephant-show-scaled.jpg',
  'the-hotspring-beach-resort-spa1.jpg',
  'the-hotspring-beach-resort-spa2.jpg',
  'the-hotspring-beach-resort-spa4.jpg',
  'the-hotspring-beach-resort-sunset-.jpg',
  'wat-tha-sai-temple.jpg',
  'wat-tha-sai-temple1.jpg',
  'benyaran-museum-1.jpg',
  'benyaran-museum-2.jpg',
  '6798780e8ebf0-17645-1200-800.jpg'
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'avatar-plus-hangdong');

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
  console.log(`📦 Downloading ${images.length} images for Avatar Plus tour...\n`);
  
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
