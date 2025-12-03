'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';

export default function ApplyPage() {
  const { id: jobId } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() });
      }
      setLoading(false);
    };
    fetchJob();
  }, [jobId]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to apply');
      return;
    }

    setUploading(true);
    try {
      let resumeUrl = '';
      if (resume) {
        // Upload resume to storage
        const resumeRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${resume.name}`);
        await uploadBytes(resumeRef, resume);
        resumeUrl = await getDownloadURL(resumeRef);
      }

      // Create application document
      const applicationId = `${jobId}_${user.uid}`;
      await setDoc(doc(db, 'applications', applicationId), {
        jobId,
        userId: user.uid,
        resumeUrl,
        coverLetter,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      });

      alert('Application submitted successfully!');
      // Redirect to dashboard or job page
    } catch (error) {
      console.error('Error applying:', error);
      alert('Error applying. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Apply for {job?.title}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Resume (PDF, DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">
            If you don't upload a new resume, your primary resume will be used.
          </p>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
        >
          {uploading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}