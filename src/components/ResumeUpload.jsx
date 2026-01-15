// components/ResumeUpload.jsx
'use client';

import { useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { storage } from '@/src/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ResumeUpload = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      // Create storage reference
      const storageRef = ref(storage, `resumes/${userId}/${Date.now()}_${file.name}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const url = await getDownloadURL(storageRef);
      setResumeUrl(url);
      
      // Save to user profile in Firestore
      await saveResumeUrlToProfile(userId, url);
      
      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="hidden"
        id="resume-upload"
      />
      
      <label
        htmlFor="resume-upload"
        className="cursor-pointer bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
      >
        Choose Resume File
      </label>
      
      {file && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">{file.name}</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      )}
    </div>
  );
};