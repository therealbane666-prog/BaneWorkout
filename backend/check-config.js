// WorkoutBrothers - Configuration Checker
// Verifies that all required environment variables are set

require('dotenv').config();

console.log('\n🔍 WorkoutBrothers Configuration Check\n');
console.log('=' .repeat(50));

let allGood = true;

// Required variables
const required = [
  { name: 'MONGODB_URI', description: 'MongoDB connection string' },
];

// Optional but recommended
const optional = [
  { name: 'STRIPE_SECRET_KEY', description: 'Stripe payment processing' },
  { name: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook verification' },
  { name: 'SENDGRID_API_KEY', description: 'SendGrid email service' },
  { name: 'ADMIN_EMAIL', description: 'Admin notification email' },
  { name: 'JWT_SECRET', description: 'JWT token security' },
];

console.log('\n✅ REQUIRED CONFIGURATION:\n');
required.forEach(({ name, description }) => {
  const value = process.env[name];
  if (value) {
    console.log(`  ✅ ${name}: Configured`);
  } else {
    console.log(`  ❌ ${name}: MISSING - ${description}`);
    allGood = false;
  }
});

console.log('\n⚠️  OPTIONAL CONFIGURATION:\n');
optional.forEach(({ name, description }) => {
  const value = process.env[name];
  if (value) {
    console.log(`  ✅ ${name}: Configured`);
  } else {
    console.log(`  ⚠️  ${name}: Not set - ${description}`);
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('\n✅ All required configuration is set!\n');
  console.log('🚀 You can now start the server with: npm start\n');
  process.exit(0);
} else {
  console.log('\n❌ Some required configuration is missing!\n');
  console.log('📝 Please set missing environment variables in your hosting platform');
  console.log('   or create a .env file based on backend/.env.example\n');
  process.exit(1);
}
