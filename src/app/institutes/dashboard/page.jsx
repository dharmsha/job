'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  increment,
  addDoc
} from 'firebase/firestore';
import { Bell, Mail, LogOut, Briefcase, Users, Plus, MessageSquare } from 'lucide-react';

export default function InstituteDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchInstituteData(currentUser.uid);
      setupRealtimeListener(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  // ✅ Modified setup without composite index requirement
  const setupRealtimeListener = (instituteId) => {
    try {
      // Listen to applications (without orderBy to avoid index)
      const appsQuery = query(
        collection(db, 'applications'),
        where('instituteId', '==', instituteId)
      );

      const unsubscribeApps = onSnapshot(appsQuery, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        }));
        
        // Sort applications by appliedAt on client side (descending)
        const sortedApps = apps.sort((a, b) => b.appliedAt - a.appliedAt);
        setApplications(sortedApps);
        calculateStats(sortedApps);
      });

      // Listen to jobs (without orderBy to avoid index)
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', instituteId)
      );

      const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
        const jobsList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        // Sort jobs by createdAt on client side (descending)
        const sortedJobs = jobsList.sort((a, b) => b.createdAt - a.createdAt);
        setJobs(sortedJobs);
        setStats(prev => ({ ...prev, totalJobs: sortedJobs.length }));
      });

      return () => {
        unsubscribeApps();
        unsubscribeJobs();
      };
    } catch (error) {
      console.error('Error setting up realtime listener:', error);
    }
  };

  const fetchInstituteData = async (instituteId) => {
    try {
      // Fetch institute's jobs
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', instituteId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      let jobsList = jobsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      
      // Sort jobs on client side
      jobsList = jobsList.sort((a, b) => b.createdAt - a.createdAt);
      setJobs(jobsList);
      
      // Fetch applications for this institute
      const appsQuery = query(
        collection(db, 'applications'),
        where('instituteId', '==', instituteId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      let appsList = appsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
      }));
      
      // Sort applications on client side
      appsList = appsList.sort((a, b) => b.appliedAt - a.appliedAt);
      setApplications(appsList);
      
      // Calculate initial stats
      calculateStats(appsList);

    } catch (error) {
      console.error('Error fetching institute data:', error);
    }
  };

  const calculateStats = (apps) => {
    const totalApplications = apps.length;
    const pendingReview = apps.filter(app => 
      app.status === 'applied' || app.status === 'under_review'
    ).length;
    const shortlisted = apps.filter(app => app.status === 'shortlisted').length;
    const rejected = apps.filter(app => app.status === 'rejected').length;
    const hired = apps.filter(app => app.status === 'hired').length;
    
    setStats(prev => ({
      ...prev,
      totalApplications,
      pendingReview,
      shortlisted,
      rejected,
      hired
    }));
  };

  // ✅ Handle application status updates
  const handleUpdateStatus = async (applicationId, newStatus, rejectionReason = '') => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      const updateData = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === 'rejected' && rejectionReason ? { rejectionReason } : {})
      };
      
      await updateDoc(applicationRef, updateData);
      
      // Create notification for candidate
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        await createNotification(
          application.candidateId,
          `Your application for "${application.jobTitle}" at ${application.instituteName} has been ${newStatus}`,
          newStatus === 'shortlisted' ? '🎉 Application Shortlisted!' : 'Application Status Updated',
          application.instituteId,
          application.jobId
        );
      }
      
      alert(`Status updated to ${newStatus}`);
      return { success: true, message: `Status updated to ${newStatus}` };
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
      return { success: false, message: 'Failed to update status' };
    }
  };

  const createNotification = async (candidateId, message, title, instituteId, jobId) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: candidateId,
        title,
        message,
        type: 'application_update',
        instituteId,
        jobId,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleViewResume = async (candidateId) => {
    try {
      const resumeQuery = query(
        collection(db, 'resumes'),
        where('userId', '==', candidateId)
      );
      const resumeSnapshot = await getDocs(resumeQuery);
      if (!resumeSnapshot.empty) {
        const resume = resumeSnapshot.docs[0].data();
        window.open(resume.fileUrl, '_blank');
      } else {
        alert('Candidate has not uploaded a resume.');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePostJob = () => {
    router.push('/institutes/post-job');
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Institute Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1 flex items-center">
                  <Mail className="inline h-4 w-4 mr-1" />
                  {user?.email}
                </p>
              </div>
              
              {notifications.length > 0 && (
                <button 
                  onClick={() => router.push('/institutes/notifications')}
                  className="relative px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
                >
                  <Bell className="h-4 w-4 inline mr-1" />
                  {notifications.length} New
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePostJob}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </button>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 flex items-center"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {user?.displayName || user?.email?.split('@')[0]}!
              </h2>
              <p className="text-blue-100 opacity-90">
                Manage your job postings and candidate applications
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {stats.totalJobs} Total Jobs
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {stats.totalApplications} Total Applications
                </span>
                {stats.pendingReview > 0 && (
                  <span className="bg-yellow-500/30 px-3 py-1 rounded-full text-sm">
                    {stats.pendingReview} Need Review
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={handlePostJob}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
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
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats & Jobs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Total Jobs</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalJobs}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Applications</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalApplications}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                      <Bell className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Pending Review</p>
                      <p className="text-3xl font-bold mt-1">{stats.pendingReview}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Shortlisted</p>
                      <p className="text-3xl font-bold mt-1">{stats.shortlisted}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Recent Jobs</h3>
                  <button
                    onClick={handlePostJob}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </button>
                </div>
                
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No jobs posted yet</h4>
                    <p className="text-gray-500 mb-6">Create your first job posting to attract candidates</p>
                    <button
                      onClick={handlePostJob}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg">{job.title}</h4>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {job.jobType || 'Full-time'}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {job.applicationsCount || 0} applications
                              </span>
                              <span>
                                Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                              </span>
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
                          <button 
                            onClick={() => router.push(`/jobs/${job.id}`)}
                            className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => router.push(`/institutes/jobs/${job.id}/applications`)}
                            className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            View Applicants ({job.applicationsCount || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {jobs.length > 3 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => setActiveTab('jobs')}
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
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Recent Applications</h3>
                  <div className="flex gap-4">
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
                </div>
                
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
                        {filteredApplications.slice(0, 5).map((app) => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{app.candidateName || 'Anonymous'}</p>
                                <p className="text-gray-600 text-sm">{app.candidateEmail}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-medium">{app.jobTitle}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-600">
                                {app.appliedAt.toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                app.status === 'hired' ? 'bg-purple-100 text-purple-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewResume(app.candidateId)}
                                  className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View Resume
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                                  className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Rejection reason (optional):');
                                    handleUpdateStatus(app.id, 'rejected', reason);
                                  }}
                                  className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredApplications.length > 5 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setActiveTab('applications')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All Applications ({filteredApplications.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={handlePostJob}
                    className="w-full p-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center"
                  >
                    <div className="p-2 bg-white rounded-lg mr-4">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Post New Job</p>
                      <p className="text-sm opacity-75">Create a new job posting</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="w-full p-4 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center"
                  >
                    <div className="p-2 bg-white rounded-lg mr-4">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Manage Jobs</p>
                      <p className="text-sm opacity-75">View all your job postings</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="w-full p-4 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg flex items-center"
                  >
                    <div className="p-2 bg-white rounded-lg mr-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">View Applications</p>
                      <p className="text-sm opacity-75">See all candidate applications</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/institutes/settings')}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center"
                  >
                    <div className="p-2 bg-white rounded-lg mr-4">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Settings</p>
                      <p className="text-sm opacity-75">Manage institute profile</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Institute Info */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4">Institute Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                    <p className="font-medium">{stats.totalJobs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Applications</p>
                    <p className="font-medium">{stats.totalApplications}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shortlisted Candidates</p>
                    <p className="font-medium">{stats.shortlisted}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Job Management</h2>
            {/* Jobs content will be here */}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">All Applications</h2>
            {/* All applications content will be here */}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Candidates</h2>
            {/* Candidates content will be here */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            {/* Settings content will be here */}
          </div>
        )}
      </div>
    </div>
  );
}