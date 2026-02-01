'use client';

import { X } from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { AIChat } from './AIChat';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
}

export default function ChatPanel({ open, onClose, accessToken }: ChatPanelProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0A0A0A] border-l border-white/10 z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold">AI Career Advisor</h2>
              <p className="text-sm text-neutral-400">
                Ask follow-up questions about your recommendations
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden p-6">
            <AIChat accessToken={accessToken} />
          </div>
        </div>
      </div>
    </>
  );
}
