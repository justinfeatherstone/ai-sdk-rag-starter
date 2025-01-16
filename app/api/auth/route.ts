import { NextResponse } from "next/server";

const MOCK_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
};

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, action } = body;

  if (action === "login") {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      return NextResponse.json({
        user: { email: MOCK_USER.email, name: MOCK_USER.name },
        token: "mock-jwt-token",
      });
    }
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (action === "register") {
    // In a real app, you would save this to a database
    return NextResponse.json({
      user: { email, name: body.name },
      token: "mock-jwt-token",
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
} 