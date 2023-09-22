import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { LogIn } from 'lucide-react'

export default async function Home() {
  const { userId } = await auth()
  const isAuthenticated = !!userId

  return (
    <main className='w-screen min-h-screen bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-rose-400 to-orange-300'>
      <section className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
          <div className='flex items-center'>
            <h1 className='mr-3 text-5xl font-bold text-white opacity-90 '>
              Query any PDF file
            </h1>
            <UserButton afterSignOutUrl='/' />
          </div>

          <div className='flex mt-6'>
            {isAuthenticated && <Button>Let's Chat</Button>}
          </div>

          <p className='max-w-xl mt-1 text-lg text-slate-800'>
            Join million of students, researchers and professionals to instantly
            answer questions and understand research with the power of AI.
          </p>

          <div className='w-full mt-4'>
            {isAuthenticated ? (
              <h1>File Upload Component</h1>
            ) : (
              <Link href='/sign-in'>
                <Button className='w-1/3'>
                  Login to get started <LogIn className='ml-2 w-4 h-4' />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
