'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Calendar,
  Award,
  FileText,
  Edit,
  Save,
  Upload,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Clock,
  Eye
} from 'lucide-react';

export default function InstituteProfilePage() {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    establishedYear: '',
    type: '',
    totalJobs: 0,
    activeJobs: 0,
    social: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    stats: {
      totalApplications: 0,
      hiredCandidates: 0,
      avgResponseTime: '24h'
    }
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchInstituteData(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  const fetchInstituteData = async (instituteId) => {
    try {
      // Fetch institute profile
      const instituteDoc = await getDoc(doc(db, 'institutes', instituteId));
      if (instituteDoc.exists()) {
        const instituteData = instituteDoc.data();
        setInstitute({
          name: instituteData.name || user?.displayName || '',
          email: user?.email || '',
          phone: instituteData.phone || '',
          address: instituteData.address || '',
          website: instituteData.website || '',
          description: instituteData.description || '',
          establishedYear: instituteData.establishedYear || '',
          type: instituteData.type || 'educational',
          totalJobs: instituteData.totalJobs || 0,
          activeJobs: instituteData.activeJobs || 0,
          social: instituteData.social || {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          stats: {
            totalApplications: instituteData.totalApplications || 0,
            hiredCandidates: instituteData.hiredCandidates || 0,
            avgResponseTime: instituteData.avgResponseTime || '24h'
          }
        });
        setEditData({
          name: instituteData.name || user?.displayName || '',
          phone: instituteData.phone || '',
          address: instituteData.address || '',
          website: instituteData.website || '',
          description: instituteData.description || '',
          establishedYear: instituteData.establishedYear || '',
          type: instituteData.type || 'educational',
          facebook: instituteData.social?.facebook || '',
          twitter: instituteData.social?.twitter || '',
          linkedin: instituteData.social?.linkedin || '',
          instagram: instituteData.social?.instagram || ''
        });
      } else {
        // Create initial institute data
        setInstitute({
          name: user?.displayName || user?.email?.split('@')[0] || '',
          email: user?.email || '',
          phone: '',
          address: '',
          website: '',
          description: '',
          establishedYear: '',
          type: 'educational',
          totalJobs: 0,
          activeJobs: 0,
          social: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          stats: {
            totalApplications: 0,
            hiredCandidates: 0,
            avgResponseTime: '24h'
          }
        });
        setEditData({
          name: user?.displayName || user?.email?.split('@')[0] || '',
          phone: '',
          address: '',
          website: '',
          description: '',
          establishedYear: '',
          type: 'educational',
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        });
      }

      // Fetch institute jobs
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', instituteId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);

      // Update institute stats
      const activeJobs = jobsList.filter(job => job.status === 'active').length;
      const totalJobs = jobsList.length;
      
      // Fetch applications for stats
      const appsQuery = query(
        collection(db, 'applications'),
        where('instituteId', '==', instituteId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      const applications = appsSnapshot.docs.length;
      const hiredCandidates = appsSnapshot.docs.filter(doc => doc.data().status === 'hired').length;

      setInstitute(prev => ({
        ...prev,
        totalJobs,
        activeJobs,
        stats: {
          ...prev.stats,
          totalApplications: applications,
          hiredCandidates
        }
      }));

    } catch (error) {
      console.error('Error fetching institute data:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      
      const updatedData = {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        website: editData.website,
        description: editData.description,
        establishedYear: editData.establishedYear,
        type: editData.type,
        social: {
          facebook: editData.facebook,
          twitter: editData.twitter,
          linkedin: editData.linkedin,
          instagram: editData.instagram
        },
        updatedAt: new Date()
      };

      // Update Firestore
      await updateDoc(doc(db, 'institutes', user.uid), updatedData);

      // Update local state
      setInstitute(prev => ({
        ...prev,
        ...updatedData,
        social: updatedData.social
      }));

      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleViewDashboard = () => {
    router.push('/institutes/dashboard');
  };

  const handlePostJob = () => {
    router.push('/institutes/post-job');
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
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Institute Profile</h1>
                <p className="text-gray-600 text-sm">Manage your institute information</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewDashboard}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View Dashboard
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
        <div className="max-w-6xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                    <Building className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-grow">
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="text-3xl font-bold bg-transparent border-b-2 border-white/50 focus:border-white focus:outline-none mb-2 w-full"
                      placeholder="Institute Name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-2">{institute.name}</h1>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-4 py-2 bg-white/20 rounded-full">
                      {getInstituteTypeLabel(institute.type)}
                    </span>
                    {institute.establishedYear && (
                      <span className="px-4 py-2 bg-white/20 rounded-full">
                        Est. {institute.establishedYear}
                      </span>
                    )}
                    {institute.address && (
                      <span className="px-4 py-2 bg-white/20 rounded-full flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {institute.address}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button
                    onClick={handlePostJob}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center"
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    Post New Job
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Stats & Contact */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Stats Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Institute Stats
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Jobs</p>
                            <p className="font-bold text-xl">{institute.totalJobs}</p>
                          </div>
                        </div>
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                          {institute.activeJobs} Active
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Applications</p>
                          <p className="font-bold text-xl">{institute.stats.totalApplications}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hired Candidates</p>
                          <p className="font-bold text-xl">{institute.stats.hiredCandidates}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Avg. Response Time</p>
                          <p className="font-bold text-xl">{institute.stats.avgResponseTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      {editing ? (
                        <>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={institute.email}
                              disabled
                              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={editData.phone}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Address</label>
                            <input
                              type="text"
                              name="address"
                              value={editData.address}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Full institute address"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Website</label>
                            <input
                              type="url"
                              name="website"
                              value={editData.website}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://example.com"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {institute.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{institute.email}</p>
                              </div>
                            </div>
                          )}
                          
                          {institute.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{institute.phone}</p>
                              </div>
                            </div>
                          )}
                          
                          {institute.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{institute.address}</p>
                              </div>
                            </div>
                          )}
                          
                          {institute.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 text-gray-500 mr-3" />
                              <div>
                                <p className="text-sm text-gray-500">Website</p>
                                <a
                                  href={institute.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                  {institute.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <Link className="h-5 w-5 mr-2" />
                      Social Links
                    </h3>
                    
                    {editing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Facebook</label>
                          <input
                            type="url"
                            name="facebook"
                            value={editData.facebook}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://facebook.com/yourinstitute"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Twitter</label>
                          <input
                            type="url"
                            name="twitter"
                            value={editData.twitter}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://twitter.com/yourinstitute"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">LinkedIn</label>
                          <input
                            type="url"
                            name="linkedin"
                            value={editData.linkedin}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/company/yourinstitute"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Instagram</label>
                          <input
                            type="url"
                            name="instagram"
                            value={editData.instagram}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://instagram.com/yourinstitute"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {institute.social.facebook && (
                          <a
                            href={institute.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100"
                          >
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Facebook</span>
                            <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                          </a>
                        )}
                        
                        {institute.social.twitter && (
                          <a
                            href={institute.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100"
                          >
                            <Twitter className="h-5 w-5 text-blue-400" />
                            <span className="font-medium">Twitter</span>
                            <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                          </a>
                        )}
                        
                        {institute.social.linkedin && (
                          <a
                            href={institute.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100"
                          >
                            <Linkedin className="h-5 w-5 text-blue-700" />
                            <span className="font-medium">LinkedIn</span>
                            <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                          </a>
                        )}
                        
                        {institute.social.instagram && (
                          <a
                            href={institute.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100"
                          >
                            <Instagram className="h-5 w-5 text-pink-600" />
                            <span className="font-medium">Instagram</span>
                            <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                          </a>
                        )}
                        
                        {!institute.social.facebook && !institute.social.twitter && 
                         !institute.social.linkedin && !institute.social.instagram && (
                          <p className="text-gray-500 text-sm text-center py-4">
                            No social links added yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About Institute */}
                  <div className="border rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">About Institute</h3>
                      {editing && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={uploading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {uploading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editing ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institute Description
                          </label>
                          <textarea
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe your institute, its mission, values, and achievements..."
                            maxLength="2000"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {editData.description?.length || 0}/2000 characters
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Established Year
                            </label>
                            <input
                              type="number"
                              name="establishedYear"
                              value={editData.establishedYear}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 1995"
                              min="1900"
                              max={new Date().getFullYear()}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institute Type
                            </label>
                            <select
                              name="type"
                              value={editData.type}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="school">School</option>
                              <option value="college">College</option>
                              <option value="university">University</option>
                              <option value="coaching">Coaching Institute</option>
                              <option value="training">Training Center</option>
                              <option value="educational">Educational Institute</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {institute.description ? (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {institute.description}
                          </p>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No description added yet. Add information about your institute.</p>
                            <button
                              onClick={() => setEditing(true)}
                              className="mt-3 text-blue-600 hover:text-blue-800"
                            >
                              Add Description
                            </button>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-medium">Institute Type</h4>
                            <p className="text-gray-600 text-sm">{getInstituteTypeLabel(institute.type)}</p>
                          </div>
                          
                          {institute.establishedYear && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <h4 className="font-medium">Established</h4>
                              <p className="text-gray-600 text-sm">{institute.establishedYear}</p>
                            </div>
                          )}
                          
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Briefcase className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h4 className="font-medium">Active Jobs</h4>
                            <p className="text-gray-600 text-sm">{institute.activeJobs} Posted</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Jobs */}
                  <div className="border rounded-xl p-6">
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
                          onClick={handlePostJob}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          Post New Job
                        </button>
                      </div>
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
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {job.location || 'Not specified'}
                                  </span>
                                  <span>
                                    Posted {job.createdAt ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
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
                              <button 
                                onClick={() => router.push(`/institutes/edit-job/${job.id}`)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Institute Achievements */}
                  <div className="border rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Institute Credentials</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-3">
                          <Award className="h-6 w-6 text-blue-600 mr-3" />
                          <h4 className="font-bold">Verification Status</h4>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-700 font-medium">Verified Institute</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Your institute is verified and trusted by candidates
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-3">
                          <FileText className="h-6 w-6 text-green-600 mr-3" />
                          <h4 className="font-bold">Profile Completeness</h4>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Complete your profile</span>
                            <span>75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Complete profile attracts more candidates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-8 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Profile last updated recently
                  </p>
                  <p className="text-sm text-gray-500">
                    Keep your information up to date for better candidate engagement
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/institutes/settings')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Advanced Settings
                  </button>
                  <button
                    onClick={handleViewDashboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}