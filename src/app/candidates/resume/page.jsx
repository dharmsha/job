'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  ArrowLeft, Upload, FileText, User, Mail, Phone, 
  Briefcase, GraduationCap, CheckCircle, AlertCircle,
  Loader2, Download, Eye, Clock
} from 'lucide-react';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    currentPosition: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolio: '',
    resumeFile: null,
    resumeFileName: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (userId) => {
    try {
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData(prev => ({
          ...prev,
          fullName: userData.fullName || userData.name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        }));
      }

      // Check if resume already exists
      const resumeDoc = await getDoc(doc(db, 'resumes', userId));
      if (resumeDoc.exists()) {
        const resumeData = resumeDoc.data();
        setFormData(prev => ({
          ...prev,
          ...resumeData,
          resumeFileName: resumeData.resumeFileName || ''
        }));
        
        // If user has resume, show message
        if (resumeData.resumeUrl) {
          // Already has resume
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF or Word documents only');
        return;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        resumeFile: file,
        resumeFileName: file.name 
      }));
    }
  };

  const uploadFileToStorage = async (file, userId) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `resume_${userId}_${timestamp}.${fileExtension}`;
      
      const storageRef = ref(storage, `resumes/${userId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.resumeFile) {
      alert('Please upload your resume file');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      let resumeUrl = '';
      
      // Step 1: Upload file to Firebase Storage
      if (formData.resumeFile) {
        resumeUrl = await uploadFileToStorage(formData.resumeFile, user.uid);
      }
      
      // Step 2: Save resume data to Firestore
      const resumeData = {
        userId: user.uid,
        fullName: formData.fullName,
        email: formData.email || user.email,
        phone: formData.phone,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
        currentPosition: formData.currentPosition,
        linkedinProfile: formData.linkedinProfile,
        githubProfile: formData.githubProfile,
        portfolio: formData.portfolio,
        resumeFileName: formData.resumeFileName,
        resumeUrl: resumeUrl,
        fileType: formData.resumeFile?.type || '',
        fileSize: formData.resumeFile?.size || 0,
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Save to resumes collection
      await setDoc(doc(db, 'resumes', user.uid), resumeData);
      
      // Update user document
      await setDoc(doc(db, 'users', user.uid), {
        hasResume: true,
        resumeUploaded: true,
        resumeUrl: resumeUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Update candidate document
      await setDoc(doc(db, 'candidates', user.uid), {
        resumeUploaded: true,
        resumeUrl: resumeUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Success
      setTimeout(() => {
        alert('✅ Resume uploaded successfully!');
        router.push('/candidates/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('❌ Error uploading resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/candidates/dashboard')}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload Your Resume</h1>
                <p className="text-gray-600 text-sm">Create your professional profile</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">
              Upload your resume and complete your profile to apply for jobs. Institutes will see this information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || user?.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                    readOnly={!!user?.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 7404980061"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Professional Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Software Engineer, Math Teacher"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education *
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., B.Tech in Computer Science from XYZ University (2023)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated) *
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., JavaScript, React, Node.js, Teaching, Mathematics"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Resume Upload *
              </h3>
              
              <div 
                className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  formData.resumeFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {formData.resumeFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-medium text-green-700">
                        {formData.resumeFileName}
                      </span>
                    </div>
                    
                    {uploading && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resumeFile: null, resumeFileName: '' }))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-100 rounded-full inline-block">
                      <Upload className="w-12 h-12 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag & drop your resume here
                      </p>
                      <p className="text-gray-600">or</p>
                    </div>
                    <label className="cursor-pointer inline-block">
                      <div className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Browse Files
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      Supports PDF, DOC, DOCX • Max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/candidates/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Upload Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Important Notes</p>
                <ul className="mt-2 space-y-1 text-blue-700 text-sm">
                  <li>• Your resume will be visible to institutes when you apply for jobs</li>
                  <li>• Keep your contact information updated</li>
                  <li>• Include relevant skills and experience for better job matches</li>
                  <li>• You can update your resume anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}