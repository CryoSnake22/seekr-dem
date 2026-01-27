import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    ArrowRight, 
    BarChart3, 
    Code2, 
    Target, 
    CheckCircle2, 
    Database, 
    BrainCircuit,
    Layers,
    Terminal,
    TrendingUp,
    Zap,
    Check
} from 'lucide-react';
import { GlowCard, ButtonBeam, BeamTexture } from './ui/Effects';

interface SectionProps {
  onNavigate?: (view: 'landing' | 'dashboard') => void;
}

// --- Hero Section ---
export const HeroSection: React.FC<SectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 w-full max-w-7xl mx-auto z-20">
      <BeamTexture />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Job Market Data for 2026
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500"
        >
          Stop Guessing. <br />
          Start Learning <span className="text-white">What Matters.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          6.1% unemployment for CS grads is a choice. Seekr analyzes 100+ job postings weekly to tell you exactly which skills to prioritize and what to build.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="group relative px-8 py-3.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all hover:scale-105"
          >
            <ButtonBeam />
            <span className="relative z-10 flex items-center gap-2">
              Get Your Match Score <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="px-8 py-3.5 bg-neutral-900 border border-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            View Live Demo
          </button>
        </motion.div>
      </div>

      {/* Hero Visual */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-20 w-full max-w-5xl mx-auto relative group z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative glass-card rounded-xl border border-white/10 overflow-hidden shadow-2xl">
           {/* Mock Dashboard UI Header */}
           <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-black/40">
             <div className="w-3 h-3 rounded-full bg-red-500/50" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
             <div className="w-3 h-3 rounded-full bg-green-500/50" />
             <div className="ml-4 h-5 w-64 bg-white/5 rounded text-[10px] flex items-center px-2 text-neutral-500 font-mono">seekr.app/dashboard/analytics</div>
           </div>
           
           {/* Mock Dashboard Content */}
           <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#050505]">
                <div className="col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-textSecondary text-sm mb-1">Target Role Match</div>
                            <div className="text-3xl font-bold text-white">72<span className="text-neutral-500">/100</span></div>
                        </div>
                        <div className="text-primary text-sm font-medium flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +12% this week
                        </div>
                    </div>
                    {/* Fake Chart */}
                    <div className="h-40 flex items-end gap-2 border-b border-white/5 pb-2">
                        {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                            <div key={i} className="flex-1 bg-neutral-800 hover:bg-primary/50 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Score: {h}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-neutral-900/50 border border-white/5">
                            <div className="text-xs text-textSecondary uppercase tracking-wider mb-2">Missing Skills</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-md bg-red-900/20 text-red-400 text-xs border border-red-900/30">Docker (68%)</span>
                                <span className="px-2 py-1 rounded-md bg-yellow-900/20 text-yellow-400 text-xs border border-yellow-900/30">AWS (55%)</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-900/50 border border-white/5">
                            <div className="text-xs text-textSecondary uppercase tracking-wider mb-2">Recommended Action</div>
                            <div className="text-sm text-white">Build "Containerized Task Manager"</div>
                        </div>
                    </div>
                </div>
                
                {/* Side Panel Mock */}
                <div className="col-span-1 border-l border-white/5 pl-6 space-y-4">
                    <div className="text-sm font-medium text-white mb-4">Live Market Intelligence</div>
                    {[
                        { skill: "React", pct: "85%", trend: "up" },
                        { skill: "TypeScript", pct: "72%", trend: "up" },
                        { skill: "Docker", pct: "68%", trend: "up" },
                        { skill: "GraphQL", pct: "23%", trend: "down" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-primary transition-colors" />
                                <span className="text-sm text-textSecondary group-hover:text-white transition-colors">{item.skill}</span>
                            </div>
                            <span className="text-xs font-mono text-neutral-500">{item.pct}</span>
                        </div>
                    ))}
                    
                    <div className="mt-8 pt-6 border-t border-white/5">
                         <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <BrainCircuit className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-xs font-semibold text-primary">AI Advisor</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 leading-relaxed">
                                "Based on your missing Docker skills, you should build a microservice app..."
                            </p>
                         </div>
                    </div>
                </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
};

// --- Value Proposition Section ---
export const ValuePropSection: React.FC = () => {
  const cards = [
    {
      title: "Market Intelligence",
      desc: "We analyze 50-100 job postings weekly. Know exactly what companies want right now, not last year.",
      icon: <Database className="w-6 h-6 text-primary" />,
      stat: "85% of jobs require React",
      cols: "md:col-span-2"
    },
    {
      title: "AI Project Advisor",
      desc: "Stop tutorial hell. Get specific project specs that demonstrate the exact skills you're missing.",
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      stat: "Personalized Specs",
      cols: "md:col-span-1"
    },
    {
      title: "Gap Analysis",
      desc: "Upload your resume. We compare it against live market data to find your critical blind spots.",
      icon: <Target className="w-6 h-6 text-blue-400" />,
      stat: "Match Score™",
      cols: "md:col-span-1"
    },
    {
      title: "10-50x ROI",
      desc: "The same outcome as a $14K bootcamp for a fraction of the cost. Get hired faster.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      stat: "$50/mo vs $14,000",
      cols: "md:col-span-2"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 w-full max-w-7xl mx-auto relative z-20 bg-background/50 backdrop-blur-sm md:backdrop-blur-none md:bg-transparent">
      <div className="mb-16 md:text-center max-w-2xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't fly blind.</h2>
            <p className="text-textSecondary">
                Most CS grads apply to 150+ jobs with no feedback. Seekr gives you the data to apply to 50 jobs and get 5 interviews.
            </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className={`${card.cols}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <GlowCard className={`flex flex-col justify-between min-h-[240px]`}>
                <div>
                <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg border border-white/10">
                    {card.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed mb-6">
                    {card.desc}
                </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                    {card.stat}
                </span>
                </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Details Section ---
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
                        Seekr isn't a course. It's the navigation layer that tells you WHICH course to take and WHAT to build to maximize your hireability.
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
                                    <p>> Fetching 100 recent jobs...</p>
                                    <p className="text-emerald-500">> [SUCCESS] 98 jobs parsed.</p>
                                    <p>> Analyzing skill frequency...</p>
                                    <p className="pl-4 text-white">React.js .................... 85%</p>
                                    <p className="pl-4 text-white">Docker ...................... 68%</p>
                                    <p className="pl-4 text-neutral-600">GraphQL ..................... 23%</p>
                                    <p className="mt-4">> Comparing user profile...</p>
                                    <p className="text-red-400">> [ALERT] Missing High Priority Skill: Docker</p>
                                    <p className="mt-2">> Generating project recommendation...</p>
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

// --- Pricing Section ---
export const PricingSection: React.FC = () => {
    return (
        <section id="pricing" className="py-24 px-4 w-full max-w-7xl mx-auto z-10 relative">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing.</h2>
                <p className="text-textSecondary">Invest in your career for less than the price of lunch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 rounded-2xl flex flex-col relative"
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
                    
                    <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors">
                        Start for Free
                    </button>
                </motion.div>

                {/* Pro Tier */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative p-8 rounded-2xl flex flex-col bg-neutral-900 border border-primary/30"
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
                    <div className="relative z-10 text-4xl font-bold mb-6">$12<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
                    
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
                    
                    <button className="relative z-10 w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                        Get Hired Faster
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

// --- Proof Section ---
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
                            <p className="text-neutral-300 text-sm leading-relaxed">"{t.quote}"</p>
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

// --- CTA Section ---
export const CTASection: React.FC<SectionProps> = ({ onNavigate }) => {
    return (
        <section className="py-32 px-4 w-full relative overflow-hidden flex flex-col items-center z-10">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
            >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Get Hired Faster.
                </h2>
                <p className="text-lg text-textSecondary max-w-xl mx-auto">
                    Start for free. Upgrade to Pro for unlimited market intelligence and AI guidance.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button 
                        onClick={() => onNavigate?.('dashboard')}
                        className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
                    >
                         <ButtonBeam />
                        <span className="relative z-10">Start Free</span>
                    </button>
                    <button className="px-8 py-4 text-white text-lg font-medium hover:text-primary transition-colors">
                        View Pricing
                    </button>
                </div>

                <div className="pt-8 flex items-center justify-center gap-8 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" /> Cancel anytime
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

// --- Footer ---
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