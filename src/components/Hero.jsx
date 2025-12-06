'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Briefcase, Building, Users, ArrowRight, 
  CheckCircle, TrendingUp, MapPin, Clock, DollarSign,
  Star, Award, Shield, BookOpen, GraduationCap, Heart
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
    { number: '10,000+', label: 'Active Jobs', icon: <Briefcase className="h-4 w-4" /> },
    { number: '5,000+', label: 'Institutes', icon: <Building className="h-4 w-4" /> },
    { number: '50,000+', label: 'Job Seekers', icon: <Users className="h-4 w-4" /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const categories = [
    { 
      icon: <BookOpen className="h-7 w-7" />, 
      title: 'Teaching Jobs', 
      count: '2,500+',
      bgColor: 'from-blue-100 to-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      icon: <Building className="h-7 w-7" />, 
      title: 'Administration', 
      count: '1,200+',
      bgColor: 'from-green-100 to-green-50',
      textColor: 'text-green-700'
    },
    { 
      icon: <Users className="h-7 w-7" />, 
      title: 'Counseling', 
      count: '800+',
      bgColor: 'from-purple-100 to-purple-50',
      textColor: 'text-purple-700'
    },
    { 
      icon: <TrendingUp className="h-7 w-7" />, 
      title: 'Management', 
      count: '1,500+',
      bgColor: 'from-orange-100 to-orange-50',
      textColor: 'text-orange-700'
    },
    { 
      icon: <GraduationCap className="h-7 w-7" />, 
      title: 'Research', 
      count: '600+',
      bgColor: 'from-pink-100 to-pink-50',
      textColor: 'text-pink-700'
    },
    { 
      icon: <Award className="h-7 w-7" />, 
      title: 'Special Education', 
      count: '400+',
      bgColor: 'from-indigo-100 to-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Verified Institutes',
      description: 'All institutes are thoroughly verified'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Quick Response',
      description: 'Get responses within 48 hours'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Free Forever',
      description: 'No charges for job seekers'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Easy Apply',
      description: 'One-click application process'
    }
  ];

  const popularJobs = [
    { title: 'Math Teacher', location: 'Delhi', salary: '₹35,000 - ₹45,000', type: 'Full Time' },
    { title: 'Science Faculty', location: 'Mumbai', salary: '₹40,000 - ₹50,000', type: 'Full Time' },
    { title: 'School Principal', location: 'Bangalore', salary: '₹80,000 - ₹1,00,000', type: 'Full Time' },
    { title: 'Online Tutor', location: 'Remote', salary: '₹25,000 - ₹35,000', type: 'Part Time' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Hero Section */}
          <div className="text-center lg:text-left lg:flex items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold mb-6 animate-fade-in">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>India's #1 Education Job Portal</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up">
                Find Your Dream{' '}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                    Teaching Job
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 opacity-50 -z-10"></span>
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Connect with 5,000+ verified schools, colleges, and coaching institutes. 
                Discover opportunities that match your skills and aspirations.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {stat.icon}
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/signup?type=job_seeker" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <span>Find Teaching Jobs</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/signup?type=institute" 
                  className="group px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  <Briefcase className="mr-3 h-5 w-5" />
                  <span>Hire Educators</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm mr-2">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                      <div className="text-xs text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Search Card */}
            <div className="lg:w-1/2">
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 transform transition-all duration-500 hover:shadow-3xl">
                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  🎯 Free Forever
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Match
                </h3>
                <p className="text-gray-600 mb-6">
                  Search from 10,000+ verified teaching positions
                </p>
                
                <form onSubmit={handleSearch}>
                  {/* Main Search */}
                  <div className="relative mb-4">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, subject, or institute name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Briefcase className="inline h-4 w-4 mr-2" />
                        Job Type
                      </label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      >
                        <option value="all">All Types</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="remote">Remote/WFH</option>
                        <option value="visiting">Visiting Faculty</option>
                      </select>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Location
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      >
                        <option value="">Anywhere</option>
                        <option value="delhi">Delhi NCR</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="bangalore">Bangalore</option>
                        <option value="hyderabad">Hyderabad</option>
                        <option value="chennai">Chennai</option>
                        <option value="pune">Pune</option>
                        <option value="kolkata">Kolkata</option>
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Award className="inline h-4 w-4 mr-2" />
                        Experience
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                        <option value="">Any Experience</option>
                        <option value="fresher">Fresher</option>
                        <option value="1-3">1-3 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5+">5+ Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending Searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Math Teacher', 'Science Faculty', 'Principal', 'Vice Principal', 
                      'Counsellor', 'Administrator', 'Online Tutor', 'PGT', 'TGT', 'Nursery Teacher'].map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(tag);
                          document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }}
                        className="group px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
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
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                    onClick={() => router.push('/jobs')}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{job.title}</h4>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{job.salary}</div>
                        <div className="text-xs text-gray-500 mt-1">{job.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Categories Section */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore Teaching Categories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find opportunities across various education domains and specializations
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/jobs?category=${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={category.textColor}>
                        {category.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {category.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{category.count} openings</span>
                        <div className="p-1 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors -z-10"></div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link 
                href="/jobs" 
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get your dream teaching job in just 4 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '01', title: 'Create Profile', desc: 'Sign up and complete your profile with qualifications', icon: '👤' },
                { number: '02', title: 'Search Jobs', desc: 'Browse through verified teaching positions', icon: '🔍' },
                { number: '03', title: 'Apply', desc: 'Apply with one click using your profile', icon: '🚀' },
                { number: '04', title: 'Get Hired', desc: 'Connect with institutes and get selected', icon: '🎉' },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
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