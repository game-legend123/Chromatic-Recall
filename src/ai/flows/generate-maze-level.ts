'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating maze levels with varying complexity, color palettes, and path lengths.
 *
 * - generateMazeLevel - A function that generates maze levels.
 * - GenerateMazeLevelInput - The input type for the generateMazeLevel function.
 * - GenerateMazeLevelOutput - The return type for the generateMazeLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMazeLevelInputSchema = z.object({
  mazeComplexity: z
    .number()
    .min(1)
    .max(10)
    .describe('The complexity of the maze (1-10, where 10 is most complex).'),
  colorPaletteSimilarity: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'The similarity of the colors in the palette (0-1, where 1 is most similar).'
    ),
  pathLength: z
    .number()
    .min(5)
    .max(25)
    .describe('The length of the path through the maze (5-25).'),
});
export type GenerateMazeLevelInput = z.infer<typeof GenerateMazeLevelInputSchema>;

const GenerateMazeLevelOutputSchema = z.object({
  mazeData: z
    .string()
    .describe(
      'A string representation of the maze level, including the layout, color sequence, and path.'
    ),
});
export type GenerateMazeLevelOutput = z.infer<typeof GenerateMazeLevelOutputSchema>;

export async function generateMazeLevel(
  input: GenerateMazeLevelInput
): Promise<GenerateMazeLevelOutput> {
  return generateMazeLevelFlow(input);
}

const generateMazeLevelPrompt = ai.definePrompt({
  name: 'generateMazeLevelPrompt',
  input: {schema: GenerateMazeLevelInputSchema},
  output: {schema: GenerateMazeLevelOutputSchema},
  prompt: `You are a maze generator. Generate a maze level with the following characteristics:

Maze Complexity: {{mazeComplexity}}
Color Palette Similarity: {{colorPaletteSimilarity}}
Path Length: {{pathLength}}

Return the maze level data as a string.  The string should contain a matrix of characters representing the maze layout and the color sequence. Use the '#' character to represent walls, '.' to represent empty spaces, 'S' for the start, 'E' for the end, and numbers to represent the path, where each number corresponds to a color in the color sequence.

Example:

Complexity: 3
Similarity: 0.6
Path Length: 7

Output:

#######
#S1234#
#     #
#567E #
#######

Colors:
1: Electric Indigo
2: Luminous Vivid Violet
3: Dark slate gray
4: Electric Indigo
5: Luminous Vivid Violet
6: Dark slate gray
7: Electric Indigo`,
});

const generateMazeLevelFlow = ai.defineFlow(
  {
    name: 'generateMazeLevelFlow',
    inputSchema: GenerateMazeLevelInputSchema,
    outputSchema: GenerateMazeLevelOutputSchema,
  },
  async input => {
    const {output} = await generateMazeLevelPrompt(input);
    return output!;
  }
);
