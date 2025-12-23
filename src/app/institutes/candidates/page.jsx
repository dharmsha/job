'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  Hash
} from 'lucide-react';

export default function InstituteCandidatesPage() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    experience: 'all',
    job: 'all'
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchData(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  const fetchData = async (instituteId) => {
    try {
      // Fetch institute jobs for filtering
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', instituteId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      }));
      setJobs(jobsList);

      // Fetch all applications for this institute
      const appsQuery = query(
        collection(db, 'applications'),
        where('instituteId', '==', instituteId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      const applications = appsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate?.() || new Date()
      }));

      // Create a map of candidates with their applications
      const candidatesMap = new Map();
      const statusCounts = {
        total: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0
      };

      for (const app of applications) {
        statusCounts.total++;
        if (app.status === 'shortlisted') statusCounts.shortlisted++;
        if (app.status === 'rejected') statusCounts.rejected++;
        if (app.status === 'hired') statusCounts.hired++;

        if (!candidatesMap.has(app.candidateId)) {
          // Fetch candidate profile
          const candidateDoc = await getDoc(doc(db, 'users', app.candidateId));
          const candidateData = candidateDoc.exists() ? candidateDoc.data() : {};
          
          // Fetch candidate resume
          const resumeDoc = await getDoc(doc(db, 'resumes', app.candidateId));
          const resumeData = resumeDoc.exists() ? resumeDoc.data() : {};

          candidatesMap.set(app.candidateId, {
            id: app.candidateId,
            name: app.candidateName || candidateData.displayName || 'Anonymous',
            email: app.candidateEmail || '',
            phone: candidateData.phone || '',
            location: candidateData.location || '',
            experience: resumeData.experience || candidateData.experience || 0,
            skills: candidateData.skills || resumeData.skills || [],
            education: candidateData.education || '',
            resumeUrl: resumeData.resumeUrl || '',
            profileComplete: candidateDoc.exists(),
            applications: [{
              jobId: app.jobId,
              jobTitle: app.jobTitle,
              status: app.status,
              appliedAt: app.appliedAt,
              applicationId: app.id
            }]
          });
        } else {
          // Add application to existing candidate
          const candidate = candidatesMap.get(app.candidateId);
          candidate.applications.push({
            jobId: app.jobId,
            jobTitle: app.jobTitle,
            status: app.status,
            appliedAt: app.appliedAt,
            applicationId: app.id
          });
        }
      }

      // Convert map to array and sort by most recent application
      const candidatesList = Array.from(candidatesMap.values()).map(candidate => ({
        ...candidate,
        applications: candidate.applications.sort((a, b) => b.appliedAt - a.appliedAt),
        latestStatus: candidate.applications[0]?.status || 'applied',
        totalApplications: candidate.applications.length,
        lastApplied: candidate.applications[0]?.appliedAt
      }));

      // Sort candidates by last applied date
      candidatesList.sort((a, b) => b.lastApplied - a.lastApplied);

      setCandidates(candidatesList);
      setStats(statusCounts);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleViewResume = (candidate) => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    } else {
      alert('Candidate has not uploaded a resume.');
    }
  };

  const handleViewProfile = (candidateId) => {
    router.push(`/candidates/profile/${candidateId}`);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setCandidates(prev => prev.map(candidate => ({
        ...candidate,
        applications: candidate.applications.map(app => 
          app.applicationId === applicationId 
            ? { ...app, status: newStatus }
            : app
        ),
        latestStatus: candidate.applications[0]?.applicationId === applicationId 
          ? newStatus 
          : candidate.latestStatus
      })));

      // Update stats
      setStats(prev => {
        const newStats = { ...prev };
        // Note: This is simplified; in a real app, you'd track status changes more carefully
        return newStats;
      });

      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendMessage = (candidateId) => {
    alert(`Message feature would open for candidate: ${candidateId}`);
    // In a real app, this would open a messaging interface
  };

  const handleDownloadCV = (candidate) => {
    if (candidate.resumeUrl) {
      const link = document.createElement('a');
      link.href = candidate.resumeUrl;
      link.download = `${candidate.name.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No resume available to download.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getExperienceLabel = (years) => {
    if (!years) return 'Not specified';
    if (years < 2) return 'Fresher';
    if (years < 5) return 'Intermediate';
    if (years < 10) return 'Experienced';
    return 'Senior';
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(term)) ||
        candidate.applications.some(app => app.jobTitle.toLowerCase().includes(term));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all') {
      const hasMatchingStatus = candidate.applications.some(app => app.status === filters.status);
      if (!hasMatchingStatus) return false;
    }

    // Experience filter
    if (filters.experience !== 'all') {
      const exp = parseInt(candidate.experience);
      switch (filters.experience) {
        case 'fresher': if (exp >= 2) return false; break;
        case 'intermediate': if (exp < 2 || exp >= 5) return false; break;
        case 'experienced': if (exp < 5) return false; break;
      }
    }

    // Job filter
    if (filters.job !== 'all') {
      const hasMatchingJob = candidate.applications.some(app => app.jobId === filters.job);
      if (!hasMatchingJob) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/institutes/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Database</h1>
                <p className="text-gray-600 text-sm">Manage and view all candidates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/institutes/dashboard?tab=applications')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View Applications
              </button>
              <button
                onClick={() => router.push('/institutes/jobs')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Jobs
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Candidates</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                <XCircle className="h-8 w-8 text-red-600" />
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
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500">Hired</p>
                <p className="text-3xl font-bold mt-1">{stats.hired}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search candidates by name, email, skills, or job title..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {filteredCandidates.length} candidates found
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Experience</option>
                <option value="fresher">Fresher (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="experienced">Experienced (5+ years)</option>
              </select>
            </div>

            {/* Job Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Job Title
              </label>
              <select
                value={filters.job}
                onChange={(e) => handleFilterChange('job', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    status: 'all',
                    experience: 'all',
                    job: 'all'
                  });
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No candidates found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || Object.values(filters).some(f => f !== 'all')
                  ? 'Try adjusting your search or filters'
                  : 'Candidates will appear here when they apply to your jobs'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    status: 'all',
                    experience: 'all',
                    job: 'all'
                  });
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Candidate</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Contact</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Experience</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Applications</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Status</th>
                      <th className="py-4 px-6 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-500">
                                {candidate.profileComplete ? 'Profile Complete' : 'Basic Profile'}
                              </div>
                            </div>
                          </div>
                          {candidate.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  +{candidate.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="truncate">{candidate.email}</span>
                            </div>
                            {candidate.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{candidate.phone}</span>
                              </div>
                            )}
                            {candidate.location && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{candidate.location}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium">
                                {candidate.experience ? `${candidate.experience} years` : 'Not specified'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {getExperienceLabel(candidate.experience)}
                            </div>
                            {candidate.education && (
                              <div className="flex items-center text-sm text-gray-600">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                {candidate.education === 'bachelors' ? "Bachelor's" :
                                 candidate.education === 'masters' ? "Master's" :
                                 candidate.education === 'phd' ? "PhD" :
                                 candidate.education}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            {candidate.applications.slice(0, 2).map((app, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium">{app.jobTitle}</div>
                                <div className="text-gray-500 text-xs">
                                  <Calendar className="inline h-3 w-3 mr-1" />
                                  {app.appliedAt.toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                            {candidate.totalApplications > 2 && (
                              <div className="text-sm text-blue-600">
                                +{candidate.totalApplications - 2} more applications
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            {candidate.applications.slice(0, 2).map((app, index) => (
                              <span
                                key={index}
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
                              >
                                {app.status.replace('_', ' ')}
                              </span>
                            ))}
                            {candidate.applications.length > 2 && (
                              <div className="text-xs text-gray-500">
                                See all for details
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewResume(candidate)}
                                className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                title="View Resume"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Resume
                              </button>
                              <button
                                onClick={() => handleViewProfile(candidate.id)}
                                className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                                title="View Profile"
                              >
                                <User className="h-4 w-4 mr-1" />
                                Profile
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSendMessage(candidate.id)}
                                className="px-3 py-1 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                                title="Send Message"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </button>
                              {candidate.resumeUrl && (
                                <button
                                  onClick={() => handleDownloadCV(candidate)}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
                                  title="Download CV"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredCandidates.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredCandidates.length}</span> candidates
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold">Export Candidates</h4>
                <p className="text-sm text-gray-600">Download candidate list as CSV</p>
              </div>
            </div>
            <button
              onClick={() => alert('Export feature coming soon!')}
              className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              Export Data
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold">Bulk Messaging</h4>
                <p className="text-sm text-gray-600">Send messages to multiple candidates</p>
              </div>
            </div>
            <button
              onClick={() => alert('Bulk messaging feature coming soon!')}
              className="w-full mt-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              Send Bulk Messages
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold">Advanced Filters</h4>
                <p className="text-sm text-gray-600">More filtering options</p>
              </div>
            </div>
            <button
              onClick={() => alert('Advanced filters coming soon!')}
              className="w-full mt-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
            >
              Advanced Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}