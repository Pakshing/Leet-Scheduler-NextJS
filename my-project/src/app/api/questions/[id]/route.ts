import prisma from '../../../../../prisma/migrations/client'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(req: Request,{params}:{params:{id:string}}){
    const {searchParams} = new URL(req.url)
    const ownerId = searchParams.get('ownerId')
    console.log("delete route",params.id, ownerId)
    try {
        console.log("Enter try\n")
        const deleteQuestion = await prisma.question.delete({where: {id: Number(params.id)},select: {id: true,title:true, ownerId: true},})
        return NextResponse.json({message: `Question:${deleteQuestion.title} has deleted successfully`,},{status: 200})
    } catch (error) {
      console.log("failed")
        console.error(error)
        return NextResponse.json({message: "Error deleting question"},{status: 500})
    }
}
