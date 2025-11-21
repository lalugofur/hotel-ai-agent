class SocialPoster {
  constructor() {
    // No Twitter initialization at all
  }

  async postToTwitter(message) {
    console.log('🐦 Twitter (simulated):', message.substring(0, 60) + '...');
    return { simulated: true, platform: 'twitter' };
  }

  async postToFacebook(message) {
    console.log('📘 Facebook (simulated):', message.substring(0, 60) + '...');
    return { simulated: true, platform: 'facebook' };
  }

  async postToInstagram(message) {
    console.log('📸 Instagram (simulated):', message.substring(0, 60) + '...');
    return { simulated: true, platform: 'instagram' };
  }
}

module.exports = SocialPoster;