import Link from "next/link";
import { Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-teal-600"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-600 hover:text-teal-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-teal-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Medicare
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Group Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Broker Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} Insurance Sales Genie. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-teal-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-teal-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
