const axios = require('axios');

/**
 * Generate AI summary using Anthropic Claude API
 */
async function generateSummary(countryName, newsArticles, countryData) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return generateFallbackSummary(countryName, newsArticles, countryData);
  }

  const headlines = newsArticles.slice(0, 5).map(a => `- ${a.title}`).join('\n');
  const prompt = `You are a concise geopolitical analyst. Given the following context about ${countryName}, provide a 3-sentence summary of the current situation and key themes.

Country: ${countryName}
Capital: ${countryData?.capital || 'N/A'}
Region: ${countryData?.region || 'N/A'}
Population: ${countryData?.population?.toLocaleString() || 'N/A'}

Recent Headlines:
${headlines}

Provide a professional, neutral 3-sentence summary covering: current events, economic/social context, and regional significance.`;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
    return response.data.content[0].text;
  } catch (err) {
    console.error('AI summary error:', err.message);
    return generateFallbackSummary(countryName, newsArticles, countryData);
  }
}

function generateFallbackSummary(countryName, newsArticles, countryData) {
  const region = countryData?.region || 'the world';
  const pop = countryData?.population ? countryData.population.toLocaleString() : 'millions';
  const capital = countryData?.capital || 'its capital';
  return `${countryName} is a nation in ${region} with a population of ${pop}, governed from ${capital}. Recent news coverage highlights ongoing developments across political, economic, and social spheres. As a significant player in its region, ${countryName} continues to navigate complex global dynamics that shape its domestic and international affairs.`;
}

module.exports = { generateSummary };
