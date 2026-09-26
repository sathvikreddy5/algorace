import { Activity, BookOpen, GitBranch, Moon } from "lucide-react";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0d10] px-4 md:px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
          <Activity size={19} />
        </div>

        <div>
          <h1 className="text-sm font-semibold tracking-wide">AlgoRace</h1>

          <p className="hidden text-[11px] text-zinc-500 sm:block">
            Algorithm execution visualizer
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden items-center gap-6 md:flex">
        <button
          type="button"
          className="text-sm text-zinc-300 transition hover:text-white"
        >
          Visualizer
        </button>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <BookOpen size={15} />
          Docs
        </button>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <GitBranch size={15} />
          GitHub
        </button>
      </nav>

      {/* Theme */}
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-white/20 hover:text-white"
      >
        <Moon size={17} />
      </button>
    </header>
  );
}

export default Header;
