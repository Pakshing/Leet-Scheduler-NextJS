// pages/api/questions/[id].ts

import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../../prisma/migrations/client'

type ResponseData = {
    message: string
  }

type QuestionInput = {
    id?: number,
    title?: string,
    url: string,
    daysReview: number
    difficulty: string,
    tags: string[],
    ownerId: string
    hasCompleted?: boolean
}

type QuestionType = {
    id: number;
    title: string;
    url: string;
    category: string | null;
    difficulty: string;
    dateCreated: Date;
    lastCompletion: Date;
    reviewDate: Date | null;
    tags: string[];
    lastUpdated: Date;
    completionCount: number;
    ownerId: string;
  };

   
export async function GET(req: Request, res: NextResponse){
    const {searchParams} = new URL(req.url)
    const id = searchParams.get('ownerId')
    if(!id) return NextResponse.json({message: "No id provided"})
    const question = await prisma.question.findMany({where: {ownerId: id}})
    console.log(question)
    return NextResponse.json(question)
}

export async function POST(request: Request) {
  try {
    const questionInput = await request.json()
    const {url, daysReview, difficulty, tags, ownerId} = questionInput as QuestionInput
    const regex = /(https:\/\/leetcode\.com\/problems\/[^\/]+)/;
    let formattedUrl = url
    const match = url.match(regex);
    if (match) {
      formattedUrl = match[0]; // 'https://leetcode.com/problems/two-sum'
    }else{
      formattedUrl = url
    }
    const duplicate = await prisma.question.findFirst({where: {title: getProblemNameFromUrl(url), ownerId: ownerId}})
    console.log(duplicate)
    if(duplicate) return NextResponse.json({message: "Question already exists"},{status: 409})    
    
    let reviewDate = new Date()
    if(daysReview > 0) reviewDate.setDate(reviewDate.getDate() + daysReview)
    const question = {
      "title": getProblemNameFromUrl(url),
      "url": formattedUrl,
      "reviewDate": reviewDate,
      "difficulty": difficulty,
      "tags": tags,
      "ownerId": ownerId
    }
    const result = await prisma.question.create({data: question})
    console.log(result)
    return NextResponse.json({message: "Question added", question: result})
  } catch (error) {
    return NextResponse.json({message: "Error adding question", error: error},{status: 400})
  }
}

export async function PUT(request: Request) {
  try {
    const updatedQuestion: QuestionInput = await request.json();
    console.log('updatedQuestion\n', updatedQuestion)

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + updatedQuestion.daysReview)
    console.log('nextReviewDate\n', nextReviewDate)
    const question = await prisma.question.update({where: {id: updatedQuestion.id, ownerId:updatedQuestion.ownerId}, 
    data: { completionCount: {
      increment: updatedQuestion.hasCompleted?1:0
    },title:getProblemNameFromUrl(updatedQuestion.url), reviewDate: nextReviewDate, difficulty: updatedQuestion.difficulty, tags: updatedQuestion.tags, ownerId: updatedQuestion.ownerId, lastUpdated: new Date(),lastCompletion: new Date()}})
    console.log("updated:\n",question)
    return NextResponse.json({message: "Question updated", question: question})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Error updating question", error: error},{status: 400})
  }
}



//helper functions
function getProblemNameFromUrl(url:string) : string{
  const urlParts = url.split('/');
  const problemIndex = urlParts.indexOf('problems');
  const problemName = urlParts[problemIndex + 1];
  const problemNameCapitalized = problemName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return problemNameCapitalized;
}
