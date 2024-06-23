// pages/api/questions/[id].ts

import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../../prisma/migrations/client'

type ResponseData = {
    message: string
  }

type Question = {

}
   
export async function GET(){
    const question = await prisma.question.findMany()
    console.log(question)
    return NextResponse.json(question)
}

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json()
    let question = {
        "title": "Two Sum",
        "url": "https://leetcode.com/problems/two-sum/",
        "category": "Algorithms",
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
        "ownerId": "clwntprx800006yy9bx0rq0gc"
      }
    const result = await prisma.question.create({data: question})
    console.log(result)
    return NextResponse.json(result)
}

