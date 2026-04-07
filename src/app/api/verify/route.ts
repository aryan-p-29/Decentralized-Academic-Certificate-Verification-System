import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || searchParams.get("hash");

    if (!id) {
        return NextResponse.json({ error: "Hash or ID parameter is required" }, { status: 400 });
    }

    try {
        console.log("Looking up KV for ID:", id);
        const data = await kv.get(id);

        if (!data) {
            return NextResponse.json({ error: "Tampered or Fake Record Detected" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        console.error("KV Read Error:", error);
        return NextResponse.json(
            { error: "Failed to query database: " + error.message },
            { status: 500 }
        );
    }
}
