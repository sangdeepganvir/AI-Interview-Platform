"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderPinwheel } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import {v4 as uuidv4} from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { db } from '@/utils/db'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDialog,setOpenDialog] = useState(false)
    const [jobPosition,setJobPosition] = useState()
    const [jobDesc,setJobDesc] = useState()
    const [jobExperience,setJobExperience] = useState()
    const [loading,setLoading] = useState(false)
    const [jsonResponse,setJsonResponse] = useState([])
    const {user} = useUser();

    const router = useRouter();

    const onSubmit=async(e)=>{
        setLoading(true);

        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience)

        const InputPrompt = "Job Position: "+ jobPosition + ", Job Description: "+ jobDesc + " Years of Experience: "+ jobExperience +", Depending on this information please give me "+ process.env.NEXT_PUBLIC_NUMBER_QUESTIONS +" Interview question with answers in Json Format, Give question and answer as field in JSON"

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','').trim();

        //console.log(JSON.parse(MockJsonResp));
        //const jsonMockStringify = JSON.stringify(result[0].jsonMockResp);

        setJsonResponse(MockJsonResp);

        if(MockJsonResp){
            const resp = await db.insert(MockInterview)
            .values({
                mockId:uuidv4(),
                jsonMockResp:MockJsonResp,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY')
            }).returning({mockId:MockInterview.mockId});

            console.log("Inserted ID:",resp);
            if(resp){
                setOpenDialog(false);
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }
        }
        else{
            console.log("ERROR");
        }

        setLoading(false);
    }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}
        >
            <h2 className='font-bold text-lg'>+ Add New</h2>
        </div>

        <Dialog open={openDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle className='font-bold text-2xl'>Tell us more about job interview</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <div>
                            <h2>Add Details about your job profile/role , Job Description and Job Experience</h2>

                            <div className='mt-7 my-3'>
                                <label>Job Role / Position</label>
                                <Input placeholder="Ex. Software Engineer" required 
                                onChange={(event)=>setJobPosition(event.target.value)}/>
                            </div>

                            <div className='my-3'>
                                <label>Job Description / Tech. Stacks</label>
                                <Textarea placeholder="Ex. React , Javascript , NodeJs, Sql , DSA" required 
                                onChange={(event)=>setJobDesc(event.target.value)}/>
                            </div>

                            <div className='my-3'>
                                <label>Years of Experience</label>
                                <Input placeholder="Ex. 5" type="number" max="50" required
                                onChange={(event)=>setJobExperience(event.target.value)}/>
                            </div>
                        </div>
                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)} >Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ?
                                <>
                                <LoaderPinwheel className='animate-spin'/>'Generating Questions for you' 
                                </> : 'Start Interview'
                                }
                                </Button>
                        </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    </div>
  )
}

export default AddNewInterview