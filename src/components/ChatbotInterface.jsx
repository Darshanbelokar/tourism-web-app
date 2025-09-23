import React, { useState, useEffect, useRef } from "react";

const BACKEND_ORIGIN = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tourism_chat_history');
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load chat history', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tourism_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history', e);
    }
    // auto-scroll
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Since AI chat service is unavailable, show a friendly message immediately
    const botMsg = { role: 'assistant', text: 'Sorry, the AI chat service is currently unavailable. Please try again later.' };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('tourism_chat_history');
  };

  const generateItinerary = async () => {
    // simple prompt using last user message or a basic form
    const destinations = messages.slice().reverse().find(m=>m.role==='user')?.text || 'Betla National Park, Netarhat';
    const payload = { destinations, duration: '3-5 days', budget: 'mid-range', interests: 'wildlife, culture' };
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/api/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      // show itinerary as a bot message (stringified for now)
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      setMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch (err) {
      console.error('Itinerary error', err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Failed to generate itinerary.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Travel Assistant</h2>
        <div className="flex items-center gap-2">
          <select value={language} onChange={e=>setLanguage(e.target.value)} className="border rounded px-2 py-1">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="sat">Santali</option>
            <option value="ho">Ho</option>
          </select>
          <button onClick={clearHistory} className="text-sm text-red-600">Clear</button>
        </div>
      </div>

      <div ref={listRef} className="h-72 overflow-auto border rounded p-3 mb-3 bg-white">
        {messages.length === 0 && <div className="text-gray-500">Ask me about places, itineraries, or local tips</div>}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role==='user'?'text-right':'text-left'}`}>
            <div className={`${m.role==='user'?'inline-block bg-blue-100 text-blue-900':'inline-block bg-gray-100 text-gray-900'} rounded px-3 py-2`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="text-gray-500">Thinking...</div>}
      </div>

      <div className="flex gap-2">
        <textarea value={input} onKeyDown={handleKey} onChange={e=>setInput(e.target.value)} rows={2} className="flex-1 border rounded p-2" placeholder="Type your message..." />
        <div className="flex flex-col gap-2">
          <button onClick={sendMessage} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
          <button onClick={generateItinerary} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Generate Itinerary</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;
