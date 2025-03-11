import {
  ArrowUpRight,
  CheckCircle2,
  BrainCircuit,
  ClipboardCheck,
  LineChart,
  MessageSquareText,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <div className="py-12 bg-white p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Intelligent Tools for Insurance Brokers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform helps independent insurance brokers
            streamline client matching, improve sales conversations, and access
            instant product information.
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
    </div>
  );
}
