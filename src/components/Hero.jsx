'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Briefcase, Building, Users, ArrowRight, 
  MapPin, Clock, TrendingUp, GraduationCap, Award,
  BookOpen, Target, Zap, Globe, Star, Sparkles,
  ChevronRight, Shield, Heart, DollarSign, User,
  CheckCircle, Menu, X
} from 'lucide-react';

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (jobType !== 'all') params.append('type', jobType);
      if (location.trim()) params.append('location', location.trim());
      
      router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const stats = [
    { number: '10,000+', label: 'Active Jobs', icon: Briefcase },
    { number: '5,000+', label: 'Institutes', icon: Building },
    { number: '50,000+', label: 'Job Seekers', icon: Users },
    { number: '95%', label: 'Success Rate', icon: TrendingUp }
  ];

  const categories = [
    { icon: BookOpen, title: 'Teaching Jobs', count: '2,500+', color: 'from-blue-500 to-cyan-500' },
    { icon: Building, title: 'Administration', count: '1,200+', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, title: 'Counseling', count: '800+', color: 'from-purple-500 to-pink-500' },
    { icon: Target, title: 'Management', count: '1,500+', color: 'from-orange-500 to-red-500' },
    { icon: GraduationCap, title: 'Research', count: '600+', color: 'from-pink-500 to-rose-500' },
    { icon: Award, title: 'Special Education', count: '400+', color: 'from-indigo-500 to-blue-500' }
  ];

  const features = [
    { icon: Shield, title: 'Verified Institutes', description: '100% verified institutions' },
    { icon: Zap, title: 'Quick Response', description: 'Get responses in 48 hours' },
    { icon: Heart, title: 'Free Forever', description: 'No charges for job seekers' },
    { icon: Star, title: 'Easy Apply', description: 'One-click application' }
  ];

  const popularJobs = [
    { title: 'Math Teacher', location: 'Delhi', salary: '₹35K - ₹45K', type: 'Full Time' },
    { title: 'Science Faculty', location: 'Mumbai', salary: '₹40K - ₹50K', type: 'Full Time' },
    { title: 'School Principal', location: 'Bangalore', salary: '₹80K - ₹1L', type: 'Full Time' },
    { title: 'Online Tutor', location: 'Remote', salary: '₹25K - ₹35K', type: 'Part Time' },
  ];

  const trendingRoles = [
    'Math Teacher', 'Science Faculty', 'Principal', 'Vice Principal', 
    'Counsellor', 'Administrator', 'Online Tutor', 'PGT', 'TGT', 'Nursery Teacher'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-purple-400/20 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-pink-400/20 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  India's #1 Education Job Portal
                </span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-white">Find Your Dream </span>
                  <span className="relative">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      Teaching Job
                    </span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-md -z-10"></span>
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Connect with <span className="text-white font-semibold">5,000+</span> verified schools, colleges, and coaching institutes. 
                  Discover opportunities that match your skills and aspirations.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="group p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login?type=job_seeker" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center justify-center overflow-hidden"
                >
                  <span className="relative z-10">Find Teaching Jobs</span>
                  <ArrowRight className="relative z-10 ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link 
                  href="/login?type=institute" 
                  className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-white/10 hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Briefcase className="mr-3 h-5 w-5 text-blue-400" />
                  <span>Hire Educators</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                        <Icon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{feature.title}</div>
                        <div className="text-xs text-gray-400">{feature.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Search Card */}
            <div className="lg:pl-8">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-white/20 p-6 md:p-8">
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-xl animate-bounce">
                  
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Find Your Perfect Match
                </h3>
                <p className="text-gray-400 mb-6">
                  Search from 10,000+ verified teaching positions
                </p>
                
                <form onSubmit={handleSearch} className="space-y-5">
                  {/* Main Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, subject, or institute name"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Briefcase className="inline h-4 w-4 mr-2 text-blue-400" />
                        Job Type
                      </label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-white"
                      >
                        <option value="all" className="bg-gray-900">All Types</option>
                        <option value="full-time" className="bg-gray-900">Full Time</option>
                        <option value="part-time" className="bg-gray-900">Part Time</option>
                        <option value="contract" className="bg-gray-900">Contract</option>
                        <option value="remote" className="bg-gray-900">Remote/WFH</option>
                      </select>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2 text-blue-400" />
                        Location
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-white"
                      >
                        <option value="" className="bg-gray-900">Anywhere</option>
                        <option value="delhi" className="bg-gray-900">Delhi NCR</option>
                        <option value="mumbai" className="bg-gray-900">Mumbai</option>
                        <option value="bangalore" className="bg-gray-900">Bangalore</option>
                        <option value="hyderabad" className="bg-gray-900">Hyderabad</option>
                        <option value="chennai" className="bg-gray-900">Chennai</option>
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Award className="inline h-4 w-4 mr-2 text-blue-400" />
                        Experience
                      </label>
                      <select className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-white">
                        <option value="" className="bg-gray-900">Any Experience</option>
                        <option value="fresher" className="bg-gray-900">Fresher</option>
                        <option value="1-3" className="bg-gray-900">1-3 Years</option>
                        <option value="3-5" className="bg-gray-900">3-5 Years</option>
                        <option value="5+" className="bg-gray-900">5+ Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-3 h-5 w-5" />
                        Search Jobs
                      </>
                    )}
                  </button>
                </form>

                {/* Popular Searches */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
                    Trending Searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingRoles.slice(0, 6).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(tag);
                          setTimeout(() => {
                            document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                          }, 100);
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center group"
                      >
                        <span>{tag}</span>
                        <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Jobs Preview */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularJobs.slice(0, 2).map((job, index) => (
                  <div 
                    key={index}
                    className="group bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push('/jobs')}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{job.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-400">{job.salary}</div>
                        <div className="text-xs text-gray-500 mt-1">{job.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Categories Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Explore Teaching Categories
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Find opportunities across various education domains and specializations
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={index}
                    href={`/jobs?category=${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {category.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400">{category.count} jobs</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-10">
              <Link 
                href="/jobs" 
                className="inline-flex items-center px-6 py-3 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
              >
                View All Categories
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24 bg-gradient-to-r from-white/5 via-white/5 to-transparent backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Get your dream teaching job in just 4 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: '01', title: 'Create Profile', desc: 'Sign up and complete your profile', icon: '👤' },
                { number: '02', title: 'Search Jobs', desc: 'Browse through verified positions', icon: '🔍' },
                { number: '03', title: 'Apply', desc: 'Apply with one click using your profile', icon: '🚀' },
                { number: '04', title: 'Get Hired', desc: 'Connect with institutes and get selected', icon: '🎉' },
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="text-4xl mb-4 filter drop-shadow-lg">{step.icon}</div>
                    <div className="text-sm font-semibold text-blue-400 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ChevronRight className="h-8 w-8 text-white/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;