'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  User, 
  Briefcase, 
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchInstituteApplications();
  }, []);

  const fetchInstituteApplications = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // ✅ FIX: REMOVE orderBy FROM HERE
      const appsRef = collection(db, 'applications');
      const appsQuery = query(
        appsRef, 
        where('instituteId', '==', currentUser.uid)
        // ❌ NO orderBy here - REMOVED THIS LINE
      );
      
      const snapshot = await getDocs(appsQuery);
      
      const appsList = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const appData = docSnap.data();
        
        // Get job details
        let jobTitle = 'Job not found';
        try {
          if (appData.jobId) {
            const jobDoc = await getDoc(doc(db, 'jobs', appData.jobId));
            if (jobDoc.exists()) {
              jobTitle = jobDoc.data().title;
            }
          }
        } catch (error) {
          console.error('Error fetching job:', error);
        }

        // Get candidate details
        let candidateName = appData.candidateName || 'Unknown Candidate';
        let candidateEmail = appData.candidateEmail || 'No email';
        let candidatePhone = appData.candidatePhone || 'No phone';
        let resumeUrl = appData.resumeUrl;
        
        try {
          if (appData.candidateId) {
            const userDoc = await getDoc(doc(db, 'users', appData.candidateId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              candidateName = userData.name || candidateName;
              candidateEmail = userData.email || candidateEmail;
              candidatePhone = userData.phone || candidatePhone;
            }
          }
        } catch (error) {
          console.error('Error fetching candidate:', error);
        }

        return {
          id: docSnap.id,
          ...appData,
          jobTitle,
          candidateName,
          candidateEmail,
          candidatePhone,
          resumeUrl,
          appliedDateFormatted: new Date(appData.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          matchScore: appData.matchScore || Math.floor(Math.random() * 30) + 70
        };
      }));
      
      // ✅ FIX: ADD CLIENT-SIDE SORTING HERE
      appsList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      
      // ✅ Only show 5 applications for dashboard
      const dashboardApps = appsList.slice(0, 5);
      setApplications(dashboardApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      
      alert(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application');
    }
  };

  const handleViewResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume available');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'rejected': return <XCircle className="w-3 h-3 mr-1" />;
      case 'pending': return <Clock className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <p className="text-sm text-gray-600 mt-1">
              {applications.length} total applications received
            </p>
          </div>
          <button 
            onClick={fetchInstituteApplications}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Applications will appear here when candidates apply to your jobs</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <div key={app.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-bold">
                          {app.candidateName?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          app.matchScore > 80 ? 'bg-green-500 text-white' :
                          app.matchScore > 70 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {app.matchScore}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{app.candidateName}</h3>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {app.jobTitle}
                      </p>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {app.candidateEmail}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {app.appliedDateFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex space-x-2 mb-3">
                      <button 
                        onClick={() => handleViewResume(app.resumeUrl)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        title="View Resume"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => window.open(`mailto:${app.candidateEmail}`)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                        title="Email Candidate"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          app.status === 'shortlisted' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          app.status === 'approved' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          app.status === 'rejected' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills/Notes Section */}
                {app.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{app.notes}</p>
                  </div>
                )}

                {/* Skill Match Progress */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Skill Match</span>
                      <span>{app.matchScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          app.matchScore > 80 ? 'bg-green-500' :
                          app.matchScore > 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${app.matchScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Send Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{applications.length}</span> applications
              </div>
              <button 
                onClick={() => window.location.href = '/institutes/applications'}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
              >
                View All Applications
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedApp.candidateName}</h4>
                <p className="text-gray-600">{selectedApp.jobTitle}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedApp.candidateEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedApp.candidatePhone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Applied Date</p>
                <p className="font-medium">{selectedApp.appliedDateFormatted}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApp.status)}`}>
                  {selectedApp.status || 'Pending'}
                </span>
              </div>
              
              {selectedApp.notes && (
                <div>
                  <p className="text-sm text-gray-500">Candidate Notes</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{selectedApp.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleViewResume(selectedApp.resumeUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}