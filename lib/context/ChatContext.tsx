import React, { createContext, useContext } from 'react';
import { useChatStream } from '../hooks/useChatStream';

type ChatContextType = ReturnType<typeof useChatStream>;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChatStream();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 