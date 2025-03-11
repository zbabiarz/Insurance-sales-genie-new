import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  BrainCircuit,
  ClipboardCheck,
  LineChart,
  MessageSquareText,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

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

      {/* Stats Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">35%</div>
              <div className="text-teal-100">Increase in Client Conversion</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100">Insurance Brokers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15min</div>
              <div className="text-teal-100">Average Time Saved Per Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              How Insurance Sales Genie Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform simplifies the insurance sales process from client
              intake to closing the deal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-teal-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Client Intake</h3>
              <p className="text-gray-600">
                Enter client information and health conditions through our
                intuitive multi-step form.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-teal-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Matching</h3>
              <p className="text-gray-600">
                Our system instantly identifies qualifying insurance plans based
                on client needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-teal-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Close Deals</h3>
              <p className="text-gray-600">
                Use AI-powered insights to guide client conversations and close
                more sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your insurance brokerage. No hidden
              fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              What Insurance Brokers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from brokers who have transformed their business with our
              platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">
                    Independent Health Insurance Broker
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "The client matching system has revolutionized my practice. I'm
                able to find the right plans for clients in minutes instead of
                hours."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">Agency Owner</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI chatbot has become my secret weapon. It helps me answer
                client questions instantly and with confidence."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Jennifer Lee</h4>
                  <p className="text-sm text-gray-500">
                    Life Insurance Specialist
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "The sales call analyzer has helped me identify patterns in my
                conversations and dramatically improved my closing rate."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Insurance Business?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of insurance brokers who are growing their business
            with our AI-powered platform.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
