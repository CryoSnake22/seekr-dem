'use client'

import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-12 px-4 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-neutral-500">
                    © 2026 Seekr Intelligence. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm text-neutral-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    )
}
