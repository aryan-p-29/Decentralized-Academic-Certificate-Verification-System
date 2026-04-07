"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

export default function IssuerPage() {
    const router = useRouter();
    const [loadingText, setLoadingText] = useState("");
    const [isIssuing, setIsIssuing] = useState(false);

    const [formData, setFormData] = useState({
        name: "Aryan Patil",
        studentId: "2023BCD0047",
        degree: "B.Tech Computer Science",
        university: "Indian Institute of Information Technology, Kottayam",
        year: "2027",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIssuing(true);

        try {
            // Fake Delays for Demo UX
            setLoadingText("Generating Cryptographic Hash...");
            await delay(1000);

            setLoadingText("Uploading JSON schema to IPFS...");
            await delay(1500);

            setLoadingText("Awaiting MetaMask Signature...");
            await delay(2000);

            setLoadingText("Confirming transaction on Polygon...");

            // Actual API call
            const res = await fetch("/api/issue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.hash) {
                setLoadingText("Success! Redirecting...");
                await delay(500);
                router.push(`/certificate/${data.hash}`);
            } else {
                alert("Failed to issue certificate: " + (data.error || "Unknown Error"));
                setIsIssuing(false);
            }
        } catch (error) {
            console.error(error);
            alert("Network error occurred.");
            setIsIssuing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
            >
                <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            College Issuer Portal
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Issue a decentralized, verifiable academic credential.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isIssuing ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <motion.p
                                    key={loadingText}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-lg font-medium text-slate-300 text-center"
                                >
                                    {loadingText}
                                </motion.p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-300">Student Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-slate-950 border-slate-800" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="studentId" className="text-slate-300">Student ID</Label>
                                    <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} className="bg-slate-950 border-slate-800" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="degree" className="text-slate-300">Degree</Label>
                                    <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} className="bg-slate-950 border-slate-800" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="university" className="text-slate-300">University</Label>
                                    <Input id="university" name="university" value={formData.university} onChange={handleChange} className="bg-slate-950 border-slate-800" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year" className="text-slate-300">Graduation Year</Label>
                                    <Input id="year" name="year" value={formData.year} onChange={handleChange} className="bg-slate-950 border-slate-800" required />
                                </div>

                                <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white flex gap-2">
                                    <Send className="w-4 h-4" /> Issue Credential
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
