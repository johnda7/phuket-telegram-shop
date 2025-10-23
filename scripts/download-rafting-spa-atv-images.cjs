const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub raw URL base
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/rafting-spa-atv';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'rafting-spa-atv');

// List of images to download (13 images - excluding main-photo.jpg which is broken)
const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/rafting21-scaled.jpg`, output: 'rafting21-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/rafting-scaled.jpg`, output: 'rafting-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/atv-1-scaled.jpg`, output: 'atv-1-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/zipline-scaled.jpg`, output: 'zipline-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/cave-scaled.jpg`, output: 'cave-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/park-scaled.jpg`, output: 'park-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/lake1-scaled.jpg`, output: 'lake1-scaled.jpg' },
  { url: `${GITHUB_RAW_BASE}/bangkaew-elephant-park11.jpg`, output: 'bangkaew-elephant-park11.jpg' },
  { url: `${GITHUB_RAW_BASE}/waterfall-1.jpg`, output: 'waterfall-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/monkeys-at-suwan-khuha-temple-1.webp`, output: 'monkeys-at-suwan-khuha-temple-1.webp' },
  { url: `${GITHUB_RAW_BASE}/statue-of-the-reclining-buddha.webp`, output: 'statue-of-the-reclining-buddha.webp' },
  { url: `${GITHUB_RAW_BASE}/the-hotspring-beach-resort-spa-1.jpeg`, output: 'the-hotspring-beach-resort-spa-1.jpeg' },
  { url: `${GITHUB_RAW_BASE}/hong-island1.jpg`, output: 'hong-island1.jpg' }
];

// Create directory if not exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download function
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main download function
async function downloadAllImages() {
  console.log(`📥 Starting download of Rafting + SPA + ATV images...`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < IMAGES.length; i++) {
    const { url, output } = IMAGES[i];
    const outputPath = path.join(OUTPUT_DIR, output);

    try {
      console.log(`📤 [${i + 1}/${IMAGES.length}] Downloading: ${output}...`);
      await downloadImage(url, outputPath);

      const stats = fs.statSync(outputPath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Downloaded: ${output} (${fileSizeKB} KB)`);

      successCount++;
    } catch (error) {
      console.error(`❌ Failed to download ${output}:`, error.message);
      failedCount++;
    }
  }

  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successCount}/${IMAGES.length}`);
  if (failedCount > 0) {
    console.log(`❌ Failed: ${failedCount}/${IMAGES.length}`);
  }

  if (successCount === IMAGES.length) {
    console.log(`\n🎉 All images downloaded successfully!`);
    console.log(`📁 Saved to: ${OUTPUT_DIR}`);
  }
}

// Run the download
downloadAllImages().catch(error => {
  console.error('❌ Download script error:', error);
  process.exit(1);
});
