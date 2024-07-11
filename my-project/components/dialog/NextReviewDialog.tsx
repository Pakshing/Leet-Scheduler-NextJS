'use client'
import React,{useState} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Checkbox,
  Card,
  ButtonGroup,
  List, 
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { questionTags,daysToReview } from "../../types/type";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { QuestionType } from "../../types/type";
import Link from "next/link";

interface NextReviewDialogProps {
    question: QuestionType;
    refresh : () => void
}

type QuestionInput = {
    id?: number,
    title?: string,
    url: string,
    daysReview: number
    difficulty: string,
    tags: string[],
    ownerId: string
}


const NextReviewDialog:React.FC<NextReviewDialogProps> = ({question,refresh}) => {
  const [open, setOpen] = useState(false);
  const [daysReview, setDaysReview] = useState<number>();
 
  const handleOpen = () => setOpen(!open);


  const handleDaysReviewChange = (value:number) => {
    setDaysReview(value);
  }

  const resetForm = () =>{
    setDaysReview(undefined)
  }

  const handleFormSubmit = async() => {
    if(daysReview === undefined) alert("Please select a review date")
    else{
      try {
        const updatedQuestion = {
            id: question.id,
            title: question.title,
            url: question.url,
            daysReview: daysReview,
            difficulty: question.difficulty,
            tags: question.tags,
            ownerId: question.ownerId,
            hasCompleted:true
        }
        const response = await fetch(`/api/questions`, {
          method: 'PUT',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedQuestion)
        }).then((res) => res.json());
        if(response.status === 400){
          throw new Error("An error occured")
        }
        refresh()
        resetForm()
        setOpen(false)
      } catch (error) {
        alert("An error occured")
      }
    }
  }





 
  return (
    <>
      
        <a href={question.url} target="_blank" rel="noopener noreferrer" >
            <Button className="px-2" variant="text" size="sm" onClick={handleOpen}>{question.title} </Button>
        </a>
          
      <Dialog open={open} handler={handleOpen} size="lg" className="p-10">
        
        <DialogBody>
        <Card color="transparent" shadow={false}  className="flex items-center justify-center">
      <form className="mb-2" onSubmit={()=>handleFormSubmit}>
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Next review date
          </Typography>
          <ButtonGroup ripple={true} variant="outlined">
            {daysToReview.map((day) => (
              <Button key={day} onClick={() => handleDaysReviewChange(day)} className={daysReview === day ? 'bg-black text-white' : ''}>
                {day} days
              </Button>
            ))}
            <Button onClick={() => handleDaysReviewChange(0)} className={daysReview === 0 ? 'bg-black text-white' : ''}>
              Never
            </Button>
          </ButtonGroup>
        </div>
      </form>
    </Card>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-4">
          <Button variant="outlined" onClick={handleOpen} size="sm">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient"  onClick={handleFormSubmit} size="sm">
            <span>Submit</span>
          </Button>
          </div>
        </DialogFooter>
      </Dialog>
      </>
  );
}

export default NextReviewDialog;
