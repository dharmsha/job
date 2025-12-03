// components/JobApplication.jsx
'use client';

import { useState } from 'react';
import { 
  Upload, FileText, CheckCircle, 
  MessageSquare, Paperclip, Send 
} from 'lucide-react';

const JobApplication = ({ jobId, userId }) => {
  const [step, setStep] = useState(1);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: 'Resume', description: 'Choose your resume' },
    { number: 2, title: 'Cover Letter', description: 'Add a cover letter' },
    { number: 3, title: 'Questions', description: 'Answer job questions' },
    { number: 4, title: 'Review', description: 'Review & Submit' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Upload resume if new
      let resumeUrl = '';
      if (!useProfileResume && resumeFile) {
        resumeUrl = await uploadResume(resumeFile, userId);
      }

      // 2. Create application record
      const applicationData = {
        jobId,
        userId,
        resumeUrl: resumeUrl || 'profile-resume',
        coverLetter,
        answers: questions,
        status: 'pending',
        appliedAt: new Date().toISOString()
      };

      await saveApplication(applicationData);

      // 3. Send notification to institute
      await notifyInstitute(jobId, userId);

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s.number ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s.number}
              </div>
              <div className="text-center mt-2">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-500">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Resume Selection */}
      {step === 1 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6">Choose Your Resume</h3>
          
          <div className="space-y-6">
            {/* Option 1: Use Profile Resume */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer ${
                useProfileResume ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
              onClick={() => setUseProfileResume(true)}
            >
              <div className="flex items-center">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  useProfileResume ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                }`}>
                  {useProfileResume && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <h4 className="font-semibold">Use My Profile Resume</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    The resume uploaded in your profile will be sent
                  </p>
                  <div className="mt-2 text-sm text-primary-600">
                    Last updated: 2 days ago
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Upload New Resume */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer ${
                !useProfileResume ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
              onClick={() => setUseProfileResume(false)}
            >
              <div className="flex items-center">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  !useProfileResume ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                }`}>
                  {!useProfileResume && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <h4 className="font-semibold">Upload Different Resume</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Upload a new resume for this specific application
                  </p>
                  
                  {!useProfileResume && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">
                        Choose Resume (PDF, DOC)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="btn-primary"
            >
              Next: Cover Letter
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Cover Letter */}
      {step === 2 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6">Cover Letter</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Write a cover letter (optional but recommended)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you're a good fit for this position..."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-primary"
            >
              Next: Questions
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-6">Review Your Application</h3>
          
          <div className="space-y-6">
            {/* Resume */}
            <div>
              <h4 className="font-semibold mb-2">Resume</h4>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FileText className="h-8 w-8 text-gray-400 mr-4" />
                <div>
                  <div className="font-medium">
                    {useProfileResume ? 'Profile Resume' : resumeFile?.name || 'New Resume'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {useProfileResume ? 'Last updated 2 days ago' : 'Will be uploaded'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <h4 className="font-semibold mb-2">Cover Letter</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                {coverLetter || 'No cover letter provided'}
              </div>
            </div>

            {/* Application Status */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-blue-900">
                    Application Status
                  </div>
                  <div className="text-sm text-blue-800">
                    You'll be notified when the institute reviews your application
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};