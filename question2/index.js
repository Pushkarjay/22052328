const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  const validIds = ["p", "f", "e", "r"];
  if (!validIds.includes(numberid)) return res.status(400).json({ error: "Invalid ID" });

  const urlMap = { p: "primes", f: "fibo", e: "even", r: "rand" };
  try {
    const response = await fetch(`http://20.244.56.144/evaluation-service/${urlMap[numberid]}`, {
      headers: { 
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTk5NDc2LCJpYXQiOjE3NDM1OTkxNzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZlZDNjNjIwLTFiMGYtNDIwNS1hMWIyLTBkMGYyZDdkNDk5OCIsInN1YiI6InB1c2hrYXJqYXkuYWpheTFAZ21haWwuY29tIn0sImVtYWlsIjoicHVzaGthcmpheS5hamF5MUBnbWFpbC5jb20iLCJuYW1lIjoicHVzaGthcmpheSBhamF5Iiwicm9sbE5vIjoiMjIwNTIzMjgiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI2ZWQzYzYyMC0xYjBmLTQyMDUtYTFiMi0wZDBmMmQ3ZDQ5OTgiLCJjbGllbnRTZWNyZXQiOiJ4U3VkdHdKZmRlRFpUdkZCIn0.-DbDnDBe4SCCySP9FizuWasgBWr1P43ldvYimKFnWGc" 
      },
      timeout: 500,
    });
    const { numbers } = await response.json();
    res.json({ numbers });
  } catch (error) {
    res.status(500).json({ error: "API error" });
  }
});

app.listen(9876, () => console.log("Server on port 9876"));