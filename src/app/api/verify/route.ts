import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash");

    if (!hash) {
        return NextResponse.json({ error: "Hash parameter is required" }, { status: 400 });
    }

    try {
        const data = await kv.get(hash);

        if (!data) {
            return NextResponse.json({ error: "Tampered or Fake Record Detected" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return NextResponse.json({ error: "Failed to verify certificate" }, { status: 500 });
    }
}
