import { connectDB } from "@/utils/connectDB";
import Job from "@/models/jobModel";
import getDataFromToken from "@/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log("2222222222222222222222api hitting22222222222222222222222222");
  await connectDB();

  const getIdFromToken = getDataFromToken(req);
  if (req.method === "GET" && getIdFromToken) {
    try {
      const jobs = await Job.find();

      return NextResponse.json(
        {
          message: "success",
          success: true,
          savedUser: jobs,
        },
        { status: 200 }
      );
    } catch (err) {
      const response = NextResponse.json(
        {
          message: "something went wrong",
          success: true,
        },
        { status: 500 }
      );
      return response;
    }
  } else if (req.method === "POST" && getIdFromToken) {
    try {
      const { title, description, experience } = (await req.json()) as {
        title: string;
        description: string;
        experience: number;
      };
      const newJob = new Job({ title, description, experience });
      const savedJob = await newJob.save();

      return NextResponse.json(
        {
          message: "success",
          success: true,
          savedUser: savedJob,
        },
        { status: 201 }
      );
    } catch (err) {
      const response = NextResponse.json(
        {
          message: "something went wrong",
          success: true,
        },
        { status: 500 }
      );
      return response;
    }
  } else {
    const response = NextResponse.json(
      {
        message: "Method " + req.method + " Not Allowed",
        success: false,
      },
      { status: 405 }
    );
    return response;
  }
}
