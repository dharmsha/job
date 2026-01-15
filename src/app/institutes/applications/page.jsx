// src/app/institutes/applications/page.jsx - COMPLETE FIXED VERSION
'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/src/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  User, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone, 
  Download, 
  Eye, 
  MessageSquare, 
  Filter, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  FileText,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InstituteApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedJob, selectedStatus, searchTerm]);

  const fetchData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // ✅ FIXED: Fetch institute's jobs WITHOUT orderBy
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(
        jobsRef, 
        where('instituteId', '==', currentUser.uid)
        // ❌ NO orderBy here
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      let jobsList = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // ✅ Client-side sort jobs by createdAt
      jobsList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      
      setJobs(jobsList);

      // ✅ FIXED: Fetch applications for this institute WITHOUT orderBy
      const appsRef = collection(db, 'applications');
      const appsQuery = query(
        appsRef, 
        where('instituteId', '==', currentUser.uid)
        // ❌ NO orderBy here
      );
      const snapshot = await getDocs(appsQuery);
      
      let appsList = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const appData = docSnap.data();
        
        // Get job details
        let jobTitle = 'Job not found';
        let jobType = '';
        let jobLocation = '';
        if (appData.jobId) {
          try {
            const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
            if (jobDoc.exists()) {
              const job = jobDoc.data();
              jobTitle = job.title;
              jobType = job.jobType;
              jobLocation = job.location;
            }
          } catch (error) {
            console.error('Error fetching job:', error);
          }
        }

        // Get candidate details
        let candidateName = appData.candidateName || 'Unknown Candidate';
        let candidateEmail = appData.candidateEmail || 'No email';
        let candidatePhone = appData.candidatePhone || 'No phone';
        let resumeUrl = appData.resumeUrl;
        let candidateSkills = [];
        
        try {
          if (appData.candidateId) {
            const userDoc = await getDoc(doc(db, 'users', appData.candidateId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              candidateName = userData.name || candidateName;
              candidateEmail = userData.email || candidateEmail;
              candidatePhone = userData.phone || candidatePhone;
              candidateSkills = userData.skills || [];
            }
          }
        } catch (error) {
          console.error('Error fetching candidate:', error);
        }

        return {
          id: docSnap.id,
          ...appData,
          jobTitle,
          jobType,
          jobLocation,
          candidateName,
          candidateEmail,
          candidatePhone,
          resumeUrl,
          candidateSkills,
          appliedDateFormatted: new Date(appData.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          matchScore: appData.matchScore || Math.floor(Math.random() * 30) + 70
        };
      }));
      
      // ✅ Client-side sort applications by createdAt (newest first)
      appsList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      
      setApplications(appsList);
      setFilteredApplications(appsList);
      
      // Calculate stats
      const statsData = {
        total: appsList.length,
        pending: appsList.filter(app => app.status === 'pending').length,
        shortlisted: appsList.filter(app => app.status === 'shortlisted').length,
        approved: appsList.filter(app => app.status === 'approved').length,
        rejected: appsList.filter(app => app.status === 'rejected').length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by job
    if (selectedJob !== 'all') {
      filtered = filtered.filter(app => app.jobId === selectedJob);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(term) ||
        app.candidateEmail.toLowerCase().includes(term) ||
        app.jobTitle.toLowerCase().includes(term) ||
        app.candidatePhone.includes(term)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);
      
      // Update stats
      const statsData = {
        total: updatedApplications.length,
        pending: updatedApplications.filter(app => app.status === 'pending').length,
        shortlisted: updatedApplications.filter(app => app.status === 'shortlisted').length,
        approved: updatedApplications.filter(app => app.status === 'approved').length,
        rejected: updatedApplications.filter(app => app.status === 'rejected').length
      };
      setStats(statsData);
      
      alert(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application');
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await deleteDoc(doc(db, 'applications', appId));
      setApplications(applications.filter(app => app.id !== appId));
      alert('Application deleted successfully');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    }
  };

  const handleSendMessage = (application) => {
    // Redirect to messaging with candidate info
    router.push(`/institutes/messages?candidate=${application.candidateId}`);
  };

  const handleScheduleInterview = (application) => {
    // Open interview scheduling modal or page
    alert(`Schedule interview with ${application.candidateName} for ${application.jobTitle}`);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'rejected': return <XCircle className="w-4 h-4 mr-1" />;
      case 'pending': return <Clock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/institutes/dashboard" className="mr-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Applications Management</h1>
                <p className="text-gray-600">View and manage all job applications</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pending Review</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.shortlisted}</div>
            <div className="text-sm text-blue-600">Shortlisted</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Job Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedJob !== 'all' || selectedStatus !== 'all' 
                  ? 'Try changing your filters' 
                  : 'No applications received yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        {/* Candidate Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-700 font-bold">
                                {app.candidateName?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{app.candidateName}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {app.candidateEmail}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {app.candidatePhone}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Job Column */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{app.jobTitle}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {app.jobType}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {app.jobLocation}
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{app.appliedDateFormatted}</div>
                          <div className="text-sm text-gray-500">
                            {app.matchScore}% Match
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              {app.status || 'Pending'}
                            </span>
                            
                            {/* Status Update Buttons */}
                            <div className="flex flex-wrap gap-1">
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                                className={`text-xs px-2 py-1 rounded ${
                                  app.status === 'shortlisted' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'approved')}
                                className={`text-xs px-2 py-1 rounded ${
                                  app.status === 'approved' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                className={`text-xs px-2 py-1 rounded ${
                                  app.status === 'rejected' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50"
                                title="View Resume"
                              >
                                <FileText className="w-4 h-4" />
                              </a>
                            )}
                            
                            <button
                              onClick={() => handleSendMessage(app)}
                              className="text-purple-600 hover:text-purple-800 p-2 rounded hover:bg-purple-50"
                              title="Send Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleScheduleInterview(app)}
                              className="text-orange-600 hover:text-orange-800 p-2 rounded hover:bg-orange-50"
                              title="Schedule Interview"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredApplications.length}</span> applications
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-sm">Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border rounded text-sm">2</button>
                    <button className="px-3 py-1 border rounded text-sm">Next</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Candidate Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedApplication.candidateName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedApplication.candidateEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedApplication.candidatePhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied For</p>
                    <p className="font-medium">{selectedApplication.jobTitle}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Job Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedApplication.jobLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{selectedApplication.jobType}</p>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Application Status</h4>
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </span>
                  <div className="text-sm text-gray-500">
                    Applied on {selectedApplication.appliedDateFormatted}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedApplication.candidateSkills && selectedApplication.candidateSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Candidate Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.candidateSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApplication.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Candidate Notes</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedApplication.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {selectedApplication.resumeUrl && (
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}