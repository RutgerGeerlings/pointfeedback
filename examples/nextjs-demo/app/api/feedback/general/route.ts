import { NextRequest } from "next/server";
import { generalFeedbackHandler } from "pointfeedback/api";

export async function GET(request: NextRequest) {
  return generalFeedbackHandler.GET(request as any);
}

export async function POST(request: NextRequest) {
  return generalFeedbackHandler.POST(request as any);
}

export async function DELETE(request: NextRequest) {
  return generalFeedbackHandler.DELETE(request as any);
}
