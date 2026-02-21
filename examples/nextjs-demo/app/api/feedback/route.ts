import { NextRequest } from "next/server";
import { feedbackHandler } from "pointfeedback/api";

export async function GET(request: NextRequest) {
  return feedbackHandler.GET(request as any);
}

export async function POST(request: NextRequest) {
  return feedbackHandler.POST(request as any);
}

export async function PUT(request: NextRequest) {
  return feedbackHandler.PUT(request as any);
}

export async function DELETE(request: NextRequest) {
  return feedbackHandler.DELETE(request as any);
}
