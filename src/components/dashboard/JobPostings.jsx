'use client';

import { Briefcase, Calendar, MapPin, Users, Plus } from 'lucide-react';

export default function JobPostings({ jobs, onPostJob }) {
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Job Postings</h2>
        <button
          onClick={onPostJob}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </button>
      </div>

      {recentJobs.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
          <button
            onClick={onPostJob}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Your First Job Posting
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location || 'Remote'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {job.createdAt?.toLocaleDateString() || 'Recently'}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applications || 0} applications
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status || 'draft'}
                </span>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium">
                  View Applicants
                </button>
              </div>
            </div>
          ))}
          
          {jobs.length > 3 && (
            <div className="text-center pt-4">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Jobs ({jobs.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}