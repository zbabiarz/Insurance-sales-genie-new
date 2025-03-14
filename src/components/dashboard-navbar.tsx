"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Users,
  Phone,
  BrainCircuit,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold text-teal-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
                clipRule="evenodd"
              />
            </svg>
            Insurance Sales Genie{" "}
            <span className="text-xs align-top bg-teal-100 text-teal-800 px-1 py-0.5 rounded-md ml-1 font-medium">
              beta
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard?tab=clients"
            className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </Link>
          <Link
            href="/dashboard?tab=calls"
            className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>Calls</span>
          </Link>
          <Link
            href="/dashboard?tab=ai"
            className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI Assistant</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 w-full"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 w-full"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
