interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
              ${
                step === currentStep
                  ? 'bg-primary text-black'
                  : step < currentStep
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-white/5 text-neutral-500 border border-white/10'
              }
            `}
          >
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < totalSteps && (
            <div
              className={`
                h-0.5 w-12 transition-all
                ${step < currentStep ? 'bg-primary' : 'bg-white/10'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
