const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  // Log form data for debugging
  console.log('Form Data:', formData);

  // Save data to a CSV file
  const csvFilePath = path.join(__dirname, 'responses.csv');
  const headers = ['Timestamp', 'Age', 'Country', 'Categories', 'Main Categories', 'CTF Count', 'Commitment', 'Writeups', 'Social Links', 'Discord Handle'];
  const timestamp = new Date().toISOString();

  const row = [
    timestamp,
    formData.age,
    formData.country,
    formData.categories.join(';'),
    formData.mainCategories.join(';'),
    formData.ctfCount,
    formData.commitment,
    formData.writeups,
    formData.socialLinks,
    formData.discordHandle,
  ].join(',');

  // Check if the file exists; if not, write headers
  if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, headers.join(',') + '\n');
  }

  // Append the row to the file
  fs.appendFileSync(csvFilePath, row + '\n');

  res.status(200).send('Form submitted successfully!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
