'use client';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const ProtectedComponent = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Ensure the check is only performed once the user state is loaded
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');  // Redirect to sign-in page if not signed in
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isSignedIn) {
    return null; // or a loading indicator until redirect
  }

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedComponent;
