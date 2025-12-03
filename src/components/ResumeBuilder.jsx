// components/ResumeBuilder.jsx
'use client';

import { useState } from 'react';
import { 
  User, GraduationCap, Briefcase, Award, 
  Mail, Phone, MapPin, Globe, Download 
} from 'lucide-react';

const ResumeBuilder = () => {
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });

  const templates = [
    { id: 1, name: 'Professional', color: 'blue' },
    { id: 2, name: 'Creative', color: 'purple' },
    { id: 3, name: 'Minimal', color: 'gray' }
  ];

  const generatePDF = () => {
    // Generate PDF using jsPDF or html2canvas
    alert('Resume generated!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left - Form */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="input-field" />
              <input type="email" placeholder="Email" className="input-field" />
              <input type="tel" placeholder="Phone Number" className="input-field" />
              <input type="text" placeholder="Location" className="input-field" />
              <input type="url" placeholder="LinkedIn Profile" className="input-field" />
              <input type="url" placeholder="Portfolio Website" className="input-field" />
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Education
            </h3>
            {/* Education form fields */}
          </div>

          {/* Experience */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Work Experience
            </h3>
            {/* Experience form fields */}
          </div>
        </div>
      </div>

      {/* Right - Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Resume Preview</h3>
            
            {/* Resume Preview */}
            <div className="border border-gray-200 rounded-lg p-6 min-h-[400px] bg-white">
              {/* Preview content */}
            </div>

            {/* Template Selection */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Choose Template</h4>
              <div className="flex gap-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    className={`px-4 py-2 rounded-lg border ${
                      template.color === 'blue' ? 'bg-blue-100 border-blue-300' :
                      template.color === 'purple' ? 'bg-purple-100 border-purple-300' :
                      'bg-gray-100 border-gray-300'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={generatePDF}
              className="mt-6 w-full btn-primary flex items-center justify-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Resume (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};