// Test MongoDB connection and setup agent collections
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection & Setting up Glen AI Agent...\n');

// Check if MONGODB_URI exists
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.log('❌ MONGODB_URI not found in .env file');
  console.log('Please add: MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

console.log('✅ MONGODB_URI found in .env file');
console.log('🔗 Connection string:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// Test connection and setup collections
async function setupAgentDatabase() {
  try {
    console.log('\n🔄 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Create agent-specific collections
    console.log('\n🏗️ Setting up Glen AI Agent collections...');
    
    // Create leads collection
    const leadsCollection = db.collection('leads');
    await leadsCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Leads collection ready');
    
    // Create campaigns collection
    const campaignsCollection = db.collection('campaigns');
    await campaignsCollection.createIndex({ name: 1 });
    console.log('✅ Campaigns collection ready');
    
    // Create email_templates collection
    const templatesCollection = db.collection('email_templates');
    await templatesCollection.createIndex({ name: 1 });
    console.log('✅ Email templates collection ready');
    
    // Create analytics collection
    const analyticsCollection = db.collection('analytics');
    await analyticsCollection.createIndex({ date: 1 });
    console.log('✅ Analytics collection ready');
    
    // Insert sample data
    console.log('\n📝 Adding sample data...');
    
    // Sample lead
    try {
      await leadsCollection.insertOne({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Tech Corp',
        tags: ['tech', 'decision-maker'],
        source: 'website',
        status: 'new',
        emailSent: 0,
        emailOpened: 0,
        emailClicked: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Sample lead added');
    } catch (error) {
      if (error.code === 11000) {
        console.log('ℹ️ Sample lead already exists');
      }
    }
    
    // Sample campaign
    try {
      await campaignsCollection.insertOne({
        name: 'Welcome Campaign',
        subject: 'Welcome to Our Platform!',
        status: 'draft',
        targetAudience: ['new-users'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Sample campaign added');
    } catch (error) {
      console.log('ℹ️ Sample campaign already exists');
    }
    
    // Sample email template
    try {
      await templatesCollection.insertOne({
        name: 'Welcome Email',
        subject: 'Welcome to {{company_name}}!',
        html: '<h1>Welcome {{first_name}}!</h1><p>Thank you for joining us.</p>',
        variables: ['first_name', 'company_name'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Sample email template added');
    } catch (error) {
      console.log('ℹ️ Sample email template already exists');
    }
    
    // Show final collections
    const finalCollections = await db.listCollections().toArray();
    console.log('\n📊 Final collections:', finalCollections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('\n🎉 Glen AI Agent database setup complete!');
    
  } catch (error) {
    console.log('❌ MongoDB setup failed:');
    console.log('Error:', error.message);
    process.exit(1);
  }
}

setupAgentDatabase();