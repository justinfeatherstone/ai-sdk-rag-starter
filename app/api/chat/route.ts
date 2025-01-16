import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    // Call our Python backend with RAG capabilities
    const response = await fetch("http://localhost:8000/api/nutrition/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: message,
        context: "" // Add empty context as required by our backend
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error:", errorData);  // Add detailed logging
      throw new Error(`Failed to get response from backend: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process message" },
      { status: 500 }
    );
  }
} 