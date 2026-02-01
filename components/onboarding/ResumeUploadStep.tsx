'use client';

import { useState } from 'react';
import type { ResumeParseResponse } from '@/lib/types/backend';
import { Button } from '@/components/ui/button';

interface ResumeUploadStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function ResumeUploadStep({ onNext, onSkip }: ResumeUploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' ||
          droppedFile.type === 'application/msword' ||
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        handleFileChange(droppedFile);
      } else {
        setError('Please upload a PDF or DOC file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setParsing(true);
    setError(null);

    try {
      // Upload and parse resume
      const uploadResponse = await fetch('/api/backend/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.error) {
        setError(uploadResult.error.message);
        setParsing(false);
        return;
      }

      const parseData: ResumeParseResponse = uploadResult.data;

      if (parseData.status !== 'completed') {
        setError(parseData.error || 'Resume parsing did not complete');
        setParsing(false);
        return;
      }

      // Apply parsed data to profile
      const applyResponse = await fetch('/api/backend/resume/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parse_id: parseData.parse_id,
          confirm: true,
          options: {
            merge_education: true,
            merge_experience: true,
            merge_skills: true,
            merge_projects: true,
          },
        }),
      });

      const applyResult = await applyResponse.json();

      if (applyResult.error) {
        setError(applyResult.error.message);
      } else if (applyResult.data?.applied) {
        // Success - move to next step
        onNext();
      }
    } catch (err) {
      setError('Failed to parse resume. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Upload Your Resume</h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          We'll automatically extract your education, experience, skills, and projects to build your profile.
        </p>
      </div>

      {/* Drag-and-drop upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all
          ${dragActive ? 'border-primary bg-primary/5' : 'border-white/20 bg-white/5'}
          ${file ? 'bg-primary/10 border-primary/40' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileChange(selectedFile);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-16 h-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Drop your resume here or click to browse</p>
              <p className="text-xs text-neutral-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Remove file
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onSkip}
          disabled={parsing}
          variant="outline"
          className="flex-1"
        >
          Skip for now
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || parsing}
          className="flex-1"
        >
          {parsing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Parsing...
            </span>
          ) : (
            'Continue'
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-neutral-500">
        Your data is processed securely and never shared with third parties.
      </p>
    </div>
  );
}
