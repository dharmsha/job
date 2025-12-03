'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobPostings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instituteId, setInstituteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInstituteJobs();
  }, []);

  const fetchInstituteJobs = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      setInstituteId(currentUser.uid);
      
      // Fetch jobs posted by this institute
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(
        jobsRef, 
        where('instituteId', '==', currentUser.uid)
        // REMOVED: orderBy('createdAt', 'desc') temporarily to avoid index error
      );
      
      const snapshot = await getDocs(jobsQuery);
      
      const jobsList = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const jobData = docSnap.data();
        
        // Get application count for this job
        const appsRef = collection(db, 'applications');
        const appsQuery = query(appsRef, where('jobId', '==', docSnap.id));
        const appsSnapshot = await getDocs(appsQuery);
        const applications = appsSnapshot.size;
        
        return {
          id: docSnap.id,
          ...jobData,
          applications,
          postedDateFormatted: new Date(jobData.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          isActive: jobData.status === 'active'
        };
      }));
      
      // Sort jobs by createdAt in descending order (newest first) - CLIENT SIDE SORTING
      jobsList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Descending order
      });
      
      setJobs(jobsList);
    } catch (error) {
      console.error('Error fetching institute jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      // Also delete associated applications
      const appsRef = collection(db, 'applications');
      const appsQuery = query(appsRef, where('jobId', '==', jobId));
      const appsSnapshot = await getDocs(appsQuery);
      
      appsSnapshot.forEach(async (appDoc) => {
        await deleteDoc(doc(db, 'applications', appDoc.id));
      });
      
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: currentStatus === 'active' ? 'closed' : 'active',
        updatedAt: new Date().toISOString()
      });
      
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, isActive: !job.isActive, status: currentStatus === 'active' ? 'closed' : 'active' }
          : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleViewApplicants = (jobId) => {
    router.push(`/institutes/applications?job=${jobId}`);
  };

  const handleEditJob = (jobId) => {
    router.push(`/institutes/jobs/edit/${jobId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Job Postings</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your institute's job listings</p>
          </div>
          <button
            onClick={() => router.push('/jobs')}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center transition-colors duration-200"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="p-8 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-600 mb-4">Start posting jobs to attract candidates</p>
          <button
            onClick={() => router.push('/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {job.title?.charAt(0) || 'J'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {job.title || 'Untitled Job'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location || 'Location not specified'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 mr-2">
                            {job.jobType || 'Full-time'}
                          </span>
                          {job.salary && (
                            <span className="text-xs text-gray-600 flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(job.applications, 3))].map((_, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                            ))}
                          </div>
                          {job.applications > 3 && (
                            <div className="absolute -right-2 top-0 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                              +{job.applications - 3}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{job.applications}</div>
                          <div className="text-xs text-gray-500">applicants</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Closed
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          {job.isActive ? 'Close Job' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{job.postedDateFormatted}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {job.experience || 'Experience not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleViewApplicants(job.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 flex flex-col items-center"
                          title="View Applicants"
                        >
                          <Users className="w-5 h-5" />
                          <span className="text-xs mt-1">View</span>
                        </button>
                        <button 
                          onClick={() => handleEditJob(job.id)}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100 flex flex-col items-center"
                          title="Edit Job"
                        >
                          <Edit className="w-5 h-5" />
                          <span className="text-xs mt-1">Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 flex flex-col items-center"
                          title="Delete Job"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="text-xs mt-1">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{jobs.length}</span> of <span className="font-medium">{jobs.length}</span> jobs
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  View All Jobs
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}