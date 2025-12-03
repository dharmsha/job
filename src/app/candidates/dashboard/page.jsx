'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  User, 
  FileText, 
  Briefcase, 
  Award, 
  Settings,
  LogOut,
  Bell,
  Mail,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchUserData(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  // ✅ Corrected function name - appobsQuery se appsQuery
  const fetchUserData = async (userId) => {
    try {
      // 1. Fetch user's applications (CORRECTED VARIABLE NAME)
      const appsQuery = query(
        collection(db, 'applications'),
        where('candidateId', '==', userId)
      );
      const snapshot = await getDocs(appsQuery); // ✅ Yeh line fix karo
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      
      // 2. Calculate stats
      const totalApplied = apps.length;
      const shortlisted = apps.filter(app => app.status === 'shortlisted').length;
      const rejected = apps.filter(app => app.status === 'rejected').length;
      const hired = apps.filter(app => app.status === 'hired').length;
      
      setStats({
        totalApplied,
        shortlisted,
        rejected,
        hired
      });
      
      // 3. Check if user has resume
      const resumeQuery = query(
        collection(db, 'resumes'),
        where('userId', '==', userId)
      );
      const resumeSnapshot = await getDocs(resumeQuery);
      if (!resumeSnapshot.empty) {
        const resume = resumeSnapshot.docs[0].data();
        setResumeUrl(resume.fileUrl);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const handleUploadResume = () => {
    router.push('/candidates/resume');
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume uploaded yet.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                <Mail className="inline h-4 w-4 mr-1" />
                {user?.email}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/jobs')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </button>
              
              <button 
                onClick={handleUploadResume}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                {resumeUrl ? 'Update Resume' : 'Upload Resume'}
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
                Welcome back, {user?.displayName || user?.email?.split('@')[0]}!
              </h2>
              <p className="text-blue-100 opacity-90">
                Track your job applications and profile status
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {resumeUrl ? (
                <button
                  onClick={handleViewResume}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 flex items-center"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Your Resume
                </button>
              ) : (
                <button
                  onClick={handleUploadResume}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Your First Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Applied</p>
                <p className="text-3xl font-bold mt-1">{stats.totalApplied}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500">Shortlisted</p>
                <p className="text-3xl font-bold mt-1">{stats.shortlisted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500">Rejected</p>
                <p className="text-3xl font-bold mt-1">{stats.rejected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500">Hired</p>
                <p className="text-3xl font-bold mt-1">{stats.hired}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Status */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Resume Status</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              resumeUrl 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {resumeUrl ? '✓ Uploaded' : '⚠ Not Uploaded'}
            </span>
          </div>
          
          {resumeUrl ? (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Resume is uploaded and visible to institutes</p>
                <p className="text-sm text-green-600 mt-1">
                  Institutes can view and download your resume when you apply
                </p>
              </div>
              <button
                onClick={handleViewResume}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't uploaded a resume yet</p>
              <button
                onClick={handleUploadResume}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Upload Your Resume
              </button>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Applications</h3>
            <p className="text-gray-600">
              Total: <span className="font-bold">{applications.length}</span> applications
            </p>
          </div>
          
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">No applications yet</h4>
              <p className="text-gray-500 mb-6">Start applying to jobs to track your progress here</p>
              <button
                onClick={() => router.push('/jobs')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Job Title</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Company</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Applied Date</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium">{app.jobTitle || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600">{app.companyName || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'hired' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status || 'applied'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => router.push(`/jobs/${app.jobId}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Job
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {applications.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push('/candidates/applications')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Applications ({applications.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold">Find Jobs</h4>
                <p className="text-sm text-gray-600">Browse teaching positions</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/jobs')}
              className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              Explore Jobs
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold">Resume Builder</h4>
                <p className="text-sm text-gray-600">Create professional resume</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/candidates/resume-builder')}
              className="w-full mt-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              Build Resume
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold">Profile Settings</h4>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/candidates/settings')}
              className="w-full mt-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}