'use client';
import { Button } from '@chakra-ui/react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isMeetingOwner = localParticipant && call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  if (!isMeetingOwner) return;

  const endCall = async () => {
    await call.endCall();
    router.push('/');
  };
  return (
    <Button onClick={endCall} className='bg-red-500 duration-300 transition-colors ease-in-out hover:bg-red-700 text-white' variant="default">
      End Call for Everyone
    </Button>
  )
}

export default EndCallButton;
