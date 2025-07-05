const express = require('express');
const app = express();

const VERIFICATION_TOKEN = 'pokejagt_verification_token_2025_secure_example_xyz';

app.use(express.json());

// Root endpoint für Browser-Zugriff
app.get('/', (req, res) => {
  res.status(200).type('text/html').send(`
    <h1>Pokejagt Webhook Server</h1>
    <p>✅ Server is running!</p>
    <p><strong>Webhook URL:</strong> <code>/ebay/account-deletion</code></p>
    <p><strong>Method:</strong> POST</p>
    <p><strong>Verification Token:</strong> <code>${VERIFICATION_TOKEN}</code></p>
  `);
});

// GET endpoint für Tests und Browser-Zugriff
app.get('/ebay/account-deletion', (req, res) => {
  console.log('✅ GET request received');
  res.status(200).type('text/plain').send('Webhook is running! Use POST for actual webhook calls.');
});

app.post('/ebay/account-deletion', (req, res) => {
  console.log('✅ eBay called the endpoint');
  console.log('🔎 Body:', req.body);
  res.status(200).type('text/plain').send(VERIFICATION_TOKEN);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
