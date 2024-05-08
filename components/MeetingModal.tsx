'use client';
import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleClick?: () => void;
  className?: string;
  buttonText?: string;
  title: string;
  children?: ReactNode;
  image?: string;
  buttonIcon?: string;
}
const MeetingModal = ({ isOpen, onClose, title, buttonText, handleClick, className, children, buttonIcon, image }: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='rounded flex w-full max-w-[80%] sm:max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
        <div className='flex flex-col gap-6'>
          {image && (
            <div className='flex justify-center'>
              <Image src={image} alt={title} width={72} height={72} />
            </div>
          )}
          <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>{title}</h1>
          {children}
          <Button className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0 ease-in-out transition-colors duration-300 hover:bg-dark-2' onClick={handleClick}>
            {buttonIcon && <Image src={buttonIcon} alt="button Icon" width={13} height={13} />} &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default MeetingModal
