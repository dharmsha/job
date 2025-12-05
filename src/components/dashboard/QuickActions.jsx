'use client';

import { 
  Briefcase, 
  Users, 
  Settings, 
  Bell, 
  MessageSquare, 
  BarChart,
  Calendar,
  FileText
} from 'lucide-react';

export default function QuickActions({ 
  user, 
  stats, 
  onPostJob, 
  onViewJobs, 
  onViewCandidates, 
  onSettings 
}) {
  const actions = [
    {
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      title: 'Post New Job',
      description: 'Create a new job posting',
      onClick: onPostJob,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-600'
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: 'Browse Candidates',
      description: 'View candidate profiles',
      onClick: onViewCandidates,
      color: 'bg-green-50 hover:bg-green-100 text-green-600'
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      title: 'View Applications',
      description: 'See all applications',
      onClick: () => window.location.href = '/institutes/applications',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-600'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-yellow-600" />,
      title: 'Messages',
      description: 'Chat with candidates',
      onClick: () => window.location.href = '/messages',
      color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'
    },
    {
      icon: <BarChart className="h-6 w-6 text-red-600" />,
      title: 'Analytics',
      description: 'View insights & reports',
      onClick: () => window.location.href = '/institutes/analytics',
      color: 'bg-red-50 hover:bg-red-100 text-red-600'
    },
    {
      icon: <Settings className="h-6 w-6 text-gray-600" />,
      title: 'Settings',
      description: 'Manage institute profile',
      onClick: onSettings,
      color: 'bg-gray-50 hover:bg-gray-100 text-gray-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full p-4 rounded-lg flex items-center ${action.color} transition-colors`}
          >
            <div className="p-2 bg-white rounded-lg mr-4">
              {action.icon}
            </div>
            <div className="text-left">
              <p className="font-medium">{action.title}</p>
              <p className="text-sm opacity-75">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Upcoming Interviews */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">Upcoming Interviews</h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-600">Software Engineer</p>
            </div>
            <span className="text-sm text-gray-500">Today, 3 PM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-gray-600">Math Teacher</p>
            </div>
            <span className="text-sm text-gray-500">Tomorrow, 11 AM</span>
          </div>
        </div>
      </div>

      {/* Institute Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-4">Institute Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Jobs:</span>
            <span className="font-medium">{stats.totalJobs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Applications:</span>
            <span className="font-medium">{stats.totalApplications}</span>
          </div>
        </div>
      </div>
    </div>
  );
}