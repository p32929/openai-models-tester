import { useState } from 'react';
import axios from 'axios';

const AskGptComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<'gpt-4o-mini' | 'gpt-4o' | 'o1-preview'>('gpt-4o-mini');
  const [conversations, setConversations] = useState<
    Array<{ id: number; role: 'system' | 'user' | 'assistant'; text: string }>
  >([
    {
      id: 1,
      role: "system",
      text: `you are an amazing twitter tweet replier who writes amazing replies to tweets that are little sarcastic, engaging, funny and sophisticated. The comments should not be more than 16 words. also dont use any emojis.
for instance:

tweet:
BREAKING: $NVDA's 3rd largest customer Super Micro Computer $SMCI is being probed by the Justice Department over "accounting irregularities."
What's a -15%  candlestick called?

reply:
Fraud

tweet:
Nvidia, $NVDA, CEO Jensen has said he works seven days a week, and when he is not working, he is thinking about working.

reply:
His work works.

tweet:  
Tesla has just reported 462,890 deliveries; their best ever for a Q3. Here's how that compares to all prior Q3s:  
$TSLA

reply:  
Exponential growth is over

tweet:
$NVDA buyers stepped in again today to save our bullish structure We were expecting worst case $110 before a bounce and rally to $150 by end of year. That being said, seems THIS could have been the moment we were waiting for. Find out how I plan to play $NVDA this week ⬇️

reply:
Ah, the classic "we were expecting" strategy. Best of luck dodging the curveballs!

`}])
  const [apiKey, setApiKey] = useState(''); // API Key input state

  // Function to handle adding new conversation entries with a role
  const handleAddConversation = (role: 'system' | 'user' | 'assistant') => {
    const newConversation = {
      id: conversations.length + 1, // Unique ID for each conversation entry
      role,
      text: '',
    };
    setConversations((prev) => [...prev, newConversation]);
  };

  // Function to handle updating the text of a specific conversation entry
  const handleConversationTextChange = (id: number, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, text } : conv))
    );
  };

  const handleAsk = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/askGpt', {
        prompt,
        model,
        previousConversations: conversations.map(({ role, text }) => ({ role, text })),
        apiKey,    // Pass the OpenAI API key with the request
      });

      if (res.data.success) {
        setResponse(res.data.message);
      } else {
        setResponse('Failed to get a response');
      }
    } catch (error) {
      setResponse('Error occurred while requesting: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Ask GPT</h2>

      {/* API Key Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">OpenAI API Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter OpenAI API Key"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Model Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as 'gpt-4o-mini' | 'gpt-4o' | 'o1-preview')}
          className="w-full p-2 border rounded"
        >
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="o1-preview">o1-preview</option>
        </select>
      </div>

      {/* Add Conversation Entries */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Add Conversation Entry:</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddConversation('system')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Add System
          </button>
          <button
            onClick={() => handleAddConversation('user')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add User
          </button>
          <button
            onClick={() => handleAddConversation('assistant')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Assistant
          </button>
        </div>
      </div>

      {/* Display and Edit Conversation Entries */}
      {conversations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold">Conversation Entries:</h3>
          {conversations.map((conv) => (
            <div key={conv.id} className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                {conv.role.charAt(0).toUpperCase() + conv.role.slice(1)} Entry:
              </label>
              <textarea
                value={conv.text}
                onChange={(e) => handleConversationTextChange(conv.id, e.target.value)}
                placeholder={`Enter ${conv.role} conversation...`}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Prompt Text Area */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Enter Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-2 mb-4 border rounded"
        />
      </div>

      {/* Ask GPT Button */}
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? 'Asking...' : 'Ask GPT'}
      </button>

      {/* Display Response */}
      {response && !loading && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AskGptComponent;
