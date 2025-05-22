'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getChatbotResponse } from '@/services/chat.service';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const courseId = params.id as string;

  const handleBack = () => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    router.push(`/course/${courseId}`);
  };

  const checkEmbedding = async () => {
      const response = await getChatbotResponse(
        inputText, 
        0.1, 
        courseId,
      );

      if (!response) {
        throw new Error('No response received from the server');
      }

      if(!response.data.success){
        // add a toast here
        toast.error("Some assets are still being embedded, please try again later");
        setTimeout(() => {
          router.push(`/course/${courseId}`);
        }, 2000); // 1 second delay
        return;
      }
      return;
}

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkEmbedding()
  }, [courseId] );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = { 
      text: inputText.trim(), 
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await getChatbotResponse(
        inputText, 
        0.1, 
        courseId,
        abortControllerRef.current.signal
      );
      
      if (!response) {
        throw new Error('No response received from the server');
      }

      const queryResponse = response.data.data;
      const queryResponseMessage: Message = {
        text: queryResponse.trim(),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, queryResponseMessage]);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.info('Request cancelled');
      } else {
        toast.error('Failed to get response from chatbot');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" closeButton />
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="py-6 px-4 bg-white border-b flex items-center justify-between">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors group"
          onClick={() => router.push(`/course/${courseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Button>
          <h1 className="text-2xl font-semibold text-gray-800">
            AI Assistant
          </h1>
          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[60%] rounded-2xl p-3 shadow-sm ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.isUser ? (
                    <p className="text-sm">{message.text}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-800 rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-xl border border-gray-200 
                       bg-white text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200"
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-xl
                         hover:bg-red-600
                         transition-all duration-200 transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-xl
                         hover:bg-blue-600 disabled:bg-blue-300
                         transition-all duration-200 transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
