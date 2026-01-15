'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, 
  Phone, MapPin, Heart, Briefcase, Users, Building, Globe,
  MessageCircle, ArrowRight, Check, Send, Download, Award,
  Shield, Star, Zap, Sparkles, PhoneCall, Mail as MailIcon,
  ChevronRight, ExternalLink, Smartphone, Laptop,
  User
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <>
      {/* Pre-Footer CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Ready to Get Started?
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Join 10,000+ Educators & Institutions
              </h2>
              <p className="text-blue-100 max-w-2xl">
                Find your dream teaching job or hire the best talent. 
                Free registration. No hidden charges.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup?type=teacher"
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group shadow-lg"
              >
                <User className="h-5 w-5 mr-2" />
                Find Teaching Jobs
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/signup?type=institute"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
              >
                <Building className="h-5 w-5 mr-2" />
                Post Jobs Free
                <ExternalLink className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Company Info - Enhanced */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Creative Jobs
                  </span>
                  <p className="text-sm text-gray-400">India's #1 Teaching Job Portal</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                We connect passionate educators with reputed educational institutions across India. 
                5000+ successful placements and counting.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">100% Safe & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">Verified Institutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-gray-300">Fast Hiring</span>
                </div>
              </div>

              {/* Social Links - Redesigned */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Follow Us</h4>
                <div className="flex space-x-2">
                  {[
                    { icon: <Facebook className="h-5 w-5" />, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                    { icon: <Twitter className="h-5 w-5" />, label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
                    { icon: <Instagram className="h-5 w-5" />, label: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
                    { icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
                    { icon: <Youtube className="h-5 w-5" />, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`p-2 rounded-lg ${social.color} transition-all duration-300 transform hover:scale-110`}
                      aria-label={social.label}
                      title={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800 flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { href: '/jobs', label: 'Find Jobs', icon: <Briefcase className="h-4 w-4" /> },
                 
                  { href: '/teachers', label: 'Teachers Directory', icon: <Users className="h-4 w-4" /> },
                  { href: '/career-advice', label: 'Career Advice', icon: <Star className="h-4 w-4" /> },
                  { href: '/about', label: 'About Us', icon: <Globe className="h-4 w-4" /> },
                  { href: '/contact', label: 'Contact Us', icon: <MailIcon className="h-4 w-4" /> },
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                    >
                      {link.icon}
                      <span className="ml-2 group-hover:ml-3 transition-all">{link.label}</span>
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Job Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800 flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" />
                Popular Categories
              </h3>
              <ul className="space-y-3">
                {[
                  'Teaching Jobs', 'School Principal', 'Vice Principal', 
                  'Coordinator', 'Counselor', 'Special Educator',
                  'Administration', 'Librarian', 'Sports Teacher',
                  'Computer Teacher', 'Music Teacher', 'Art Teacher'
                ].map((category, index) => (
                  <li key={index}>
                    <Link 
                      href={`/#/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-300 hover:text-white transition-colors flex items-center group"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-sm">{category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800 flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" />
                Stay Connected
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded">
                    <Phone className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <a 
                      href="tel:+917079948109" 
                      className="text-white font-medium hover:text-blue-300 transition-colors"
                    >
                      +91 7079948109
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded">
                    <MailIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Us</p>
                    <a 
                      href="mailto:Classdoorweb@gmail.com" 
                      className="text-white font-medium hover:text-blue-300 transition-colors"
                    >
                      Classdoorweb@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Visit Us</p>
                    <span className="text-white text-sm">
                      Delhi, Mumbai, Bangalore, Hyderabad
                    </span>
                  </div>
                </div>
              </div>

              {/* Newsletter - Improved */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-800">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Send className="h-4 w-4 mr-2 text-blue-400" />
                  Get Job Alerts
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Get latest teaching jobs directly in your inbox
                </p>
                
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  
                  <button 
                    type="submit"
                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                      subscribed 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {subscribed ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* App Download Banner */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Download className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Get Our Mobile App</h3>
                  <p className="text-gray-300">Apply for jobs on the go. Download now!</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 488 512">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Bottom Footer - Improved */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-white font-medium">ClassDoor Jobs</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Made with <Heart className="h-3 w-3 inline mx-1 text-red-500 animate-pulse" /> 
                 CreatorsMind
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/cookies" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/sitemap" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sitemap
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button - Responsive */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {/* Tooltip */}
          {showWhatsAppTooltip && (
            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white rounded-lg shadow-xl animate-fadeIn">
              <div className="text-sm font-medium">Need help? Chat with us!</div>
              <div className="text-xs text-gray-300 mt-1">Usually replies within 5 minutes</div>
              <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          )}
          
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/917079948109"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 group"
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setShowWhatsAppTooltip(true)}
            onMouseLeave={() => setShowWhatsAppTooltip(false)}
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></div>
            </div>
            
            {/* Mobile badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-bounce">
              <span className="block md:hidden">Hi!</span>
              <span className="hidden md:block">Live Chat</span>
            </div>
          </a>
          
          {/* Alternative Contact Buttons (Mobile) */}
         
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 md:bottom-4 left-4 z-40 w-10 h-10 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <svg className="h-5 w-5 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Footer;