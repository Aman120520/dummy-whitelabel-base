const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '../dummy-config.json');
const APP_JSON_PATH = path.join(__dirname, '../app.json');
const ASSETS_DIR = path.join(__dirname, '../assets');

// Helper to download images from URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

async function run() {
    console.log("🚀 Starting White-label Mutator Script...");

    // 1. Read the dummy config
    const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    console.log(`✅ Loaded config for: ${configData.appName}`);

    // 2. Read app.json
    const appJsonRaw = fs.readFileSync(APP_JSON_PATH, 'utf8');
    let appJson = JSON.parse(appJsonRaw);

    // 3. Mutate app.json
    appJson.expo.name = configData.appName;
    appJson.expo.slug = configData.slug;

    // Ensure android and ios objects exist
    if (!appJson.expo.android) appJson.expo.android = {};
    if (!appJson.expo.ios) appJson.expo.ios = {};

    appJson.expo.android.package = configData.androidPackage;
    appJson.expo.ios.bundleIdentifier = configData.iosBundleIdentifier;

    // Set Expo Owner to your personal account
    appJson.expo.owner = "amanvagadiya12personal";

    fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2));
    console.log(`✅ Updated app.json with slug: ${configData.slug}`);

    // 4. Download Assets
    // Make sure assets folder exists
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }

    console.log("⏳ Downloading fresh assets...");
    try {
        await downloadImage(configData.logoUrl, path.join(ASSETS_DIR, 'icon.png'));
        await downloadImage(configData.splashUrl, path.join(ASSETS_DIR, 'splash.png'));
        console.log("✅ Assets downloaded and replaced!");
    } catch (e) {
        console.log("⚠️ Asset download failed, using default assets. Error:", e.message);
    }

    console.log("🎉 Mutator Script Finished Successfully!");
}

run().catch(console.error);