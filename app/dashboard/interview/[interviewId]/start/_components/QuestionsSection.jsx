import { LightbulbIcon, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestions,activeQuestionIndex}) {

  const textToSpeech=(text)=>{
    if('speechSynthesis' in window ){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('Sorry your browser do not support Text to Speech , Kindly Update it')
    }
  }

  return mockInterviewQuestions && (
    <div className='p-5 border rounded-lg m-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cpls-4 gap-5'>
            {mockInterviewQuestions&&mockInterviewQuestions.map((question,index)=>(
                <h2 className={`p-2 bg-secondary rounded-full
                text-xs md:text-s text-center cursor-pointer
                ${activeQuestionIndex==index&&'bg-blue-700 text-white'}`}> Question No {index+1} </h2>
            ))}
        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>
        <Volume2 className='cursor-pointer my-5' onClick={()=>textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}/>

        <div className='border rounded-lg p-5 bg-blue-100'>
          <h2 className='flex gap-2 items-center text-primary'>
            <LightbulbIcon/>
            <strong>Note:</strong>
          </h2>
          <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_NOTE}</h2>
        </div>
    </div>
  )
}

export default QuestionsSection