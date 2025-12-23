'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import { 
  Briefcase, Users, Calendar, CheckCircle, Clock, Star, 
  MapPin, DollarSign, Home, LogOut, FileText, Eye, 
  Plus, Edit, Trash2, MessageSquare, Phone, Mail,
  ArrowRight, ExternalLink, TrendingUp, Award
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    
    if (user && userData) {
      fetchDashboardData();
    }
  }, [user, userData, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userType = userData?.userType || 'candidate';
      let data = {};

      if (userType === 'candidate') {
        // Fetch candidate data
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('candidateId', '==', user.uid)
        );
        
        const jobsQuery = query(
          collection(db, 'jobs'),
          where('status', '==', 'active')
        );

        const [applicationsSnapshot, jobsSnapshot] = await Promise.all([
          getDocs(applicationsQuery),
          getDocs(jobsQuery)
        ]);

        const applications = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const recommendedJobs = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).slice(0, 3);

        // Calculate stats
        const stats = {
          totalApplied: applications.length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          underReview: applications.filter(app => app.status === 'under_review' || app.status === 'applied').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
          interviews: applications.filter(app => app.status === 'interview').length
        };

        // Fetch resume if exists
        let resume = null;
        try {
          const resumeDoc = await getDoc(doc(db, 'resumes', user.uid));
          if (resumeDoc.exists()) {
            resume = resumeDoc.data();
          }
        } catch (error) {
          console.log('No resume found');
        }

        data = {
          type: 'candidate',
          applications,
          recommendedJobs,
          stats,
          resume
        };

      } else {
        // Fetch institute data
        const jobsQuery = query(
          collection(db, 'jobs'),
          where('instituteId', '==', user.uid)
        );

        const applicationsQuery = query(
          collection(db, 'applications'),
          where('instituteId', '==', user.uid)
        );

        const [jobsSnapshot, applicationsSnapshot] = await Promise.all([
          getDocs(jobsQuery),
          getDocs(applicationsQuery)
        ]);

        const jobs = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const applications = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate stats
        const stats = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === 'active').length,
          totalApplications: applications.length,
          pendingReview: applications.filter(app => app.status === 'applied' || app.status === 'under_review').length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          hired: applications.filter(app => app.status === 'hired').length
        };

        data = {
          type: 'institute',
          jobs,
          applications,
          stats
        };
      }

      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return null;
  }

  // Render appropriate dashboard
  if (dashboardData.type === 'institute') {
    return <InstituteDashboard user={user} userData={userData} data={dashboardData} logout={logout} />;
  }

  return <CandidateDashboard user={user} userData={userData} data={dashboardData} logout={logout} />;
}

// Candidate Dashboard Component
const CandidateDashboard = ({ user, userData, data, logout }) => {
  const router = useRouter();
  const { applications = [], recommendedJobs = [], stats = {}, resume } = data;

  const handleApplyJob = (jobId) => {
    router.push(`/jobs/${jobId}/apply`);
  };

  const handleViewJob = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleUploadResume = () => {
    router.push('/candidates/resume'); // ✅ Fixed: /candidates/resume
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Home className="h-5 w-5" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold">Candidate Dashboard</h1>
              </div>
              <p className="text-blue-100">Track your applications and opportunities</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/20 p-3 rounded-xl">
                <div className="h-12 w-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{userData?.name || user?.displayName || 'Candidate'}</p>
                  <p className="text-sm text-blue-100">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalApplied || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Applications</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.shortlisted || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Shortlisted</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.underReview || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Under Review</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <Star className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.interviews || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Interviews</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Rejected</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Resume Status</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  resume 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {resume ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
              
              {resume ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Resume is uploaded</p>
                      <p className="text-sm text-green-600 mt-1">
                        Last updated: {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(resume.downloadURL || resume.url, '_blank')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => router.push('/candidates/resume')} // ✅ Fixed
                        className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't uploaded a resume yet</p>
                  <p className="text-sm text-gray-500 mb-6">Upload your resume to start applying for jobs</p>
                  <button
                    onClick={() => router.push('/candidates/resume')} // ✅ Fixed
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center mx-auto"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Upload Resume
                  </button>
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                {applications.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-bold">{applications.length}</span> applications
                  </span>
                )}
              </div>
              
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No applications yet</h4>
                  <p className="text-gray-500 mb-6">
                    {resume 
                      ? 'Start applying to jobs to track your progress here' 
                      : 'Upload your resume first, then apply for jobs'}
                  </p>
                  <button
                    onClick={() => router.push('/jobs')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    disabled={!resume}
                  >
                    Browse Available Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{app.jobTitle || 'N/A'}</h3>
                          <p className="text-gray-600">{app.instituteName || app.company || 'N/A'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {app.location && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" /> {app.location}
                              </span>
                            )}
                            {app.salary && (
                              <span className="text-sm text-gray-500 flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" /> {app.salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <button
                          onClick={() => handleViewJob(app.jobId)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                        >
                          View Details <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {applications.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => router.push('/candidates/applications')} // ✅ Fixed
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All Applications ({applications.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/jobs')}
                  className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <span className="text-white text-2xl">🔍</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Find Jobs</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Browse available teaching positions</p>
                </button>

                <button
                  onClick={() => router.push('/candidates/resume')} // ✅ Fixed
                  className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <span className="text-white text-2xl">📄</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Update Resume</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Upload or update your resume</p>
                </button>

                <button
                  onClick={() => router.push('/candidates/applications')} // ✅ Fixed
                  className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Applications</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Track your job applications</p>
                </button>

                <button
                  onClick={() => router.push('/candidates/profile')} // ✅ Fixed
                  className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 rounded-xl hover:from-yellow-100 hover:to-amber-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <span className="text-white text-2xl">👤</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Profile</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Complete your profile</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userData?.name || 'Your Name'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Completion:</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push('/candidates/profile')} // ✅ Fixed
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  Complete Profile
                </button>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Jobs</h2>
              <div className="space-y-4">
                {recommendedJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recommended jobs available</p>
                ) : (
                  recommendedJobs.map((job) => (
                    <div key={job.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <h3 className="font-medium text-gray-900">{job.title || 'N/A'}</h3>
                      <p className="text-sm text-gray-600">{job.company || job.instituteName || 'N/A'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">📍 {job.location || 'N/A'}</span>
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/jobs')}
                  className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center"
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>Browse Jobs</span>
                </button>
                
                <button
                  onClick={() => router.push('/candidates/resume')} // ✅ Fixed
                  className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>{resume ? 'Update Resume' : 'Upload Resume'}</span>
                </button>
                
                <button
                  onClick={() => router.push('/candidates/profile')} // ✅ Fixed
                  className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center"
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Institute Dashboard Component
const InstituteDashboard = ({ user, userData, data, logout }) => {
  const router = useRouter();
  const { jobs = [], applications = [], stats = {} } = data;

  const handlePostJob = () => {
    router.push('/institutes/post-job'); // ✅ Fixed: /institutes/post-job
  };

  const handleViewJob = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleViewApplications = (jobId) => {
    router.push(`/institutes/jobs/${jobId}/applications`); // ✅ Fixed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Home className="h-5 w-5" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold">Institute Dashboard</h1>
              </div>
              <p className="text-blue-100">Manage your job postings and applications</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/20 p-3 rounded-xl">
                <div className="h-12 w-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{userData?.name || user?.displayName || 'Institute'}</p>
                  <p className="text-sm text-blue-100">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalJobs || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Jobs</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Applications</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingReview || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Review</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.shortlisted || 0}</span>
            </div>
            <p className="text-gray-600 font-medium">Shortlisted</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <button
                  onClick={() => router.push('/institutes/post-job')} // ✅ Fixed
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Job
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/institutes/post-job')} // ✅ Fixed
                  className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">Post New Job</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Create a new job posting for teachers</p>
                </button>

                <button
                  onClick={() => router.push('/institutes/applications')} // ✅ Fixed
                  className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">View Applications</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Review candidate applications</p>
                </button>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                {jobs.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-bold">{jobs.length}</span> jobs
                  </span>
                )}
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No jobs posted yet</h4>
                  <p className="text-gray-500 mb-6">Create your first job posting to attract candidates</p>
                  <button
                    onClick={() => router.push('/institutes/post-job')} // ✅ Fixed
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{job.title || 'N/A'}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">
                              📍 {job.location || 'N/A'}
                            </span>
                            <span className="text-sm text-gray-500">
                              💰 {job.salary || 'Negotiable'}
                            </span>
                            <span className="text-sm text-gray-500">
                              📅 Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.status || 'draft'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          {job.applicationsCount || 0} Applications
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleViewApplications(job.id)}
                            className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            View Applicants
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {jobs.length > 3 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => router.push('/institutes/jobs')} // ✅ Fixed
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All Jobs ({jobs.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                {applications.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-bold">{applications.length}</span> applications
                  </span>
                )}
              </div>
              
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No applications yet</h4>
                  <p className="text-gray-500">Applications will appear here when candidates apply to your jobs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{app.candidateName || 'Anonymous'}</h3>
                          <p className="text-gray-600">Applied for {app.jobTitle || 'N/A'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">
                              📧 {app.candidateEmail || 'N/A'}
                            </span>
                            <span className="text-sm text-gray-500">
                              📅 {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          Status: {app.status || 'Applied'}
                        </span>
                        <button
                          onClick={() => router.push(`/institutes/applications/${app.id}`)} // ✅ Fixed
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                        >
                          View Details <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Institute Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userData?.name || 'Your Institute'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{userData?.subscription || 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Jobs:</span>
                    <span className="font-medium">{stats.activeJobs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Applications:</span>
                    <span className="font-medium">{stats.totalApplications || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push('/institutes/profile')} // ✅ Fixed
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  Update Profile
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/institutes/jobs')} // ✅ Fixed
                  className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center"
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>Manage Jobs</span>
                </button>
                
                <button
                  onClick={() => router.push('/institutes/applications')} // ✅ Fixed
                  className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center"
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>View Applications</span>
                </button>
                
                <button
                  onClick={() => router.push('/institutes/candidates')} // ✅ Fixed
                  className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center"
                >
                  <Users className="h-5 w-5 mr-3" />
                  <span>Candidates</span>
                </button>
                
                <button
                  onClick={() => router.push('/institutes/settings')} // ✅ Fixed
                  className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg flex items-center"
                >
                  <Edit className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};