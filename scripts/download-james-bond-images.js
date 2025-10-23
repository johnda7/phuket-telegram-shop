import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets';
const OUTPUT_DIR = path.join(__dirname, '../src/assets/james-bond-island');

// James Bond Island images (7 images)
// ⚠️ ВАЖНО! Файлы в phukeo репозитории в КОРНЕ assets/ с хешами!
// Импорты из src/data/tours/james-bond-island/static.ts:
// import jamesBondMain from '@/assets/james-1-CrrUEsJ1.jpg';
// import jamesBondRock from '@/assets/james-2-Voq4mfXH.jpg';
// import phangNgaBay from '@/assets/james-3-CZncWmAG.webp';
// import kooPingKan from '@/assets/james-4-BKlK7Ymz.webp';
// import seaCanoe from '@/assets/james-5-DsMmvbXh.webp';
// import floatingVillage from '@/assets/james-6-DKlj8kUA.webp';
// import jamesBondIsland from '@/assets/james-7-B5bdZZ8d.webp';

const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/james-1-CrrUEsJ1.jpg`, output: `${OUTPUT_DIR}/james-1.jpg` },
  { url: `${GITHUB_RAW_BASE}/james-2-Voq4mfXH.jpg`, output: `${OUTPUT_DIR}/james-2.jpg` },
  { url: `${GITHUB_RAW_BASE}/james-3-CZncWmAG.webp`, output: `${OUTPUT_DIR}/james-3.webp` },
  { url: `${GITHUB_RAW_BASE}/james-4-BKlK7Ymz.webp`, output: `${OUTPUT_DIR}/james-4.webp` },
  { url: `${GITHUB_RAW_BASE}/james-5-DsMmvbXh.webp`, output: `${OUTPUT_DIR}/james-5.webp` },
  { url: `${GITHUB_RAW_BASE}/james-6-DKlj8kUA.webp`, output: `${OUTPUT_DIR}/james-6.webp` },
  { url: `${GITHUB_RAW_BASE}/james-7-B5bdZZ8d.webp`, output: `${OUTPUT_DIR}/james-7.webp` },
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'james-bond-island');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Created directory: ${outputDir}`);
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log(`  ↪️  Redirecting to: ${redirectUrl}`);
        https.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(outputPath, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`\n🚀 Starting download of ${IMAGES.length} James Bond Island images...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const { url, output } of IMAGES) {
    const filename = path.basename(output);
    
    try {
      console.log(`📥 Downloading: ${filename}...`);
      await downloadImage(url, output);
      
      const stats = fs.statSync(output);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      
      console.log(`✅ Downloaded: ${filename} (${fileSizeKB} KB)`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successCount}/${IMAGES.length}`);
  console.log(`❌ Failed: ${errorCount}/${IMAGES.length}`);
  
  if (successCount === IMAGES.length) {
    console.log(`\n🎉 All images downloaded successfully!`);
    console.log(`📁 Location: ${OUTPUT_DIR}`);
  }
}

main().catch(console.error);
