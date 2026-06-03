import { handleMcpRequest } from "@/lib/mastra/mcp";
import { validateApiKeyFromRequest } from "@/lib/api-key";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleMcpRequest(req);
}

export async function DELETE(req: Request) {
  return handleMcpRequest(req);
}

export async function POST(req: Request) {
  const validation = await validateApiKeyFromRequest(req);
  if (!validation.valid) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized: valid API key required" },
        id: null,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return handleMcpRequest(req, validation.orgCode);
}
