'use client';
import { Input } from "@/components/ui/input"
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@chakra-ui/react'
import ReactDatePicker from "react-datepicker";
const MeetingTypeList = () => {
  const toast = useToast()
  const router = useRouter();
  const [values, setValues] = useState({
    dateTime: new Date(),
    descriptiopn: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const createMeeting = async () => {
    if (!client || !user) {
      return;
    }
    try {
      if (!values.dateTime) {
        toast({
          status: "warning",
          title: "Please select a date and time!",
          isClosable: true,
          position: "top",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) {
        throw new Error("Failed to create a call");
      }
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.descriptiopn || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call);
      if (!values.descriptiopn) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'The meeting was created.',
        status: 'success',
        isClosable: true,
        position: "top",
      })
    }
    catch (err) {
      console.log(err);
      toast({
        title: 'Something went wrong. Please try again later.',
        status: 'error',
        isClosable: true,
        position: "top",
      })
    }
  };
  const createScheduleMeeting = async () => {
    if (!client || !user) {
      return;
    }
    try {
      if (!values.dateTime) {
        toast({
          status: "warning",
          title: "Please select a date and time!",
          isClosable: true,
          position: "top",
        })
        return;
      }
      if (values.dateTime < new Date()) {
        toast({
          title: 'You have scheduled the meeting for a past date. Please select a future date.',
          status: 'warning',
          isClosable: true,
          position: "top",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) {
        throw new Error("Failed to create a call");
      }
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.descriptiopn || "Unset Description";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetails(call);
      toast({
        title: 'The meeting was created.',
        status: 'success',
        isClosable: true,
        position: "top",
      }) 
    }
    catch (err) {
      console.log(err);
      toast({
        title: 'Something went wrong. Please try again later.',
        status: 'error',
        isClosable: true,
        position: "top",
      })
    }
  };
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        bgColor="bg-orange-1"
        h1Text="New Meeting"
        pText="Start an instant meeting"
        img="/icons/add-meeting.svg"
        handleClick={() => setMeetingState('isInstantMeeting')} />
      <HomeCard
        bgColor="bg-blue-1"
        h1Text="Join Meeting"
        pText="Via invitation link"
        img="/icons/join-meeting.svg"
        handleClick={() => setMeetingState("isJoiningMeeting")} />
      <HomeCard
        bgColor="bg-purple-1"
        h1Text="Schedule Meeting"
        pText="Plan your meeting"
        img="/icons/schedule.svg"
        handleClick={() => setMeetingState('isScheduleMeeting')} />
      <HomeCard
        bgColor="bg-yellow-1"
        h1Text="View Recordings"
        pText="Meeting recordings"
        img="/icons/recordings.svg"
        handleClick={() => router.push("/recordings")}
      />
      {!callDetails ?
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createScheduleMeeting}>
          <div className='flex flex-col gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>Add a description</label>
            <Textarea placeholder="Meeting Description" maxLength={60} className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) =>
                setValues({
                  ...values,
                  descriptiopn: e.target.value
                })} />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base font-normal leading-[22px] text-sky-2'>Select Date and Time</label>
            <ReactDatePicker selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat="MMMM d, yyyy h:mm aa"
              className='w-full bg-dark-3 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
        :
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
            if (values.dateTime > new Date()) {
              router.push("/upcoming")
            } else {
              router.push("/previous");
            };
          }}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              status: "info",
              isClosable: true,
              position: "top",
              title: "Meeting's Link copied!"
            })
            if (values.dateTime > new Date()) {
              router.push("/upcoming")
            } else {
              router.push("/previous");
            };
          }}
        />}
      <MeetingModal isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)} title="Start an instant meeting"
        className="text-center" buttonText="Start Meeting" handleClick={createMeeting} />
      <MeetingModal isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)} title="Type the link here"
        className="text-center" buttonText="Join Meeting" handleClick={() => router.push(values.link)}>
        <Input placeholder="Meeting Link" required className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })} />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList;
