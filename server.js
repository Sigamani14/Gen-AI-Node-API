const express = require('express'); // importing express
const { GoogleGenAI } = require("@google/genai");

require('dotenv').config(); // load environment variables from .env file
const app = express();
const cors = require('cors'); // to handle CORS

app.use(cors(
  {
    origin: 'https://blue-mushroom-0f060a100.2.azurestaticapps.net/', // allow requests from this origin
  }
)); // enable CORS
app.use(express.json()); // to parse JSON bodies

// Add CSP header to allow connections
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000");
  next();
});

// app.get('/', (req, res) => {
//   res.send('Hello!');
// }); 

const genAI = new GoogleGenAI({});

app.get('/', async (req, res) => {

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash', // specify the model to use
    contents: 'Give me a random greeting',
  });

  res.json(response); // return the response as JSON
});

app.post('/generate', async(req, res) => {
    const { prompt} = req.body; // get the prompt from the request body

    if(!prompt){
        return res.status(400).json({error: 'Prompt is required'}); // return an error if prompt is missing
    }

    try{
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash', // specify the model to use
            contents: prompt, // use the prompt from the request body
        });
        res.json(response); // return the response as JSON
    } catch(error) {
        console.error('Error generating content:', error);
        res.status(500).json({error: 'An error occurred while generating content'}); // return an error if something goes wrong
    }
});

const PORT = process.env.PORT || 3000; // use the port from environment variables or default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
