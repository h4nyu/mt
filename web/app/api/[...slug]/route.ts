import { NextResponse, NextRequest } from "next/server";

import axios from "axios";

export const POST = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) => {
  const { slug } = params;
  const url = `${process.env.API_URL}/${slug.join("/")}`;
  try {
    const res = await axios.post(url, request.body);
    return NextResponse.json(res.data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return new NextResponse(e.response?.data, {
        status: e.response?.status,
      });
    } else {
      throw e;
    }
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) => {
  const { slug } = params;
  const url = `${process.env.API_URL}/${slug.join("/")}${
    request.nextUrl.search
  }`;
  try {
    const res = await axios.get(url);
    return NextResponse.json(res.data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return new NextResponse(e.response?.data, {
        status: e.response?.status,
      });
    } else {
      throw e;
    }
  }
};
