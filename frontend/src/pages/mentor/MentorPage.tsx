import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiMessageSquare, FiArrowUp, FiClock } from 'react-icons/fi';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const MentorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI mentor. How can I assist you with your studies today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's an interesting question. Let me think about that...",
        "I can help you with that. Here's what I know...",
        "Based on my knowledge, I'd suggest...",
        "That's a great topic! Here's some information that might help...",
        "I'd be happy to explain that concept to you..."
      ];
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">AI Mentor</h1>
        <p className="text-gray-600 dark:text-gray-400">Get personalized learning assistance</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 ml-3' 
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 mr-3'
                    }`}>
                      {message.sender === 'user' ? (
                        <FiUser className="w-4 h-4" />
                      ) : (
                        <FiMessageSquare className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-purple-100 text-gray-900 dark:bg-purple-900/50 dark:text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-50 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 p-2"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FiMessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-r-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center"
            >
              <FiSend className="w-4 h-4 mr-1" />
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center">
            <FiClock className="w-3 h-3 mr-1" />
            AI Mentor may produce inaccurate information
          </p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Questions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Explain this concept',
            'Help me study',
            'Quiz me',
            'Give me an example'
          ].map((question) => (
            <button
              key={question}
              onClick={() => setNewMessage(question + ' ')}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorPage;
