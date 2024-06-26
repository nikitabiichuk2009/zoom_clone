'use client';
import React from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';
import { format, toZonedTime } from 'date-fns-tz';
const Home = () => {
  const nowUtc = new Date(); // Server-side UTC date
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Client-side time zone detection
  const now = toZonedTime(nowUtc, timeZone);

  const time = format(now, 'h:mm aa', { timeZone });
  const date = format(now, 'EEEE, MMMM d, yyyy', { timeZone });

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between px-5 py-8 max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>Start your meeting now!</h2>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>{time}</h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
}

export default Home;
