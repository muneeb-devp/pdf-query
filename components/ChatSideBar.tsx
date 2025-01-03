'use client';

import React from 'react';

import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const handlePurchase = async () => {
  const resp = await fetch('/api/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId: '646028' }),
  });

  const { url } = await resp.json();
  window.location.href = url;
};

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className='w-full h-screen flex flex-col p-4 text-gray-200 bg-gray-900'>
      <Link href='/'>
        <Button className='w-full border-dashed border-white border'>
          <PlusCircle className='mr-2 w-4 h-4' />
          New Chat
        </Button>
      </Link>

      <div className='flex flex-col grow gap-2 mt-4'>
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn('rounded-lg p-3 text-slate-300 flex items-center', {
                'bg-blue-600 text-white': chat.id === chatId,
                'hover:text-white': chat.id !== chatId,
              })}
            >
              <MessageCircle className='mr-2' />
              <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='flex flex-col'>
        <Button
          onClick={handlePurchase}
          className=' bg-orange-400 hover:bg-orange-500'
        >
          Upgrade to PRO
        </Button>
        <Link href='/' className='block mt-2 text-center text-white'>
          Home
        </Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
