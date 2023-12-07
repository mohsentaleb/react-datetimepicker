"use client";

function ResponsivenessDebugger() {
  return (
    <div className="absolute right-2 top-2 text-white">
      <div className="bg-black p-1 rounded">
        <span className="hidden max-sm:block">xs</span>
        <span className="hidden sm:max-md:block">sm</span>
        <span className="hidden md:max-lg:block">md</span>
        <span className="hidden lg:max-xl:block">lg</span>
        <span className="hidden xl:max-2xl:block">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </div>
    </div>
  );
}

export default ResponsivenessDebugger;
