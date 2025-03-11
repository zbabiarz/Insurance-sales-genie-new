import { ArrowUpRight, Check } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-teal-100 opacity-70" />

      <div className="relative pt-12 pb-16">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              Insurance{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                Sales Genie
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              The intelligent SaaS platform that empowers insurance brokers with
              AI-driven tools to streamline client matching, improve sales
              conversations, and access instant product information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="inline-flex items-center px-8 py-4 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors text-lg font-medium">
                Get Started Free
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </button>

              <button className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium">
                View Pricing
              </button>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-500" />
                <span>AI-powered client matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-500" />
                <span>Sales call analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-500" />
                <span>Intelligent chatbot assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
