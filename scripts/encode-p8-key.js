#!/usr/bin/env node

const fs = require('fs');

const P8_PATH = process.argv[2] || './AuthKey_2MFD4KXKR7.p8';

if (!fs.existsSync(P8_PATH)) {
  console.error(`❌ File not found: ${P8_PATH}`);
  process.exit(1);
}

try {
  const keyContent = fs.readFileSync(P8_PATH, 'utf-8');
  const encoded = Buffer.from(keyContent).toString('base64');

  console.log('✅ Base64 encoded P8 key:');
  console.log(encoded);
  console.log('\nℹ️  Copy the above and add it as a GitHub secret named: APP_STORE_CONNECT_P8_BASE64');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
