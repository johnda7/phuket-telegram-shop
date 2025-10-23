const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub raw URL base
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/johnda7/island-travel-echo-clone/main/src/assets/kao-lak-safari';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'kao-lak-safari');

// List of images to download (13 images - excluding 4 very large PNG files > 5MB)
const IMAGES = [
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.56.21.png`, output: 'snimok-jekrana-2025-09-06-v-20.56.21.png' },
  { url: `${GITHUB_RAW_BASE}/6798780e8ebf0-17645-1200-800.jpg`, output: '6798780e8ebf0-17645-1200-800.jpg' },
  { url: `${GITHUB_RAW_BASE}/the-hotspring-beach-resort-spa-1.jpeg`, output: 'the-hotspring-beach-resort-spa-1.jpeg' },
  { url: `${GITHUB_RAW_BASE}/cape-promthep.jpg`, output: 'cape-promthep.jpg' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.53.08.png`, output: 'snimok-jekrana-2025-09-06-v-20.53.08.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.53.32.png`, output: 'snimok-jekrana-2025-09-06-v-20.53.32.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.53.44.png`, output: 'snimok-jekrana-2025-09-06-v-20.53.44.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.55.06.png`, output: 'snimok-jekrana-2025-09-06-v-20.55.06.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.55.17.png`, output: 'snimok-jekrana-2025-09-06-v-20.55.17.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.58.15.png`, output: 'snimok-jekrana-2025-09-06-v-20.58.15.png' },
  { url: `${GITHUB_RAW_BASE}/snimok-jekrana-2025-09-06-v-20.58.45.png`, output: 'snimok-jekrana-2025-09-06-v-20.58.45.png' }
];

// Note: Excluding these 4 very large files (5-22 MB each):
// - airplane-beach_-1.jpg (22 MB!)
// - snimok-jekrana-2025-09-06-v-20.53.58.png (5 MB)
// - snimok-jekrana-2025-09-06-v-20.54.16.png (5.9 MB)
// - snimok-jekrana-2025-09-06-v-20.54.29.png (5.8 MB)
// - snimok-jekrana-2025-09-06-v-20.54.39.png (5.3 MB)
// - snimok-jekrana-2025-09-06-v-20.54.55.png (3.5 MB)

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
  console.log(`📥 Starting download of Kao Lak Safari images...`);
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
