const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');

const app = express();
const port = 5005;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', mainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});