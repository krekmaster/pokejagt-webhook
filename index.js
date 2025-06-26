const express = require('express');
const app = express();

const VERIFICATION_TOKEN = 'pokejagt_verification_token_2025_secure_example_xyz';

app.use(express.json());

app.post('/ebay/account-deletion', (req, res) => {
  res.status(200).type('text/plain').send(VERIFICATION_TOKEN);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
