import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';
import UserLayout from '../../components/user/layout/UserLayout';
import ConversationList from '../../components/user/chat/ConversationList';
import ChatThread from '../../components/user/chat/ChatThread';
import { useTranslation } from '../../hooks/user/useTranslation';
import { chatService } from '../../services/user/chatService';
import { userService } from '../../services/user/userService';

const MessagesPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const targetRecipientId = searchParams.get('recipient');
  const targetProductId = searchParams.get('product');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingConversations(true);
    try {
      const uRes = await userService.getCurrentUser().catch(() => null);
      const user = uRes?.user || uRes?.data || uRes;
      setCurrentUser(user);

      const convRes = await chatService.getConversations().catch(() => []);
      const convList = convRes?.conversations || convRes?.data || (Array.isArray(convRes) ? convRes : []);
      setConversations(convList);

      // Check if URL specified recipient or product
      if (targetRecipientId) {
        let matching = convList.find(c => {
          const other = c.otherParticipant || c.participant || {};
          return (other._id || other.id) === targetRecipientId;
        });

        if (!matching) {
          // Virtual draft conversation
          matching = {
            id: 'temp_' + targetRecipientId,
            otherParticipant: { _id: targetRecipientId, name: 'Neighbour Grower' },
            product: targetProductId ? { _id: targetProductId, title: 'Inquired Produce' } : undefined
          };
        }
        setActiveConversation(matching);
      } else if (convList.length > 0) {
        setActiveConversation(convList[0]);
      }
    } catch (err) {
      console.warn('Initial chat error:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (activeConversation && !String(activeConversation._id || activeConversation.id).startsWith('temp_')) {
      loadMessages(activeConversation._id || activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const loadMessages = async (convId) => {
    setLoadingMessages(true);
    try {
      const msgRes = await chatService.getMessages(convId);
      const list = msgRes?.messages || msgRes?.data || (Array.isArray(msgRes) ? msgRes : []);
      setMessages(list);
    } catch (err) {
      console.warn('Failed to load message thread:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation) return;
    setSending(true);

    try {
      const convId = activeConversation._id || activeConversation.id;
      const isTemp = String(convId).startsWith('temp_');

      const payload = {
        conversationId: !isTemp ? convId : undefined,
        recipientId: activeConversation.otherParticipant?._id || activeConversation.otherParticipant?.id,
        productId: activeConversation.product?._id || activeConversation.product?.id,
        content: text
      };

      const res = await chatService.sendMessage(payload);
      const newMsg = res?.message || res?.data || {
        _id: Date.now(),
        sender: currentUser?._id || currentUser?.id,
        content: text,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMsg]);

      if (isTemp) {
        // Refresh conversations to link the created thread
        const refreshed = await chatService.getConversations().catch(() => []);
        const list = refreshed?.conversations || refreshed?.data || [];
        setConversations(list);
        if (list.length > 0) setActiveConversation(list[0]);
      }
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main 2-Pane Chat Hub */}
        <div className="h-[calc(100vh-180px)] min-h-[550px] bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Pane: Conversations */}
          <div className="w-full md:w-80 lg:w-96 border-r border-sand/40 dark:border-sand/15 flex flex-col bg-cream/20 dark:bg-bark/20">
            <div className="p-4 border-b border-sand/40 dark:border-sand/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-olive dark:text-sage" />
                <h2 className="font-serif font-bold text-base text-bark dark:text-warm-white">
                  Messages & Discussions
                </h2>
              </div>
              <span className="text-xs font-mono text-earth dark:text-sand/70 font-bold">
                {conversations.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?._id || activeConversation?.id}
                onSelectConversation={(c) => setActiveConversation(c)}
                loading={loadingConversations}
              />
            </div>
          </div>

          {/* Right Pane: Message Thread */}
          <div className="flex-1 h-full flex flex-col bg-warm-white dark:bg-darkcard">
            <ChatThread
              conversation={activeConversation}
              messages={messages}
              currentUserId={currentUser?._id || currentUser?.id}
              onSendMessage={handleSendMessage}
              sending={sending}
            />
          </div>

        </div>

      </div>
    </UserLayout>
  );
};

export default MessagesPage;
