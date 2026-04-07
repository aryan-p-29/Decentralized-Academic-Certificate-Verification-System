"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, GraduationCap, ArrowRight, Network } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-5xl z-10 flex flex-col items-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Network className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 mb-6 leading-tight">
          Decentralized Academic <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Certificate Verification System
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Secure, immutable, and instantly verifiable academic credentials. Prevent credential fraud using unalterable cryptographic records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-8">
          {/* Issuer Portal Card */}
          <Link href="/issuer" className="block group">
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-300 h-full shadow-xl">
              <CardHeader className="text-left">
                <div className="mb-4 bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <GraduationCap className="w-7 h-7 text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                  Issuer Portal
                </CardTitle>
                <CardDescription className="text-slate-400 text-base mt-3 leading-relaxed">
                  For authorized university administrators. Issue permanent, cryptographically signed academic degrees to the decentralized network.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-2 bg-slate-800 text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center border border-slate-700 group-hover:border-blue-500 py-6 text-lg">
                  Access Issuer Portal <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Verifier Portal Card */}
          <Link href="/verify" className="block group">
            <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all duration-300 h-full shadow-xl">
              <CardHeader className="text-left">
                <div className="mb-4 bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <ShieldCheck className="w-7 h-7 text-indigo-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  Verifier Portal
                </CardTitle>
                <CardDescription className="text-slate-400 text-base mt-3 leading-relaxed">
                  For employers and recruiters. Instantly verify the authenticity of a candidate's diploma using their unique transaction hash.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-2 bg-slate-800 text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center border border-slate-700 group-hover:border-indigo-500 py-6 text-lg">
                  Access Verifier Portal <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
