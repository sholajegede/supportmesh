import { handleMcpRequest } from "@/lib/mastra/mcp";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleMcpRequest(req);
}

export async function POST(req: Request) {
  return handleMcpRequest(req);
}

export async function DELETE(req: Request) {
  return handleMcpRequest(req);
}
