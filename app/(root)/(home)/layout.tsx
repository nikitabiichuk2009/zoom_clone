import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import React from 'react'
import { ReactNode } from 'react';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Zoom Clone",
  description: "Video calling app",
  icons: {
    icon: '/icons/logo.svg'
  }
};
const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='revaltive'>
      <NavBar />
      <div className='flex'>
        <SideBar />
        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
          <div className='w-full'>
            {children}
          </div>
        </section>
      </div>
      Footer
    </main>
  )
}

export default HomeLayout;
