const WarningNoteForComingSoon = () => {
  return (
    <>
      <div
        class="absolute top-[15%] left-[35%] z-10 w-[280px] p-4 text-center rounded-lg bg-[#ffb703] 
              opacity-0 pointer-events-none transition-all duration-300
              group-hover:opacity-100 group-hover:pointer-events-auto
              drop-shadow-[0_6px_12px_rgba(0,0,0,0.2)]
              
              after:content-[''] after:absolute after:-bottom-2 after:right-12 
              after:w-6 after:h-6 after:bg-[#ffb703] after:rotate-45 
              after:rounded-br after:z-[-1]"
      >
        <div class="flex justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 stroke-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p class="text-[13px] leading-relaxed font-semibold text-gray-900">
          Disabled due to module dependencies. This feature will be available
          after related modules are completed.
        </p>
      </div>
    </>
  );
};

export default WarningNoteForComingSoon;
