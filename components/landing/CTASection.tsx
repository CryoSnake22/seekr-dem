'use client'

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from '@/components/ui/Icon';
import { ButtonBeam } from '../ui/Effects';

export const CTASection: React.FC = () => {
    return (
        <section className="py-32 px-4 w-full relative overflow-hidden flex flex-col items-center z-10">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div
                className="relative z-10 max-w-3xl mx-auto text-center space-y-8 animate-scale-in"
            >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Get Hired Faster.
                </h2>
                <p className="text-lg text-textSecondary max-w-xl mx-auto">
                    Start for free. Upgrade to Pro for unlimited market intelligence and AI guidance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/signup"
                        className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
                    >
                         <ButtonBeam />
                        <span className="relative z-10">Start Free</span>
                    </Link>
                    <a
                        href="#pricing"
                        className="px-8 py-4 text-white text-lg font-medium hover:text-primary transition-colors"
                    >
                        View Pricing
                    </a>
                </div>

                <div className="pt-8 flex items-center justify-center gap-8 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> Cancel anytime
                    </div>
                </div>
            </div>
        </section>
    )
}
