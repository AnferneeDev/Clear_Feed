import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function TestimonialsSection({ testimonials }) {
  return (
    <section
      id="testimonials"
      className="py-24 w-full bg-white/60 scroll-mt-24"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Built for viewers who value their time
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-[var(--neuter)]">
              <CardContent className="pt-6">
                <p className="text-lg">"{t.quote}"</p>
              </CardContent>
              <CardFooter>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm opacity-70">{t.title}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
