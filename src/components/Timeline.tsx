export default function TimelineDots({
  totalSteps,
  currentStep,
}: {
  totalSteps: number;
  currentStep: number;
}) {
  return (
    <div className="flex  bg-white flex-wrap justify-center items-center mb-8 sm:mb-12 px-4 sm:gap-0">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-base sm:text-lg transition-all duration-300 ${
              index <= currentStep
                ? "bg-[#111] text-white"
                : "bg-black/30 text-white"
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`h-[2px] w-20 sm:w-48 transition-all duration-300 ${
                index < currentStep ? "bg-[#111]" : "bg-[#111]/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
