'use client';
import Loader from '@/components/Loader'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@chakra-ui/react';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
const Table = ({ title, description }: { title: string, description: string }) => {
  return <div className='flex flex-col items-start gap-2 xl:flex-row'>
    <h1 className='text-base font-medium text-sky-1 lg:text-xl xl:min-w-32'>{title}:</h1>
    <h2 className='text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>{description}</h2>
  </div>
}
const PersonalRoom = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const toast = useToast();
  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const { call, isCallLoading } = useGetCallById(meetingId!);
  const client = useStreamVideoClient();
  const startRoom = async () => {
    if (!client || !user) {
      return;
    }

    if (!call) {
      const newCall = client.call('default', meetingId!);
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: `${user?.username}'s Personal Meeting`
          }
        }
      })
    }
    router.push(`/meeting/${meetingId}?personal=true`)
  }
  if (!isLoaded || isCallLoading) return <Loader />
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Personal Room
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className='flex gap-5'>
        <Button className="rounded bg-blue-1 px-6 ease-in-out transition-colors duration-300 hover:bg-blue-800" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              status: "info",
              isClosable: true,
              position: "top",
              title: "Meeting's Link copied!"
            })
          }}
          className='bg-dark-4 px-6  ease-in-out transition-colors duration-300 hover:bg-dark-2'>
          <Image
            src="/icons/copy.svg"
            alt="feature"
            width={20}
            height={20}
          />
          &nbsp; Copy Link & Share
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom;
