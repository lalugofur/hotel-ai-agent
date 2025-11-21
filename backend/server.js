require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Scheduler = require('./jobs/scheduler');
const HotelScraper = require('./scrapers/hotel-scraper');
const { BlogPost } = require('./models/BlogPost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotels', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Scraper API',
    status: 'running',
    time: new Date().toISOString()
  });
});

// Get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ publishedAt: -1 }).limit(10);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Manual scrape endpoint
app.get('/api/scrape/:location', async (req, res) => {
  try {
    const scraper = new HotelScraper();
    const hotels = await scraper.scrape(req.params.location);
    res.json({ location: req.params.location, hotels });
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed' });
  }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const responses = {
      'hello': '👋 Hello! I can help you find hotels. Where are you going?',
      'bali': '🏝️ Bali has great resorts! Seminyak for luxury, Ubud for culture.',
      'paris': '🗼 Paris hotels: Le Marais for charm, Champs-Élysées for luxury.',
      'tokyo': '🗼 Tokyo: Shibuya for shopping, Shinjuku for nightlife.',
      'default': '🌍 Tell me your destination and budget for hotel recommendations.'
    };

    const lowerMessage = message.toLowerCase();
    let reply = responses.default;

    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        reply = response;
        break;
      }
    }

    res.json({ 
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Start scheduler
const scheduler = new Scheduler();
scheduler.start();

// Start server
app.listen(PORT, () => {
  console.log('=== Hotel Scraper Started ===');
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/posts`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('=============================');
});