import { useState } from "react";
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import { MessageCircle, Send, Bot, User, Globe, Mic, X, Loader2 } from "lucide-react";

const getApiBase = () => 'http://localhost:3000';

const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your AI travel assistant for Jharkhand. I can help you in Hindi, English, Santali, and other local languages. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  // Voice assistant logic
  let recognition;
  if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage === 'हिंदी' ? 'hi-IN' : 'en-US';
  }

  const handleMicClick = () => {
    if (!recognition) {
      setSpeechError("Speech recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }
    setSpeechError("");
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      setSpeechError(event.error || "Speech recognition error");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'sat', name: 'Santali' },
    { code: 'ho', name: 'Ho' },
    { code: 'kha', name: 'Kharia' }
  ];

  const sampleQueries = [
    "Best places to visit in Jharkhand",
    "Tribal cultural experiences",
    "Eco-friendly accommodations",
    "Local food recommendations",
    "Transportation options"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setLoading(true);

    try {
      console.log('Sending message to API:', currentMessage);
      const apiBase = getApiBase();
      console.log('API base URL:', apiBase);
      
      const response = await fetch(`${apiBase}/api/ai-chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          language: selectedLanguage 
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const botMessage = {
        id: userMessage.id + 1,
        text: data.response || data.message || "Sorry, I couldn't generate a response.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-glow bg-gradient-primary hover:shadow-lg transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      <Card className="shadow-glow bg-background border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Jharkhand Travel AI</h3>
              <p className="text-xs opacity-90">Multilingual Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-primary-foreground/20 text-primary-foreground rounded px-2 py-1 border-0"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-muted-foreground'}`}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="max-w-[75%]">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sample Queries */}
        {messages.length === 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="space-y-1">
              {sampleQueries.slice(0, 3).map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(query)}
                  className="block w-full text-left text-xs p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Type your message in ${selectedLanguage}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={loading || isListening}
            />
            <Button size="sm" variant="ghost" onClick={handleMicClick} disabled={loading || isListening} aria-label="Start voice input">
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse text-green-500' : ''}`} />
            </Button>
            <Button size="sm" onClick={handleSendMessage} disabled={!inputMessage.trim() || loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            AI-powered • Supports 5+ languages
          </p>
          {speechError && (
            <p className="text-xs text-red-500 mt-1">{speechError}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatbotInterface;
