'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Mail, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  User
} from 'lucide-react';

export default function Applications({ 
  applications, 
  onUpdateStatus, 
  onViewResume,
  showAll = false 
}) {
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const displayApplications = showAll ? applications : applications.slice(0, 5);

  const filteredApplications = displayApplications.filter(app => {
    // Filter by job
    if (selectedJob !== 'all' && app.jobId !== selectedJob) return false;
    
    // Filter by status
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.candidateName?.toLowerCase().includes(term) ||
        app.candidateEmail?.toLowerCase().includes(term) ||
        app.jobTitle?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const result = await onUpdateStatus(appId, newStatus);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Applications</h2>
        <div className="flex items-center gap-4">
          {applications.some(app => app.status === 'shortlisted') && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {applications.filter(app => app.status === 'shortlisted').length} Shortlisted
            </span>
          )}
          <p className="text-gray-600">
            Total: <span className="font-bold">{applications.length}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="under_review">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">No applications found</h4>
          <p className="text-gray-500 mb-6">
            {applications.length === 0 
              ? 'Applications will appear here when candidates apply to your jobs'
              : 'No applications match your filters'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium text-gray-700">Candidate</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Job Applied</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Applied Date</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {app.candidateName || 'Anonymous'}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {app.candidateEmail}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">{app.jobTitle}</p>
                    <p className="text-gray-600 text-sm">Applied {Math.floor((new Date() - app.appliedAt) / (1000 * 60 * 60 * 24))} days ago</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {app.appliedAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(app.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        app.status === 'hired' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onViewResume(app.candidateId)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium flex items-center"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Resume
                      </button>
                      
                      {app.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app.id, 'under_review')}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'shortlisted')}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium"
                          >
                            Shortlist
                          </button>
                        </>
                      )}
                      
                      {app.status === 'under_review' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app.id, 'shortlisted')}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason (optional):');
                              handleStatusChange(app.id, 'rejected', reason);
                            }}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {app.status === 'shortlisted' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'hired')}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium"
                        >
                          Hire
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          // Open message dialog
                          alert(`Contact ${app.candidateName} at ${app.candidateEmail}`);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium flex items-center"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!showAll && applications.length > 5 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/institutes/applications'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Applications ({applications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}