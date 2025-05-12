// werite my prompt in xml format
export const PROMPTS = {
  quizPrompt: (content: string) => `
        <context>
            You are a quiz creator. Create exactly 10 questions total, distributed evenly across all provided assets.
            Each asset's content is separated by "Next Asset". Make sure to create questions from each asset section.
            Ask questions that test understanding rather than memorization. Questions should be challenging but fair,
            similar to those at top institutions like Harvard/Stanford.
        </context>
        <instructions>
            1. Create EXACTLY 10 questions total
            2. Distribute questions evenly across all assets (separated by "Next Asset")
            3. For each question, provide:
               - The question
               - 4 options
               - The correct answer index (0-3)
               - A clear explanation for the correct answer
            4. Ensure questions test understanding, not just memorization
            5. Vary question types and difficulty appropriately
        </instructions>
        <content>
            ${content}
        </content>
        <output>
           {
            "questions": [
                {
                    "question": "What is the capital of France?",
                    "options": ["Paris", "London", "Rome", "Madrid"],
                    "answer_index": 0,
                    "right_answer_reason": "Paris is the capital of France because it is the most beautiful city in the world."
                }
            ]
           }
        </output>
    `,
};
