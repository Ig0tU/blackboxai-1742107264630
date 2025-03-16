const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

async function checkService(url, name) {
    try {
        const response = await axios.get(url);
        console.log(`✅ ${name} is running`);
        return true;
    } catch (error) {
        console.error(`❌ ${name} is not accessible:`, error.message);
        return false;
    }
}

async function checkDirectories() {
    const dirs = ['uploads', 'logs', 'uploads/projects'];
    
    for (const dir of dirs) {
        try {
            await fs.access(path.join(__dirname, '..', dir));
            console.log(`✅ Directory '${dir}' exists`);
        } catch (error) {
            console.error(`❌ Directory '${dir}' is missing`);
        }
    }
}

async function checkEnvironmentVariables() {
    const requiredVars = [
        'PORT',
        'OPENAI_API_KEY',
        'HUGGINGFACE_API_KEY',
        'GEMINI_API_KEY'
    ];

    for (const varName of requiredVars) {
        if (process.env[varName]) {
            console.log(`✅ Environment variable ${varName} is set`);
        } else {
            console.warn(`⚠️ Environment variable ${varName} is not set`);
        }
    }
}

async function runSystemCheck() {
    console.log('🔍 Starting system check...\n');

    // Check services
    console.log('Checking services:');
    await checkService(`http://localhost:${config.port}`, 'Backend API');
    await checkService(`http://localhost:${config.chatServer.port}`, 'Chat Server');
    await checkService('http://localhost:5173', 'Frontend Dev Server');

    console.log('\nChecking directories:');
    await checkDirectories();

    console.log('\nChecking environment variables:');
    await checkEnvironmentVariables();

    // Check file permissions
    console.log('\nChecking file permissions:');
    try {
        const testFile = path.join(__dirname, '..', 'uploads', 'test.txt');
        await fs.writeFile(testFile, 'test');
        await fs.unlink(testFile);
        console.log('✅ File permissions are correctly set');
    } catch (error) {
        console.error('❌ File permission error:', error.message);
    }

    console.log('\n✨ System check completed');
}

// Run the check
runSystemCheck().catch(console.error);
