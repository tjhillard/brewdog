const path = require('path');
const express = require('express');
const morgan = require('morgan');

/* Config */
const port = process.env.PORT || 3000;

/* Express */
const app = express();
if (process.env !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, '../dist/')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
