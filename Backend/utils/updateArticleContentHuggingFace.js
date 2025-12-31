import axios from "axios";

export async function updateArticleContent(originalText, scrapedArticles) {
  if (!originalText || !scrapedArticles || scrapedArticles.length < 2) {
    console.error("Missing required data for enhancement!");
    return "Data missing";
  }

  // Task instructions for the LLM
  const prompt = `Rewrite the following original article to match the professional tone, depth, and formatting of the reference articles provided. Use Markdown headings and ensure it is high quality.

ORIGINAL ARTICLE:
${originalText}

REFERENCE 1:
${scrapedArticles[0].content}

// REFERENCE 2:
// ${scrapedArticles[1].content}`;

  try {
    const response = await axios.post(
      // "https://router.huggingface.co/hf-inference/v1/chat/completions", 
      "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Make sure token is valid
          "Content-Type": "application/json",
        },
        timeout: 90000, // LLMs take time, 90s is safer
      }
    );

    // New response format handling
    let enhancedContent = response.data.choices[0].message.content;

    // Adding references as per Phase 2 requirement
    enhancedContent += `\n\n--- \n### References:\n- ${scrapedArticles[0].url}\n- ${scrapedArticles[1].url}`;

    return enhancedContent;

  } catch (error) {
    console.error("Hugging Face Router Error:", error.response?.data || error.message);
    return "Enhancement failed due to API error";
  }
}