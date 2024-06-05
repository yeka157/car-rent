'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Navbar() {
    const pathName = usePathname();
  return (
    <div className='min-h-[10vh] bg-blue-300 flex items-center justify-center'>
        <div className='flex space-x-10 font-medium'>
            <Link href='/' className={pathName === '/' ? 'cursor-pointer font-bold hover:-my-1 underline' : 'cursor-pointer hover:-my-1' }>Car List</Link>
            <Link href='/order-history' className={pathName === '/order-history' ? 'cursor-pointer hover:-my-1 font-bold underline' : 'cursor-pointer hover:-my-1'}>Order History</Link>
        </div>
    </div>
  )
}
