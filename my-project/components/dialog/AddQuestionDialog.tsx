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
import Link from "next/link";

type UrlFormat = {
  format:boolean;
  url:string;

}

interface AddQuestionDialogProps {
  refresh: () => void;
}

const AddQuestionDialog:React.FC<AddQuestionDialogProps> = ({refresh}) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("");
  const [daysReview, setDaysReview] = useState<number>();
  const [inputUrl, setInputUrl] = useState<UrlFormat>({"format":false,"url":""});
 
  const handleOpen = () => setOpen(!open);



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

  const handleCancelOnClick = () => {
    resetForm()
    setOpen(false)
  } 

  const handleFormSubmit = async() => {
    if(inputUrl.format !== true) alert("Please enter a valid URL")
    else if(difficulty === "") alert("Please select a difficulty")
    else if(daysReview === undefined) alert("Please select a review date")
    else if(checkedTags.length === 0) alert("Please select a tag")
    else{
      try {
        const response = await fetch(`/api/questions`, {
          method: 'POST',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: inputUrl.url,
            difficulty: difficulty,
            daysReview: daysReview,
            tags: checkedTags,
            ownerId: session?.user?.id
          })
        });
        if(response.status === 409){
          alert("Question already exists")
          return
        }
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
      <Button className="flex items-center gap-2 text-xs sm:text-sm" size="sm" onClick={handleOpen}>
        <UserPlusIcon strokeWidth={2} className="h-3 w-3 sm:h-4 sm:w-4" /> Add Question
      </Button>
      
      <Dialog 
        open={open} 
        handler={handleOpen} 
        size="lg" 
        className="max-h-[90vh] w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] flex flex-col"
      >
        <DialogBody className="m-2 sm:p-4 overflow-y-auto flex-grow">
          <form className="mb-2" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg">
                LeetCode URL
              </Typography>
              <Input
                size="lg"
                placeholder="https://leetcode.com/problems/two-sum/description"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                crossOrigin={""}
                value={inputUrl.url}
                onChange={(e) => handleUrlInput(e.target.value)}
                error={inputUrl.url !== "" && inputUrl.format === false}
              />
              <Typography
                variant="small"
                color="gray"
                className="flex items-center gap-1 font-normal text-xs sm:text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 sm:h-4 sm:w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Please follow this LeetCode Url format: https://leetcode.com/problems/two-sum/***
              </Typography>
              <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg mt-2">
                Difficulty
              </Typography>
              <div className="flex flex-wrap gap-2">
                {["EASY", "MEDIUM", "HARD"].map((diff) => (
                  <Button
                    key={diff}
                    onClick={() => handleDfficultyChange(diff)}
                    variant="outlined"
                    className={`text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 ${difficulty === diff ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
              <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg mt-2">
                Tags
              </Typography>
              <div className="flex flex-wrap gap-2">
                {questionTags.map((tag) => (
                  <Button 
                    key={tag} 
                    variant="outlined"
                    onClick={() => handleCheckboxChange(tag)} 
                    className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 ${checkedTags.includes(tag) ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg mt-2">
                Next review date
              </Typography>
              <div className="flex flex-wrap gap-2 ">
                {[...daysToReview, 0].map((day) => (
                  <Button 
                    key={day} 
                    onClick={() => handleDaysReviewChange(day)} 
                    variant="outlined"
                    className={`text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 ${daysReview === day ? 'bg-black text-white' : 'bg-white text-black'}`}
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
            <Button variant="outlined" onClick={handleCancelOnClick} size="sm" className="text-xs sm:text-sm">
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

export default AddQuestionDialog;
