'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Briefcase, User, Search, Home, 
  Building, MessageSquare, LogOut, ChevronDown,
  Users, LayoutDashboard, FileText, Globe, BookOpen, 
  Lightbulb, MessageCircle, Bell, Settings, UserPlus,
  GraduationCap, Award
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    message: '',
    rating: 0
  });
  
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect - FIXED
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    const phoneNumber = '917079948109';
    const message = 'Hi! I need help with ClassDoor Jobs';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.message.trim()) {
      alert('Please enter your feedback');
      return;
    }
    
    try {
      console.log('Feedback submitted:', feedback);
      alert('Thank you for your feedback!');
      setFeedback({ message: '', rating: 0 });
      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // SAME LINKS FOR BOTH DESKTOP & MOBILE
  const mainLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/jobs', label: 'Jobs', icon: <Briefcase className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/career-advice', label: 'Career Advice', icon: <Lightbulb className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/teachers', label: 'Teachers', icon: <Users className="h-4 w-4 md:h-5 md:w-5" /> },
   
  ];

  // User dashboard links
  const userDashboardLinks = user ? [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },

  ] : [];

  // If loading, show minimal navbar
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Creative Jobs</span>
            </Link>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Main Navbar - FIXED POSITION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo - Left Side */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ClassDoor</span>
              </Link>
              
              {/* Desktop Navigation - SAME LINKS */}
              <div className="hidden md:flex items-center space-x-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions - SAME FOR BOTH */}
            <div className="flex items-center space-x-3">
              
              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                
                <button
                  onClick={() => setShowFeedback(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback</span>
                </button>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName?.split(' ')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                  </button>
                  
                  {/* Dropdown Menu - SAME LINKS AS MOBILE */}
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {/* Quick Actions */}
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    {/* Dashboard Links */}
                    {userDashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {link.icon}
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    {/* Action Buttons in Dropdown */}
                    <div className="px-4 py-2 space-y-2">
                      <button
                        onClick={handleWhatsAppClick}
                        className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 text-sm font-medium"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp Help</span>
                      </button>
                      
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="flex items-center justify-center space-x-2 w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Give Feedback</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button
                      onClick={logout}
                      className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="hidden md:block px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-sm hover:shadow"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - SAME CONTENT AS DESKTOP */}
        <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}>
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-40' : 'opacity-0'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">ClassDoor Jobs</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* User Info / Login */}
              {user ? (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100%-160px)] overflow-y-auto">
              <div className="p-4">
                
                {/* Main Navigation Links - SAME AS DESKTOP */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                    Navigation
                  </h3>
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${
                        pathname === link.href
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded ${
                        pathname === link.href ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Action Buttons - SAME AS DESKTOP */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleWhatsAppClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex flex-col items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg hover:from-green-100 hover:to-emerald-100"
                    >
                      <MessageCircle className="h-5 w-5 text-green-600 mb-1" />
                      <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowFeedback(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex flex-col items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg hover:from-blue-100 hover:to-indigo-100"
                    >
                      <MessageSquare className="h-5 w-5 text-blue-600 mb-1" />
                      <span className="text-xs font-medium text-gray-700">Feedback</span>
                    </button>
                  </div>
                </div>

                {/* User Dashboard Links - SAME AS DESKTOP DROPDOWN */}
                {user && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                      My Account
                    </h3>
                    <div className="space-y-1">
                      {userDashboardLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          <div className="p-2 bg-gray-100 rounded">
                            {link.icon}
                          </div>
                          <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                      ))}
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg"
                      >
                        <div className="p-2 bg-red-100 rounded">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* For Non-Users - Sign Up CTA */}
                {!user && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Join Creative Jobs</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Create account to apply for jobs and track applications
                    </p>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium"
                    >
                      Create Free Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Feedback Modal - SAME FOR BOTH */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Share Feedback</h3>
                  <p className="text-sm text-gray-600">Help us improve Creative Jobs</p>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                {/* Rating Stars */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate us?
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({...feedback, rating: star})}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                          star <= feedback.rating
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {star}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback.message}
                    onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                    placeholder="What can we improve? What do you like?"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to main content to prevent navbar overlap */}
      <div className="pt-16"></div>
    </>
  );
}