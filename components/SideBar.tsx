'use client';
import React from 'react'
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
const SideBar = () => {
  const pathName = usePathname();
  return (
    <section className='sticky left-0 top-0 flex h-screen w-fit flex-col rounded-sm
    justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]'>
      <div className='flex flex-1 flex-col gap-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathName === link.route || (link.label !== "Home" && pathName.startsWith(link.route));
          return (<Link key={link.label} href={link.route} className={cn('flex gap-4 items-center p-4 rounded-lg justify-start duration-300 transition-colors hover:bg-blue-1', {
            'bg-blue-1': isActive,
          })}> <Image src={link.imgUrl} alt={link.label} width={24} height={24} />
            <p className='text-lg text-white font-semibold max-lg:hidden'>{link.label}</p>
          </Link>)
        })}
      </div>
    </section>
  )
}
export default SideBar;
