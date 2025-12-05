'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc,
  increment 
} from 'firebase/firestore';
import { CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';

export default function ApplyButton({ job }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleApply = async () => {
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = auth.currentUser.uid;
      
      // 1. Check if user has resume
      const resumeDoc = await getDoc(doc(db, 'resumes', userId));
      if (!resumeDoc.exists()) {
        setError('Please upload your resume first before applying for jobs.');
        setLoading(false);
        setTimeout(() => {
          router.push('/candidates/resume');
        }, 2000);
        return;
      }

      const resumeData = resumeDoc.data();
      
      // 2. Check if already applied
      const applicationsQuery = collection(db, 'applications');
      // In real implementation, you'd query to check for existing application
      // For simplicity, we'll proceed
      
      // 3. Get user info
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // 4. Create application document
      const applicationData = {
        candidateId: userId,
        candidateName: userData.fullName || auth.currentUser.displayName || auth.currentUser.email?.split('@')[0],
        candidateEmail: auth.currentUser.email,
        resumeUrl: resumeData.resumeUrl,
        instituteId: job.instituteId,
        instituteName: job.instituteName,
        jobId: job.id,
        jobTitle: job.title,
        jobType: job.jobType,
        location: job.location,
        salary: job.salary,
        status: 'applied',
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resumeFileName: resumeData.resumeFileName,
        experience: resumeData.experience || '',
        skills: resumeData.skills || [],
        education: resumeData.education || ''
      };

      // 5. Save application
      await addDoc(collection(db, 'applications'), applicationData);
      
      // 6. Update job applications count
      const jobRef = doc(db, 'jobs', job.id);
      await updateDoc(jobRef, {
        applicationsCount: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // 7. Update candidate's application count
      const candidateRef = doc(db, 'candidates', userId);
      await updateDoc(candidateRef, {
        totalApplications: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setSuccess('✅ Successfully applied for this job!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/candidates/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error applying for job:', err);
      setError('Failed to apply for job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleApply}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Applying...
          </>
        ) : (
          <>
            <FileText className="h-5 w-5 mr-2" />
            Apply Now
          </>
        )}
      </button>
      
      <div className="text-sm text-gray-600">
        <p className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Your resume will be sent to the institute
        </p>
        <p className="flex items-center mt-2">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          Track your application status in dashboard
        </p>
      </div>
    </div>
  );
}