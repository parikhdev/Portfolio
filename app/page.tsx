import Masthead from "@/components/Masthead";
import LeadStory from "@/components/LeadStory";
import Projects from "@/components/Projects";
import Vlogs from "@/components/Vlogs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Masthead />
      <LeadStory />
      <Projects />
      <Vlogs />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  );
}