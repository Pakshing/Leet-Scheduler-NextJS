'use client'
import { useRouter } from 'next/navigation'
import {ChangeEvent} from 'react'
import AddQuestionDialog from "../dialog/AddQuestionDialog";
import EditQuestionDialog from "../dialog/EditQuestionDialog";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {TABLE_HEAD, QuestionType, ColumnSortingType, initialSortingState, convertColumnTypeToQuestionType } from "../../types/type"; // Add the import statement for the QuestionType type
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import NextReviewDialog from "../dialog/NextReviewDialog";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const TABS = [
  { label: "Due", value: "due" },
  { label: "All", value: "all" },
  { label: "Future", value: "future" },
];


export function QuestionsTable() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [activeTabQuestions, setActiveTabQuestions] = useState<QuestionType[]>([])
  const [selectedTab, setSelectedTab] = useState(TABS[1].value);
  const [columnSorting, setColumnSorting] = useState<ColumnSortingType>(initialSortingState)
  const [sortingColumnName, setSortingColumnName] = useState<keyof ColumnSortingType>()
  const { data: session, status } = useSession();

  useEffect(() => {
    if(status === "authenticated") fetchQuestionsByOwner()
    if(status === "unauthenticated"){
      router.push('/')
    }
  }, [status]);

  useEffect(() => {
    handleActiveTab(selectedTab)
    console.log("handleActiveTab", "activated")
    }, [questions]);
  



  async function fetchQuestionsByOwner() {
    console.log("fetchQuestionsByOwner")
    const userId = session?.user?.id;
    if(!userId) router.push('/');
    const response = await fetch(`/api/questions?ownerId=${userId}`, {
      method: 'GET',
      credentials: 'include', 
    });
    const data = await response.json();
    setQuestions(data);

  }

  const handDeleteOnClick = async(questionId:number,ownerId:string) =>{
    const userResponse = window.confirm("Are you sure you want to delete this question?");
    if (userResponse && ownerId) {
      try {
        const response = await fetch(`${BASE_URL}/api/questions/${questionId}?ownerId=${ownerId}`, {
          method: 'DELETE',
          credentials: 'include', 
        });
        if(response.status !== 200) alert("An error occurred while deleting the question")
        else fetchQuestionsByOwner()
      } catch (error) {
        alert("An error occurred while deleting the question")
      }
    }
  }


  const handleActiveTab = (tab:string) =>{
    const today = new Date().setHours(0,0,0,0)
    let sortedQuestions : QuestionType[] = questions
    Object.entries(sortByColumn).forEach(([key,value])=>{
      if(value > 0){
        let sorted = sortByColumn(key as keyof ColumnSortingType ,value,questions)
        if(sorted) sortedQuestions = sorted
        return
      }
    })
    if(tab === "due"){
      const newFilteredQuestions = sortedQuestions.filter(question=>{
        if(question.reviewDate === null) return false;
        let date = new Date(question.reviewDate).setHours(0,0,0,0)
        return date <= today
      })
      
      setActiveTabQuestions(newFilteredQuestions)
    }
    if(tab === "all"){
      setActiveTabQuestions(questions)
    }
    if(tab === "future"){
      const newFilteredQuestions = sortedQuestions.filter(question=>{
        if(question.reviewDate === null) return false;
        let date = new Date(question.reviewDate).setHours(0,0,0,0)
        return date > today
      })
      setActiveTabQuestions(newFilteredQuestions)
    }
  }

  const handleSearchInput = (event:ChangeEvent<HTMLInputElement>) =>{
    const query = event.target.value
    if(query === "") setActiveTabQuestions(questions)
    else{
      const filtered = questions.filter((question) =>
        question.title.toLowerCase().includes(query.toLowerCase())
      );
      setActiveTabQuestions(filtered)
    }    
  }

  const sorting = (name:keyof ColumnSortingType) =>{
    setColumnSorting((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        if (key !== name) {
          newState[key as keyof ColumnSortingType] = 0;
        }
      });
      newState[name] = (prevState[name] + 1) % 3;
      return newState;
    });
    const sorted = sortByColumn(name, (columnSorting[name] + 1) % 3,activeTabQuestions);
    if(sorted)setActiveTabQuestions(sorted)
  }

  const sortByColumn = (name: keyof ColumnSortingType, type: number, questions: QuestionType[]) => {
    const typedName = convertColumnTypeToQuestionType(name)
    let sortedArray = [...questions];
    if(sortedArray.length === 0) return
    if (type === 1) {
      sortedArray.sort((a, b) => {
        const aValue = a[typedName];
        const bValue = b[typedName];
        if (aValue === null || aValue === undefined) return -1;
        if (bValue === null || bValue === undefined) return 1;
        return aValue > bValue ? 1 : -1;
      });
    } else if (type === 2) {
      sortedArray.sort((a, b) => {
        const aValue = a[typedName];
        const bValue = b[typedName];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        return aValue < bValue ? 1 : -1;
      });
    } else {
      sortedArray = questions;
    }
    return sortedArray
  };

  const handleTabClick = (tabValue:string) => {
    setSelectedTab(tabValue);
    handleActiveTab(tabValue);
  };

  return (
    <Card className="h-full w-full flex  flex-col">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Your leetcode database & scheduler
            </Typography>
            <Typography color="gray" className=" font-normal">
             <span color="gray" className="font-normal">Total: {activeTabQuestions.length}</span>
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 lg:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              placeholder="Two Sum"
              crossOrigin={""}
              onChange={handleSearchInput}
            />
          </div>
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} onClick={() => handleTabClick(tab.value)}>
                &nbsp;&nbsp;{tab.label}&nbsp;&nbsp;
              </Tab>
            ))}
            </TabsHeader>
          </Tabs>
            <AddQuestionDialog refresh={fetchQuestionsByOwner}/>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-1 overflow-auto px-0  py-0 ">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head,index) => (
                
                <th
                  key={head}
                  className="border-y bg-black p-4 sticky top-0 z-10"
                  
                >
                  <button onClick={()=>sorting(head)}>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal leading-none flex items-center"
                  >
                    <b className={head.toLowerCase() === "title" ? 'pl-2':''}>{head.replace("_"," ")}</b>
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                  </button>
                </th>
                
              ))}
            </tr>
          </thead>
          <tbody>
            {activeTabQuestions.map(
              (record, index) => {
                const isLast = index === questions.length - 1;
                const classes = isLast 
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={record.id}>
                    <td className= {columnSorting["Title"] === 0? "p-4 border-b border-blue-gray-100" : "p-4 border-b border-blue-gray-200 bg-gray-200"} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <NextReviewDialog question={record} refresh={fetchQuestionsByOwner}/>
                          </Typography>
                           
                    </td>
                    <td className={columnSorting["Difficulty"] === 0? "p-4 border-b border-blue-gray-100" : "p-4 border-b border-blue-gray-200 bg-gray-200"} >
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={record.difficulty}
                          color={getColor(record.difficulty)}
                        />
                        </div>
                      </td>
                    <td className={columnSorting["Tags"] === 0? "p-4 border-b border-blue-gray-100" : "p-4 border-b border-blue-gray-200 bg-gray-200"}>
                      <div className="flex gap-2">
                        {record.tags.map(tag=>
                        <Chip
                        key={index+tag}
                        variant="ghost"
                        size="sm"
                        value={tag}
                        color={getTagColors(tag)}
                      />)}
                        </div>
                    </td>
                    <td className={columnSorting["Next_Review"] === 0? "p-4 border-b border-blue-gray-100" : "p-4 border-b border-blue-gray-200 bg-gray-200"} >
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <b>
                        {
                          record.reviewDate 
                            ? new Date(record.reviewDate).toDateString() 
                            : "Never"
                        }
                        </b>
                      </Typography>
                    </td>
                    <td className={columnSorting["Last_Completion"] === 0? "p-4 border-b border-blue-gray-100" : "p-4 border-b border-blue-gray-200 bg-gray-200"}>
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <b>
                        {new Date(record.lastCompletion).toDateString()}
                        </b>
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-100">
                      <div className="flex gap-4">
                          <EditQuestionDialog question={record} refresh={fetchQuestionsByOwner}/>
                          <Button className="flex items-center gap-3" size="sm" color="red" variant="outlined" onClick={()=>handDeleteOnClick(record.id,record.ownerId)}>
                            Delete
                          </Button>
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter> */}
    </Card>
  );
}

function getColor(difficult:string){
  if(difficult.toUpperCase()==="EASY"){
    return "green"
  }else if(difficult.toUpperCase()==="MEDIUM"){
    return "blue"
  }else{
    return "red"
  }
}

function getTagColors(tag: string){
  tag = tag.toUpperCase();

  if(tag === '') return 'gray';
  if(tag === 'ARRAY') return 'blue';
  if(tag === 'STRING') return 'red';
  if(tag === 'LINKED LIST') return 'green';
  if(tag === 'RECURSION') return 'amber';
  if(tag === 'MAP/SET') return 'pink';
  if(tag === 'BINARY SEARCH') return 'indigo';
  if(tag === 'HEAP/PRIORITY QUEUE') return 'purple';
  if(tag === 'SLIDING WINDOW') return 'teal';
  if(tag === 'STACK/QUEUE') return 'cyan';
  if(tag === 'TREE') return 'blue';
  if(tag === 'GRAPH') return 'red';
  if(tag === 'DYNAMIC PROGRAMMING') return 'green';
  if(tag === 'GREEDY') return 'amber';
  if(tag === 'SORTING') return 'pink';
  if(tag === 'BACKTRACKING') return 'indigo';
  if(tag === 'INTERVALS') return 'purple';
  if(tag === 'MATH&GEOMETRY') return 'teal';
  if(tag === 'BIT MANIPULATION') return 'cyan';

  return 'gray';
};