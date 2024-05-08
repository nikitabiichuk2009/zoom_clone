import React from 'react'
import Image from 'next/image';

interface HomeCardProps {
  bgColor: string,
  img: string,
  pText: string,
  h1Text: string,
  handleClick: () => void
}
const HomeCard = ({ bgColor, h1Text, pText, img, handleClick }: HomeCardProps) => {
  return (
    <div className={`${bgColor} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[380px] min-h-[260px] rounded-[14px] cursor-pointer`} onClick={handleClick}>
      <div className='flex-center glassmorphism size-12 rounded-[10px]'>
        <Image src={img} alt="meeting" width={27} height={27} />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl text-white font-bold'>{h1Text}</h1>
        <p className='text-lg font-normal text-white'>{pText}</p>
      </div>
    </div>
  )
}

export default HomeCard;
