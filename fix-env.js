// Fix MongoDB URI in .env file
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing MongoDB URI in .env file...\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('Please create a .env file with your API keys');
  process.exit(1);
}

// Read current .env content
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if MONGODB_URI exists
if (!envContent.includes('MONGODB_URI=')) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('Please add: MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

// Check if URI has database name
if (envContent.includes('mongodb+srv://') && !envContent.includes('/glen-ai-agent')) {
  console.log('🔧 Adding database name to MongoDB URI...');
  
  // Add /glen-ai-agent before the query parameters
  envContent = envContent.replace(
    /(mongodb\+srv:\/\/[^\/]+)\/(\?.*)/,
    '$1/glen-ai-agent$2'
  );
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file with database name');
} else {
  console.log('✅ MongoDB URI already has database name or is correct format');
}

// Show the current MONGODB_URI (masked)
const mongoUriMatch = envContent.match(/MONGODB_URI=(.+)/);
if (mongoUriMatch) {
  const uri = mongoUriMatch[1];
  const maskedUri = uri.replace(/\/\/.*@/, '//***:***@');
  console.log('🔗 Current MongoDB URI:', maskedUri);
}

console.log('\n🎉 .env file check complete!');
console.log('Now run: node test-mongodb.js');