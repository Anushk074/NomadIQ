# NomadIQ AI Architecture

## AI Philosophy

NomadIQ is not a simple chatbot.

The AI layer should combine:

- User preferences
- Trip requirements
- Existing trip data
- Destination information
- Weather information
- Places and attractions
- Budget information

The AI then produces a structured response.

## AI Flow

```text
User Request
      |
      v
AIService
      |
      +--------------------+
      |                    |
      v                    v
TripService         DiscoveryService
      |                    |
      +---------+----------+
                |
                v
          AI Orchestrator
                |
                v
             AI Model
                |
                v
      Structured AI Response

Core AI Features
----------------

### 1\. AI Trip Planner

Input:

Destination
Budget
Duration
Travel Dates
Travel Style
Preferences
Number of Travelers

Output:

*   Trip overview
    
*   Daily itinerary
    
*   Budget breakdown
    
*   Recommendations
    
*   Important travel notes
    

### 2\. Trip Modification

Examples:

*   Make Day 3 cheaper
    
*   Add more nature activities
    
*   Remove museums
    
*   Add vegetarian food options
    
*   Reduce the trip by one day
    

The AI receives:

Existing Trip
+
User Modification Request
+
Relevant Destination Data

It returns a modified structured plan.

### 3\. AI Travel Assistant

Examples:

*   What should I do on Day 3?
    
*   What if it rains?
    
*   What should I pack?
    
*   Is this place vegetarian-friendly?
    

The assistant should use trip and conversation context.

Structured Responses
--------------------

AI responses should not initially be treated as unstructured text.

Example:

JSON 
{
  "tripSummary": "",
  "estimatedTotalCost": 0,
  "currency": "INR",
  "days": [
    {
      "day": 1,
      "activities": []
    }
  ]
}

Structured responses make it easier to:

*   Save trips
    
*   Modify trips
    
*   Render React UI
    
*   Validate responses
    
*   Reuse generated plans
    

AI Provider Strategy
--------------------

AI provider logic should be abstracted.

Initial providers may include:

*   Google Gemini
    
*   Claude
    
*   OpenAI
    

The application should not tightly depend on a single provider.

Example abstraction:

IAIProvider
     |
     +-- GeminiProvider
     +-- ClaudeProvider
     +-- OpenAIProvider
     
Only one provider needs to be implemented initially.

Important AI Rules
------------------

The AI should:

*   Use real data when available
    
*   Clearly handle missing information
    
*   Return structured output where required
    
*   Not permanently store API keys in source code
    
*   Avoid hallucinating booking confirmations
    
*   Avoid presenting estimated prices as guaranteed prices
    

Future AI Improvements
----------------------

Future features may include:

*   Function calling
    
*   Tool calling
    
*   RAG
    
*   Embeddings
    
*   Vector database
    
*   AI agents
    
*   Multiple AI agents
    
*   Recommendation models
    
*   Flight price prediction
    

These are not part of the initial MVP.