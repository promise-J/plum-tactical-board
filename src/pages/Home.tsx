export default function Landing() {
    return (
      <div className="min-h-screen bg-[#f7faf9] text-gray-900">
        {/* NAV */}
        <header className="flex items-center justify-between px-6 md:px-12 py-5">
          <h1 className="text-xl font-bold text-green-600">
            Plum Tactical
          </h1>
  
          <a
            href="/app"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition"
          >
            Open App
          </a>
        </header>
  
        {/* HERO */}
        <section className="px-6 md:px-12 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Visualize. Analyze.{" "}
              <span className="text-green-600">
                Dominate the Game.
              </span>
            </h2>
  
            <p className="mt-5 text-gray-600 max-w-lg">
              A powerful football tactics board for coaches, analysts,
              and players. Create formations, draw plays, and break down
              matches with precision.
            </p>
  
            <div className="mt-8 flex gap-4">
              <a
                href="/app"
                className="rounded-xl bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-500 transition"
              >
                Start Analyzing
              </a>
  
              <a
                href="#features"
                className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 transition"
              >
                Learn More
              </a>
            </div>
          </div>
  
          {/* Mock Board Preview */}
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-xl p-6 overflow-hidden">
  <div className="aspect-video rounded-lg overflow-hidden">
    <img
      src="/board.png" // put image in public/images
      alt="Tactical board preview"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Floating UI hints */}
  <div className="absolute -top-4 -right-4 bg-white shadow-md px-3 py-1 rounded-full text-xs">
    Drag Players
  </div>

  <div className="absolute bottom-4 left-4 bg-white shadow-md px-3 py-1 rounded-full text-xs">
    Draw Arrows
  </div>
</div>
        </section>
  
        {/* FEATURES */}
        <section
          id="features"
          className="px-6 md:px-12 py-20 bg-white border-t"
        >
          <h3 className="text-3xl font-bold text-center">
            Built for Modern Football Analysis
          </h3>
  
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive Tactics Board",
                desc: "Drag, drop, and position players effortlessly on a responsive pitch.",
              },
              {
                title: "Draw & Visualize Plays",
                desc: "Use arrows, lines, and shapes to explain movement and strategy.",
              },
              {
                title: "Team & Player Management",
                desc: "Create teams, assign players, and organize formations easily.",
              },
              {
                title: "Real-time Editing",
                desc: "Instant updates with smooth interactions and rendering.",
              },
              {
                title: "Undo / Redo System",
                desc: "Experiment freely with full control over your actions.",
              },
              {
                title: "Built for Coaches & Analysts",
                desc: "Designed for real match preparation and breakdowns.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <h4 className="font-semibold text-lg">
                  {f.title}
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
  
        {/* CTA */}
        <section className="px-6 md:px-12 py-20 text-center">
          <h3 className="text-3xl font-bold">
            Ready to Elevate Your Game Analysis?
          </h3>
  
          <p className="mt-3 text-gray-600">
            Start building tactics and analyzing matches in seconds.
          </p>
  
          <a
            href="/app"
            className="inline-block mt-6 rounded-xl bg-green-600 px-8 py-3 text-white font-medium hover:bg-green-500 transition"
          >
            Launch Tactical Board
          </a>
        </section>
  
        {/* FOOTER */}
        <footer className="px-6 md:px-12 py-10 border-t text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} Plum Tactical</span>
          <span>Built for football minds ⚽</span>
        </footer>
      </div>
    );
  }