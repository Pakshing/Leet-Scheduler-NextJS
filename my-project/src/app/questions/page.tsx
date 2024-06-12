'use client'
import React,{useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import { QuestionsTable } from '../../../components/table/QuestionsTable'

function page() {
    const {data: session} = useSession();
  return (
    <div className='flex justify-center items-center bg-gray-300 h-screen'>
        <div className='w-[95%] h-[80%]'>
            <QuestionsTable/>
        </div>
        
    </div>
  )
}

export default page