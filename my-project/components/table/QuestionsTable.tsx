'use client'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AddQuestionDialog from "../dialog/AddQuestionDialog";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { QuestionType } from "../../types/type"; // Add the import statement for the QuestionType type
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
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import NextReviewDialog from "../dialog/NextReviewDialog";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
 
const TABS = [
  {
    label: "Due",
    value: "due",
  },
  {
    label: "All",
    value: "all",
  },
  {
    label: "Future",
    value: "future",
  },
];
 
const TABLE_HEAD = ["Title", "Difficulty", "Tags", "Next Review", "Last Completion", "Actions"];
 
export function QuestionsTable() {
  const [activeTab, setActiveTab] = useState("all");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const { data: session } = useSession();
  const [handleNextReviewDialogOpen, setHandleNextReviewDialogOpen] = useState(false);

useEffect(() => {
    // Fetch data from API
    // async function fetchData() {
    //   fetchQuestionsByOwner()
    // }
    fetchQuestionsByOwner()
    //fetchData();
  }, []);

  async function fetchQuestionsByOwner() {
    const session = await getSession();
    const userId = session?.user?.id;
    const response = await fetch(`/api/questions?ownerId=${userId}`, {
      method: 'GET',
      credentials: 'include', 
    });
    const data = await response.json();
    setQuestions(data);

  }

  const handleTitileOnlcik = () =>{
    setHandleNextReviewDialogOpen(!handleNextReviewDialogOpen)
  }

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Question list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {session?.user?(<span color="gray" className="mt-1 font-normal">Your leetcode database & scheduler</span>):null}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              view all
            </Button>
            <AddQuestionDialog/>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value, }) => (
                <Tab key={label} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              placeholder="Search question"
              crossOrigin={""}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map(
              (record, index) => {
                const isLast = index === questions.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={record.id}>
                    <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            <NextReviewDialog question={record} refresh={fetchQuestionsByOwner}/>
                          </Typography>
                           
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={record.difficulty}
                          color={getColor(record.difficulty)}
                        />
                        </div>
                      </td>
                    <td className={classes}>
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
                    <td className={classes}>
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        {
                          record.reviewDate && new Date(record.reviewDate) > new Date() 
                            ? new Date(record.reviewDate).toDateString() 
                            : "N/A"
                        }
                      </Typography>
                    </td>
                    <td className={classes}>
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        {new Date(record.lastCompletion).toDateString()}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
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
      </CardFooter>
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