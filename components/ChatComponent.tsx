'use client';
import toast from 'react-hot-toast';

import React, { useEffect } from 'react';

import { Input } from './ui/input';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from 'ai';

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, error, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    if (error) {
      const { error: errorMsg } = JSON.parse(error.message);

      if (errorMsg === 'free tier limit reached') {
        toast.error(errorMsg);
        toast.error('Switch to pro plan to have unlimited access', {
          duration: 10_000,
        });
      }
    }
  }, [error]);

  React.useEffect(() => {
    const messageContainer = document.querySelector('#message-container');

    if (messageContainer)
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      });
  }, [messages]);

  return (
    <div
      className='relative max-h-screen min-h-screen overflow-scroll flex flex-col'
      id='message-container'
    >
      {/* Header */}
      <div className='sticky top-0 inset-x-0 p-2 bg-white border h-fit'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>

      <div className='flex-1 overflow-scroll'>
        {/* Msg List */}
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <form
        onSubmit={handleSubmit}
        className='sticky flex  bottom-0 inset-x-0 px-2 py-4 bg-white'
      >
        <Input
          value={input}
          onChange={async (e) => {
            handleInputChange(e);
          }}
          placeholder='Ask any question...'
          className='w-full'
        />
        <Button className='bg-blue-600  ml-2'>
          <Send className='h-4 w-4' />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
