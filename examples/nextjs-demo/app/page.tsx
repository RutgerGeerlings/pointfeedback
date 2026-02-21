"use client";

import HeroSection from "./components/HeroSection";
import TryItBanner from "./components/TryItBanner";
import FeaturesGrid from "./components/FeaturesGrid";
import LiveDemoSection from "./components/LiveDemoSection";
import CodeExamples from "./components/CodeExamples";
import StorageTable from "./components/StorageTable";
import UseCasesSection from "./components/UseCasesSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <TryItBanner />
      <HeroSection />
      <FeaturesGrid />
      <LiveDemoSection />
      <CodeExamples />
      <StorageTable />
      <UseCasesSection />
      <Footer />
    </>
  );
}
