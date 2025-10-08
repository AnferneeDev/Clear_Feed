export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 w-full bg-white/40 scroll-mt-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">
          Features that protect your attention
        </h2>
        <p className="mt-2 max-w-2xl mx-auto opacity-80">
          Clear Feed helps you reclaim your time by focusing only on creators
          you actually want to see.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl">🎯 Distraction-Free UI</h3>
            <p className="mt-2 opacity-80">
              A minimalist layout that keeps videos and creators front and
              center.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl">🕒 Chronological Feed</h3>
            <p className="mt-2 opacity-80">
              No recommendations — just the latest uploads from your chosen
              channels.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl">🛡 Privacy First</h3>
            <p className="mt-2 opacity-80">
              No tracking or data collection — your attention stays yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
