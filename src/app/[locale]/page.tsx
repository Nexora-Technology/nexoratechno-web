import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Hero, Marquee, Services, Process, Models, TechStack, Stats, Clients, Testimonials, About, Contact } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  );
}
