'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/src/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  Languages,
  Globe,
  Linkedin,
  FileText,
  Edit,
  Download,
  Share2,
  Printer,
  Eye,
  MessageSquare,
  Star,
  Clock,
  TrendingUp,
  Target,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Award as AwardIcon,
  Book
} from 'lucide-react';

export default function CandidateProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    experience: '',
    skills: [],
    bio: '',
    linkedin: '',
    portfolio: '',
    expertise: [],
    languages: [],
    certifications: []
  });
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    interviews: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchProfileData(currentUser); // Pass currentUser directly
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  const fetchProfileData = async (currentUser) => {
    try {
      // Fetch user profile
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          displayName: userData.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || '',
          email: currentUser.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          education: userData.education || '',
          experience: userData.experience || '',
          skills: userData.skills ? (Array.isArray(userData.skills) ? userData.skills : userData.skills.split(',').map(s => s.trim())) : [],
          bio: userData.bio || '',
          linkedin: userData.linkedin || '',
          portfolio: userData.portfolio || '',
          expertise: userData.expertise || ['Classroom Management', 'Curriculum Development'],
          languages: userData.languages || ['English', 'Hindi'],
          certifications: userData.certifications || ['Teaching Certification', 'Subject Specialization']
        });
        setEditData({
          bio: userData.bio || '',
          skills: userData.skills ? (Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills) : '',
          languages: userData.languages ? (Array.isArray(userData.languages) ? userData.languages.join(', ') : userData.languages) : ''
        });
      } else {
        // Set basic data from auth
        setProfile(prev => ({
          ...prev,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
          email: currentUser.email || ''
        }));
        setEditData({
          bio: '',
          skills: '',
          languages: ''
        });
      }

      // Fetch resume
      const resumeDoc = await getDoc(doc(db, 'resumes', currentUser.uid));
      if (resumeDoc.exists()) {
        setResume(resumeDoc.data());
      }

      // Fetch applications for stats
      const appsQuery = query(
        collection(db, 'applications'),
        where('candidateId', '==', currentUser.uid)
      );
      const appsSnapshot = await getDocs(appsQuery);
      const apps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);

      // Calculate stats
      const totalApplied = apps.length;
      const shortlisted = apps.filter(app => app.status === 'shortlisted').length;
      const interviews = apps.filter(app => app.status === 'interview').length;
      const successRate = totalApplied > 0 ? Math.round((shortlisted / totalApplied) * 100) : 0;

      setStats({
        totalApplied,
        shortlisted,
        interviews,
        successRate
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Convert comma-separated strings to arrays
      const updatedData = {
        ...editData,
        skills: editData.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: editData.languages.split(',').map(l => l.trim()).filter(l => l),
        updatedAt: new Date()
      };

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), updatedData);

      // Update local state
      setProfile(prev => ({
        ...prev,
        bio: updatedData.bio,
        skills: updatedData.skills,
        languages: updatedData.languages
      }));

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDownloadResume = () => {
    if (resume?.resumeUrl) {
      window.open(resume.resumeUrl, '_blank');
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
          title: `${profile.displayName}'s Teaching Profile`,
          text: `Check out ${profile.displayName}'s teaching profile on TeachConnect`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/candidates/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 text-sm">Your professional teaching profile</p>
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
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                    <span className="text-white text-4xl font-bold">
                      {profile.displayName?.charAt(0)?.toUpperCase() || 
                       user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.displayName || 'Your Name'}
                </h2>
                <p className="text-gray-600 mb-2">Teaching Professional</p>
                
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <Star className="h-3 w-3 mr-1" />
                  {getExperienceLevel(profile.experience)} Level
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center justify-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center justify-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadResume}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    disabled={!resume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {resume ? 'Download Resume' : 'No Resume'}
                  </button>
                  <button
                    onClick={() => router.push('/candidates/settings')}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Edit Full Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Application Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Applied</span>
                    <span className="text-sm font-bold">{stats.totalApplied}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Shortlisted</span>
                    <span className="text-sm font-bold">{stats.shortlisted}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stats.shortlisted / Math.max(stats.totalApplied, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Interview Calls</span>
                    <span className="text-sm font-bold">{stats.interviews}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(stats.interviews / Math.max(stats.totalApplied, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-bold">{stats.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">About Me</h3>
                {editing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editData.bio || ''}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell institutes about your teaching philosophy, experience, and passion..."
                      maxLength="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editData.bio?.length || 0}/1000 characters
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma-separated)
                    </label>
                    <textarea
                      name="skills"
                      value={editData.skills || ''}
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Classroom Management, Lesson Planning, Student Assessment, Communication..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={editData.languages || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="English, Hindi, French..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.bio ? (
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No bio added yet. Add a professional bio to showcase your teaching philosophy.</p>
                      <button
                        onClick={() => setEditing(true)}
                        className="mt-3 text-blue-600 hover:text-blue-800"
                      >
                        Add Bio
                      </button>
                    </div>
                  )}
                  
                  {/* Skills */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No skills added yet</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Languages className="h-4 w-4 mr-2" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages && profile.languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {profile.education || 'Not specified'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {profile.education === 'bachelors' ? "Bachelor's Degree" :
                         profile.education === 'masters' ? "Master's Degree" :
                         profile.education === 'phd' ? "Doctorate" :
                         profile.education === 'high_school' ? "High School" :
                         "Education Level"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Certifications</h4>
                    {profile.certifications && profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {profile.experience ? `${profile.experience} Years` : 'Not specified'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Teaching Experience • {getExperienceLevel(profile.experience)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Areas of Expertise</h4>
                    {profile.expertise && profile.expertise.map((area, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <AwardIcon className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Status */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Resume Status
                </h3>
                
                {resume ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">Resume Uploaded ✓</h4>
                        <span className="text-sm text-green-600">
                          {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your resume is visible to institutes when you apply for jobs
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Name in Resume:</span>
                        <span className="font-medium">{resume.fullName || 'Not specified'}</span>
                      </div>
                      {resume.experience && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{resume.experience} years</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleDownloadResume}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Resume
                      </button>
                      <button
                        onClick={() => router.push('/candidates/resume')}
                        className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No Resume Uploaded</h4>
                    <p className="text-gray-500 mb-6">Upload your resume to apply for jobs</p>
                    <button
                      onClick={() => router.push('/candidates/resume')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>

              {/* Links & Social */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Links & Social
                </h3>
                
                <div className="space-y-4">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">LinkedIn</h4>
                        <p className="text-sm text-gray-600 truncate">{profile.linkedin}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  
                  {profile.portfolio && (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Globe className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-medium">Portfolio</h4>
                        <p className="text-sm text-gray-600 truncate">{profile.portfolio}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  
                  {!profile.linkedin && !profile.portfolio && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No links added yet. Add your LinkedIn or portfolio to showcase your work.</p>
                      <button
                        onClick={() => router.push('/candidates/settings')}
                        className="mt-3 text-blue-600 hover:text-blue-800"
                      >
                        Add Links
                      </button>
                    </div>
                  )}
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
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Institute</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 3).map((app) => (
                        <tr key={app.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{app.jobTitle || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-600">{app.instituteName || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-4">
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
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">
                              {app.appliedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}