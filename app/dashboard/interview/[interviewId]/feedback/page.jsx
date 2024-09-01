"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


function Feedback({params}) {

    const [feedbackList , setFeedbackList] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const router = useRouter();

    useEffect(()=>{
        GetFeedback();
    },[])

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        if (result.length > 0) {
            const totalRating = result.reduce((sum, item) => {
                const rating = Number(item.rating);
                return sum + (isNaN(rating) ? 0 : rating);
            }, 0);

            const avgRating = totalRating / result.length;
            setAverageRating(avgRating.toFixed(1)); // To display the rating with 1 decimal point
        } else {
            setAverageRating(0); // Handle case when there are no results
        }

        setFeedbackList(result);
    };

  return (
    <div className='p-10'>
        {feedbackList?.length==0 ? 
        <h2 className='font-bold text-2xl'>No Interview Feedback Found </h2>
        :
        <>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
        <h2 className='font-bold text-2xl'>Here is your interview Feedback</h2>
        <h2 className='text-primary text-lg my-3'>Your Overall Interview Rating: <strong>{averageRating}/10</strong></h2>

        <h2 className='text-sm text-grey-500'>Find below interview question with correct answer, your answer, and feedback for improvement</h2>

        {feedbackList && feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>

                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
                {item.question} <ChevronsUpDown className='h-5 w-5'/>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>

                        <h2 className='bg-red-50 p-2 border rounded-lg text-sm text-red-900'><strong>Your Answer:</strong>{item.userAns}</h2>

                        <h2 className='bg-green-50 p-2 border rounded-lg text-sm text-green-900'><strong>Correct Answer:</strong>{item.correctAns}</h2>

                        <h2 className='bg-blue-50 p-2 border rounded-lg text-sm text-primary'><strong>Feedback:</strong>{item.feedback}</h2>
                    </div>
                </CollapsibleContent>

            </Collapsible>
        ))}
        </>}

        <Button onClick={()=>router.replace('/dashboard')} >Go Home</Button>

    </div>
  )
}

export default Feedback
