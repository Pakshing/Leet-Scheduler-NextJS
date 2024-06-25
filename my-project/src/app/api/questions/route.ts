// pages/api/questions/[id].ts

import { NextResponse, NextRequest } from 'next/server'
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react'
import { getServerSession } from 'next-auth';
import { getToken } from "next-auth/jwt"
import { cookies } from 'next/headers'
import prisma from '../../../../prisma/migrations/client'

type ResponseData = {
    message: string
  }

type QuestionInput = {
    url: string,
    daysReview: number
    difficulty: string,
    tags: string[],
    ownerId: string
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
    if(duplicate) return NextResponse.json({message: "Question already exists"},{status: 400})    
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() + daysReview)
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
