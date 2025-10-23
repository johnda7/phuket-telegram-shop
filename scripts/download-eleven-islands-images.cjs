const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub raw URL base
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/eleven-islands-mega';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'eleven-islands-mega');

// List of images to download (8 images)
const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/hero-1.jpg`, output: 'hero-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/eleven-1.jpg`, output: 'eleven-1.jpg' },
  { url: `${GITHUB_RAW_BASE}/maya-bay1.jpg`, output: 'maya-bay1.jpg' },
  { url: `${GITHUB_RAW_BASE}/pileh-lagoon.jpg`, output: 'pileh-lagoon.jpg' },
  { url: `${GITHUB_RAW_BASE}/viking-cave.jpg`, output: 'viking-cave.jpg' },
  { url: `${GITHUB_RAW_BASE}/koh-panyi.jpg`, output: 'koh-panyi.jpg' },
  { url: `${GITHUB_RAW_BASE}/canoeing-talu-island.jpg`, output: 'canoeing-talu-island.jpg' },
  { url: `${GITHUB_RAW_BASE}/phi-phi-don.jpg`, output: 'phi-phi-don.jpg' }
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
  console.log(`📥 Starting download of 11 Islands Mega images...`);
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
