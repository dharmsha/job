// components/JobSearch.jsx
'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign, X } from 'lucide-react';

const JobSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    remote: false,
    urgent: false
  });

  const jobTypes = ['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'];
  const experienceLevels = ['Fresher', '0-2 years', '2-5 years', '5-10 years', '10+ years'];

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      salaryMin: '',
      salaryMax: '',
      experience: '',
      remote: false,
      urgent: false
    });
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Find Your Dream Job</h2>
        <p className="text-gray-600">Search from thousands of opportunities</p>
      </div>

      {/* Main Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={filters.keyword}
          onChange={(e) => setFilters({...filters, keyword: e.target.value})}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            placeholder="City or state"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Briefcase className="h-4 w-4 mr-1" />
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({...filters, experience: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Any Experience</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Salary Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryMin}
              onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryMax}
              onChange={(e) => setFilters({...filters, salaryMax: e.target.value})}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Checkbox Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => setFilters({...filters, remote: e.target.checked})}
            className="h-4 w-4 text-primary-600"
          />
          <span className="ml-2">Remote Jobs Only</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.urgent}
            onChange={(e) => setFilters({...filters, urgent: e.target.checked})}
            className="h-4 w-4 text-primary-600"
          />
          <span className="ml-2">Urgent Hiring</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSearch}
          className="flex-1 btn-primary py-4 text-lg"
        >
          Search Jobs
        </button>
        
        <button
          onClick={clearFilters}
          className="px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
        >
          <X className="h-5 w-5 mr-2" />
          Clear
        </button>
      </div>

      {/* Popular Searches */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-3">Popular Searches:</p>
        <div className="flex flex-wrap gap-2">
          {['Mathematics Teacher', 'Science Faculty', 'School Principal', 
            'Online Tutor', 'Administrator', 'Counselor'].map((term) => (
            <button
              key={term}
              onClick={() => setFilters({...filters, keyword: term})}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};