// components/InstituteApplications.jsx
'use client';

import { useState } from 'react';
import { 
  Users, Filter, Download, Mail, 
  Phone, Calendar, CheckCircle, XCircle,
  MessageSquare, Eye, FileText
} from 'lucide-react';

const InstituteApplications = ({ jobId }) => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      candidate: {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+91 98765 43210',
        location: 'New Delhi',
        resumeUrl: '/resume.pdf',
        photo: 'https://i.pravatar.cc/150?img=1'
      },
      appliedDate: '2024-01-15',
      status: 'pending',
      coverLetter: 'I have 5 years of teaching experience...',
      matchScore: 85,
      experience: '5 years',
      education: 'M.Ed, B.Ed'
    },
    // More applications...
  ]);

  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('all');

  const statuses = [
    { id: 'all', label: 'All Applications', count: 24 },
    { id: 'pending', label: 'Pending', count: 12 },
    { id: 'shortlisted', label: 'Shortlisted', count: 8 },
    { id: 'rejected', label: 'Rejected', count: 3 },
    { id: 'interview', label: 'Interview', count: 1 }
  ];

  const handleStatusChange = (appId, newStatus) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const exportToExcel = () => {
    // Export applications to Excel
    alert('Exported to Excel!');
  };

  const sendBulkEmail = () => {
    // Send email to selected candidates
    alert('Bulk email sent!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            <p className="text-gray-600">Manage job applications for this position</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={sendBulkEmail}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-4 mt-6 overflow-x-auto">
          {statuses.map(status => (
            <button
              key={status.id}
              onClick={() => setFilter(status.id)}
              className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap ${
                filter === status.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              {status.label}
              <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {status.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y divide-gray-200">
        {applications.map(app => (
          <div key={app.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              {/* Candidate Info */}
              <div className="flex items-start space-x-4">
                <img
                  src={app.candidate.photo}
                  alt={app.candidate.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.candidate.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-1" />
                      {app.candidate.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-1" />
                      {app.candidate.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {app.appliedDate}
                    </div>
                  </div>
                  
                  {/* Candidate Details */}
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {app.experience} experience
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {app.education}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Match: {app.matchScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* View Resume */}
                <a
                  href={app.candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-primary-600"
                  title="View Resume"
                >
                  <FileText className="h-5 w-5" />
                </a>
                
                {/* Message */}
                <button
                  className="p-2 text-gray-600 hover:text-primary-600"
                  title="Message Candidate"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                
                {/* View Details */}
                <button
                  onClick={() => setSelectedApp(app)}
                  className="p-2 text-gray-600 hover:text-primary-600"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => handleStatusChange(app.id, 'shortlisted')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Shortlist
              </button>
              
              <button
                onClick={() => handleStatusChange(app.id, 'rejected')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </button>
              
              <button
                onClick={() => handleStatusChange(app.id, 'interview')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};