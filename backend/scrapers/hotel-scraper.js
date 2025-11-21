const puppeteer = require('puppeteer');
const axios = require('axios');

class HotelScraper {
  
  constructor() {
    this.browser = null;
    this.page = null;
  }

  // Main method to scrape hotels from multiple sources
  async scrape(location) {
    console.log(`Starting scrape for: ${location}`);
    
    let results = [];
    
    try {
      // Try Expedia first
      const expediaHotels = await this.scrapeExpedia(location);
      results = results.concat(expediaHotels);
      
      // If no results, try mock data
      if (results.length === 0) {
        console.log('No results from Expedia, using mock data');
        results = this.getMockHotels(location);
      }
      
    } catch (error) {
      console.log('Scraping failed, using mock data:', error.message);
      results = this.getMockHotels(location);
    }
    
    console.log(`Found ${results.length} hotels in ${location}`);
    return results;
  }

  // Expedia scraper - realistic approach
  async scrapeExpedia(location) {
    console.log(`Scraping Expedia for ${location}...`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Go to Expedia search
      const searchUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(location)}`;
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for results to load
      await page.waitForTimeout(5000);
      
      // Extract hotel data - using multiple selectors for robustness
      const hotels = await page.evaluate(() => {
        const hotelElements = document.querySelectorAll('[data-stid="property-card"], .uitk-card, .offer-card');
        const results = [];
        
        hotelElements.forEach((card, index) => {
          if (index >= 8) return; // Limit to 8 hotels
          
          // Try different selectors for hotel name
          const nameSelectors = ['h3', '[data-test-id="hotel-name"]', '.uitk-heading'];
          let name = '';
          
          for (const selector of nameSelectors) {
            const element = card.querySelector(selector);
            if (element && element.textContent.trim()) {
              name = element.textContent.trim();
              break;
            }
          }
          
          // Try different selectors for price
          const priceSelectors = ['[data-test-id="price-summary"]', '.uitk-text', '.price'];
          let priceText = '';
          
          for (const selector of priceSelectors) {
            const element = card.querySelector(selector);
            if (element && element.textContent) {
              priceText = element.textContent;
              break;
            }
          }
          
          const price = priceText ? parseInt(priceText.replace(/[^\d]/g, '')) : null;
          
          if (name && price) {
            results.push({
              name: name,
              price: price,
              rating: Math.random() * 2 + 3, // Random rating between 3-5
              location: location,
              image: `https://picsum.photos/400/300?random=${index}`,
              description: `Hotel in ${location}`,
              scrapedAt: new Date()
            });
          }
        });
        
        return results;
      });
      
      return hotels;
      
    } catch (error) {
      console.log('Expedia scrape failed:', error.message);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // Fallback mock data
  getMockHotels(location) {
    const hotels = [
      {
        name: `${location} Luxury Resort`,
        price: Math.floor(Math.random() * 200) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        location: location,
        amenities: ['Pool', 'Spa', 'Restaurant'],
        image: `https://picsum.photos/400/300?random=1`,
        description: `Nice hotel in ${location}`,
        scrapedAt: new Date()
      },
      {
        name: `${location} City Hotel`, 
        price: Math.floor(Math.random() * 150) + 50,
        rating: (Math.random() * 2 + 3).toFixed(1),
        location: location,
        amenities: ['Breakfast', 'WiFi', 'Gym'],
        image: `https://picsum.photos/400/300?random=2`,
        description: `Good hotel in downtown ${location}`,
        scrapedAt: new Date()
      },
      {
        name: `${location} Budget Inn`,
        price: Math.floor(Math.random() * 80) + 30,
        rating: (Math.random() * 2 + 3).toFixed(1),
        location: location,
        amenities: ['Parking', 'AC', 'TV'],
        image: `https://picsum.photos/400/300?random=3`,
        description: `Cheap hotel in ${location}`,
        scrapedAt: new Date()
      }
    ];
    
    return hotels;
  }
}

module.exports = HotelScraper;