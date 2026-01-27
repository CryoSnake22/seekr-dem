import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus,
  ArrowUpRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  MoreHorizontal
} from 'lucide-react';
import { ButtonBeam } from './ui/Effects';

interface DashboardProps {
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-900 flex items-center justify-center border border-white/10">
              <span className="font-bold text-white">S</span>
           </div>
           <span className="font-bold text-lg tracking-tight">Seekr</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'market', icon: BarChart3, label: 'Market Data' },
            { id: 'projects', icon: Code2, label: 'Projects' },
            { id: 'skills', icon: BookOpen, label: 'My Skills' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.05),rgba(0,0,0,0))]">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-4 text-sm text-neutral-500">
               <span>Dashboard</span>
               <span>/</span>
               <span className="text-white">Overview</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search jobs, skills..." 
                      className="h-9 w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                </div>
                <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    JD
                </div>
            </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Welcome / Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Score Card */}
                    <div className="col-span-1 md:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                            <BarChart3 className="w-48 h-48 text-primary" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Match Score</h2>
                                <p className="text-neutral-400">Based on "Full Stack Developer" market demand</p>
                            </div>
                            <div className="flex items-end gap-4 mt-8">
                                <span className="text-7xl font-bold tracking-tighter">72<span className="text-3xl text-neutral-500 font-normal">%</span></span>
                                <div className="mb-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium flex items-center gap-1">
                                    <ArrowUpRight className="w-4 h-4" /> +12% this week
                                </div>
                            </div>
                            <div className="mt-6 h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "72%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-primary rounded-full relative"
                                >
                                    <div className="absolute top-0 right-0 bottom-0 w-[100px] bg-gradient-to-r from-transparent to-white/20" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                             <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
                                <Cpu className="w-5 h-5" />
                             </div>
                             <h3 className="text-lg font-semibold mb-2">AI Advisor</h3>
                             <p className="text-sm text-neutral-400 leading-relaxed">
                                You are missing <span className="text-white font-medium">Docker</span> and <span className="text-white font-medium">AWS</span> experience. 
                                Building a containerized microservice would boost your score by ~15%.
                             </p>
                        </div>
                        <button className="group relative w-full mt-6 py-3 bg-white text-black font-semibold rounded-lg overflow-hidden transition-transform active:scale-95">
                            <ButtonBeam />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Generate Project Spec <ArrowUpRight className="w-4 h-4" />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Missing Skills Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Critical Skill Gaps</h3>
                            <button className="text-sm text-neutral-400 hover:text-white">View All</button>
                        </div>
                        
                        <div className="space-y-3">
                            {[
                                { name: "Docker", priority: "High", frequency: "68% of jobs", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
                                { name: "AWS / Cloud", priority: "Medium", frequency: "55% of jobs", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                                { name: "CI/CD Pipelines", priority: "Medium", frequency: "42% of jobs", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
                            ].map((skill, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-white/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${skill.color.replace('text', 'bg')}`} />
                                        <div>
                                            <div className="font-medium text-white group-hover:text-primary transition-colors">{skill.name}</div>
                                            <div className="text-xs text-neutral-500">Appears in {skill.frequency}</div>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded text-xs font-medium border ${skill.bg} ${skill.border} ${skill.color}`}>
                                        {skill.priority} Priority
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Projects */}
                        <div className="pt-6">
                             <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Recommended Projects</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-[#0A0A0A] border border-white/10 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 rounded bg-neutral-900 border border-white/5">
                                            <LayoutDashboard className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="text-xs font-mono text-emerald-500">+15% Score</div>
                                    </div>
                                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">Microservice Task Manager</h4>
                                    <p className="text-xs text-neutral-500 mb-4 line-clamp-2">Build a task API using Express and Docker, deploy to ECS.</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-400">Docker</span>
                                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-400">AWS</span>
                                    </div>
                                </div>
                                <div className="p-5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <Plus className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-300">Generate New Project</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Trends Column */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Trending Now</h3>
                            <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                        </div>
                        
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 space-y-4">
                            {[
                                { name: "Next.js", change: "+14%", isUp: true },
                                { name: "Tailwind CSS", change: "+8%", isUp: true },
                                { name: "Redux", change: "-5%", isUp: false },
                                { name: "Supabase", change: "+22%", isUp: true },
                            ].map((trend, i) => (
                                <div key={i} className="flex items-center justify-between py-1">
                                    <span className="text-sm text-neutral-300">{trend.name}</span>
                                    <span className={`text-xs font-mono ${trend.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {trend.change}
                                    </span>
                                </div>
                            ))}
                        </div>

                         <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 relative overflow-hidden">
                             <div className="relative z-10">
                                <h4 className="font-semibold text-primary mb-2">Upgrade to Pro</h4>
                                <p className="text-xs text-neutral-300 mb-4">
                                    Get unlimited AI project generation and resume deep-scans.
                                </p>
                                <button className="w-full py-2 bg-primary text-black text-xs font-bold rounded hover:bg-emerald-400 transition-colors">
                                    Upgrade Plan
                                </button>
                             </div>
                         </div>
                    </div>

                </div>
            </div>
        </div>
      </main>
    </div>
  );
};