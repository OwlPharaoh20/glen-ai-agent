// Simple test script to verify Glen AI Agent basic functionality
const dotenv = require('dotenv');
const fs = require('fs');

console.log('\n🧪 Testing Glen AI Agent Basic Setup...\n');

// Test 1: Environment variables
console.log('1. Testing environment variables...');
dotenv.config();

const requiredVars = ['OPENAI_API_KEY', 'RESEND_API_KEY', 'MONGODB_URI'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please create a .env file with your API keys:');
  console.log('OPENAI_API_KEY=your_openai_api_key_here');
  console.log('RESEND_API_KEY=your_resend_api_key_here');
  console.log('MONGODB_URI=mongodb://localhost:27017/glen-ai-agent');
} else {
  console.log('✅ All environment variables found');
}

// Test 2: Check if .env file exists
console.log('\n2. Testing .env file...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file not found');
}

// Test 3: Check if node_modules exists
console.log('\n3. Testing dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules directory not found');
}

// Test 4: Check if dist directory exists
console.log('\n4. Testing compiled files...');
if (fs.existsSync('dist')) {
  console.log('✅ dist directory exists');
  const distFiles = fs.readdirSync('dist');
  console.log(`   Files in dist: ${distFiles.join(', ')}`);
} else {
  console.log('❌ dist directory not found');
}

console.log('\n🎉 Basic setup test completed!');
console.log('\nNext steps:');
console.log('1. Create .env file with your API keys');
console.log('2. Run: npm install (to update dependencies)');
console.log('3. Run: npm run build');
console.log('4. Run: npx ts-node main-simple.ts'); 