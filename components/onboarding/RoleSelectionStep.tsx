'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoleSelectionStepProps {
  onNext: (selectedRoles: string[]) => void;
  onBack: () => void;
}

const COMMON_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
  'Machine Learning Engineer',
];

export default function RoleSelectionStep({ onNext, onBack }: RoleSelectionStepProps) {
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('skills_market_data')
        .select('job_role')
        .order('job_role');

      if (error) {
        setError('Failed to load available roles');
        // Fallback to common roles
        setAllRoles(COMMON_ROLES);
      } else {
        // Get unique roles
        const uniqueRoles = Array.from(new Set(data.map((row) => row.job_role))).sort();
        setAllRoles(uniqueRoles);
      }
      setLoading(false);
    }

    fetchRoles();
  }, []);

  const toggleRole = (role: string) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(role)) {
      newSelected.delete(role);
    } else {
      if (newSelected.size >= 4) {
        setError('You can select up to 4 roles to start. You can track more later.');
        return;
      }
      newSelected.add(role);
      setError(null);
    }
    setSelectedRoles(newSelected);
  };

  const handleContinue = () => {
    if (selectedRoles.size === 0) {
      setError('Please select at least one role');
      return;
    }
    onNext(Array.from(selectedRoles));
  };

  const filteredRoles = allRoles.filter((role) =>
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show common roles first, then others
  const commonRolesFiltered = filteredRoles.filter((role) => COMMON_ROLES.includes(role));
  const otherRoles = filteredRoles.filter((role) => !COMMON_ROLES.includes(role));
  const displayRoles = [...commonRolesFiltered, ...otherRoles];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Select Your Target Roles</h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Choose 1-4 roles to get personalized match scores and skill gap analysis. You can add more later.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role selection */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-neutral-400">
            Loading roles...
          </div>
        ) : displayRoles.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            No roles found matching "{searchQuery}"
          </div>
        ) : (
          <div className="space-y-2">
            {displayRoles.map((role) => (
              <Label
                key={role}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                  ${selectedRoles.has(role)
                    ? 'bg-primary/20 border border-primary/40'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
              >
                <Checkbox
                  checked={selectedRoles.has(role)}
                  onCheckedChange={() => toggleRole(role)}
                />
                <span className="flex-1 text-sm font-medium text-white">{role}</span>
                {COMMON_ROLES.includes(role) && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </Label>
            ))}
          </div>
        )}
      </div>

      {/* Selection counter */}
      <div className="text-center">
        <p className="text-sm text-neutral-400">
          {selectedRoles.size === 0 ? (
            'Select at least one role'
          ) : (
            <>
              {selectedRoles.size} role{selectedRoles.size !== 1 ? 's' : ''} selected
              {selectedRoles.size < 4 && (
                <span className="text-neutral-500"> (you can select up to 4)</span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-xl border border-red-500/20 text-sm text-center">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedRoles.size === 0}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
