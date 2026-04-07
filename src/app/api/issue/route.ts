import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { generateSHA256 } from "@/lib/hash";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a deterministic hash from the data
    const stringifiedData = JSON.stringify(body);
    const hash = await generateSHA256(stringifiedData);
    const formatHash = `0x${hash}`;

    const timestamp = new Date().toISOString();
    const payload = {
      hash: formatHash,
      cid: `ipfs://mock-${formatHash.slice(0, 10)}`,
      data: body,
      timestamp,
    };

    console.log("Saving to KV:", formatHash, payload);

    try {
      // Ensure strict try/catch for KV save
      await kv.set(formatHash, payload);
    } catch (error: any) {
      // Must not return success if this fails
      console.error("KV Save Error:", error);
      return NextResponse.json(
        { error: "Vercel KV failed to save: " + error.message },
        { status: 500 }
      );
    }

    // Only return 200 success if await kv.set succeeded
    return NextResponse.json({ success: true, hash: formatHash, payload }, { status: 200 });
  } catch (error: any) {
    console.error("Server Execution Error:", error);
    return NextResponse.json({ error: "Server execution failed: " + error.message }, { status: 500 });
  }
}
