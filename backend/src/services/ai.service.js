import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateResponse(prompt) {

  if (!prompt) {
    return {
      success: false,
      message: "prompt is required",
    };
  }

  try {

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an expert AI Code Reviewer and Senior Software Engineer.

Your task is to analyze code submitted by users.

Responsibilities:
- Detect syntax errors
- Detect logical errors
- Detect runtime issues
- Detect bad coding practices
- Suggest optimizations
- Suggest cleaner approaches
- Explain time complexity for DSA problems
- Explain space complexity for DSA problems
- Identify edge cases
- Review both development and DSA code
- Support JavaScript, C++, Java, Python, React, Node.js, Express, MongoDB, and SQL

Response Rules:
- Be concise but clear
- Explain errors line by line if needed
- Provide corrected code when possible
- Mention why the issue occurs
- Suggest best practices
- Format responses properly using markdown

For DSA code:
- Analyze brute force and optimized approaches
- Explain algorithm choice
- Mention TC and SC

For development code:
- Check API logic
- Check security issues
- Check async-await mistakes
- Check database handling
- Check React component issues

Never give vague answers.
Always behave like a professional senior developer conducting a real code review.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.5,
      max_tokens: 2048,
    });

    return {
      success: true,
      data: chatCompletion.choices[0].message.content,
    };

  } catch (error) {

    console.log("Groq Error:", error);

    if (error.status === 429) {
      return {
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Something went wrong with AI service.",
    };
  }
}

export default generateResponse;