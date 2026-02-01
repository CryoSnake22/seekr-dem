"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "@/components/ui/Icon";
import type { ResumeParseResponse } from "@/lib/types/backend";

export default function ResumeUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ResumeParseResponse | null>(
    null,
  );
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const parsed = parseResult?.parsed_data;
  const experience = parsed?.experience ?? [];
  const education = parsed?.education ?? [];
  const skills = parsed?.skills ?? [];
  const projects = parsed?.projects ?? [];

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
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/msword" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        handleFileChange(droppedFile);
      } else {
        setError("Please upload a PDF or DOC file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setParsing(true);
    setError(null);

    try {
      const response = await fetch("/api/backend/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
      } else if (result.data) {
        const data: ResumeParseResponse = result.data;
        setParseResult(data);
        if (data.status !== "completed") {
          setError(data.error || "Resume parsing did not complete");
        }
      }
    } catch (err) {
      setError("Failed to parse resume");
    } finally {
      setParsing(false);
    }
  };

  const handleApply = async () => {
    if (!parseResult?.parse_id) return;

    setApplying(true);
    setError(null);

    try {
      const response = await fetch("/api/backend/resume/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parse_id: parseResult.parse_id,
          confirm: true,
          options: {
            merge_education: true,
            merge_experience: true,
            merge_skills: true,
            merge_projects: true,
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
      } else if (result.data?.applied) {
        // Success - close dialog and refresh page
        setOpen(false);
        setFile(null);
        setParseResult(null);
        router.refresh();
      }
    } catch (err) {
      setError("Failed to apply resume data");
    } finally {
      setApplying(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setParseResult(null);
    setError(null);
  };

  return (
    <>
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-neutral-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Automatically extract your education, experience, skills, and
              projects from your resume.
            </p>
            <Button
              onClick={() => setOpen(true)}
              size="lg"
              className="bg-white text-black hover:bg-neutral-200"
            >
              <Upload className="w-4 h-4" />
              Upload Resume
            </Button>
          </div>
        </div>

        {error && !open && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              Upload your resume to automatically populate your profile with
              education, experience, skills, and projects.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Section */}
            {!parseResult && (
              <>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"}
                    ${file ? "bg-primary/10 border-primary/40" : ""}
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
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-neutral-400" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-xs text-neutral-500">
                          PDF, DOC, DOCX (Max 10MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-10 h-10 mx-auto text-primary" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || parsing}
                    className="flex-1"
                  >
                    {parsing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Parsing...
                      </>
                    ) : (
                      "Parse Resume"
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Preview Section */}
            {parseResult && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Parsed Data Preview
                    </h3>
                    <Button onClick={resetUpload} variant="ghost" size="sm">
                      Upload Different File
                    </Button>
                  </div>

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-400 mb-2">
                        Experience ({experience.length})
                      </p>
                      <div className="space-y-2">
                        {experience.slice(0, 2).map((exp, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white/5 rounded-lg text-xs"
                          >
                            <p className="font-medium text-white">{exp.role}</p>
                            <p className="text-neutral-400">{exp.company}</p>
                          </div>
                        ))}
                        {experience.length > 2 && (
                          <p className="text-xs text-neutral-500">
                            +{experience.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-400 mb-2">
                        Education ({education.length})
                      </p>
                      <div className="space-y-2">
                        {education.map((edu, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white/5 rounded-lg text-xs"
                          >
                            <p className="font-medium text-white">
                              {edu.degree || "Degree"}
                            </p>
                            <p className="text-neutral-400">{edu.university}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-400 mb-2">
                        Skills ({skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 8).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs border border-primary/20"
                          >
                            {skill.skill_name}
                          </span>
                        ))}
                        {skills.length > 8 && (
                          <span className="px-2 py-0.5 bg-white/5 text-neutral-400 rounded-full text-xs">
                            +{skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-400 mb-2">
                        Projects ({projects.length})
                      </p>
                      <div className="space-y-2">
                        {projects.slice(0, 2).map((project, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white/5 rounded-lg text-xs"
                          >
                            <p className="font-medium text-white">
                              {project.title}
                            </p>
                          </div>
                        ))}
                        {projects.length > 2 && (
                          <p className="text-xs text-neutral-500">
                            +{projects.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1"
                  >
                    {applying ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Applying...
                      </>
                    ) : (
                      "Add to Profile"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-neutral-500 text-center">
                  This will add the parsed data to your profile without
                  overwriting existing entries
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
