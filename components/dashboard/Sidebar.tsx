"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  Code2,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      id: "dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      id: "resume",
      href: "/resume",
      icon: FileText,
      label: "Resume",
    },
    {
      id: "ai-chat",
      href: "/ai-chat",
      icon: MessageSquare,
      label: "AI Chat",
    },
    {
      id: "skills-gap",
      href: "/skills-gap",
      icon: BarChart3,
      label: "Skills Gap",
    },
    { id: "projects", href: "/projects", icon: Code2, label: "AI Projects" },
    { id: "profile", href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="w-60 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-xl">
      <Link
        href="/"
        className="p-5 border-b border-white/5 flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-emerald-900 flex items-center justify-center border border-white/10">
          <span className="font-bold text-white">S</span>
        </div>
        <span className="font-bold text-base tracking-tight">Seekr</span>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
};
