const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

// Function to fetch data from a given URL
async function fetchDataFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching data from URL ${url}:`, error.message);
    return [];
  }
}

// Function to merge and return unique integers
function mergeAndSortNumbers(numbersArray) {
  return [...new Set(numbersArray)].sort((a, b) => a - b);
}

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || typeof urls !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing query parameter: url' });
  }

  const urlsArray = urls.split('&');

  try {
    const fetchDataPromises = urlsArray.map(fetchDataFromUrl);
    const allNumbers = await Promise.all(fetchDataPromises);

    // Merge and sort the numbers from all URLs
    const mergedNumbers = mergeAndSortNumbers(allNumbers.flat());

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error processing URLs:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`number-management-service is running at http://localhost:${port}`);
});