'use client'
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { questionTags, daysToReview, QuestionType } from "../../types/type";

interface NextReviewDialogProps {
  question: QuestionType;
  refresh: () => void;
}

const NextReviewDialog: React.FC<NextReviewDialogProps> = ({ question, refresh }) => {
  const [open, setOpen] = useState(false);
  const [daysReview, setDaysReview] = useState<number>();
 
  const handleOpen = () => setOpen(!open);

  const handleDaysReviewChange = (value: number) => {
    setDaysReview(value);
  }

  const resetForm = () => {
    setDaysReview(undefined);
  }

  const handleFormSubmit = async () => {
    if (daysReview === undefined) {
      alert("Please select a review date");
    } else {
      try {
        const updatedQuestion = {
          id: question.id,
          title: question.title,
          url: question.url,
          daysReview: daysReview,
          difficulty: question.difficulty,
          tags: question.tags,
          ownerId: question.ownerId,
          hasCompleted: true
        };
        const response = await fetch(`/api/questions`, {
          method: 'PUT',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedQuestion)
        }).then((res) => res.json());
        if (response.status === 400) {
          throw new Error("An error occurred");
        }
        refresh();
        resetForm();
        setOpen(false);
      } catch (error) {
        alert("An error occurred");
      }
    }
  }

  return (
    <>
      <a href={question.url} target="_blank" rel="noopener noreferrer" className="inline-block">
        <Button 
          className="px-2 py-1 text-xs sm:text-sm  whitespace-normal text-left" 
          variant="text" 
          size="sm" 
          onClick={handleOpen}
        >
          {question.title}
        </Button>
      </a>
          
      <Dialog 
        open={open} 
        handler={handleOpen} 
        size="md" 
        className="flex flex-col max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] max-h-[90vh]"
      >
        <DialogBody className="p-2 sm:p-4 overflow-y-auto">
          <form className="mb-2" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
            <div className="mb-1 flex flex-col gap-4 sm:gap-6">
              <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg md:text-xl">
                Next review date
              </Typography>
              <div className="flex flex-wrap gap-2">
                {[...daysToReview, 0].map((day) => (
                  <Button 
                    key={day} 
                    onClick={() => handleDaysReviewChange(day)} 
                    variant="outlined"
                    className={`text-xs sm:text-sm md:text-base px-2 py-1 sm:px-4 sm:py-2 ${daysReview === day ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {day === 0 ? 'Never' : `${day} days`}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter className="p-2 sm:p-4">
          <div className="flex gap-2 sm:gap-4">
            <Button variant="outlined" onClick={handleOpen} size="sm" className="text-xs sm:text-sm">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" onClick={handleFormSubmit} size="sm" className="text-xs sm:text-sm">
              <span>Submit</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default NextReviewDialog;