'use client';

import { useState } from 'react';
import InstituteStats from '@/components/dashboard/InstituteStats';

import JobPostings from '@/components/dashboard/JobPostings';
import Applications from '@/components/dashboard/Applications';
import QuickActions from '@/components/dashboard/QuickActions';

export default function InstituteDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Institute Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and applications</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'jobs', 'applications', 'candidates', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 font-medium ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <InstituteStats />
            <JobPostings />
            <Applications />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <QuickActions />
            {/* Other widgets */}
          </div>
        </div>
      </div>
    </div>
  );
}