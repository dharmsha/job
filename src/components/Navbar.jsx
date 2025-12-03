'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Briefcase, User, Bell, Search } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-primary-600 font-medium">
              Find Jobs
            </Link>
            <Link href="/institutes" className="text-gray-700 hover:text-primary-600 font-medium">
              For Institutes
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 font-medium">
              Pricing
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <div className="flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-lg">
                    <User className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">Dashboard</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/jobs" className="text-gray-700 hover:text-primary-600">
                Find Jobs
              </Link>
              <Link href="/institutes" className="text-gray-700 hover:text-primary-600">
                For Institutes
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-primary-600">
                Pricing
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link href="/signup" className="text-primary-600 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}