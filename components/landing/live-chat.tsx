'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Rajora AI. Ask me anything about AI, coding, or general knowledge.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: 'This is a demo response. Connect to the backend API to get real AI responses!',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="glass rounded-2xl p-6 h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Rajora AI Chat</h3>
          <p className="text-xs text-gray-400">Powered by Llama 3.1</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-purple-400 to-pink-500'
                    : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] p-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-white'
                    : 'bg-white/5 text-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}