'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const DetailsSection: React.FC = () => {
    return (
        <section id="market-data" className="py-24 px-4 w-full relative overflow-hidden z-10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                        Your personal <span className="text-primary">Career API</span>.
                    </h2>
                    <p className="text-textSecondary text-lg">
                        Seekr isn&apos;t a course. It&apos;s the navigation layer that tells you WHICH course to take and WHAT to build to maximize your hireability.
                    </p>

                    <div className="space-y-6">
                        {[
                            { title: "Identify Gaps", desc: "See precisely what separates your resume from the job description." },
                            { title: "Build Portfolio", desc: "Get AI-generated project ideas that hit multiple missing skills at once." },
                            { title: "Track Progress", desc: "Watch your Match Score rise from 60% to 85% as you ship code." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                    <span className="text-xs font-mono">{i + 1}</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{item.title}</h4>
                                    <p className="text-sm text-textSecondary">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                     {/* Abstract Visual Representation of Data Processing */}
                     <div className="relative z-10 glass-card p-1 rounded-2xl border border-white/10">
                        <div className="bg-black rounded-xl overflow-hidden aspect-square md:aspect-video relative">
                            {/* Terminal Window Mock */}
                            <div className="absolute inset-0 p-6 font-mono text-xs md:text-sm text-neutral-400 overflow-hidden">
                                <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
                                    <Terminal className="w-4 h-4" />
                                    <span>seekr-cli --analyze</span>
                                </div>
                                <div className="space-y-2">
                                    <p>&gt; Fetching 100 recent jobs...</p>
                                    <p className="text-emerald-500">&gt; [SUCCESS] 98 jobs parsed.</p>
                                    <p>&gt; Analyzing skill frequency...</p>
                                    <p className="pl-4 text-white">React.js .................... 85%</p>
                                    <p className="pl-4 text-white">Docker ...................... 68%</p>
                                    <p className="pl-4 text-neutral-600">GraphQL ..................... 23%</p>
                                    <p className="mt-4">&gt; Comparing user profile...</p>
                                    <p className="text-red-400">&gt; [ALERT] Missing High Priority Skill: Docker</p>
                                    <p className="mt-2">&gt; Generating project recommendation...</p>
                                    <div className="mt-2 p-3 bg-neutral-900 border-l-2 border-primary rounded-r">
                                        <span className="text-primary">SUGGESTION:</span> Build a containerized microservice API using Node.js and deploy to AWS ECS.
                                    </div>
                                    <div className="animate-pulse mt-2 h-4 w-4 bg-white/50 block" />
                                </div>
                            </div>
                        </div>
                     </div>
                     {/* Decor elements */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
                </motion.div>
            </div>
        </section>
    )
}
