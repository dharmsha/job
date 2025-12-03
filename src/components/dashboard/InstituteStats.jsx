'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getCountFromServer
} from 'firebase/firestore';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function InstituteStats() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeStudents: 0,
    placementRate: 0,
    pendingApplications: 0,
    avgSalary: '0'
  });
  const [loading, setLoading] = useState(true);
  const [instituteId, setInstituteId] = useState(null);

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      setInstituteId(currentUser.uid);
      
      // 1. Fetch user data to check if institute
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', currentUser.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty || userSnapshot.docs[0].data().userType !== 'institute') {
        console.log('User is not an institute');
        return;
      }

      // 2. Fetch institute stats
      await fetchInstituteStats(currentUser.uid);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstituteStats = async (uid) => {
    try {
      // Get total jobs posted by this institute
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(jobsRef, where('instituteId', '==', uid));
      const jobsSnapshot = await getCountFromServer(jobsQuery);
      const totalJobs = jobsSnapshot.data().count;

      // Get all applications for institute's jobs
      const appsRef = collection(db, 'applications');
      const appsQuery = query(appsRef, where('instituteId', '==', uid));
      const appsSnapshot = await getCountFromServer(appsQuery);
      const totalApplications = appsSnapshot.data().count;

      // Get pending applications
      const pendingQuery = query(
        appsRef, 
        where('instituteId', '==', uid),
        where('status', '==', 'pending')
      );
      const pendingSnapshot = await getCountFromServer(pendingQuery);
      const pendingApplications = pendingSnapshot.data().count;

      // Calculate placement rate (approved applications / total applications)
      const approvedQuery = query(
        appsRef,
        where('instituteId', '==', uid),
        where('status', '==', 'approved')
      );
      const approvedSnapshot = await getCountFromServer(approvedQuery);
      const approvedApplications = approvedSnapshot.data().count;
      
      const placementRate = totalApplications > 0 
        ? Math.round((approvedApplications / totalApplications) * 100)
        : 0;

      // Get active students (unique candidates who applied)
      const appsDocs = await getDocs(appsQuery);
      const uniqueCandidates = new Set();
      appsDocs.forEach(doc => {
        const data = doc.data();
        if (data.candidateId) {
          uniqueCandidates.add(data.candidateId);
        }
      });
      const activeStudents = uniqueCandidates.size;

      // Calculate average salary (mock for now)
      const avgSalary = '₹25,000';

      setStats({
        totalJobs,
        totalApplications,
        activeStudents,
        placementRate,
        pendingApplications,
        avgSalary
      });

    } catch (error) {
      console.error('Error in fetchInstituteStats:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Jobs Posted",
      value: stats.totalJobs,
      change: "+2",
      trend: "up",
      icon: Briefcase,
      color: "blue",
      description: "Active job listings"
    },
    {
      title: "Applications Received",
      value: stats.totalApplications,
      change: `+${stats.pendingApplications} pending`,
      trend: stats.pendingApplications > 0 ? "up" : "neutral",
      icon: Users,
      color: "green",
      description: `${stats.pendingApplications} pending review`
    },
    {
      title: "Active Candidates",
      value: stats.activeStudents,
      change: "Recently applied",
      trend: "up",
      icon: Users,
      color: "purple",
      description: "Unique applicants"
    },
    {
      title: "Placement Rate",
      value: `${stats.placementRate}%`,
      change: "+5% this month",
      trend: stats.placementRate > 70 ? "up" : stats.placementRate > 40 ? "neutral" : "down",
      icon: TrendingUp,
      color: "orange",
      description: "Success rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 inline-block mb-4`}>
                  <div className={`text-${stat.color}-600`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                stat.trend === 'up' ? 'bg-green-50 text-green-700' : 
                stat.trend === 'down' ? 'bg-red-50 text-red-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {stat.trend === 'up' ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : stat.trend === 'down' ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : null}
                {stat.change}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}