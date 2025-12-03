'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Briefcase, Building, Users, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?q=${encodeURIComponent(searchQuery)}&type=${jobType}`;
    }
  };

  const stats = [
    { number: '10,000+', label: 'Active Jobs' },
    { number: '5,000+', label: 'Institutes' },
    { number: '50,000+', label: 'Job Seekers' },
    { number: '95%', label: 'Success Rate' }
  ];

  const categories = [
    { icon: <Briefcase className="h-6 w-6" />, title: 'Teaching Jobs', count: '2,500+' },
    { icon: <Building className="h-6 w-6" />, title: 'Administration', count: '1,200+' },
    { icon: <Users className="h-6 w-6" />, title: 'Counseling', count: '800+' },
    { icon: <TrendingUp className="h-6 w-6" />, title: 'Management', count: '1,500+' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-200/30 bg-[size:20px_20px]"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Content */}
          <div className="text-center lg:text-left lg:flex items-center justify-between gap-12">
            
            {/* Left Side - Text */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>India's #1 Education Job Portal</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find Your Dream{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Teaching Job
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Connect with top schools, colleges, and coaching institutes. 
                Thousands of teaching and administrative positions waiting for you.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-700">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/signup?type=job_seeker" 
                  className="btn-primary flex items-center justify-center"
                >
                  Find Jobs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/signup?type=institute" 
                  className="btn-secondary flex items-center justify-center"
                >
                  Post Jobs Free <Briefcase className="ml-2 h-5 w-5" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Verified Institutes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Secure Apply</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Free Registration</span>
                </div>
              </div>
            </div>

            {/* Right Side - Search Box */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Perfect Job</h3>
                <p className="text-gray-600 mb-6">Search from 10,000+ teaching positions</p>
                
                <form onSubmit={handleSearch}>
                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, keywords, or institute name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type
                      </label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="all">All Types</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="remote">Remote</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        <option value="">Select Location</option>
                        <option value="delhi">Delhi NCR</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="bangalore">Bangalore</option>
                        <option value="hyderabad">Hyderabad</option>
                        <option value="chennai">Chennai</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary py-4 text-lg font-semibold"
                  >
                    Search Jobs
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Math Teacher', 'Science Faculty', 'Principal', 'Vice Principal', 
                      'Counsellor', 'Administrator', 'Online Tutor'].map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Categories */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/jobs/category/${category.title.toLowerCase().replace(' ', '-')}`}
                  className="group card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                      <div className="text-sm text-gray-500">Jobs</div>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                    {category.title}
                  </h3>
                  <div className="mt-2 flex items-center text-primary-600 group-hover:text-primary-700">
                    <span className="text-sm">View Jobs</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;