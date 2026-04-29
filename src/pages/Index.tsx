import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import {
  Problem, Urgency, Solution, HowItWorks, Features,
  ValueProp, Market, Competitive, Demo, CTA, Footer
} from "@/components/Sections";

const Index = () => (
  <div className="min-h-screen relative overflow-x-hidden">
    <Navbar />
    <main>
      <Hero />
      <Problem />
      <Urgency />
      <Solution />
      <HowItWorks />
      <Features />
      <ValueProp />
      <Market />
      <Competitive />
      <Demo />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
