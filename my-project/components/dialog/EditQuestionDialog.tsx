'use client'
import React,{useEffect, useState} from "react";
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
import { questionTags,daysToReview, QuestionType } from "../../types/type";

type UrlFormat = {
  format:boolean;
  url:string;
}

interface EditQuestionDialogProps {
    question: QuestionType;
    refresh: () => void;
}


const EditQuestionDialog:React.FC<EditQuestionDialogProps> = ({question,refresh}) => {
  const [open, setOpen] = useState(false);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("");
  const [daysReview, setDaysReview] = useState<number>();
  const [inputUrl, setInputUrl] = useState<UrlFormat>({"format":false,"url":""});
 
  const handleOpen = () => setOpen(!open);

    useEffect(() => {
    setCheckedTags(question.tags)
    setDifficulty(question.difficulty)
    setInputUrl({"format":true,"url":question.url})
    setDaysReview(undefined)
    }
    , [question])

  const handleUrlInput = (e:string) =>{
    const regrex =  /^https:\/\/leetcode\.com\/problems\/.+$/;
    if(regrex.test(e)){
      setInputUrl({"format":true,"url":e})
    }else{
      setInputUrl({"format":false,"url":e})
    } 
  }

  const handleDfficultyChange = (value:string) => {
    setDifficulty(value);
  }

  const handleCheckboxChange = (tag:string) => {
    checkedTags.includes(tag) ? setCheckedTags(checkedTags.filter((t) => t !== tag)) : setCheckedTags([...checkedTags, tag]);
  };

  const handleDaysReviewChange = (value:number) => {
    setDaysReview(value);
  }

  const resetForm = () =>{
    setInputUrl({"format":false,"url":""})
    setDifficulty("")
    setDaysReview(undefined)
    setCheckedTags([])
  }

  const handleFormSubmit = async() => {
    if(inputUrl.format !== true) alert("Please enter a valid URL")
    else if(difficulty === "") alert("Please select a difficulty")
    else if(daysReview === undefined) alert("Please select a review date")
    else if(checkedTags.length === 0) alert("Please select a tag")
    else{
      try {
        const response = await fetch(`/api/questions`, {
          method: 'PUT',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: question.id,
            title: question.title,
            url: inputUrl.url,
            daysReview: daysReview,
            difficulty: difficulty,
            tags: checkedTags,
            ownerId: question.ownerId,
            hasCompleted:false
        })
        }).then((res) => res.json());
        if(response.status === 400){
          alert("An error occured")  
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
      <Button className="flex items-center gap-3 text-sm " size="sm" onClick={handleOpen}>
        Edit
      </Button>
      
      <Dialog 
        open={open} 
        handler={handleOpen} 
        size="lg" 
        className=" max-h-[90vh] flex flex-col"
      >
        <DialogBody className="p-2 md:p-4 overflow-y-auto flex-grow">
        
            <form className="mb-2" onSubmit={handleFormSubmit}>
              <div className="mb-1 flex flex-col gap-4 md:gap-6">
                <Typography variant="h6" color="blue-gray" className="text-base md:text-lg">
                  LeetCode URL
                </Typography>
                <div className="w-full">
                  <Input
                    size="lg"
                    placeholder="https://leetcode.com/problems/two-sum/description"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-full text-sm md:text-base"
                    crossOrigin={""}
                    value={inputUrl.url}
                    onChange={(e) => handleUrlInput(e.target.value)}
                    error={inputUrl.url !== "" && inputUrl.format === false}
                  />
                </div>
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center gap-1 font-normal text-xs md:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-3 w-3 md:h-4 md:w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Please follow this LeetCode Url format: https://leetcode.com/problems/two-sum/***
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base md:text-lg">
                  Difficulty
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {["EASY", "MEDIUM", "HARD"].map((diff) => (
                    <Button
                      key={diff}
                      onClick={() => handleDfficultyChange(diff)}
                      variant="outlined"
                      className={`text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 ${difficulty === diff ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base md:text-lg">
                  Tags
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {questionTags.map((tag) => (
                    <Button 
                      key={tag} 
                      variant="outlined"
                      onClick={() => handleCheckboxChange(tag)} 
                      className={`py-1 px-2 text-xs md:text-sm ${checkedTags.includes(tag) ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2 text-base md:text-lg">
                  Next review date
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {[...daysToReview, 0].map((day) => (
                    <Button 
                      key={day} 
                      variant="outlined"
                      onClick={() => handleDaysReviewChange(day)} 
                      className={`text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 ${daysReview === day ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {day === 0 ? 'Never' : `${day} days`}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          
        </DialogBody>
        <DialogFooter className="flex justify-end p-2 md:p-4">
          <div className="flex gap-2 md:gap-4">
            <Button variant="outlined" onClick={handleOpen} size="sm" className="text-xs md:text-sm">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" onClick={handleFormSubmit} size="sm" className="text-xs md:text-sm">
              <span>Submit</span>
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );


}

export default EditQuestionDialog;
