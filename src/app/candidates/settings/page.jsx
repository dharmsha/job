'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/src/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  updateProfile, 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Save,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  CheckCircle,
  Upload,
  Globe,
  Linkedin,
  FileText
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    phone: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    bio: '',
    linkedin: '',
    portfolio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resume, setResume] = useState(null);
  
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

  const fetchUserData = async (userId) => {
    try {
      // Fetch user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setProfile({
          displayName: userDoc.data().displayName || '',
          phone: userDoc.data().phone || '',
          location: userDoc.data().location || '',
          education: userDoc.data().education || '',
          experience: userDoc.data().experience || '',
          skills: userDoc.data().skills || '',
          bio: userDoc.data().bio || '',
          linkedin: userDoc.data().linkedin || '',
          portfolio: userDoc.data().portfolio || ''
        });
      } else {
        // Create basic profile from auth user
        setProfile({
          displayName: user.displayName || '',
          phone: '',
          location: '',
          education: '',
          experience: '',
          skills: '',
          bio: '',
          linkedin: '',
          portfolio: ''
        });
      }

      // Fetch resume data
      const resumeDoc = await getDoc(doc(db, 'resumes', userId));
      if (resumeDoc.exists()) {
        setResume(resumeDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Update Firebase Auth profile
      if (user.displayName !== profile.displayName) {
        await updateProfile(user, {
          displayName: profile.displayName
        });
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (!validatePassword()) {
        setSaving(false);
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError('Failed to change password: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.')) {
      return;
    }

    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    try {
      setSaving(true);
      setError('');

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore
      const collections = ['applications', 'notifications'];
      for (const collectionName of collections) {
        const q = query(
          collection(db, collectionName),
          where('candidateId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, collectionName, document.id));
        });
      }

      // Delete resume
      await deleteDoc(doc(db, 'resumes', user.uid));

      // Delete user document
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete auth user
      await deleteUser(user);

      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError('Failed to delete account: ' + error.message);
      }
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 text-sm">
                  Manage your account information and preferences
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/candidates/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    resume ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {resume ? 'Profile Complete' : 'Profile Incomplete'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Professional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="inline h-4 w-4 mr-1" />
                    Highest Education
                  </label>
                  <select
                    name="education"
                    value={profile.education}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select education level</option>
                    <option value="high_school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-1" />
                    Total Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={profile.experience}
                    onChange={handleProfileChange}
                    min="0"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Expertise
                  </label>
                  <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your skills separated by commas (e.g., Teaching, Communication, Lesson Planning)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell institutes about your teaching experience and philosophy..."
                    maxLength="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Online Presence</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin className="inline h-4 w-4 mr-1" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">Profile Completion</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Personal Information</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      profile.displayName ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Name added</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      resume ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Resume uploaded</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      profile.skills ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Skills added</span>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push('/candidates/resume')}
                  className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {resume ? 'Update Resume' : 'Upload Resume'}
                </button>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Change Password
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword.current ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword.new ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {saving ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
                
                <button
                  onClick={() => router.push('/candidates/dashboard')}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Discard Changes
                </button>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}