# Media-Literacy-Campaign

## AI Headline Research

The headline checker keeps its local wording analysis and can also search current web coverage through Tavily. Create a Tavily key in [the Tavily dashboard](https://app.tavily.com/home); its current free plan lists 1,000 search credits per month, with basic search costing one credit per query. The checker runs up to two searches per headline (about 500 full analyses per month at that quota). Add the keys to `.env.local` (the file is git-ignored):

```dotenv
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
# GEMINI_MODEL=gemini-3.8-flash
GROQ_API_KEY=your_groq_api_key
# GROQ_MODEL=openai/gpt-oss-20b
```

Restart the dev server after changing environment variables. Never expose these keys through a `NEXT_PUBLIC_` variable. Tavily retrieves search results; Gemini is tried first to assess those results, and Groq is used if Gemini is unavailable. Both models receive the same bounded search evidence, and neither performs a separate web search in this flow. Check current [Tavily credits](https://docs.tavily.com/documentation/api-credits), [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), and [Groq rate limits](https://console.groq.com/docs/rate-limits) before deployment.

The AI review is an educational research aid, not a definitive fact-check. It reports evidence strength and links only to search results returned by Tavily. Headlines and search queries are sent to Tavily, and the headline plus retrieved snippets are sent to the selected model provider. Review provider terms before using sensitive data or deploying publicly.
