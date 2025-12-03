// src/app/candidates/resume/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { 
  Upload, 
  FileText, 
  CheckCircle,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Save
} from 'lucide-react';

export default function ResumeUploadPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data on load
  useState(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          name: data.name || '',
          email: data.email || currentUser.email || '',
          phone: data.phone || '',
          education: data.education || '',
          experience: data.experience || '',
          skills: data.skills ? data.skills.join(', ') : ''
        });
        setResumeUrl(data.resumeUrl || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setResumeFile(file);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      alert('Please select a file first');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const fileName = `resumes/${currentUser.uid}_${Date.now()}_${resumeFile.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload file
      await uploadBytes(storageRef, resumeFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        resumeUrl: downloadURL,
        updatedAt: new Date().toISOString()
      });
      
      setResumeUrl(downloadURL);
      setResumeFile(null);
      alert('Resume uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const skillsArray = userData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: userData.name,
        phone: userData.phone,
        education: userData.education,
        experience: userData.experience,
        skills: skillsArray,
        updatedAt: new Date().toISOString()
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Resume & Profile</h1>
          <p className="text-gray-600">Upload your resume and complete your profile to apply for jobs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Resume Upload */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Upload Resume
            </h2>

            {resumeUrl ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-700">Resume uploaded successfully!</span>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View your resume
                  </a>
                  <button
                    onClick={() => setResumeUrl('')}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Upload new resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Drag & drop your resume here or</p>
                  <input
                    type="file"
                    id="resume-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                        Supports PDF, DOC, DOCX • Max 5MB
                  </p>
                </div>

                {resumeFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium">{resumeFile.name}</span>
                      </div>
                      <button
                        onClick={() => setResumeFile(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={uploadResume}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Tip:</span> Institutes will see your resume when you apply. 
                Keep it updated with your latest experience and skills.
              </p>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Profile Information
            </h2>

            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Education
                </h3>
                <textarea
                  value={userData.education}
                  onChange={(e) => setUserData({...userData, education: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Your educational qualifications (e.g., B.Tech in Computer Science, Delhi University)"
                  rows={3}
                />
              </div>

              {/* Experience */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Experience
                </h3>
                <textarea
                  value={userData.experience}
                  onChange={(e) => setUserData({...userData, experience: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Your work experience (e.g., 2 years as Mathematics Teacher at ABC School)"
                  rows={3}
                />
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Skills
                </h3>
                <textarea
                  value={userData.skills}
                  onChange={(e) => setUserData({...userData, skills: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your skills separated by commas (e.g., Mathematics, Teaching, CBSE, Communication)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={saveProfile}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Status */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold mb-6">Your Applications</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You haven't applied for any jobs yet. Browse jobs and apply!
            </p>
            <button
              onClick={() => router.push('/jobs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}