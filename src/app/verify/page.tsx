"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlId = searchParams?.get("id");

    const [hashInput, setHashInput] = useState("");
    const [loadingText, setLoadingText] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<any>(null); // null, { success: true, data }, { error: true, message }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        if (urlId) {
            setHashInput(urlId);
            handleVerify(urlId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlId]);

    const handleVerify = async (hashToVerify: string) => {
        if (!hashToVerify.trim()) return;

        setIsVerifying(true);
        setResult(null);

        try {
            setLoadingText("Querying Polygon Network...");
            await delay(1500);

            setLoadingText("Fetching from IPFS...");
            await delay(1000);

            setLoadingText("Verifying Cryptographic Signatures...");
            await delay(800);

            const res = await fetch(`/api/verify?hash=${hashToVerify}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setResult({ success: true, data: data.data });
            } else {
                setResult({ error: true, message: data.error || "Record not found" });
            }
        } catch (e) {
            setResult({ error: true, message: "Network Error" });
        } finally {
            setIsVerifying(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.replace(`/verify?id=${hashInput}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
            <div className="w-full max-w-2xl text-center mb-10">
                <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-slate-800 mb-2">Employer Verification Portal</h1>
                <p className="text-lg text-slate-500">Verify the authenticity of decentralized academic credentials.</p>
            </div>

            <Card className="w-full max-w-2xl shadow-lg border-slate-200">
                <CardContent className="pt-6">
                    <form onSubmit={onSubmit} className="flex gap-3">
                        <Input
                            value={hashInput}
                            onChange={(e) => setHashInput(e.target.value)}
                            placeholder="Paste Transaction Hash (0x...)"
                            className="flex-1 text-lg py-6 bg-slate-100"
                        />
                        <Button type="submit" disabled={isVerifying || !hashInput.trim()} className="py-6 px-8 bg-blue-600 hover:bg-blue-700 text-white">
                            <Search className="w-5 h-5 mr-2" /> Verify
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* States */}
            <div className="w-full max-w-2xl mt-8">
                {isVerifying && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow border border-slate-100"
                    >
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-lg font-medium text-slate-600 animate-pulse">{loadingText}</p>
                    </motion.div>
                )}

                {!isVerifying && result && result.success && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-green-200 shadow-xl overflow-hidden">
                            <div className="bg-green-500 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-semibold text-lg">Authentic Record Verified</span>
                                </div>
                                <div className="text-green-100 text-sm font-medium">Valid Signature</div>
                            </div>
                            <CardContent className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase">Student Name</p>
                                        <p className="text-xl font-bold text-slate-800">{result.data.data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase">Student ID</p>
                                        <p className="text-xl font-bold text-slate-800">{result.data.data.studentId}</p>
                                    </div>
                                    <div className="md:col-span-2 border-t border-slate-100 pt-4">
                                        <p className="text-sm font-semibold text-slate-400 uppercase mb-2">Degree Information</p>
                                        <p className="text-lg font-medium text-slate-700 flex flex-col">
                                            <span>{result.data.data.degree}</span>
                                            <span className="text-slate-500">{result.data.data.university} • Class of {result.data.data.year}</span>
                                        </p>
                                    </div>
                                    <div className="md:col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Data Hash & IPFS CID</p>
                                        <p className="text-xs font-mono text-slate-600 break-all mt-1">{result.data.hash}</p>
                                        <p className="text-xs font-mono text-blue-600 break-all mt-1">{result.data.cid}</p>
                                        <p className="text-xs text-slate-400 mt-1">Issued: {new Date(result.data.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {!isVerifying && result && result.error && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-red-200 shadow-xl overflow-hidden">
                            <div className="bg-red-500 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="font-semibold text-lg">Tampered / Fake Record Detected</span>
                                </div>
                            </div>
                            <CardContent className="p-8 text-center bg-red-50">
                                <p className="text-lg text-red-800 font-medium">{result.message}</p>
                                <p className="text-sm text-red-600 mt-2">The cryptographic hash provided does not match any authentic record on the network.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
