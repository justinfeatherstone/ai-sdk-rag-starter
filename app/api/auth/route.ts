import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, action, name } = body;

  try {
    if (action === "login") {
      // Convert to form data as required by FastAPI's OAuth2 implementation
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.detail || "Invalid credentials" },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    if (action === "register") {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: error.detail || "Registration failed" },
          { status: response.status }
        );
      }

      // After registration, log the user in
      return await POST(
        new Request("http://localhost:3000/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            action: "login",
          }),
        })
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 500 }
    );
  }
} 