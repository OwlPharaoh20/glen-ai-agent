// Simple test script to verify Glen AI Agent basic functionality
const dotenv = require('dotenv');
const chalk = require('chalk');

console.log(chalk.blue.bold('🧪 Testing Glen AI Agent Basic Setup...\n'));

// Test 1: Environment variables
console.log(chalk.yellow('1. Testing environment variables...'));
dotenv.config();

const requiredVars = ['OPENAI_API_KEY', 'RESEND_API_KEY', 'MONGODB_URI'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log(chalk.red('❌ Missing environment variables:'));
  missingVars.forEach(varName => {
    console.log(chalk.red(`   - ${varName}`));
  });
} else {
  console.log(chalk.green('✅ All environment variables found'));
}

// Test 2: Check if .env file exists
console.log(chalk.yellow('\n2. Testing .env file...'));
const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log(chalk.green('✅ .env file exists'));
} else {
  console.log(chalk.red('❌ .env file not found'));
}

// Test 3: Check if node_modules exists
console.log(chalk.yellow('\n3. Testing dependencies...'));
if (fs.existsSync('node_modules')) {
  console.log(chalk.green('✅ node_modules directory exists'));
} else {
  console.log(chalk.red('❌ node_modules directory not found'));
}

// Test 4: Check if dist directory exists
console.log(chalk.yellow('\n4. Testing compiled files...'));
if (fs.existsSync('dist')) {
  console.log(chalk.green('✅ dist directory exists'));
  const distFiles = fs.readdirSync('dist');
  console.log(chalk.gray(`   Files in dist: ${distFiles.join(', ')}`));
} else {
  console.log(chalk.red('❌ dist directory not found'));
}

// Test 5: Test basic imports
console.log(chalk.yellow('\n5. Testing basic imports...'));
try {
  const inquirer = require('inquirer');
  console.log(chalk.green('✅ inquirer imported successfully'));
} catch (error) {
  console.log(chalk.red('❌ inquirer import failed:', error.message));
}

try {
  const { logger } = require('./dist/utils/logger');
  console.log(chalk.green('✅ logger imported successfully'));
} catch (error) {
  console.log(chalk.red('❌ logger import failed:', error.message));
}

console.log(chalk.blue.bold('\n🎉 Basic setup test completed!'));
console.log(chalk.gray('\nIf all tests passed, you can try running:'));
console.log(chalk.cyan('   node dist/main.js'));
console.log(chalk.cyan('   or'));
console.log(chalk.cyan('   npx ts-node main-simple.ts')); 