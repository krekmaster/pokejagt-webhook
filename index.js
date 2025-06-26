const express = require('express');
const app = express();
app.use(express.json());

const VERIFICATION_TOKEN = 'pokejagt_verification_token_2025_secure_example_xyz';


app.post('/ebay/account-deletion', (req, res) => {
  console.log('Received eBay deletion notification:', req.body);
  res.status(200).send(VERIFICATION_TOKEN);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook läuft auf Port ${PORT}`);
});
