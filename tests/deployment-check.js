#!/usr/bin/env node

/**
 * WorkoutBrothers - Pre-Deployment Check Script
 * Validates that the application is ready for deployment
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkPassed(test) {
  results.passed.push(test);
  log(`✅ ${test}`, colors.green);
}

function checkFailed(test, reason) {
  results.failed.push({ test, reason });
  log(`❌ ${test}: ${reason}`, colors.red);
}

function checkWarning(test, reason) {
  results.warnings.push({ test, reason });
  log(`⚠️  ${test}: ${reason}`, colors.yellow);
}

// Test functions
async function checkFileExists(filePath, name) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    checkPassed(`${name} exists`);
    return true;
  } else {
    checkFailed(`${name} missing`, `File not found: ${filePath}`);
    return false;
  }
}

async function checkFileContent(filePath, searchString, name) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    checkFailed(`${name} - file not found`, filePath);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(searchString)) {
    checkPassed(`${name} contains expected content`);
    return true;
  } else {
    checkFailed(`${name} missing content`, `"${searchString}" not found`);
    return false;
  }
}

async function checkNoOldBranding(filePath, name) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    return true; // File doesn't exist, skip check
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const oldBrandingPatterns = ['BaneWorkout', 'BANE WORKOUT', 'bane-workout'];
  
  for (const pattern of oldBrandingPatterns) {
    if (content.includes(pattern)) {
      checkFailed(`${name} contains old branding`, `Found "${pattern}"`);
      return false;
    }
  }
  
  checkPassed(`${name} - no old branding`);
  return true;
}

async function checkJSONSyntax(filePath, name) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    checkFailed(`${name} - file not found`, filePath);
    return false;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    JSON.parse(content);
    checkPassed(`${name} - valid JSON`);
    return true;
  } catch (error) {
    checkFailed(`${name} - invalid JSON`, error.message);
    return false;
  }
}

async function checkPackageJSON() {
  const fullPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(fullPath)) {
    checkFailed('package.json not found');
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    // Check required dependencies
    const requiredDeps = [
      'express',
      'mongoose',
      'cors',
      'dotenv',
      'bcryptjs',
      'jsonwebtoken',
      'helmet',
      'express-rate-limit',
      'node-cron'
    ];

    let allDepsPresent = true;
    for (const dep of requiredDeps) {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        checkFailed('Missing dependency', dep);
        allDepsPresent = false;
      }
    }

    if (allDepsPresent) {
      checkPassed('All required dependencies present');
    }

    // Check scripts
    if (pkg.scripts && pkg.scripts.start) {
      checkPassed('Start script defined');
    } else {
      checkFailed('Start script missing');
    }

    return true;
  } catch (error) {
    checkFailed('package.json validation failed', error.message);
    return false;
  }
}

async function checkEnvironmentTemplate() {
  const envExample = path.join(__dirname, '..', 'backend', '.env.example');
  
  if (fs.existsSync(envExample)) {
    const content = fs.readFileSync(envExample, 'utf8');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'];
    
    let allPresent = true;
    for (const varName of requiredVars) {
      if (!content.includes(varName)) {
        checkWarning('Missing env var in example', varName);
        allPresent = false;
      }
    }
    
    if (allPresent) {
      checkPassed('Environment template complete');
    }
  } else {
    checkWarning('.env.example not found', 'Consider creating one for deployment');
  }
}

async function checkMongoConnection() {
  log('\n📦 Testing MongoDB connection...', colors.cyan);
  
  // This is a basic check - in production you'd want to actually test the connection
  const hasMongoose = await checkFileContent(
    'backend/index.js',
    'mongoose.connect',
    'MongoDB connection code'
  );
  
  if (hasMongoose) {
    checkPassed('MongoDB connection code present');
  }
}

async function checkDomainConfiguration() {
  log('\n🌐 Checking domain configuration...', colors.cyan);
  
  // Check if domain is mentioned in configuration files
  await checkFileContent('app.json', 'DOMAIN', 'Domain config in app.json');
  await checkFileContent('backend/index.js', 'baneworkout.com', 'Domain in CORS config');
}

async function checkSecurityFeatures() {
  log('\n🔒 Checking security features...', colors.cyan);
  
  await checkFileContent('backend/index.js', 'helmet', 'Helmet security');
  await checkFileContent('backend/index.js', 'rateLimit', 'Rate limiting');
  await checkFileContent('backend/index.js', 'cors', 'CORS configuration');
}

async function checkAIAgent() {
  log('\n🤖 Checking AI Agent...', colors.cyan);
  
  const exists = await checkFileExists('backend/ai-agent.js', 'AI Agent file');
  if (exists) {
    await checkFileContent(
      'backend/ai-agent.js',
      'WorkoutBrothersAgent',
      'AI Agent class'
    );
  }
}

async function checkScheduledJobs() {
  log('\n📅 Checking scheduled jobs...', colors.cyan);
  
  const exists = await checkFileExists('backend/scheduled-jobs.js', 'Scheduled jobs file');
  if (exists) {
    await checkFileContent(
      'backend/scheduled-jobs.js',
      'cron.schedule',
      'Cron jobs configured'
    );
  }
}

async function checkDocumentation() {
  log('\n📚 Checking documentation...', colors.cyan);
  
  await checkFileExists('README.md', 'README');
  await checkFileExists('DEPLOIEMENT_RAPIDE.md', 'Quick deployment guide');
  await checkFileExists('DEPLOIEMENT_DOMAINE.md', 'Domain configuration guide');
  
  await checkNoOldBranding('README.md', 'README.md');
}

async function checkDeploymentConfigs() {
  log('\n⚙️  Checking deployment configurations...', colors.cyan);
  
  await checkJSONSyntax('package.json', 'package.json');
  await checkJSONSyntax('app.json', 'app.json');
  await checkJSONSyntax('railway.json', 'railway.json');
  await checkFileExists('render.yaml', 'render.yaml');
  await checkFileExists('Procfile', 'Procfile');
}

async function checkBranding() {
  log('\n🏷️  Checking branding (no old references)...', colors.cyan);
  
  const filesToCheck = [
    'README.md',
    'package.json',
    'app.json',
    'workout-generator.html',
    'frontend/index.html'
  ];
  
  for (const file of filesToCheck) {
    await checkNoOldBranding(file, file);
  }
}

// Main test runner
async function runTests() {
  log('═══════════════════════════════════════════════════', colors.blue);
  log('   WorkoutBrothers Pre-Deployment Checks', colors.blue);
  log('═══════════════════════════════════════════════════', colors.blue);
  
  // Run all tests
  log('\n📋 Checking core files...', colors.cyan);
  await checkFileExists('backend/index.js', 'Backend server');
  await checkFileExists('package.json', 'Package.json');
  
  await checkPackageJSON();
  await checkBranding();
  await checkDocumentation();
  await checkDeploymentConfigs();
  await checkDomainConfiguration();
  await checkSecurityFeatures();
  await checkMongoConnection();
  await checkAIAgent();
  await checkScheduledJobs();
  await checkEnvironmentTemplate();
  
  // Print summary
  log('\n═══════════════════════════════════════════════════', colors.blue);
  log('   Test Summary', colors.blue);
  log('═══════════════════════════════════════════════════', colors.blue);
  
  log(`\n✅ Passed: ${results.passed.length}`, colors.green);
  log(`❌ Failed: ${results.failed.length}`, colors.red);
  log(`⚠️  Warnings: ${results.warnings.length}`, colors.yellow);
  
  if (results.failed.length > 0) {
    log('\n❌ Failed Tests:', colors.red);
    results.failed.forEach(({ test, reason }) => {
      log(`   - ${test}: ${reason}`, colors.red);
    });
  }
  
  if (results.warnings.length > 0) {
    log('\n⚠️  Warnings:', colors.yellow);
    results.warnings.forEach(({ test, reason }) => {
      log(`   - ${test}: ${reason}`, colors.yellow);
    });
  }
  
  log('\n═══════════════════════════════════════════════════', colors.blue);
  
  if (results.failed.length === 0) {
    log('\n🎉 All critical tests passed!', colors.green);
    log('✅ Application is ready for deployment!\n', colors.green);
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please fix the issues before deploying.\n', colors.red);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Error running tests: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
