require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tls = require('tls');
const readline = require('readline');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error("Please set 'EMAIL_USERNAME' and 'EMAIL_PASSWORD' in your .env file.");
  process.exit(1);
}

const BASE64_USERNAME = Buffer.from(USERNAME).toString('base64');
const BASE64_PASSWORD = Buffer.from(PASSWORD).toString('base64');

// Email sending route
app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;

  if (!recipient || !subject || !message) {
    return res.status(400).send({ error: 'Recipient, subject, and message are required.' });
  }

  const client = tls.connect(465, 'smtp.gmail.com', { rejectUnauthorized: false }, () => {
    client.setEncoding('utf-8');
    const rl = readline.createInterface({ input: client, output: client, terminal: false });

    rl.on('line', (line) => {
      if (line.startsWith('220')) {
        client.write('EHLO localhost\r\n');
      } else if (line.startsWith('250-AUTH') || line.startsWith('250 AUTH')) {
        client.write('AUTH LOGIN\r\n');
      } else if (line.startsWith('334 VXNlcm5hbWU6')) {
        client.write(`${BASE64_USERNAME}\r\n`);
      } else if (line.startsWith('334 UGFzc3dvcmQ6')) {
        client.write(`${BASE64_PASSWORD}\r\n`);
      } else if (line.startsWith('235 2.7.0 Accepted')) {
        client.write(`MAIL FROM:<${USERNAME}>\r\n`);
      } else if (line.startsWith('250 2.1.0')) {
        client.write(`RCPT TO:<${recipient}>\r\n`);
      } else if (line.startsWith('250 2.1.5')) {
        client.write('DATA\r\n');
      } else if (line.startsWith('354')) {
        client.write(`Subject: ${subject}\r\n`);
        client.write(`From: Send-MSG-Email2Email-Application <${USERNAME}>\r\n`);
        client.write(`To: ${recipient}\r\n`);
        client.write('\r\n'); // Blank line between headers and body
        client.write(`${message}\r\n`);
        client.write('.\r\n');
      } else if (line.startsWith('250 2.0.0')) {
        res.send({ success: 'Email sent successfully.' });
        client.write('QUIT\r\n');
        rl.close();
      } else if (line.startsWith('221')) {
        client.end();
      }
    });
  });

  client.on('error', (err) => {
    console.error('Error:', err);
    res.status(500).send({ error: 'Failed to send email.' });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
