const axios = require('axios');
const cheerio = require('cheerio');

const fetchUrlMetadata = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    
    return {
      title: title.trim().substring(0, 200),
      description: description.trim().substring(0, 500),
      success: true
    };
  } catch (error) {
    console.error('Error fetching metadata:', error.message);
    return {
      title: '',
      description: '',
      success: false
    };
  }
};

module.exports = { fetchUrlMetadata };