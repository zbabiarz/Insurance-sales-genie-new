import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ArrowUpRight,
  CheckCircle2,
  BrainCircuit,
  ClipboardCheck,
  LineChart,
  MessageSquareText,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Intelligent Tools for Insurance Brokers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform helps independent insurance brokers
              streamline client matching, improve sales conversations, and
              access instant product information.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: "Client Intake & Matching",
                description:
                  "Multi-step form with health condition filtering that instantly displays qualifying insurance plans in a sortable table format.",
              },
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                title: "AI Chatbot Assistant",
                description:
                  "Get real-time product information and client-specific recommendations through our intuitive chat interface.",
              },
              {
                icon: <MessageSquareText className="w-6 h-6" />,
                title: "Sales Call Analyzer",
                description:
                  "Upload call recordings to receive AI-powered feedback highlighting strengths and improvement areas.",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Performance Dashboard",
                description:
                  "Track your sales metrics, client conversions, and business growth with our intuitive analytics.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Plan Comparison",
                description:
                  "Side-by-side comparison of insurance plans to help clients make informed decisions quickly.",
              },
              {
                icon: <ArrowUpRight className="w-6 h-6" />,
                title: "Mobile Friendly",
                description:
                  "Access all features on any device with our responsive design and persistent navigation.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-teal-100"
              >
                <div className="text-teal-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
