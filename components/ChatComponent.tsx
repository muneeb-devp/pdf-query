'use client'

import React from 'react'

import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import MessageList from './MessageList'

type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId,
    },
  })

  return (
    <div className='relative max-h-screen min-h-screen overflow-scroll'>
      {/* Header */}
      <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>

      {/* Msg List */}
      <MessageList messages={messages} />

      <form
        onSubmit={handleSubmit}
        className='absolute flex bottom-0 inset-x-0 px-2 py-4 bg-white'
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder='Ask any question...'
          className='w-full'
        />
        <Button className='bg-blue-600 ml-2'>
          <Send className='h-4 w-4' />
        </Button>
      </form>
    </div>
  )
}

export default ChatComponent
