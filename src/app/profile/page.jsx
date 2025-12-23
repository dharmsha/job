'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  doc, 
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Languages,
  Globe,
  Linkedin,
  FileText,
  Download,
  Share2,
  Printer,
  Eye,
  Star,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Book,
  Calendar,
  Clock,
  Users,
  Briefcase as BriefcaseIcon,
  BookOpen,
  Hash
} from 'lucide-react';

export default function DynamicProfilePage() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'candidate' or 'institute'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await determineUserType(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  const determineUserType = async (userId) => {
    try {
      // Check if user is an institute
      const instituteDoc = await getDoc(doc(db, 'institutes', userId));
      if (instituteDoc.exists()) {
        setUserType('institute');
        await fetchInstituteProfile(userId, instituteDoc.data());
        return;
      }

      // Check if user is a candidate (user document exists)
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserType('candidate');
        await fetchCandidateProfile(userId, userDoc.data());
        return;
      }

      // Default to candidate if no document found
      setUserType('candidate');
      await fetchCandidateProfile(userId, {});
    } catch (error) {
      console.error('Error determining user type:', error);
      setUserType('candidate');
      await fetchCandidateProfile(userId, {});
    }
  };

  const fetchCandidateProfile = async (userId, userData) => {
    try {
      // Fetch candidate profile
      const candidateProfile = {
        displayName: userData.displayName || user?.displayName || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        education: userData.education || '',
        experience: userData.experience || '',
        skills: userData.skills ? (Array.isArray(userData.skills) ? userData.skills : userData.skills.split(',').map(s => s.trim())) : [],
        bio: userData.bio || '',
        linkedin: userData.linkedin || '',
        portfolio: userData.portfolio || '',
        languages: userData.languages || ['English', 'Hindi'],
        expertise: userData.expertise || ['Classroom Management', 'Curriculum Development'],
        certifications: userData.certifications || ['Teaching Certification', 'Subject Specialization']
      };

      // Fetch resume
      const resumeDoc = await getDoc(doc(db, 'resumes', userId));
      const resume = resumeDoc.exists() ? resumeDoc.data() : null;

      // Fetch applications for stats
      const appsQuery = query(
        collection(db, 'applications'),
        where('candidateId', '==', userId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      const applicationsList = appsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate?.() || new Date()
      }));

      // Calculate stats
      const totalApplied = applicationsList.length;
      const shortlisted = applicationsList.filter(app => app.status === 'shortlisted').length;
      const interviews = applicationsList.filter(app => app.status === 'interview').length;
      const successRate = totalApplied > 0 ? Math.round((shortlisted / totalApplied) * 100) : 0;

      setProfile({
        ...candidateProfile,
        resume,
        type: 'candidate'
      });
      setStats({
        totalApplied,
        shortlisted,
        interviews,
        successRate
      });
      setApplications(applicationsList);

    } catch (error) {
      console.error('Error fetching candidate profile:', error);
    }
  };

  const fetchInstituteProfile = async (instituteId, instituteData) => {
    try {
      // Fetch institute profile
      const instituteProfile = {
        name: instituteData.name || user?.displayName || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        phone: instituteData.phone || '',
        address: instituteData.address || '',
        website: instituteData.website || '',
        description: instituteData.description || '',
        establishedYear: instituteData.establishedYear || '',
        type: instituteData.type || 'educational',
        social: instituteData.social || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      };

      // Fetch institute jobs
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', instituteId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));

      // Fetch applications for stats
      const appsQuery = query(
        collection(db, 'applications'),
        where('instituteId', '==', instituteId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      const applicationsList = appsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      }));

      // Calculate stats
      const totalJobs = jobsList.length;
      const activeJobs = jobsList.filter(job => job.status === 'active').length;
      const totalApplications = applicationsList.length;
      const shortlisted = applicationsList.filter(app => app.status === 'shortlisted').length;
      const hired = applicationsList.filter(app => app.status === 'hired').length;

      setProfile({
        ...instituteProfile,
        type: 'institute'
      });
      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        shortlisted,
        hired
      });
      setJobs(jobsList);
      setApplications(applicationsList);

    } catch (error) {
      console.error('Error fetching institute profile:', error);
    }
  };

  const handleDownloadResume = () => {
    if (profile?.resume?.resumeUrl) {
      window.open(profile.resume.resumeUrl, '_blank');
    } else {
      alert('No resume uploaded yet.');
    }
  };

  const handlePrintProfile = () => {
    window.print();
  };

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName || profile.name}'s Profile`,
          text: `Check out ${profile.displayName || profile.name}'s profile on TeachConnect`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const getExperienceLevel = (years) => {
    if (!years) return 'Not specified';
    if (years < 2) return 'Beginner';
    if (years < 5) return 'Intermediate';
    if (years < 10) return 'Experienced';
    return 'Senior';
  };

  const getInstituteTypeLabel = (type) => {
    const types = {
      'school': 'School',
      'college': 'College',
      'university': 'University',
      'coaching': 'Coaching Institute',
      'training': 'Training Center',
      'educational': 'Educational Institute'
    };
    return types[type] || 'Educational Institute';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userType === 'candidate' ? 'My Profile' : 'Institute Profile'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {userType === 'candidate' ? 'Teaching Professional Profile' : 'Educational Institute Profile'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareProfile}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handlePrintProfile}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => router.push(userType === 'candidate' ? '/candidates/dashboard' : '/institutes/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    {userType === 'candidate' ? (
                      <span className="text-white text-3xl font-bold">
                        {profile.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    ) : (
                      <Building className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {userType === 'candidate' ? profile.displayName || 'Your Name' : profile.name || 'Institute Name'}
                  </h1>
                  <p className="text-xl mb-4 text-blue-100">
                    {userType === 'candidate' ? 'Teaching Professional' : getInstituteTypeLabel(profile.type)}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {userType === 'candidate' ? (
                      <>
                        <span className="px-4 py-2 bg-white/20 rounded-full flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          {getExperienceLevel(profile.experience)} Level
                        </span>
                        {profile.experience && (
                          <span className="px-4 py-2 bg-white/20 rounded-full">
                            {profile.experience} years experience
                          </span>
                        )}
                        {profile.location && (
                          <span className="px-4 py-2 bg-white/20 rounded-full flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {profile.location}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="px-4 py-2 bg-white/20 rounded-full">
                          {getInstituteTypeLabel(profile.type)}
                        </span>
                        {profile.establishedYear && (
                          <span className="px-4 py-2 bg-white/20 rounded-full">
                            Est. {profile.establishedYear}
                          </span>
                        )}
                        {profile.address && (
                          <span className="px-4 py-2 bg-white/20 rounded-full flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {profile.address}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {userType === 'candidate' && profile.resume && (
                <button
                  onClick={handleDownloadResume}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Resume
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {userType === 'candidate' ? (
            <CandidateProfileContent 
              profile={profile} 
              stats={stats} 
              applications={applications}
              onDownloadResume={handleDownloadResume}
            />
          ) : (
            <InstituteProfileContent 
              profile={profile} 
              stats={stats} 
              jobs={jobs}
              applications={applications}
            />
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          header, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

// Candidate Profile Content Component
function CandidateProfileContent({ profile, stats, applications, onDownloadResume }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column - Contact & Skills */}
      <div className="lg:col-span-1 space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {profile.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Skills & Expertise
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Application Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Applied</span>
              <span className="font-bold">{stats.totalApplied || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Shortlisted</span>
              <span className="font-bold text-green-600">{stats.shortlisted || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Interviews</span>
              <span className="font-bold text-purple-600">{stats.interviews || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-bold text-yellow-600">{stats.successRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* About Me */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">About Me</h3>
          
          {profile.bio ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bio added yet.</p>
              <button
                onClick={() => router.push('/candidates/profile')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Add a professional bio
              </button>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Education
              </h4>
              <p className="text-gray-600">
                {profile.education === 'bachelors' ? "Bachelor's Degree" :
                 profile.education === 'masters' ? "Master's Degree" :
                 profile.education === 'phd' ? "Doctorate" :
                 profile.education === 'high_school' ? "High School" :
                 profile.education || 'Not specified'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Experience
              </h4>
              <p className="text-gray-600">
                {profile.experience ? `${profile.experience} years` : 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Applications</h3>
              <button
                onClick={() => router.push('/candidates/applications')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{app.jobTitle}</h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                        <span>{app.instituteName}</span>
                        <span>
                          Applied: {app.appliedAt?.toLocaleDateString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                      app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      app.status === 'hired' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status ? app.status.replace('_', ' ').toUpperCase() : 'APPLIED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Resume
            </h3>
            
            {profile.resume ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Resume Available</h4>
                  <p className="text-sm text-green-700">
                    Last updated: {profile.resume.updatedAt ? new Date(profile.resume.updatedAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                
                <button
                  onClick={onDownloadResume}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Resume
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No resume uploaded yet</p>
                <button
                  onClick={() => router.push('/candidates/resume')}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Links & Social
            </h3>
            
            <div className="space-y-3">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-600 truncate">Professional Profile</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              )}
              
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">Portfolio</p>
                    <p className="text-sm text-gray-600 truncate">Work & Projects</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              )}
              
              {!profile.linkedin && !profile.portfolio && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No links added</p>
                  <button
                    onClick={() => router.push('/candidates/settings')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Add Links
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Institute Profile Content Component
function InstituteProfileContent({ profile, stats, jobs, applications }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column - Stats & Contact */}
      <div className="lg:col-span-1 space-y-6">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Institute Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="font-bold text-xl">{stats.totalJobs || 0}</p>
                </div>
              </div>
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                {stats.activeJobs || 0} Active
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="font-bold text-xl">{stats.totalApplications || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="font-bold text-xl">{stats.shortlisted || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hired</p>
                <p className="font-bold text-xl">{stats.hired || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {profile.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {profile.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{profile.address}</p>
                </div>
              </div>
            )}
            
            {profile.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {profile.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* About Institute */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">About Institute</h3>
          
          {profile.description ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.description}</p>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No description added yet.</p>
              <button
                onClick={() => router.push('/institutes/profile')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Add institute description
              </button>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Institute Type</h4>
              <p className="text-gray-600 text-sm">
                {profile.type === 'school' ? 'School' :
                 profile.type === 'college' ? 'College' :
                 profile.type === 'university' ? 'University' :
                 profile.type === 'coaching' ? 'Coaching Institute' :
                 profile.type === 'training' ? 'Training Center' :
                 'Educational Institute'}
              </p>
            </div>
            
            {profile.establishedYear && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium">Established</h4>
                <p className="text-gray-600 text-sm">{profile.establishedYear}</p>
              </div>
            )}
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Active Jobs</h4>
              <p className="text-gray-600 text-sm">{stats.activeJobs || 0} Posted</p>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Jobs</h3>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/institutes/dashboard?tab=jobs')}
                className="text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
              <button
                onClick={() => router.push('/institutes/post-job')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">No jobs posted yet</h4>
              <p className="text-gray-500 mb-6">Create your first job posting to attract candidates</p>
              <button
                onClick={() => router.push('/institutes/post-job')}
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
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {job.jobType || 'Full-time'}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location || 'Not specified'}
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
                      View Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}