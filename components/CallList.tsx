'use client';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import MeetingCard from './MeetingCard';
import { useToast } from '@chakra-ui/react';
const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const toast = useToast();
  const router = useRouter();
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls?.slice(0, 20);
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
    }
  }
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous Calls";
      case "upcoming":
        return "No upcoming Calls";
      case "recordings":
        return "No recordings";
      default:
        return '';
    }
  }
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []);
        const recordings = callData.filter((call) => call.recordings.length > 0).flatMap((call) => call.recordings);
        setRecordings(recordings);
      } catch (err) {
        console.log(err);
        toast({
          status: "error",
          isClosable: true,
          position: "top",
          title: "Something went wrong. Please try again later!"
        })
      }
    }
    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);
  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  if (isLoading) {
    return <Loader />
  }
  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard key={(meeting as Call).id}
            icon={
              type === 'ended' ? '/icons/previous.svg' : type === "upcoming" ? "/icons/upcoming.svg" : "/icons/recordings.svg"
            }
            title={(meeting as Call).state?.custom?.description?.substring(0, 60) || (meeting as CallRecording).filename?.substring(0, 40) || "No description"}
            date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time.toLocaleString()}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? 'Play' : 'Start'}
            link={type === 'recordings' ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call)?.id}`}
            handleClick={type === 'recordings' ? () => router.push((meeting as CallRecording).url) : () => router.push(`/meeting/${(meeting as Call)?.id}`)}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>

  )
}

export default CallList;
