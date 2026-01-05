
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Mountain, Sparkles, Globe, ExternalLink, Map } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';
import { MOCK_TOURS } from '../services/mockData';

const SUGGESTIONS = [
    "Best time to visit Hunza?",
    "Top hotels in Skardu",
    "Current weather in Gilgit",
    "5-day itinerary ideas"
];

const LOADING_STATES = [
    "Consulting local maps...",
    "Checking road conditions...",
    "Finding hidden gems...",
    "Reading travel guides...",
    "Looking up weather forecasts..."
];

const AiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "AOA! I'm your AI assistant. How can I help you plan your trip to the North today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Listen for external open events
    useEffect(() => {
        const handleOpenEvent = (e: CustomEvent) => {
            setIsOpen(true);
            if (e.detail && e.detail.message) {
                handleSend(e.detail.message);
            }
        };

        window.addEventListener('open-ai-chat' as any, handleOpenEvent);
        return () => {
            window.removeEventListener('open-ai-chat' as any, handleOpenEvent);
        };
    }, []);

    // Cycle loading text
    useEffect(() => {
        if (isLoading) {
            let i = 0;
            const interval = setInterval(() => {
                i = (i + 1) % LOADING_STATES.length;
                setLoadingText(LOADING_STATES[i]);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    // Simple Markdown Formatter for "Attractive Typing"
    const renderFormattedText = (text: string) => {
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            
            // Handle Lists (Bullets)
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const content = trimmed.substring(2);
                return (
                    <div key={i} className="flex items-start gap-2 mb-1 ml-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-2"></div>
                        <p className="text-gray-700">
                            {parseBold(content)}
                        </p>
                    </div>
                );
            }
            
            // Handle Headers (Simple detection)
            if (trimmed.startsWith('## ')) {
                return <h4 key={i} className="text-primary font-bold text-lg mt-3 mb-2">{parseBold(trimmed.substring(3))}</h4>
            }

            // Standard Paragraphs
            if (trimmed === '') return <div key={i} className="h-2"></div>;
            
            return (
                <p key={i} className="mb-1 text-gray-800 leading-relaxed">
                    {parseBold(line)}
                </p>
            );
        });
    };

    // Helper to parse **bold** syntax
    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={index} className="font-bold text-emerald-900">{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    // Initialize Chat Session
    const getChatSession = () => {
        if (!chatSessionRef.current) {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                console.error("API Key not found");
                return null;
            }

            // 1. GATHER INFORMATION AUTOMATICALLY
            const tourDatabaseContext = MOCK_TOURS.map(t => 
                `- Tour: ${t.title}
                 - Price: $${t.price}
                 - Duration: ${t.duration_days} Days
                 - Location: ${t.location}
                 - Availability: ${t.available_seats} seats left
                 - Rating: ${t.rating} stars
                 - Description: ${t.description}
                 - Featured: ${t.featured ? "Yes" : "No"}`
            ).join('\n\n');

            // Fix: Initializing with named parameter as per guidelines
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            // 2. TRAIN THE MODEL WITH DYNAMIC CONTEXT AND WEB CAPABILITIES
            // Fix: Updated model to 'gemini-3-flash-preview' per guidelines for basic text tasks
            chatSessionRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: `You are an enthusiastic and knowledgeable local travel guide for Gilgit-Baltistan (GB), Pakistan.
                    Your name is "ExploreGB Guide".
                    
                    Key traits:
                    - Warm, hospitable, and polite (use greetings like "As-salamu alaykum").
                    - Expert on destinations: Hunza, Skardu, Fairy Meadows, Astore, Ghizer, Khunjerab Pass.
                    - Practical: Give advice on roads, weather, best seasons.
                    
                    IMPORTANT - REAL-TIME DATABASE ACCESS:
                    You have access to the following LIVE tour packages:
                    ${tourDatabaseContext}

                    IMPORTANT - WEB SEARCH ACCESS:
                    Use the search tool for current weather, road conditions, news, or specific facts not in the database.
                    
                    Response Style:
                    - Use **Bold** for key locations or prices.
                    - Use bullet points for lists or itineraries.
                    - Keep it easy to read and visually structured.
                    - Be concise but helpful.`,
                }
            });
        }
        return chatSessionRef.current;
    };

    const handleSend = async (textOverride?: string) => {
        const userMsg = textOverride || input;
        if (!userMsg.trim() || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);
        setLoadingText(LOADING_STATES[0]); // Reset loading text

        try {
            const chat = getChatSession();
            if (!chat) {
                throw new Error("Could not initialize AI");
            }

            // Fix: sendMessageStream is the correct method for chat streaming
            const result = await chat.sendMessageStream({ message: userMsg });
            
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            let fullText = '';
            let sources: { title: string; uri: string }[] = [];

            for await (const chunk of result) {
                const c = chunk as GenerateContentResponse;
                // Fix: Solely access the .text property as per guidelines (do not use .text())
                if (c.text) {
                    fullText += c.text;
                }

                if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                    c.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                        if (chunk.web) {
                            if (!sources.some(s => s.uri === chunk.web.uri)) {
                                sources.push({
                                    title: chunk.web.title || 'Source',
                                    uri: chunk.web.uri
                                });
                            }
                        }
                    });
                }

                setMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1] = { 
                        role: 'model', 
                        text: fullText,
                        sources: sources.length > 0 ? sources : undefined
                    };
                    return newArr;
                });
            }

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "My radio connection to the base camp is a bit weak (Network Error). Please try asking again!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 bg-gradient-to-br from-primary to-emerald-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Open Travel Assistant"
            >
                <div className="relative">
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                </div>
            </button>

            {/* Chat Window */}
            {/* eslint-disable-next-line */}
            <div 
                className={`fixed bottom-6 right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-500 z-50 overflow-hidden border border-gray-100 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none'}`} 
                style={{ height: '600px', maxHeight: '85vh', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900 via-primary to-emerald-800 p-4 flex justify-between items-center text-white shadow-md">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                            <Mountain size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base tracking-tight">ExploreGB Guide</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                <p className="text-xs font-medium">Online • AI Powered</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scrollbar-hide">
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    {msg.role === 'model' && idx === 0 ? (
                                        <span className="flex items-center gap-2 mb-2 font-bold text-primary text-xs uppercase tracking-wider border-b border-gray-100 pb-1">
                                            <Sparkles size={12} /> AI Assistant
                                        </span>
                                    ) : null}
                                    
                                    {/* Render message with smart formatting */}
                                    <div className="prose prose-sm max-w-none">
                                        {msg.role === 'user' ? msg.text : renderFormattedText(msg.text)}
                                    </div>
                                    
                                    {/* Source Citations */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider font-bold">
                                                <Globe size={10} /> Sources found:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, sIdx) => (
                                                    <a 
                                                        key={sIdx}
                                                        href={source.uri}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[10px] bg-gray-50 hover:bg-gray-100 text-primary border border-gray-200 px-2 py-1 rounded-md transition-colors truncate max-w-[200px]"
                                                        title={source.title}
                                                    >
                                                        {source.title} <ExternalLink size={8} />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Animated Loading Indicator */}
                        {isLoading && (
                            <div className="flex flex-col items-start animate-fade-in">
                                <div className="bg-white p-3 px-5 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center space-x-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium animate-pulse">{loadingText}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Suggestions & Input Area */}
                <div className="bg-white border-t border-gray-100 z-10">
                    {/* Suggestion Chips */}
                    {messages.length < 3 && (
                        <div className="px-4 py-3 overflow-x-auto flex gap-2 scrollbar-hide bg-gray-50/50">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(s)}
                                    className="flex-shrink-0 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Box */}
                    <div className="p-4">
                        <div className="flex items-end bg-gray-100 rounded-[24px] px-4 py-3 border border-transparent focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                            {/* eslint-disable-next-line */}
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask anything..."
                                rows={1}
                                aria-label="Chat message input"
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 resize-none max-h-24 py-1"
                                style={{ minHeight: '24px' }}
                            />
                            <button 
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className={`ml-2 p-2 rounded-full flex-shrink-0 transition-all ${
                                    input.trim() 
                                        ? 'bg-primary text-white shadow-md hover:bg-emerald-700 transform hover:-translate-y-0.5' 
                                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={input.trim() ? "ml-0.5" : ""} />}
                            </button>
                        </div>
                        <div className="text-center mt-2 flex justify-center items-center gap-1">
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                Powered by Ahad Malik <Sparkles size={8} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AiAssistant;
