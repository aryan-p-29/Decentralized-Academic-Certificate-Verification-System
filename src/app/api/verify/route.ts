import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash") || searchParams.get("id"); // Accept 'hash' or 'id'

    if (!hash) {
        return NextResponse.json({ error: "Hash or ID parameter is required" }, { status: 400 });
    }

    try {
        console.log("Searching for Hash/ID:", hash);
        const data = await kv.get(hash);
        console.log("KV Result:", data);

        if (!data) {
            return NextResponse.json({ error: "Tampered or Fake Record Detected" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        console.error("KV Read Error:", error);
        return NextResponse.json(
            { error: `Failed to query database: ${error.message}` },
            { status: 500 }
        );
    }
}
