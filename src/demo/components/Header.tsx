export default function Header() {
  return (
    <div className="bg-slate-900 py-4">
      <div className="mx-auto flex max-w-7xl justify-between px-2 text-2xl font-bold text-white sm:px-6 lg:px-8">
        <span>React TailwindCSS Date &amp; Time Picker Demo</span>
        <a
          href="https://github.com/mohsentaleb/react-tailwindcss-datetimepicker"
          title="Github"
        >
          <img src="../../../github.svg" alt="Github" />
        </a>
      </div>
    </div>
  );
}
