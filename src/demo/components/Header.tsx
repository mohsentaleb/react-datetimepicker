import ResponsivenessDebugger from './ResponsivnessDebugger';
import ThemeToggler from './ThemeToggler';

export default function Header() {
  return (
    <div className="relative bg-slate-900 py-4">
      <ResponsivenessDebugger />
      <div className="mx-auto flex max-w-7xl justify-between px-2 text-2xl font-bold text-white sm:px-6 lg:px-8">
        <span>React TailwindCSS Date &amp; Time Picker Demo</span>
        <div className="flex items-center">
          <ThemeToggler />
          <a href="https://github.com/mohsentaleb/react-tailwindcss-datetimepicker" title="Github">
            <img
              src="https://raw.githubusercontent.com/mohsentaleb/react-tailwindcss-datetimepicker/master/public/github.svg"
              alt="Github"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
