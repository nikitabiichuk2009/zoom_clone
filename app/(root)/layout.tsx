import React from 'react'
import { ReactNode } from 'react';
import { StreamVideoProvider } from '@/providers/StreamClientProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { Metadata } from 'next';
import ProtectedComponent from '@/components/ProtectedComponents';
export const metadata: Metadata = {
  title: "Zoom Clone",
  description: "Video calling app",
  icons: {
    icon: '/icons/logo.svg'
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <StreamVideoProvider>
      <ChakraProvider>
        <ProtectedComponent>
          <main>
            {children}
          </main>
        </ProtectedComponent>
      </ChakraProvider>
    </StreamVideoProvider>

  )
}

export default RootLayout;
