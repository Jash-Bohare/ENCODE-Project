const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

async function main() {
  if (!NFT_STORAGE_KEY) {
    console.error('❌ NFT_STORAGE_KEY is missing in .env!');
    return;
  }

  const client = new NFTStorage({ token: NFT_STORAGE_KEY });

  const imagePath = path.join(__dirname, 'NFT1.png');
  console.log('🧪 Checking image path:', imagePath);

  const imageData = await fs.promises.readFile(imagePath);
  console.log('✅ Image loaded successfully, size:', imageData.length, 'bytes');

  console.log('📡 Uploading to NFT.storage...');
  const metadata = await client.store({
    name: 'ENCODE NFT',
    description: 'This is a custom NFT from the ENCODE Token project.',
    image: new File([imageData], 'encd_nft.png', { type: 'image/png' }),
  });

  console.log('✅ Metadata URI (tokenURI):', metadata.url);
}

main().catch((err) => {
  console.error('❌ Upload failed:', err);
});
