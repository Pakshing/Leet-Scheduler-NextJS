import { NextResponse, NextRequest } from 'next/server'
export async function GET(req: Request, res: NextResponse){
    return NextResponse.json({ message: process.env.NEXTAUTH_URL });
}
