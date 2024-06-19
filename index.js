const express = require("express");
const cors = require("cors"); // Enable CORS for development (remove for production)

const WINDOW_SIZE = 10;
let window = new Set();

// Simulate fetching numbers (replace with actual Test Server interaction)
function fetchNumbers(numberType) {
  if (numberType === "p") {
    return Promise.resolve([2, 3, 5, 7]);
    // Simulate prime numbers
  } else if (numberType === "f") {
    return Promise.resolve([1, 1, 2, 3, 5]);
    // Simulate Fibonacci sequence
  } else if (numberType === "e") {
    return Promise.resolve(Array.from({ length: 5 }, (_, i) => 2 * (i + 1)));
    // Simulate even numbers
  } else if (numberType === "r") {
    return Promise.resolve([1, 5, 8, 3, 9]);
    // Simulate random numbers
  } else {
    return Promise.reject(new Error("Invalid number type"));
  }
}

// Calculate average without external libraries
function calculateAverage() {
  if (window.size === 0) {
    return null;
  }
  let sum = 0;
  for (const num of window) {
    sum += num;
  }
  return sum / window.size;
}

const app = express();
app.use(cors());
// Enable CORS for development (remove for production)

app.get("/numbers/:numberType", async (req, res) => {
  const numberType = req.params.numberType;

  try {
    const newNumbers = await fetchNumbers(numberType);

    // Update window with unique numbers
    window = new Set([...window, ...newNumbers]);
    window = new Set(Array.from(window).slice(-WINDOW_SIZE));

    // Calculate average
    const average = calculateAverage();

    const response = {
      windowPrevState: Array.from(window).slice(0, -newNumbers.length),
      windowCurrState: Array.from(window),
      numbers: newNumbers,
      avg: average,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  } finally {
    setNumberType(""); 
    // Reset number type after fetching (not applicable here)
  }
});

app.listen(9876, () => console.log("Server listening on port 9876"));
