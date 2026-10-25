const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const DonorProfile = require('./models/DonorProfile');
const BloodRequest = require('./models/BloodRequest');

async function testEndToEnd() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas successfully!\n');

  // 1. Create a test user
  const testEmail = `test_donor_${Date.now()}@example.com`;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('TestPass123!', salt);

  console.log('1. Creating test user:', testEmail);
  const user = await User.create({
    name: 'Rahul Sharma',
    email: testEmail,
    passwordHash,
  });
  console.log('   User created with ID:', user._id);

  // 2. Create donor profile
  console.log('2. Creating donor profile for user...');
  const donor = await DonorProfile.create({
    userId: user._id,
    bloodGroup: 'O+',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 9876543210',
    availabilityStatus: true,
    isVisibleInSearch: true,
    contactVisibility: 'Always',
  });
  console.log('   Donor profile created for blood group:', donor.bloodGroup, 'in', donor.city);

  // 3. Search donors
  console.log('3. Testing donor search query (bloodGroup: O+, city: Mumbai)...');
  const searchResults = await DonorProfile.find({
    bloodGroup: 'O+',
    city: { $regex: /^Mumbai$/i },
    availabilityStatus: true,
    isVisibleInSearch: true,
  }).populate('userId', 'name email');
  console.log(`   Found ${searchResults.length} donor(s) matching criteria! First match: ${searchResults[0].userId.name}`);

  // 4. Create blood request
  console.log('4. Creating emergency blood request...');
  const request = await BloodRequest.create({
    requestId: `BR-${Date.now().toString().slice(-4)}-1001`,
    requesterId: user._id,
    patientReference: 'Aarav Mehta (ICU Bed 12)',
    bloodGroup: 'O+',
    hospitalName: 'Lilavati Hospital & Research Centre',
    city: 'Mumbai',
    state: 'Maharashtra',
    unitsRequired: 2,
    requiredBy: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    urgency: 'Emergency',
    notes: 'Urgent requirement for surgery scheduled tomorrow morning.',
    status: 'Pending',
  });
  console.log('   Blood request created with ID:', request.requestId);

  // 5. Query requests
  const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
  console.log('5. Total pending requests currently in Atlas:', pendingRequests);

  console.log('\n🎉 ALL MONGODB ATLAS DATABASE OPERATIONS PASSED PERFECTLY!');
  await mongoose.disconnect();
  process.exit(0);
}

testEndToEnd().catch((err) => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
