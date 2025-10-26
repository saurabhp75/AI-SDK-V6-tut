import { google } from '@ai-sdk/google';
import { streamText, streamObject } from 'ai';
import z from 'zod';

const model = google('gemini-2.0-flash');

const stream = streamText({
  model,
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;

// TODO: Replace this with a call to streamObject, passing:
// - The model, same as above
// - The prompt, asking for facts about the imaginary planet,
//   passing in the finalText as the story
// - The schema, which should be an object with a facts property
//   that is an array of strings
const factsResult = streamObject({
  model,
  prompt: `Give me some facts about the imaginary planet. Here's the story: ${finalText}`,
  schema: z.object({
    facts: z
      .array(z.string())
      .describe(
        'The facts about the imaginary planet. Write as if you are a scientist.',
      ),
  }),
});

for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
