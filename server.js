const express = require('express');
const { getTransactionInfo } = require('transaction-sms-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST route for getting transaction info
app.post('/getTransactionInfo', (req, res) => {
  const { sms } = req.body; // Assuming the SMS text is sent in the body with a key of 'sms'
  if (!sms) {
    return res.status(400).send({ error: 'SMS text is required' });
  }

  try {
    const transactionInfo = getTransactionInfo(sms);
    // Transform the response to include only the specified attributes
    const modifiedResponse = {
      atype: transactionInfo.account.type,
      ttype: transactionInfo.transaction.type,
      amount: transactionInfo.transaction.amount,
      balance: transactionInfo.balance.available
    };
    res.send(modifiedResponse);
  } catch (error) {
    res.status(500).send({ error: 'Failed to parse transaction info' });
  }
});

// Make the server listen on the defined port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});