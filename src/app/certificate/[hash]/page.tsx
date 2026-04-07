"use client";

import { useEffect, useState, useRef, use } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, AlertTriangle } from "lucide-react";

export default function CertificatePage({ params }: { params: Promise<{ hash: string }> }) {
    const { hash } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [verificationUrl, setVerificationUrl] = useState("");

    const certificateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setVerificationUrl(`${window.location.origin}/verify?id=${hash}`);
        }

        async function fetchCertificate() {
            try {
                const res = await fetch(`/api/verify?hash=${hash}`);
                const result = await res.json();

                if (!res.ok || result.error) {
                    setError(result.error || "Failed to fetch certificate");
                } else {
                    setData(result.data);
                }
            } catch (e) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        }
        fetchCertificate();
    }, [hash]);

    const handleDownload = async () => {
        if (certificateRef.current === null) return;
        try {
            const dataUrl = await toPng(certificateRef.current, { cacheBust: true, quality: 1.0, pixelRatio: 2, skipFonts: true });
            saveAs(dataUrl, `Certificate_${hash.slice(0, 10)}.png`);
        } catch (err) {
            console.error("Failed to download image", err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="mt-4 text-xl font-medium text-gray-700">Fetching Verifiable Credential...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <Card className="w-full max-w-md border-red-200 shadow-xl">
                    <CardHeader className="bg-red-100 rounded-t-lg">
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertTriangle className="text-red-500 h-6 w-6" />
                            Not Found or Tampered
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-700 text-lg font-medium">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
            >
                <div className="flex justify-end mb-6">
                    <Button onClick={handleDownload} className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all">
                        <Download className="w-5 h-5" /> Download Certificate (PNG)
                    </Button>
                </div>

                {/* Certificate Container with ref for downloading */}
                <div
                    ref={certificateRef}
                    className="bg-white rounded-xl shadow-2xl p-10 md:p-16 border-8 border-double border-slate-200 relative overflow-hidden"
                >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-50 rounded-tl-full opacity-60"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-6 rounded-full bg-blue-100 p-4 shadow-sm border border-blue-200">
                            <span className="text-6xl flex items-center justify-center">🎓</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-2">
                            Certificate of Completion
                        </h1>
                        <p className="text-lg text-slate-500 uppercase tracking-widest mb-10 font-semibold text-blue-600">
                            Decentralized Academic Credential
                        </p>

                        <p className="text-xl text-slate-600 mb-3">This is to certify that</p>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">{data.data.name}</h2>

                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mb-8 rounded"></div>

                        <p className="text-xl text-slate-600 mb-2">
                            has successfully completed the degree of
                        </p>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                            {data.data.degree}
                        </h3>
                        <p className="text-lg text-slate-500 mb-12">
                            from {data.data.university} (Class of {data.data.year})
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t border-slate-200 pt-8 mt-8">
                            <div className="flex flex-col items-center md:items-start text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Verification Hash</p>
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg w-full mt-2 shadow-inner">
                                    <p className="font-mono text-xs text-slate-600 break-all">
                                        {data.hash}
                                    </p>
                                </div>

                                <div className="flex gap-8 mt-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Student ID</p>
                                        <p className="font-medium text-slate-800 mt-1">{data.data.studentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Issue Date</p>
                                        <p className="font-medium text-slate-800 mt-1">{new Date(data.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end justify-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Scan to Verify</p>
                                <div className="p-4 bg-white shadow-md rounded-xl border border-slate-100">
                                    {verificationUrl && (
                                        <QRCodeCanvas value={verificationUrl} size={130} level={"Q"} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
