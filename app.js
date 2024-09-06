const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');

const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
//const port = 5005;

app.use(cors());
app.use(bodyParser.json());

// Route untuk otentikasi
app.use('/auth', authRoutes);

app.use('/api', mainRoutes);

// Error handling (opsional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});