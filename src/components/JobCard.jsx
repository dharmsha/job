// src/components/JobCard.jsx - Update this file
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function JobCard({ job }) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

  // Check if user has already applied
  const checkIfApplied = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    try {
      const appsRef = collection(db, 'applications');
      const q = query(
        appsRef,
        where('jobId', '==', job.id),
        where('candidateId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking application:', error);
      return false;
    }
  };

  const handleApplyClick = async () => {
    const currentUser = auth.currentUser;
    
    // Check if user is logged in
    if (!currentUser) {
      alert('Please login to apply for this job');
      router.push('/login');
      return;
    }

    // Check user type
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        alert('Please complete your profile before applying');
        router.push('/profile');
        return;
      }

      const userData = snapshot.docs[0].data();
      if (userData.userType !== 'candidate') {
        alert('Only candidates can apply for jobs');
        return;
      }

      // Check if already applied
      const hasApplied = await checkIfApplied();
      if (hasApplied) {
        setApplied(true);
        alert('You have already applied for this job');
        return;
      }

      // Get candidate's resume URL
      setResumeUrl(userData.resumeUrl || '');
      setShowApplyModal(true);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error checking user data');
    }
  };

  const submitApplication = async () => {
    if (!resumeUrl.trim()) {
      alert('Please upload your resume first');
      router.push('/candidates/resume');
      return;
    }

    setApplying(true);
    try {
      const currentUser = auth.currentUser;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      
      let candidateName = currentUser.displayName || '';
      let candidateEmail = currentUser.email || '';
      let candidatePhone = '';
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        candidateName = userData.name || candidateName;
        candidateEmail = userData.email || candidateEmail;
        candidatePhone = userData.phone || '';
      }

      // Create application document
      await addDoc(collection(db, 'applications'), {
        jobId: job.id,
        jobTitle: job.title,
        candidateId: currentUser.uid,
        instituteId: job.instituteId,
        candidateName,
        candidateEmail,
        candidatePhone,
        resumeUrl,
        notes: notes.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setApplied(true);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{job.companyName || 'Institute'}</span>
            </div>
          </div>
          {job.featured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{job.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{job.salary}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{job.jobType}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{job.postedDateFormatted}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills && job.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {job.applications || 0} applications • Posted by institute
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </button>
            
            {applied ? (
              <button
                disabled
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Applied
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Apply for {job.title}</h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You are applying to <span className="font-semibold">{job.title}</span> at <span className="font-semibold">{job.companyName}</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Resume
                </label>
                {resumeUrl ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-700">Resume uploaded</span>
                    </div>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      View your resume
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 mb-2">No resume found</p>
                    <button
                      onClick={() => router.push('/candidates/resume')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Upload resume first
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Tell the institute why you're a good fit..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={applying}
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={applying || !resumeUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}