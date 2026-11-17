import React, { useState, useRef, useEffect } from 'react';
import { Send, Sprout, ArrowRight, ShieldCheck, MapPin, User } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const ChatThread = ({ 
  conversation, 
  messages = [], 
  currentUserId, 
  onSendMessage, 
  sending 
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-earth dark:text-sand/70">
        <div className="space-y-2">
          <Sprout className="w-10 h-10 text-olive/40 mx-auto" />
          <h4 className="text-base font-serif font-bold text-bark dark:text-warm-white">
            {t('chat.selectToRead', 'Select a Conversation')}
          </h4>
          <p className="text-xs max-w-xs">
            {t('chat.selectDesc', 'Coordinate produce pickup windows, exchange terms, or check freshness directly with growers.')}
          </p>
        </div>
      </div>
    );
  }

  const otherUser = conversation.otherParticipant || conversation.participant || {};
  const product = conversation.product;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-warm-white dark:bg-darkcard">
      
      {/* Top Bar: Participant and Produce Context */}
      <div className="p-4 border-b border-sand/40 dark:border-sand/15 bg-cream/40 dark:bg-bark/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-olive/15 text-olive dark:text-sage font-serif font-bold text-sm flex items-center justify-center border border-olive/20">
            {(otherUser.name || 'N').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-bark dark:text-warm-white">
                {otherUser.name || t('common.neighbour', 'Neighbour')}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-olive" title="Local Community Member" />
            </div>
            {otherUser.location?.address && (
              <span className="text-[11px] text-earth dark:text-sand/70 flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-terracotta" />
                {otherUser.location.address}
              </span>
            )}
          </div>
        </div>

        {/* Product Reference Pill */}
        {product && (
          <div className="flex items-center gap-2 bg-warm-white dark:bg-darkcard px-3 py-1.5 rounded-xl border border-sand/40 shadow-sm text-xs">
            <Sprout className="w-4 h-4 text-olive shrink-0" />
            <div className="text-right truncate max-w-[140px]">
              <span className="font-semibold text-bark dark:text-warm-white block truncate">
                {product.title || product.name}
              </span>
              <span className="text-[10px] text-earth dark:text-sand/70 font-mono">
                {product.price ? `₹${product.price}/${product.unit || 'kg'}` : 'Barter / Free'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-earth dark:text-sand/70">
            Send a friendly message to begin coordinating this exchange.
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = (m.sender?._id || m.sender?.id || m.sender) === currentUserId;

            return (
              <div
                key={m._id || m.id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-olive text-warm-white rounded-br-none shadow-sm'
                      : 'bg-cream/70 dark:bg-bark/50 text-bark dark:text-warm-white border border-sand/40 dark:border-sand/15 rounded-bl-none'
                  }`}
                >
                  <p>{m.content || m.text}</p>
                </div>
                {m.createdAt && (
                  <span className="text-[10px] text-earth/60 dark:text-sand/50 mt-1 px-1">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-sand/40 dark:border-sand/15 bg-warm-white dark:bg-darkcard">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chat.typeMessagePlaceholder', 'Write a message to your neighbour...')}
            className="flex-1 text-xs bg-cream/40 dark:bg-bark/30 border border-sand dark:border-sand/30 rounded-xl px-4 py-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-2.5 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white rounded-xl transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatThread;
