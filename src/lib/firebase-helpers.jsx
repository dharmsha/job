import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ==================== USERS ====================
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { 
        success: true, 
        data: { id: userSnap.id, ...userSnap.data() } 
      };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// ==================== JOBS ====================
export const createJob = async (jobData) => {
  try {
    const jobsRef = collection(db, 'jobs');
    const jobRef = doc(jobsRef);
    
    await setDoc(jobRef, {
      ...jobData,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      applicants: [],
      views: 0,
      applicationsCount: 0
    });
    
    return { success: true, jobId: jobRef.id };
  } catch (error) {
    console.error('Error creating job:', error);
    return { success: false, error };
  }
};

export const getAllJobs = async (filters = {}) => {
  try {
    let q = collection(db, 'jobs');
    
    // Apply filters
    const conditions = [];
    if (filters.location) {
      conditions.push(where('location', '==', filters.location));
    }
    if (filters.jobType) {
      conditions.push(where('jobType', '==', filters.jobType));
    }
    if (filters.minSalary) {
      conditions.push(where('salary', '>=', parseInt(filters.minSalary)));
    }
    if (filters.status) {
      conditions.push(where('status', '==', filters.status));
    }
    
    // Add ordering
    conditions.push(orderBy('createdAt', 'desc'));
    
    // Create query
    q = query(q, ...conditions);
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return { success: true, jobs };
  } catch (error) {
    console.error('Error getting jobs:', error);
    return { success: false, error, jobs: [] };
  }
};

export const getJobById = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    
    if (jobSnap.exists()) {
      const data = jobSnap.data();
      return {
        success: true,
        job: {
          id: jobSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      };
    } else {
      return { success: false, error: 'Job not found' };
    }
  } catch (error) {
    console.error('Error getting job:', error);
    return { success: false, error };
  }
};

export const applyForJob = async (jobId, userId, applicationData) => {
  try {
    // Create application
    const applicationRef = doc(collection(db, 'applications'));
    await setDoc(applicationRef, {
      jobId,
      userId,
      ...applicationData,
      status: 'pending',
      appliedAt: serverTimestamp()
    });
    
    // Update job's applicants
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      applicants: arrayUnion(userId),
      applicationsCount: increment(1)
    });
    
    return { success: true, applicationId: applicationRef.id };
  } catch (error) {
    console.error('Error applying for job:', error);
    return { success: false, error };
  }
};

// ==================== FILE UPLOAD ====================
export const uploadFile = async (file, userId, folder = 'resumes') => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${userId}_${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error };
  }
};

// ==================== PAYMENTS ====================
export const createPaymentRecord = async (paymentData) => {
  try {
    const paymentRef = doc(collection(db, 'payments'));
    
    await setDoc(paymentRef, {
      ...paymentData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, paymentId: paymentRef.id };
  } catch (error) {
    console.error('Error creating payment record:', error);
    return { success: false, error };
  }
};

export const updatePaymentStatus = async (paymentId, status, razorpayData = {}) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    
    await updateDoc(paymentRef, {
      status,
      ...razorpayData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error };
  }
};

// ==================== REAL-TIME UPDATES ====================
export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      q = query(q, ...conditions);
    }
    
    // Note: For real-time updates, you'd use onSnapshot
    // This is a simplified version
    return null;
  } catch (error) {
    console.error('Error subscribing to collection:', error);
    return null;
  }
};

// ==================== STATS ====================
export const getDashboardStats = async (userId, userType) => {
  try {
    let stats = {
      totalJobs: 0,
      totalApplications: 0,
      activeJobs: 0,
      pendingApplications: 0
    };
    
    if (userType === 'institute') {
      // Get institute's jobs
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('instituteId', '==', userId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      stats.totalJobs = jobsSnapshot.size;
      
      // Count active jobs
      const activeJobs = jobsSnapshot.docs.filter(doc => 
        doc.data().status === 'active'
      );
      stats.activeJobs = activeJobs.length;
      
      // Count total applications
      let totalApps = 0;
      jobsSnapshot.forEach(doc => {
        totalApps += (doc.data().applicationsCount || 0);
      });
      stats.totalApplications = totalApps;
      
    } else if (userType === 'job_seeker') {
      // Get user's applications
      const appsQuery = query(
        collection(db, 'applications'),
        where('userId', '==', userId)
      );
      const appsSnapshot = await getDocs(appsQuery);
      stats.totalApplications = appsSnapshot.size;
      
      // Count pending applications
      const pendingApps = appsSnapshot.docs.filter(doc => 
        doc.data().status === 'pending'
      );
      stats.pendingApplications = pendingApps.length;
    }
    
    return { success: true, stats };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error, stats: {} };
  }
};

// Increment field helper (Firestore doesn't have increment in v9 modular SDK)
import { increment as inc } from 'firebase/firestore';
export { inc as increment };