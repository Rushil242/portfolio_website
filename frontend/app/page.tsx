import Hero from "@/components/sections/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import DemoTabs from "@/components/sections/DemoTabs"; // <--- Crucial Import

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      
      {/* This lists your 5 agents */}
      <BentoGrid />
      
      {/* This is the interactive playground you were missing */}
      <DemoTabs /> 
    </main>
  );
}