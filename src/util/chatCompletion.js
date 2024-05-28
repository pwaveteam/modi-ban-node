import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    console.log(message)
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: message}],
      });
      const result = completion.data.choices[0].message.content
      res.status(200).json({ message: result })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'An error occurred while generating the message.' })
    }
  } else {
    res.status(405).json({ error: 'Only POST requests are accepted.' });
  }
}