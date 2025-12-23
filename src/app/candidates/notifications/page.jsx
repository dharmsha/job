'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/src/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  Bell,
  Check,
  X,
  Trash2,
  ExternalLink,
  Calendar,
  Mail,
  Briefcase,
  Filter,
  ChevronRight,
  BellOff,
  Eye,
  EyeOff
} from 'lucide-react';

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [loading, setLoading] = useState(true);
  const [showMarkAll, setShowMarkAll] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setupNotificationsListener(currentUser.uid);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [router]);

  const setupNotificationsListener = (userId) => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          readAt: doc.data().readAt?.toDate?.() || null
        }));
        
        setNotifications(notifs);
        setShowMarkAll(notifs.some(n => !n.read));
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const batchPromises = unreadNotifications.map(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        return updateDoc(notificationRef, {
          read: true,
          readAt: new Date()
        });
      });
      
      await Promise.all(batchPromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) return;
    
    try {
      const readNotifications = notifications.filter(n => n.read);
      const batchPromises = readNotifications.map(notification => 
        deleteDoc(doc(db, 'notifications', notification.id))
      );
      
      await Promise.all(batchPromises);
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'application_update':
        if (notification.jobId) {
          router.push(`/jobs/${notification.jobId}`);
        }
        break;
      case 'new_message':
        if (notification.applicationId) {
          router.push(`/candidates/applications/${notification.applicationId}`);
        }
        break;
      case 'profile_reminder':
        router.push('/candidates/resume');
        break;
      default:
        break;
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_update':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'new_message':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'profile_reminder':
        return <Bell className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 text-sm">
                  {notifications.length} total • {notifications.filter(n => !n.read).length} unread
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/candidates/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats and Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {notifications.filter(n => !n.read).length}
                </div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              
              <div className="h-8 w-px bg-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'read' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Read
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {showMarkAll && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center text-sm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </button>
                )}
                
                {notifications.some(n => n.read) && (
                  <button
                    onClick={deleteAllRead}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <BellOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You don't have any notifications yet." 
                  : `No ${filter} notifications found.`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-full ${
                        !notification.read 
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                          <span className="text-sm text-gray-500">
                            {notification.createdAt.toLocaleDateString()} • {notification.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>
                      
                      {notification.meta && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {notification.meta.jobTitle && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {notification.meta.jobTitle}
                            </span>
                          )}
                          {notification.meta.status && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              notification.meta.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                              notification.meta.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.meta.status}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {notification.createdAt.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as read"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Types Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold">Application Updates</h4>
                <p className="text-sm text-gray-600">Status changes on your job applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold">Messages</h4>
                <p className="text-sm text-gray-600">Communication from institutes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold">Reminders</h4>
                <p className="text-sm text-gray-600">Profile updates and deadlines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}