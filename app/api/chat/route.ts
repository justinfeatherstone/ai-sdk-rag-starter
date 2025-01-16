import { NextResponse } from "next/server";

const MOCK_RESPONSES = [
  "Based on your dietary preferences and local food availability in Andover, I recommend incorporating more leafy greens into your diet. You can find affordable options at Market Basket or Stop & Shop.",
  "A budget-friendly protein option available locally is chicken breast when it's on sale at Shaw's. You can prepare it in various healthy ways like grilling or baking.",
  "For a balanced meal plan, try to include whole grains like brown rice or whole wheat bread, which are readily available at local stores and provide good nutritional value.",
  "Consider visiting the Andover Farmers Market when in season for fresh, local produce at reasonable prices.",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get a random response
    const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

    return NextResponse.json({
      response,
      sources: [], // In a real app, this would include relevant nutrition sources
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
} 