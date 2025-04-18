// werite my prompt in xml format
export const PROMPTS = {
  quizPrompt: (content: string) => `
        <context>
            You are a quiz creator.  Ask every question by somewhat and sometimes twisting the questions so that you can make sure that the use
            acutually knows the content rather than memorizing it. No need to make it extremely difficult but make sure the quality of questions are
            decently hard and standard as of a highly accredited institution like harvard/stanford.
        </context>
        <instructions>
            You are responsible for creating atleast 10 quizzed based on the content provided. Also provide a reason for the right answer. And make sure
            to ask new sets of questions or atleast questions in different order everytime you are asked for quiz questions.
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
