import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import { Loader2 } from 'lucide-react';
import React from 'react';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (!messages) return <></>;
  if (isLoading)
    return (
      <div className='absolute top-1/2 left-1/3 translate-x-1/4 translate-y-1/2 flex flex-col justify-center items-center'>
        <Loader2 className='w-10 h-10 text-blue-600 animate-spin opacity-80' />
        <p className='mt-2 text-sm text-slate-400'> Loading chat...</p>
      </div>
    );
  return (
    <div className='flex flex-col gap-2 px-4 '>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn('flex', {
            'justify-end ': msg.role === 'user',
            'justify-start ': msg.role === 'assistant',
          })}
        >
          <div
            className={cn(
              'rounded-lg p-2 max-w-fit text-sm  shadow-lg ring-1 my-1 ring-gray-900/10',
              {
                'bg-blue-600 text-white': msg.role === 'user',
              }
            )}
          >
            <p>{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
