'use client'

import React from 'react';
import { motion } from 'framer-motion';

export const ProofSection: React.FC = () => {
    return (
        <section className="py-24 px-4 w-full max-w-7xl mx-auto z-10 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl font-bold mb-4">Validate your competence.</h2>
                <p className="text-textSecondary">Join students landing jobs at top startups.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        quote: "I applied to 200 jobs before Seekr. After using it for 2 months, I focused on 50 high-match jobs and got 5 interviews.",
                        author: "Alex",
                        role: "CS Grad, now employed",
                        stat: "4 months to hire"
                    },
                    {
                        quote: "Seekr showed me React was in 85% of jobs, so I prioritized it. I stopped wasting time on random tutorials.",
                        author: "Dakota",
                        role: "Self-Taught Dev",
                        stat: "Increased salary 40%"
                    },
                    {
                        quote: "I didn't know what to put in my portfolio. The AI advisor gave me a specific project that the interviewer actually asked about.",
                        author: "Sam",
                        role: "Junior Developer",
                        stat: "3 offers received"
                    }
                ].map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="glass-card p-6 rounded-xl flex flex-col justify-between"
                    >
                        <div className="mb-6">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="w-1 h-4 bg-primary rounded-full opacity-80" />
                                ))}
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div>
                                <div className="font-semibold text-white">{t.author}</div>
                                <div className="text-xs text-textSecondary">{t.role}</div>
                            </div>
                            <div className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-primary">
                                {t.stat}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
