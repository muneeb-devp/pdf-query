import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import React from 'react';

const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { userId } = await auth();
  const { chatId } = await params;
  if (!userId) return redirect('/sign-in');

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!userChats) return redirect('/');
  if (!userChats.find((c) => c.id === parseInt(chatId))) return redirect('/');

  const account = process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_NAME || '';
  const containerName =
    process.env.NEXT_PUBLIC_AZURE_SA_ACCOUNT_CONTAINER_NAME || '';

  const currentChat = userChats.find((c) => c.id === parseInt(chatId));
  const pdfURL = currentChat
    ? `https://${account}.blob.core.windows.net/${containerName}/${containerName}/${currentChat.fileKey}`
    : '';

  return (
    <div className='flex max-h-screen overflow-hidden'>
      <div className='flex w-full max-h-screen overflow-hidden'>
        {/* Chat Sidebar */}
        <aside className='flex-[1.5] max-w-xs'>
          <ChatSideBar chats={userChats} chatId={parseInt(chatId)} />
        </aside>
        {/* PDF Viewer */}
        <aside className='max-h-screen  overflow-hidden flex-[5]'>
          <PDFViewer pdf_url={pdfURL} />
        </aside>
        {/* Chat Component */}
        <main className='flex-[3] border-l-4 border-l-slate-200'>
          <ChatComponent chatId={parseInt(chatId)} />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
