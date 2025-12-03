'use client';

import { useState } from 'react';
import JobCard from '@/components/JobCard';
import { Clock, MapPin, IndianRupee } from 'lucide-react';

const FeaturedJobs = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Mathematics Teacher',
      company: 'Delhi Public School',
      location: 'New Delhi',
      salary: '₹35,000 - ₹45,000',
      type: 'Full Time',
      experience: '2-5 years',
      posted: '2 days ago',
      featured: true
    },
    // Add more jobs...
  ]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hand-picked teaching positions from top educational institutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/jobs"
            className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
          >
            View All Jobs
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;