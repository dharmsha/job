'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  addDoc
} from 'firebase/firestore';
import { 
  Briefcase, Search, Filter, ChevronRight, MapPin, Calendar, 
  Home, Plus, Building, Users, DollarSign, Clock, TrendingUp,
  BookOpen, Award, Zap, Star, ExternalLink
} from 'lucide-react';
import JobCard from '@/src/components/JobCard';
import JobFilters from '@/src/components/jobs/JobFilters';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  // New job form state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experience: 'Fresher',
    skills: '',
    urgent: false,
    featured: false
  });
  
  const router = useRouter();

  // Fetch user data and jobs
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check user role from Firestore
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', currentUser.uid)
        ));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setUserRole(userData.userType); // 'candidate' or 'institute'
        }
      }
      fetchJobs();
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch jobs from Firebase
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsRef = collection(db, 'jobs');
      const q = query(jobsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const jobsList = [];
      snapshot.forEach((doc) => {
        jobsList.push({ 
          id: doc.id, 
          ...doc.data(),
          // Add formatted date for display
          postedDateFormatted: new Date(doc.data().createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        });
      });
      
      setJobs(jobsList);
      setFilteredJobs(jobsList);
      console.log('Fetched jobs:', jobsList.length);
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim() && !searchLocation.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job => {
      const matchesKeyword = searchKeyword ? 
        job.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchKeyword.toLowerCase()) : true;
      
      const matchesLocation = searchLocation ?
        job.location?.toLowerCase().includes(searchLocation.toLowerCase()) : true;
      
      return matchesKeyword && matchesLocation;
    });
    
    setFilteredJobs(filtered);
  };

  // Handle filters from JobFilters component
  const handleFilterChange = (filters) => {
    let filtered = [...jobs];
    
    // Job Type filter
    if (filters.jobType && filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.type === filters.jobType);
    }
    
    // Experience filter
    if (filters.experience && filters.experience !== 'all') {
      if (filters.experience === 'fresher') {
        filtered = filtered.filter(job => 
          job.experience?.toLowerCase().includes('fresher') ||
          job.experience === '0' ||
          !job.experience
        );
      } else if (filters.experience === '1-3') {
        filtered = filtered.filter(job => 
          job.experience?.includes('1') || 
          job.experience?.includes('2') ||
          job.experience?.includes('3')
        );
      }
    }
    
    // Salary filter
    if (filters.salary && filters.salary !== 'all') {
      if (filters.salary === '20-40') {
        filtered = filtered.filter(job => {
          const salaryNum = parseInt(job.salary?.replace(/\D/g, ''));
          return salaryNum >= 20000 && salaryNum <= 40000;
        });
      }
    }
    
    setFilteredJobs(filtered);
  };

  // Post new job (for institutes)
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login as institute to post job');
      router.push('/login');
      return;
    }
    
    try {
      const jobData = {
        ...newJob,
        instituteId: user.uid,
        companyName: user.displayName || user.email?.split('@')[0],
        skills: newJob.skills.split(',').map(skill => skill.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        applications: 0,
        views: 0
      };
      
      // Add to Firestore
      await addDoc(collection(db, 'jobs'), jobData);
      
      alert('Job posted successfully!');
      setShowPostJobModal(false);
      setNewJob({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experience: 'Fresher',
        skills: '',
        urgent: false,
        featured: false
      });
      
      // Refresh jobs list
      fetchJobs();
      
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    }
  };

  // Stats data
  const stats = [
    { number: jobs.length, label: 'Active Jobs', icon: Briefcase, color: 'blue' },
    { number: '500+', label: 'Institutes', icon: Building, color: 'purple' },
    { number: '10K+', label: 'Job Seekers', icon: Users, color: 'green' },
    { number: '95%', label: 'Success Rate', icon: TrendingUp, color: 'orange' }
  ];

  // Popular job categories
  const categories = [
    { name: 'Mathematics', count: 245, icon: BookOpen },
    { name: 'Science', count: 189, icon: Award },
    { name: 'English', count: 167, icon: BookOpen },
    { name: 'Computer', count: 143, icon: Zap }
  ];

  // Top institutes
  const topInstitutes = [
    { name: 'Delhi Public School', jobs: 15, rating: 4.8 },
    { name: 'Kendriya Vidyalaya', jobs: 12, rating: 4.6 },
    { name: 'FIITJEE', jobs: 8, rating: 4.7 },
    { name: 'Aakash Institute', jobs: 10, rating: 4.5 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex items-center text-white/90 text-sm">
                <a href="/" className="flex items-center hover:text-white transition-colors">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </a>
                <ChevronRight className="h-3 w-3 mx-2 text-white/70" />
                <span className="text-white font-medium">All Jobs</span>
              </nav>
            </div>

            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{jobs.length}+ Active Jobs</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Find Your Dream 
                <span className="block text-yellow-300 mt-2">
                  Teaching Job
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with top schools, colleges, and coaching institutes across India
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Icon className={`h-5 w-5 text-${stat.color}-300 mr-2`} />
                        <div className="text-xl md:text-2xl font-bold text-white">{stat.number}</div>
                      </div>
                      <div className="text-xs text-white/80">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-4">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Teaching Jobs</h2>
            <p className="text-gray-600">Find the perfect teaching position for you</p>
          </div>
          
          {/* Post Job Button (for institutes) */}
          {userRole === 'institute' && (
            <button
              onClick={() => setShowPostJobModal(true)}
              className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </button>
          )}
          
          {/* For candidates */}
          {userRole === 'candidate' && (
            <button
              onClick={() => router.push('/candidates/resume')}
              className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Upload Resume to Apply
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Job title, keywords, or institute name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="City, state, or remote"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </button>
            </form>
            
            {/* Popular Categories */}
            <div className="mt-3 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Popular:</span>
                {categories.map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchKeyword(category.name)}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors flex items-center"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            {/* Mobile Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <span className="flex items-center font-medium">
                  <Filter className="h-5 w-5 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                <ChevronRight className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-6 space-y-6">
                <JobFilters onFilterChange={handleFilterChange} />
                
                {/* Top Institutes */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    Top Hiring Institutes
                  </h4>
                  <div className="space-y-3">
                    {topInstitutes.map((institute, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{institute.name}</p>
                          <p className="text-xs text-gray-500">{institute.jobs} jobs</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium ml-1">{institute.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Job Market Insights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Remote Jobs</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Urgent Hiring</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Fresher Friendly</span>
                      <span className="font-medium">42%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Jobs List */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {searchKeyword || searchLocation ? 'Search Results' : 'All Teaching Jobs'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="font-medium">India-wide</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="font-medium">Updated today</span>
                    </div>
                  </div>
                </div>
                
                {/* Results Count */}
                <div className="mt-3 md:mt-0">
                  <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                    <Briefcase className="h-4 w-4 mr-1.5" />
                    <span className="font-semibold">{filteredJobs.length}</span>
                    <span className="ml-1.5">jobs found</span>
                  </div>
                </div>
              </div>
              
              {/* Applied Filters */}
              {(searchKeyword || searchLocation) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchKeyword && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                      <Search className="h-3 w-3 mr-1" />
                      {searchKeyword}
                      <button 
                        onClick={() => setSearchKeyword('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {searchLocation && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {searchLocation}
                      <button 
                        onClick={() => setSearchLocation('')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchKeyword || searchLocation 
                    ? 'Try changing your search criteria' 
                    : 'No jobs posted yet. Be the first to post!'}
                </p>
                {userRole === 'institute' && (
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Post First Job
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
            
            {/* Info for Candidates */}
            {userRole === 'candidate' && filteredJobs.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Ready to Apply?</h4>
                    <p className="text-blue-800 text-sm mb-3">
                      Make sure your resume is uploaded before applying. Institutes will see your resume 
                      when you apply and can hire you directly.
                    </p>
                    <button
                      onClick={() => router.push('/candidates/resume')}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    >
                      Upload/Update Resume
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Job Modal (for Institutes) */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Post New Job</h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handlePostJob} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics Teacher for Class 9-10"
                  required
                />
              </div>
              
              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Describe the job responsibilities, requirements, etc."
                  required
                />
              </div>
              
              {/* Location and Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Delhi, Remote, Mumbai"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Salary/Month *
                  </label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ₹25,000 - ₹35,000"
                    required
                  />
                </div>
              </div>
              
              {/* Job Type and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Job Type *
                  </label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) => setNewJob({...newJob, jobType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Required *
                  </label>
                  <select
                    value={newJob.experience}
                    onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Fresher">Fresher (0-1 years)</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills (comma separated) *
                </label>
                <input
                  type="text"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics, Teaching, CBSE, Communication"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
              </div>
              
              {/* Urgent & Featured */}
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newJob.urgent}
                    onChange={(e) => setNewJob({...newJob, urgent: e.target.checked})}
                    className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-gray-700">Mark as Urgent Hiring</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newJob.featured}
                    onChange={(e) => setNewJob({...newJob, featured: e.target.checked})}
                    className="h-4 w-4 text-yellow-600 rounded focus:ring-yellow-500"
                  />
                  <span className="ml-2 text-gray-700">Featured Job (Highlighted)</span>
                </label>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}