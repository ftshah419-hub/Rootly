import React from 'react';
import { MessageSquare, User, Sprout, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const ConversationList = ({ 
  conversations = [], 
  activeConversationId, 
  onSelectConversation, 
  loading 
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="flex gap-3 p-3 rounded-xl animate-pulse bg-sand/15">
            <div className="w-10 h-10 rounded-full bg-sand/30 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-3.5 bg-sand/30 rounded" />
              <div className="w-3/4 h-3 bg-sand/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center space-y-2 text-earth dark:text-sand/70">
        <MessageSquare className="w-8 h-8 mx-auto text-olive/40" />
        <h4 className="text-sm font-serif font-semibold text-bark dark:text-warm-white">
          {t('chat.noConversations', 'No Conversations Yet')}
        </h4>
        <p className="text-xs">
          {t('chat.startMessageDesc', 'Connect with neighbours on produce listings to discuss exchanges and porch pickups.')}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-sand/30 dark:divide-sand/10 overflow-y-auto">
      {conversations.map((c) => {
        const otherParticipant = c.otherParticipant || c.participant || c.user || {};
        const isActive = (c._id || c.id) === activeConversationId;
        const lastMsg = c.lastMessage || {};

        return (
          <div
            key={c._id || c.id}
            onClick={() => onSelectConversation(c)}
            className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
              isActive 
                ? 'bg-cream/80 dark:bg-bark/60 border-l-4 border-olive' 
                : 'hover:bg-cream/30 dark:hover:bg-bark/20'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-olive/15 text-olive dark:text-sage font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-olive/20">
              {(otherParticipant.name || 'N').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-bark dark:text-warm-white truncate">
                  {otherParticipant.name || t('common.neighbour', 'Neighbour')}
                </h4>
                {lastMsg.createdAt && (
                  <span className="text-[10px] text-earth/70 dark:text-sand/60">
                    {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {c.product && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-terracotta truncate">
                  <Sprout className="w-3 h-3 shrink-0" />
                  <span>{c.product.title || c.product.name}</span>
                </div>
              )}

              <p className="text-xs text-earth dark:text-sand/80 truncate">
                {lastMsg.content || lastMsg.text || t('chat.emptyThread', 'Conversation open...')}
              </p>
            </div>

            {c.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-terracotta text-warm-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {c.unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
