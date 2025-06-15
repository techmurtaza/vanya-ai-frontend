import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from '../context/SessionContext';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type SocketStatus = 'connecting' | 'open' | 'closed';

// The WebSocket URL needs to be configured for your environment
const WS_URL = 'ws://localhost:3001';

export const useChatStream = () => {
  const { sessionId } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('closed');
  const socketRef = useRef<WebSocket | null>(null);
  
  const connect = useCallback(() => {
    if (!sessionId || (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    setSocketStatus('connecting');
    const ws = new WebSocket(`${WS_URL}?sessionId=${sessionId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setError(null);
      setSocketStatus('open');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'chunk':
          setIsLoading(true);
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant') {
              // Append chunk to the last assistant message
              const updatedLastMessage = { ...lastMessage, content: lastMessage.content + message.content };
              return [...prev.slice(0, -1), updatedLastMessage];
            } else {
              // Start a new assistant message
              return [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content: message.content }];
            }
          });
          break;
        case 'status':
          if (message.message === 'done') {
            setIsLoading(false);
          }
          break;
        case 'error':
          setError(new Error(message.message));
          setIsLoading(false);
          setSocketStatus('closed');
          break;
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError(new Error('WebSocket connection failed.'));
      setIsLoading(false);
      setSocketStatus('closed');
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setSocketStatus('closed');
    };

  }, [sessionId]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);


  const sendMessage = useCallback((messageContent: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected.');
      return;
    }
    
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    
    socketRef.current.send(JSON.stringify({
      type: 'chat',
      content: messageContent
    }));
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return {
    messages,
    input,
    error,
    isLoading,
    socketStatus,
    handleInputChange,
    handleSubmit,
  };
}; 