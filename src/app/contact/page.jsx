'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, MessageSquare, Clock, User,
  Mail as MailIcon, Send, CheckCircle, X, HelpCircle,
  PhoneCall, MessageCircle, Building, Globe, Users,
  ArrowRight, Sparkles, Shield, Zap, Star, Heart,
  ChevronRight, ExternalLink, Calendar, Video
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '919876543210';
    const message = `Hi Creative Jobs Team! I need help with: ${formData.subject || 'General Inquiry'}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+919876543210', '_self');
  };

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'teacher', label: 'Teacher Support', icon: '👩‍🏫' },
    { value: 'school', label: 'School Partnership', icon: '🏫' },
    { value: 'technical', label: 'Technical Support', icon: '🛠️' },
    { value: 'billing', label: 'Billing & Payments', icon: '💰' },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: '🌟' },
  ];

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "We typically respond within 2-4 hours during business hours (9 AM - 7 PM IST). For urgent matters, use WhatsApp for instant response.",
      category: "general"
    },
    {
      question: "Can I get help with my resume?",
      answer: "Yes! Our career experts provide free resume reviews. Just mention 'Resume Help' in your message and we'll schedule a free consultation.",
      category: "teacher"
    },
    {
      question: "How do schools partner with you?",
      answer: "Schools can sign up for free, post unlimited jobs, and access our verified teacher database. Contact us for bulk hiring solutions.",
      category: "school"
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely! We use bank-level encryption and never share your data with third parties without consent.",
      category: "technical"
    },
    {
      question: "Do you provide interview preparation?",
      answer: "Yes, we offer mock interviews and preparation kits. Premium members get personalized coaching sessions.",
      category: "teacher"
    },
  ];

  const contactMethods = [
    {
      title: "Call Us",
      description: "Speak directly with our team",
      details: "+91 98765 43210",
      icon: <PhoneCall className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      action: handleCallClick,
      note: "Available 9 AM - 7 PM IST"
    },
    {
      title: "WhatsApp",
      description: "Instant chat support",
      details: "+91 98765 43210",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      action: handleWhatsAppClick,
      note: "Usually replies in 5 minutes"
    },
    {
      title: "Email",
      description: "For detailed queries",
      details: "support@creativejobs.com",
      icon: <Mail className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      action: () => window.open('mailto:support@creativejobs.com'),
      note: "Response within 4 hours"
    },
    {
      title: "Office Visit",
      description: "Meet us in person",
      details: "Delhi, Mumbai, Bangalore",
      icon: <Building className="h-6 w-6" />,
      color: "from-amber-500 to-orange-500",
      action: () => window.open('https://maps.google.com'),
      note: "By appointment only"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-indigo-50/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                We're Here to Help!
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Let's Create{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Magic
                </span>
                {' '}Together
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Got questions? Need help? Want to partner? We're just a message away. 
                Our team of education experts is ready to assist you 24/7.
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-blue-200">
                <Clock className="h-5 w-5" />
                <span>Current India Time: {currentTime} IST</span>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300">● Online Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <button
                key={index}
                onClick={method.action}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full text-left">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${method.color}`}>
                      <div className="text-white">{method.icon}</div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {method.note}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  
                  <div className="text-blue-600 font-medium mb-4">{method.details}</div>
                  
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Click to connect</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column - Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Send Us a Message
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Fill the form below and we'll get back to you within hours
                      </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Team Online</span>
                    </div>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Message Sent Successfully! 🎉
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Our team will contact you within 2 hours. Check your email for confirmation.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          What do you need help with?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {categories.map((cat) => (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setFormData({...formData, category: cat.value})}
                              className={`p-3 rounded-xl border-2 transition-all ${
                                formData.category === cat.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Enter your full name"
                            />
                            <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="your.email@example.com"
                            />
                            <MailIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="+91 98765 43210"
                            />
                            <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="What is this regarding?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="5"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Your information is 100% secure</span>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-8 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all duration-300 ${
                            isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                          } text-white`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              <span>Send Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column - Info & Support */}
              <div className="space-y-8">
                {/* Live Support Status */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-gray-900">Live Support Status</span>
                    </div>
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium text-gray-900">Under 5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Agents</span>
                      <span className="font-medium text-green-600">8 Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Wait</span>
                      <span className="font-medium text-gray-900">No Wait</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chat Instantly on WhatsApp</span>
                  </button>
                </div>

                {/* Book Appointment */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Book 1:1 Session</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Schedule a personal consultation with our career experts
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {[
                      { time: "30 min", type: "Career Guidance", icon: "🎯" },
                      { time: "45 min", type: "Resume Review", icon: "📄" },
                      { time: "60 min", type: "Mock Interview", icon: "💼" },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{session.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{session.type}</div>
                            <div className="text-sm text-gray-500">{session.time} session</div>
                          </div>
                        </div>
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href="/book-appointment"
                    className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                  >
                    <Video className="h-5 w-5" />
                    <span>View All Sessions</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Why Trust Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">100% Confidential</div>
                        <div className="text-sm text-gray-500">Your data is encrypted & safe</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Fast Response</div>
                        <div className="text-sm text-gray-500">Average reply time: 2 hours</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Expert Support</div>
                        <div className="text-sm text-gray-500">Education industry specialists</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 text-sm font-medium mb-4">
                <HelpCircle className="h-4 w-4 mr-2" />
                Quick Answers
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions. Can't find what you're looking for? Just ask!
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="group">
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                    className="w-full bg-white rounded-xl p-6 text-left hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <HelpCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                          {faq.question}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {activeFAQ === index ? (
                      <X className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 transform group-hover:rotate-90 transition-transform" />
                    )}
                  </button>
                  {activeFAQ === index && (
                    <div className="bg-blue-50 rounded-b-xl p-6 border-t border-blue-100">
                      <p className="text-gray-700">{faq.answer}</p>
                      {index === 0 && (
                        <button
                          onClick={handleWhatsAppClick}
                          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Click here for instant WhatsApp support
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/help-center"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium group"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit Full Help Center
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-sm font-medium mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                Our Offices
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visit Us{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  In Person
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We have offices across India. Schedule a visit for personalized assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  city: "Delhi",
                  address: "Connaught Place, Central Delhi",
                  phone: "+91 11 1234 5678",
                  hours: "9 AM - 7 PM",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  city: "Mumbai",
                  address: "Bandra Kurla Complex",
                  phone: "+91 22 2345 6789",
                  hours: "9 AM - 7 PM",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  city: "Bangalore",
                  address: "MG Road, Central Bangalore",
                  phone: "+91 80 3456 7890",
                  hours: "9 AM - 7 PM",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((office, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${office.color} flex items-center justify-center text-white text-xl font-bold mb-2`}>
                        {office.city.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{office.city}</h3>
                    </div>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      Directions
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{office.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{office.hours} (Mon-Sat)</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Book Office Visit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Don't hesitate to reach out. We're here to help you succeed in your teaching career journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppClick}
                className="px-8 py-3 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Now
              </button>
              <button
                onClick={handleCallClick}
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                <PhoneCall className="h-5 w-5 mr-2" />
                Call +91 98765 43210
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              Average wait time: <span className="font-bold">2 minutes</span> • Available 24/7 on WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        /* Smooth scroll for FAQ */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom focus styles */
        input:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}