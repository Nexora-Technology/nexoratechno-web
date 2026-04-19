import { Hero, Marquee, Services, Process, Models, TechStack, Stats, Clients, Testimonials, About, Contact } from '@/components/sections';

export default function HomePage() {
  return (
    <main className="pt-16">
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Models />
      <TechStack />
      <Stats />
      <Clients />
      <Testimonials />
      <About />
      <Contact />
    </main>
  );
}
