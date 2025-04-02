const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;  // Using single port

const TEST_SERVER = "http://20.244.56.144/evaluation-service";
const MAX_WINDOW_SIZE = 10;
const slidingWindow = [];

const numberSources = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

// Function to fetch numbers with a 500ms timeout
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${TEST_SERVER}/${type}`, { timeout: 500 });
    return response.data.numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

// Function to update the sliding window
const updateWindow = (newNumbers) => {
  newNumbers.forEach((num) => {
    if (!slidingWindow.includes(num)) {
      if (slidingWindow.length >= MAX_WINDOW_SIZE) {
        slidingWindow.shift(); // Remove oldest number
      }
      slidingWindow.push(num);
    }
  });
};

// Function to calculate the average
const calculateAverage = () => {
  if (slidingWindow.length === 0) return 0;
  return slidingWindow.reduce((sum, num) => sum + num, 0) / slidingWindow.length;
};

// API Endpoint for numbers
app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  if (!numberSources[numberid]) {
    return res.status(400).json({ error: "Invalid number type. Use p, f, e, or r." });
  }

  const previousState = [...slidingWindow];
  const newNumbers = await fetchNumbers(numberSources[numberid]);
  updateWindow(newNumbers);
  const updatedState = [...slidingWindow];
  const average = calculateAverage();

  res.json({
    previousState,
    updatedState,
    average
  });
});

// API Endpoint for Deep Research
app.get('/Deep-research', (req, res) => {
    res.send('Deep Research Data Here');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
