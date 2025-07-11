const app = require('./app');
const PORT = process.env.PORT || 7100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});