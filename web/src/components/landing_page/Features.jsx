import { Card, CardContent, CardFooter } from '@/components/ui/card';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Distraction-Free UI',
    description:
      'A minimalist layout that keeps videos and creators front and center.',
  },
  {
    icon: '🕒',
    title: 'Chronological Feed',
    description:
      'No recommendations — just the latest uploads from your chosen channels.',
  },
  {
    icon: '🛡',
    title: 'Privacy First',
    description: 'No tracking or data collection — your attention stays yours.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 w-full bg-gray-500/40 scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Features that protect your attention
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-center opacity-80 text-lg">
          Clear Feed helps you reclaim your time by focusing only on creators
          you actually want to see.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon, title, description }) => (
            <Card key={title} className="bg-[var(--neuter)]">
              <CardContent className="pt-6 px-6">
                <h3 className="font-bold text-lg">
                  {icon} {title}
                </h3>
                <p className="mt-2 text-lg opacity-80">{description}</p>
              </CardContent>
              <CardFooter />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
