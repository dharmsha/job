'use client';

import { useRouter } from 'next/navigation';
import { 
  Briefcase,
  Users,
  FileText,
  Settings,
  Bell,
  BarChart,
  MessageSquare,
  Download,
  Plus,
  Calendar,
  Award,
  Mail
} from 'lucide-react';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Post New Job",
      description: "Create and publish new job listing",
      icon: Plus,
      color: "blue",
      action: () => router.push('/jobs')
    },
    {
      title: "View All Applicants",
      description: "Browse all candidate applications",
      icon: Users,
      color: "green",
      action: () => router.push('/institutes/applications')
    },
    {
      title: "Generate Report",
      description: "Create placement analytics report",
      icon: BarChart,
      color: "purple",
      action: () => router.push('/institutes/reports')
    },
    {
      title: "Send Announcement",
      description: "Notify all students about opportunities",
      icon: Bell,
      color: "orange",
      action: () => router.push('/institutes/announcements')
    },
    {
      title: "Message Candidates",
      description: "Contact shortlisted candidates",
      icon: MessageSquare,
      color: "red",
      action: () => router.push('/institutes/messages')
    },
    {
      title: "Download Data",
      description: "Export applications and reports",
      icon: Download,
      color: "indigo",
      action: () => alert('Export feature coming soon!')
    }
  ];

  const upcomingInterviews = [
    { name: "Rahul Sharma", time: "10:30 AM", date: "Today", position: "Math Teacher" },
    { name: "Priya Singh", time: "2:00 PM", date: "Tomorrow", position: "Science Teacher" },
    { name: "Amit Patel", time: "11:00 AM", date: "Jan 20", position: "English Teacher" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-600 mt-1">Frequently used actions for your institute</p>
      </div>

      <div className="p-6">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`group relative p-4 rounded-xl border-2 border-gray-100 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-lg bg-${action.color}-100 text-${action.color}-600 mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                  
                  <div className={`mt-3 text-xs font-medium text-${action.color}-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center`}>
                    Click to access
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upcoming Interviews */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Interviews
          </h4>
          <div className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-bold">
                      {interview.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{interview.name}</p>
                    <p className="text-xs text-gray-600">{interview.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{interview.time}</p>
                  <p className="text-xs text-gray-600">{interview.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            Schedule New Interview →
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span> Respond to applications within 48 hours for better candidate experience
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}