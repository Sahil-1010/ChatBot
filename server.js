require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Google Generative AI setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    const result = await chat.sendMessage(userMsg);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Something went wrong 😞" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🌍 Server running at http://localhost:${port}`);
});
