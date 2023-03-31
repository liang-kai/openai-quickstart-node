import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const word = req.body.word || '';
  if (word.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid word",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: word,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(word) {
//   const capitalizedword =
//     word[0].toUpperCase() + word.slice(1).toLowerCase();
//   return `Suggest three names for an word that is a superhero.

// word: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// word: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// word: ${capitalizedword}
// Names:`;
// }