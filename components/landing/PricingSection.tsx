'use client'

import React from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, Zap } from '@/components/ui/Icon';

export const PricingSection: React.FC = () => {
    return (
        <section id="pricing" className="py-24 px-4 w-full max-w-7xl mx-auto z-10 relative">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing.</h2>
                <p className="text-textSecondary">Invest in your career seriously.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div
                    className="glass-card p-8 rounded-2xl flex flex-col relative animate-fade-in-up"
                >
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Seekr Starter</h3>
                        <p className="text-textSecondary text-sm">For students exploring the market.</p>
                    </div>
                    <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-neutral-500 font-normal">/mo</span></div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "3 Job Market Analyses / month",
                            "Basic Skill Gap Identification",
                            "Public Community Access",
                            "Weekly Trend Newsletter"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                <Check className="w-4 h-4 text-neutral-500" /> {feature}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/signup"
                        className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors text-center"
                    >
                        Start for Free
                    </Link>
                </div>

                {/* Pro Tier */}
                <div
                    className="relative p-8 rounded-2xl flex flex-col bg-neutral-900 border border-primary/30 animate-fade-in-up animation-delay-100"
                >
                     {/* Glow Effect */}
                     <div className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none" />
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                        Most Popular
                     </div>

                    <div className="relative z-10 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                             <h3 className="text-xl font-bold">Seekr Pro</h3>
                             <Zap className="w-4 h-4 text-primary fill-primary" />
                        </div>
                        <p className="text-emerald-400/80 text-sm">For serious candidates.</p>
                    </div>
                    <div className="relative z-10 text-4xl font-bold mb-6">$79<span className="text-lg text-neutral-500 font-normal">/mo</span></div>

                    <ul className="relative z-10 space-y-4 mb-8 flex-1">
                        {[
                            "Unlimited Market Analyses",
                            "Real-time Skill Gap Tracking",
                            "AI Project Generator (Unlimited)",
                            "Resume Deep Scan & Optimization",
                            "Priority Match Score Updates"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-white">
                                <CheckCircle2 className="w-4 h-4 text-primary" /> {feature}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/signup"
                        className="relative z-10 w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors text-center"
                    >
                        Get Hired Faster
                    </Link>
                </div>
            </div>
        </section>
    )
}
