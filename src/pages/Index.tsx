import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Philosophy from "@/components/Philosophy";
import HowItWorks from "@/components/HowItWorks";
import Engines from "@/components/Engines";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Philosophy />
      <HowItWorks />
      <Engines />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
