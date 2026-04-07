import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { generateSHA256 } from "@/lib/hash";

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
      // Save to Vercel KV
      await kv.set(formatHash, payload);
    } catch (kvError: any) {
      console.error("Critical KV Save Error:", kvError);
      return NextResponse.json(
        { error: `Database Save Failed: ${kvError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, hash: formatHash, payload }, { status: 200 });
  } catch (error: any) {
    console.error("General API Error:", error);
    return NextResponse.json(
      { error: `Server execution failed: ${error.message}` },
      { status: 500 }
    );
  }
}
