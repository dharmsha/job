'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function ApplyPage() {
  const { id: jobId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/jobs/${jobId}/apply`);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch job details
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        } else {
          router.push('/jobs');
          return;
        }

        // Fetch user profile
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }

          // Check if user already applied
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('jobId', '==', jobId),
            where('userId', '==', user.uid)
          );
          const applicationsSnapshot = await getDocs(applicationsQuery);
          setHasApplied(!applicationsSnapshot.empty);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ general: 'Failed to load data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, user, authLoading, router]);

  const validateForm = () => {
    const newErrors = {};

    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter should be at least 50 characters';
    } else if (coverLetter.length > 5000) {
      newErrors.coverLetter = 'Cover letter should not exceed 5000 characters';
    }

    if (resume) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(resume.type)) {
        newErrors.resume = 'Please upload a PDF or DOC/DOCX file';
      } else if (resume.size > maxSize) {
        newErrors.resume = 'File size should not exceed 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setErrors({ ...errors, resume: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setErrors({});

    try {
      let resumeUrl = userProfile?.primaryResumeUrl || '';

      // Upload new resume if provided
      if (resume) {
        const fileName = `resume_${Date.now()}_${resume.name.replace(/\s+/g, '_')}`;
        const resumeRef = ref(storage, `resumes/${user.uid}/${fileName}`);
        await uploadBytes(resumeRef, resume);
        resumeUrl = await getDownloadURL(resumeRef);

        // Update user's primary resume if they want
        if (!userProfile?.primaryResumeUrl) {
          await setDoc(doc(db, 'users', user.uid), {
            primaryResumeUrl: resumeUrl
          }, { merge: true });
        }
      }

      if (!resumeUrl) {
        throw new Error('No resume provided. Please upload a resume or set a primary resume in your profile.');
      }

      // Create application document
      const applicationId = `${jobId}_${user.uid}_${Date.now()}`;
      const applicationData = {
        jobId,
        jobTitle: job?.title,
        jobCompany: job?.instituteName,
        userId: user.uid,
        userEmail: user.email,
        userName: userProfile?.fullName || user.displayName || 'Anonymous',
        resumeUrl,
        coverLetter: coverLetter.trim(),
        status: 'pending',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewed: false,
        notes: ''
      };

      await setDoc(doc(db, 'applications', applicationId), applicationData);

      // Update job's application count
      const jobRef = doc(db, 'jobs', jobId);
      const currentCount = job?.applicationsCount || 0;
      await setDoc(jobRef, {
        applicationsCount: currentCount + 1
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/candidates/dashboard?tab=applications`);
      }, 2000);

    } catch (error) {
      console.error('Error applying:', error);
      setErrors({
        general: error.message || 'Error submitting application. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push(`/jobs/${jobId}`);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Applied!</h2>
            <p className="text-gray-600 mb-6">
              You have already submitted an application for this position.
              You can track your application status from your dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/candidates/dashboard?tab=applications')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                View Your Applications
              </button>
              <button
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Back to Job Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're trying to apply for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/jobs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Browse Other Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Job
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {success ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your application for <span className="font-semibold">{job.title}</span> has been submitted successfully.
              You will be redirected to your dashboard shortly.
            </p>
            <div className="animate-pulse text-blue-600">Redirecting...</div>
          </div>
        ) : (
          <>
            {/* Job Summary */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600 mb-4">{job.instituteName} • {job.location}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-2" />
                <span>Application for {job.title}</span>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Application Form</h2>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{errors.general}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Cover Letter */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-3">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <div className="mb-2 text-sm text-gray-500">
                    Tell us why you're a great fit for this position. Include relevant experience, skills, and achievements.
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => {
                      setCoverLetter(e.target.value);
                      setErrors({ ...errors, coverLetter: null });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] ${
                      errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Write your cover letter here..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.coverLetter && (
                      <span className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.coverLetter}
                      </span>
                    )}
                    <span className={`text-sm ${coverLetter.length > 5000 ? 'text-red-500' : 'text-gray-500'}`}>
                      {coverLetter.length}/5000 characters
                    </span>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-3">
                    Resume
                    {userProfile?.primaryResumeUrl && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Leave blank to use your primary resume)
                      </span>
                    )}
                  </label>
                  
                  <div className="mb-4">
                    {resume ? (
                      <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{resume.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setResume(null)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Upload your resume (PDF, DOC, DOCX)</p>
                        <p className="text-sm text-gray-500 mb-4">Max file size: 5MB</p>
                        <label className="inline-block">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium">
                            Choose File
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {errors.resume && (
                    <div className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.resume}
                    </div>
                  )}

                  {userProfile?.primaryResumeUrl && !resume && (
                    <div className="mt-3 text-sm text-gray-600">
                      ⓘ Your primary resume will be used for this application.
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Application Tips */}
            <div className="mt-6 bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Application Tips
              </h4>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  Tailor your cover letter to this specific position
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  Highlight relevant skills and achievements
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  Keep your resume updated with recent experience
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  Proofread for spelling and grammar errors
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}