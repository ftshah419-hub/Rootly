import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Sprout } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { aiService } from '../../../services/user/aiService';

const HarvestBuddyChat = () => {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'ml'
        ? "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഹാർവെസ്റ്റ് ബഡ്ഡി (Harvest Buddy). ജൈവ കൃഷി രീതികൾ, ചെടികളുടെ രോഗങ്ങൾ, ജൈവ വളങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം."
        : "Namaskaram! I am your Harvest Buddy AI assistant. Ask me anything about home gardening, organic bio-fertilizers, seasonal planting, or pest remedies!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "How to prepare Jeevamrutham fertilizer?",
    "Why are my green chili leaves curling?",
    "Best organic potting mix ratio for grow bags?",
    "നാടൻ പൂപ്പൽ രോഗത്തിന് എന്ത് ചെയ്യണം?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.askHarvestBuddy(query, language);
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer || response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "Sorry, I am temporarily having trouble reaching the community agro knowledge base. Please check back in a moment!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-sand/40 dark:border-sand/15 bg-cream/40 dark:bg-bark/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-olive/15 text-olive dark:text-sage flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-bark dark:text-warm-white flex items-center gap-1.5">
              Harvest Buddy AI
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-olive/10 text-olive dark:text-sage">
                Community Agro Model
              </span>
            </h3>
            <p className="text-xs text-earth dark:text-sand/70">
              Hyperlocal gardening advice & biological plant care
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-olive/15 text-olive dark:text-sage flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                <Sprout className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-olive text-warm-white rounded-br-none'
                  : 'bg-cream/60 dark:bg-bark/40 text-bark dark:text-warm-white border border-sand/40 dark:border-sand/15 rounded-bl-none font-sans'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-olive dark:text-sage">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Harvest Buddy is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-cream/20 dark:bg-bark/10 border-t border-sand/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-sand/30 dark:bg-sand/10 hover:bg-sand/50 text-earth dark:text-sand transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-sand/40 dark:border-sand/15 bg-warm-white dark:bg-darkcard">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fertilizer recipes, pest control, planting..."
            className="flex-1 text-xs bg-cream/40 dark:bg-bark/30 border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white rounded-xl transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default HarvestBuddyChat;
