'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Briefcase, User, Search, Home, 
  Building, MessageSquare, LogOut, ChevronDown,
  Users, LayoutDashboard, Phone, Mail, HelpCircle,
  FileText, Star, Globe, BookOpen
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    message: '',
    rating: 0
  });
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Navigation links
  const mainLinks = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/jobs', label: 'Jobs', icon: <Briefcase className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/career advice', label: 'Career Advice', icon: <Building className="h-4 w-4 md:h-5 md:w-5" /> },
    { href: '/teachers', label: 'Teachers', icon: <Users className="h-4 w-4 md:h-5 md:w-5" /> },
  ];

  const mobileExtraLinks = [
    { href: '/resources', label: 'Resources', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/blog', label: 'Blog', icon: <Globe className="h-5 w-5" /> },
    { href: '/help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-gray-900">Creative Jobs</span>
                <span className="text-[10px] text-gray-500 hidden md:block">Teaching Jobs</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.icon}
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Search className="h-4 w-4" />
              </button>

              {/* Feedback Button */}
              <button
                onClick={() => setShowFeedback(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Feedback</span>
              </button>

              {/* User Actions */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left max-w-[120px]">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-[10px] text-gray-500">Dashboard</p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500 ml-1" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard className="h-3 w-3" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-3 w-3" />
                      <span>Profile</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-sm hover:shadow transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center space-x-2">
              {!user && (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-blue-600 font-medium"
                >
                  Login
                </Link>
              )}
              
              <button
                className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-blue-600" />
                ) : (
                  <Menu className="h-5 w-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
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
          <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-900">Creative Jobs</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              {user ? (
                <div className="flex items-center space-x-2 p-2.5 bg-gray-50 rounded-lg">
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
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-3 py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-3 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100%-160px)] overflow-y-auto pb-4">
              <div className="p-4">
                {/* Feedback Button */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setShowFeedback(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-500 rounded group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Give Feedback</span>
                    </div>
                  </button>
                </div>

                {/* Main Links */}
                <div className="space-y-0.5 mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                    Navigation
                  </h3>
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        pathname === link.href
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded ${
                        pathname === link.href ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Extra Links */}
                <div className="space-y-0.5 mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                    More
                  </h3>
                  {mobileExtraLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-1.5 bg-gray-100 rounded">
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Dashboard Links (if logged in) */}
                {user && (
                  <div className="space-y-0.5 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                      Account
                    </h3>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-1.5 bg-blue-100 rounded">
                        <LayoutDashboard className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-1.5 bg-purple-100 rounded">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2.5 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
                    >
                      <div className="p-1.5 bg-red-100 rounded">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}

                {/* Contact Info */}
                <div className="p-3 mt-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Contact Us</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>help@edujobs.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
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
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({...feedback, rating: star})}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
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
                    placeholder="Share your thoughts or suggestions..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-28"
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}