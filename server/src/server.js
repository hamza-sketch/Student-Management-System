 
const express = require('express');
const { connectToMongo } = require('./config/db')

const app = express();
const PORT = 3000;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// Start server AFTER DB connects
async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();