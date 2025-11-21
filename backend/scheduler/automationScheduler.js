import cron from 'node-cron';
import HotelScraper from '../scrapers/hotelScraper.js';
import ContentGenerator from '../ai/contentGenerator.js';
import SocialMediaManager from '../social/SocialPoster.js';
import { BlogPost } from '../database/models.js';

class AutomationScheduler {
  constructor() {
    this.scraper = new HotelScraper();
    this.contentGenerator = new ContentGenerator();
    this.socialManager = new SocialMediaManager();
    
    this.locations = ['Bali', 'Paris', 'Tokyo', 'New York', 'London', 'Bangkok', 'Dubai'];
    this.isRunning = false;
  }

  startScheduler() {
    console.log('🕐 Starting AI Hotel Agent Scheduler...');
    
    // Run immediately on startup
    this.runPublishingCycle();
    
    // Schedule every 2 hours
    cron.schedule('0 */2 * * *', () => {
      console.log('🚀 Starting scheduled publishing cycle...');
      this.runPublishingCycle();
    });

    // Additional schedule for variety - every 6 hours with different location
    cron.schedule('0 */6 * * *', () => {
      console.log('🎯 Starting variety publishing cycle...');
      this.runPublishingCycle(true);
    });

    console.log('✅ Scheduler started successfully!');
    console.log('⏰ Running every 2 hours');
    console.log('🎭 Variety posts every 6 hours');
  }

  async runPublishingCycle(useVariety = false) {
    if (this.isRunning) {
      console.log('⚠️  Publishing cycle already running, skipping...');
      return;
    }

    this.isRunning = true;
    
    try {
      console.log('\n══════════════════════════════════════');
      console.log('🤖 AI HOTEL AGENT - PUBLISHING CYCLE');
      console.log('══════════════════════════════════════\n');

      // 1. Choose location
      const location = useVariety 
        ? this.getRandomLocation() 
        : this.getLocationByTime();
      
      console.log(`📍 Target Location: ${location}`);

      // 2. Scrape hotel data
      console.log('🔍 Scraping hotel data...');
      const hotelData = await this.scraper.scrapeHotels(location);
      console.log(`✅ Found ${hotelData.length} hotels`);

      // 3. Generate AI content
      console.log('🤖 Generating AI content...');
      const blogContent = await this.contentGenerator.generateBlogContent(hotelData);
      const imageUrl = await this.contentGenerator.generateImagePrompt(hotelData);
      const socialPosts = await this.contentGenerator.generateSocialMediaPosts(blogContent, hotelData);

      // 4. Save to database
      console.log('💾 Saving to database...');
      const blogPost = new BlogPost({
        ...blogContent,
        imageUrl,
        hotelData,
        socialPosts,
        location,
        status: 'published'
      });
      
      await blogPost.save();
      console.log(`📝 Blog post saved: "${blogContent.title}"`);

      // 5. Publish to Lynx/RN App (simulated)
      console.log('📱 Publishing to Lynx/RN App...');
      await this.publishToLynxApp(blogPost);

      // 6. Share to social media
      console.log('📤 Sharing to social media...');
      const socialResults = await this.socialManager.shareToSocialMedia(blogPost);
      
      socialResults.forEach(result => {
        if (result.success) {
          console.log(`✅ ${result.platform}: Shared successfully`);
        } else {
          console.log(`❌ ${result.platform}: Failed - ${result.error}`);
        }
      });

      console.log('\n🎉 PUBLISHING CYCLE COMPLETED SUCCESSFULLY!');
      console.log('══════════════════════════════════════\n');

    } catch (error) {
      console.error('❌ Publishing cycle failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  getRandomLocation() {
    return this.locations[Math.floor(Math.random() * this.locations.length)];
  }

  getLocationByTime() {
    const hour = new Date().getHours();
    // Different locations based on time of day
    const timeBasedLocations = {
      morning: ['Bali', 'Tokyo'],      // 6-12
      afternoon: ['Paris', 'London'],  // 12-18  
      evening: ['New York', 'Dubai'],  // 18-24
      night: ['Bangkok', 'Bali']       // 0-6
    };

    let period;
    if (hour >= 6 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 18) period = 'period';
    else if (hour >= 18 && hour < 24) period = 'evening';
    else period = 'night';

    const availableLocations = timeBasedLocations[period] || this.locations;
    return availableLocations[Math.floor(Math.random() * availableLocations.length)];
  }

  async publishToLynxApp(blogPost) {
    // Simulate Lynx/RN app integration
    // In real implementation, this would call your Lynx/RN app API
    
    const lynxPayload = {
      title: blogPost.title,
      content: blogPost.content,
      image: blogPost.imageUrl,
      metadata: {
        location: blogPost.location,
        hotels: blogPost.hotelData.slice(0, 3),
        publishedAt: blogPost.publishedAt,
        tags: blogPost.tags
      },
      type: 'hotel_deal',
      priority: 'high'
    };

    console.log('📱 Lynx App Payload:', {
      title: lynxPayload.title,
      location: lynxPayload.metadata.location,
      hotels: lynxPayload.metadata.hotels.length
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: 'Published to Lynx/RN app' };
  }

  // Manual trigger for testing
  async manualPublish(location = null) {
    const targetLocation = location || this.getRandomLocation();
    console.log(`🎮 Manual publish triggered for: ${targetLocation}`);
    await this.runPublishingCycle(false);
  }
}

export default AutomationScheduler;
