'use client';
import { Button, useToast } from '@chakra-ui/react';
import { DeviceSettings, VideoPreview, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Alert from './Alert';
const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  const router = useRouter();
  const [isMicCam, setIsMicCam] = useState<boolean>();
  const toast = useToast();
  const call = useCall();
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;
  if (!call) {
    throw new Error("error")
  }


  useEffect(() => {
    let isActive = true;
    const toggleMedia = async () => {
      try {
        if (isMicCam) {
          await call.camera.disable();
          await call.microphone.disable();
        } else {
          await call.camera.enable();
          await call.microphone.enable();
        }
      } catch (error) {
        if (isActive) {
          console.error("Failed to access user media devices:", error);
          toast({
            title: "Couldn't access your devices!",
            position: 'top',
            isClosable: true,
            status: "warning",
          });
          setIsMicCam(true);
        }
      }
    };
    toggleMedia();
    return () => {
      isActive = false;  // Prevents the toast from firing after component unmounts
    };
  }, [isMicCam, call?.microphone, call?.camera, toast]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <Button variant={'link'} onClick={() => router.push("/")} className='mb-[40px]'>Back</Button>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input type="checkbox" checked={isMicCam} onChange={(e) => setIsMicCam(e.target.checked)} />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button className="rounded bg-green-500 px-4 py-2.5 text-white duration-500 ease-in-out transition-colors hover:bg-green-600"
        onClick={() => { call?.join(); setIsSetupComplete(true); }} variant="default">Join meeting</Button>
    </div>
  )
}

export default MeetingSetup;
