'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
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
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  Upload,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Bell,
  Shield,
  Key,
  LogOut,
  ArrowLeft,
  Settings as SettingsIcon
} from 'lucide-react';

export default function InstituteSettingsPage() {
  const [user, setUser] = useState(null);
  const [institute, setInstitute] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    establishedYear: '',
    type: 'educational',
    social: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    notifications: {
      email: true,
      applicationUpdates: true,
      jobAlerts: true,
      newsletter: false
    }
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
  const [activeTab, setActiveTab] = useState('profile');
  
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
          social: instituteData.social || {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
          },
          notifications: instituteData.notifications || {
            email: true,
            applicationUpdates: true,
            jobAlerts: true,
            newsletter: false
          }
        });
      } else {
        // Set basic data from auth
        setInstitute(prev => ({
          ...prev,
          name: user?.displayName || user?.email?.split('@')[0] || '',
          email: user?.email || ''
        }));
      }

    } catch (error) {
      console.error('Error fetching institute data:', error);
      setError('Failed to load institute data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setInstitute(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else if (name.startsWith('notifications.')) {
      const notificationField = name.split('.')[1];
      setInstitute(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationField]: checked
        }
      }));
    } else {
      setInstitute(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      if (user.displayName !== institute.name) {
        await updateProfile(user, {
          displayName: institute.name
        });
      }

      // Update Firestore institute document
      const instituteRef = doc(db, 'institutes', user.uid);
      const updateData = {
        name: institute.name,
        phone: institute.phone,
        address: institute.address,
        website: institute.website,
        description: institute.description,
        establishedYear: institute.establishedYear,
        type: institute.type,
        social: institute.social,
        notifications: institute.notifications,
        updatedAt: new Date()
      };

      await updateDoc(instituteRef, updateData);

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
    if (!confirm('Are you sure you want to delete your institute account? This action cannot be undone. All your data will be permanently deleted.')) {
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

      // Delete institute data from Firestore
      const collections = ['jobs', 'applications'];
      for (const collectionName of collections) {
        const q = query(
          collection(db, collectionName),
          where('instituteId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const batchPromises = snapshot.docs.map(async (document) => {
          await deleteDoc(doc(db, collectionName, document.id));
        });
        await Promise.all(batchPromises);
      }

      // Delete institute document
      await deleteDoc(doc(db, 'institutes', user.uid));

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
              <button
                onClick={() => router.push('/institutes/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Institute Settings</h1>
                <p className="text-gray-600 text-sm">Manage your institute account and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Settings
              </h3>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-4 w-4 mr-3" />
                  Profile Settings
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-4 w-4 mr-3" />
                  Security & Password
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </button>
                
                <button
                  onClick={() => setActiveTab('social')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === 'social'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Link className="h-4 w-4 mr-3" />
                  Social Links
                </button>
                
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeTab === 'danger'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Danger Zone
                </button>
              </nav>
              
              <div className="mt-8 pt-6 border-t">
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Institute
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Building className="h-6 w-6 mr-2" />
                  Institute Profile
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="inline h-4 w-4 mr-1" />
                        Institute Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={institute.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter institute name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={institute.email}
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
                        value={institute.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="inline h-4 w-4 mr-1" />
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={institute.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={institute.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full institute address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Established Year
                      </label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={institute.establishedYear}
                        onChange={handleInputChange}
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
                        value={institute.type}
                        onChange={handleInputChange}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institute Description
                    </label>
                    <textarea
                      name="description"
                      value={institute.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your institute, its mission, values, and achievements..."
                      maxLength="2000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {institute.description.length}/2000 characters
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Lock className="h-6 w-6 mr-2" />
                  Security & Password
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Account Security
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Change your password regularly to keep your account secure.
                    </p>
                  </div>
                  
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
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
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
                    
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                      >
                        <Key className="h-5 w-5 mr-2" />
                        {saving ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Bell className="h-6 w-6 mr-2" />
                  Notification Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Email Notifications
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Choose which emails you want to receive from TeachConnect
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive all email notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={institute.notifications.email}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Application Updates</h4>
                        <p className="text-sm text-gray-600">When candidates apply or update applications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.applicationUpdates"
                          checked={institute.notifications.applicationUpdates}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Job Alerts</h4>
                        <p className="text-sm text-gray-600">Updates about your job postings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.jobAlerts"
                          checked={institute.notifications.jobAlerts}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Newsletter</h4>
                        <p className="text-sm text-gray-600">Monthly updates and tips</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications.newsletter"
                          checked={institute.notifications.newsletter}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Notification Settings'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Link className="h-6 w-6 mr-2" />
                  Social Media Links
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="font-bold text-purple-800 mb-2 flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Connect Social Media
                    </h3>
                    <p className="text-purple-700 text-sm">
                      Add your social media profiles to increase credibility and reach
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                        Facebook Page
                      </label>
                      <input
                        type="url"
                        name="social.facebook"
                        value={institute.social.facebook}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourinstitute"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter Profile
                      </label>
                      <input
                        type="url"
                        name="social.twitter"
                        value={institute.social.twitter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/yourinstitute"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                        LinkedIn Page
                      </label>
                      <input
                        type="url"
                        name="social.linkedin"
                        value={institute.social.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/company/yourinstitute"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        Instagram Profile
                      </label>
                      <input
                        type="url"
                        name="social.instagram"
                        value={institute.social.instagram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourinstitute"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Social Links'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                  Danger Zone
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-bold text-red-800 mb-2">⚠️ Critical Actions</h3>
                    <p className="text-red-700 text-sm">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-red-300 rounded-lg">
                      <h4 className="font-bold text-red-700 mb-2">Delete Account</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Permanently delete your institute account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        {saving ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                    
                    <div className="p-4 border border-yellow-300 rounded-lg">
                      <h4 className="font-bold text-yellow-700 mb-2">Export Data</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Download all your institute data including jobs, applications, and profile information.
                      </p>
                      <button
                        onClick={() => alert('Export feature coming soon!')}
                        className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 font-medium"
                      >
                        Export All Data
                      </button>
                    </div>
                    
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <h4 className="font-bold text-gray-700 mb-2">Logout Everywhere</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Logout from all devices and sessions. You'll need to login again on all devices.
                      </p>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Logout All Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}