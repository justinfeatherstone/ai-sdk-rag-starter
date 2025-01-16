import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Get request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to process message: Invalid JSON" },
        { status: 400 }
      );
    }

    // Make request to backend
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nutrition/advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json({ 
          error: `Failed to get response from backend: ${data.error || 'Backend error'}`
        }, { status: response.status });
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('Network error:', error);
      return NextResponse.json({ error: 'Network error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error",
    },
    { status: 500 }
  );
  }
}
