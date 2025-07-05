const express = require('express');
const crypto = require('crypto');
const app = express();

const VERIFICATION_TOKEN = 'pokejagt_verification_token_2025_secure_example_xyz';

app.use(express.json());

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - Query:`, req.query);
  next();
});

// Root endpoint für Browser-Zugriff
app.get('/', (req, res) => {
  res.status(200).type('text/html').send(`
    <h1>Pokejagt Webhook Server</h1>
    <p>✅ Server is running!</p>
    <p><strong>Webhook URL:</strong> <code>/ebay/account-deletion</code></p>
    <p><strong>Method:</strong> POST</p>
    <p><strong>Verification Token:</strong> <code>${VERIFICATION_TOKEN}</code></p>
    <p><strong>Challenge Response:</strong> GET mit ?challenge_code= unterstützt</p>
    <hr>
    <h3>Test Links:</h3>
    <p><a href="/ebay/account-deletion">GET ohne Challenge</a></p>
    <p><a href="/ebay/account-deletion?challenge_code=test123">GET mit Challenge</a></p>
  `);
});

// eBay Challenge-Response für Endpunkt-Validierung
app.get('/ebay/account-deletion', (req, res) => {
  console.log('🔍 GET /ebay/account-deletion called');
  console.log('🔍 Query parameters:', req.query);
  
  const challengeCode = req.query.challenge_code;
  
  if (challengeCode) {
    console.log('🔐 eBay Challenge Code received:', challengeCode);
    
    // Hash berechnen: challengeCode + verificationToken + endpoint
    const endpoint = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    const hash = crypto.createHash('sha256');
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(endpoint);
    const challengeResponse = hash.digest('hex');
    
    console.log('🔐 Challenge Response:', challengeResponse);
    console.log('🔐 Endpoint used:', endpoint);
    console.log('🔐 Hash components:', {
      challengeCode,
      verificationToken: VERIFICATION_TOKEN,
      endpoint
    });
    
    res.status(200).type('application/json').json({
      challengeResponse: challengeResponse
    });
  } else {
    console.log('✅ GET request received (no challenge)');
    res.status(200).type('text/plain').send('Webhook is running! Use POST for actual webhook calls.');
  }
});

app.post('/ebay/account-deletion', (req, res) => {
  console.log('✅ eBay called the endpoint');
  console.log('🔎 Body:', req.body);
  res.status(200).type('text/plain').send(VERIFICATION_TOKEN);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`🌐 Test URLs:`);
  console.log(`   - Root: http://localhost:${PORT}/`);
  console.log(`   - Webhook: http://localhost:${PORT}/ebay/account-deletion`);
  console.log(`   - Challenge: http://localhost:${PORT}/ebay/account-deletion?challenge_code=test123`);
});
