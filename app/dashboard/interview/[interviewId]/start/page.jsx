"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {

    const [interviewData , setInterviewData] = useState();
    const [mockInterviewQuestions , setMockInterviewQuestions] = useState();
    const [activeQuestionIndex , setActiveQuestionIndex] = useState(0);

    useEffect(()=>{
        //console.log(params.interviewId)
        GetInterviewDetails();
    },[])

    // Get interview data by mockId , or interview Id
    const GetInterviewDetails = async () => {
      try {
          const result = await db.select().from(MockInterview)
              .where(eq(MockInterview.mockId, params.interviewId));

          // Extract the JSON content from the result
          let res = result[0].jsonMockResp;

          // Trim any extra content by looking for the JSON array
          const startIndex = res.indexOf('['); // Find the first occurrence of '['
          const endIndex = res.lastIndexOf(']') + 1; // Find the last occurrence of ']'

          // Extract only the JSON part
          res = res.slice(startIndex, endIndex);

          // Parse the JSON string
          const jsonMockResp = JSON.parse(res);

          // Update the state with the parsed JSON data
          setMockInterviewQuestions(jsonMockResp);
          setInterviewData(result[0]);
      } catch (error) {
          console.error("Error fetching interview details:", error);
      }
  };


  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions */}

            <QuestionsSection mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            />

            {/* Audio / Video Recording */}
            <RecordAnswerSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            />

        </div>

        <div className='flex justify-end gap-6'>
            {activeQuestionIndex > 0 && 
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}

            {activeQuestionIndex != mockInterviewQuestions?.length-1 &&
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}

            {activeQuestionIndex == mockInterviewQuestions?.length-1 && 
            <Link href={'/dashboard/interview/'+ interviewData?.mockId + '/feedback'}>
              <Button>End Interview</Button>
            </Link>
            }
        </div>
    </div>
  )
}

export default StartInterview