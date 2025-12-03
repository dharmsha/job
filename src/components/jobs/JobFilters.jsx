'use client';

import { useState } from 'react';
import { Filter, DollarSign, Briefcase, MapPin } from 'lucide-react';

export default function JobFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    jobType: 'all',
    experience: 'all',
    salary: 'all',
    location: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Call parent callback if provided
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          Filters
        </h3>
        <button 
          onClick={() => {
            setFilters({
              jobType: 'all',
              experience: 'all',
              salary: 'all',
              location: 'all'
            });
            if (onFilterChange) onFilterChange({});
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      {/* Job Type Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
          Job Type
        </h4>
        <div className="space-y-2">
          {['all', 'full-time', 'part-time', 'remote', 'contract', 'internship'].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="jobType"
                checked={filters.jobType === type}
                onChange={() => handleFilterChange('jobType', type)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-600 capitalize">
                {type === 'all' ? 'All Types' : type.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {['all', 'fresher', '1-3', '3-5', '5+'].map((exp) => (
            <label key={exp} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="experience"
                checked={filters.experience === exp}
                onChange={() => handleFilterChange('experience', exp)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-600">
                {exp === 'all' ? 'All Experience' : 
                 exp === 'fresher' ? 'Fresher (0-1 years)' :
                 exp === '1-3' ? '1-3 years' :
                 exp === '3-5' ? '3-5 years' : '5+ years'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
          Salary Range
        </h4>
        <div className="space-y-2">
          {['all', '20-40', '40-60', '60+'].map((range) => (
            <label key={range} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="salary"
                checked={filters.salary === range}
                onChange={() => handleFilterChange('salary', range)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-600">
                {range === 'all' ? 'All Salaries' : 
                 range === '20-40' ? '₹20K - ₹40K' :
                 range === '40-60' ? '₹40K - ₹60K' : '₹60K+'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          Location
        </h4>
        <div className="space-y-2">
          {['all', 'delhi', 'mumbai', 'bangalore', 'remote'].map((loc) => (
            <label key={loc} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="location"
                checked={filters.location === loc}
                onChange={() => handleFilterChange('location', loc)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-600 capitalize">
                {loc === 'all' ? 'All Locations' : loc}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}