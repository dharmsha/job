import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// User operations
export const userDB = {
  // Create or update user
  async createUser(uid, data) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: uid, ...data };
  },

  // Get user by ID
  async getUser(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  },

  // Update user
  async updateUser(uid, data) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Job operations
export const jobDB = {
  // Create job
  async createJob(data) {
    const jobsRef = collection(db, 'jobs');
    const jobRef = doc(jobsRef);
    await setDoc(jobRef, {
      ...data,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      applicants: []
    });
    return jobRef.id;
  },

  // Get all jobs with filters
  async getJobs(filters = {}) {
    let q = collection(db, 'jobs');
    
    // Apply filters
    if (filters.instituteId) {
      q = query(q, where('instituteId', '==', filters.instituteId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.location) {
      q = query(q, where('location', '==', filters.location));
    }
    if (filters.jobType) {
      q = query(q, where('jobType', '==', filters.jobType));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    return jobs;
  },

  // Get single job
  async getJob(jobId) {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
    return null;
  },

  // Update job
  async updateJob(jobId, data) {
    const jobRef = doc(db, 'jobs', jobId);
    await updateDoc(jobRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Delete job
  async deleteJob(jobId) {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
  }
};

// Application operations
export const applicationDB = {
  // Apply for job
  async applyForJob(jobId, userId, data) {
    const applicationRef = doc(db, 'applications', `${jobId}_${userId}`);
    await setDoc(applicationRef, {
      jobId,
      userId,
      status: 'pending',
      ...data,
      appliedAt: serverTimestamp()
    });

    // Add to job's applicants list
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      const jobData = jobSnap.data();
      const applicants = jobData.applicants || [];
      if (!applicants.includes(userId)) {
        applicants.push(userId);
        await updateDoc(jobRef, { applicants });
      }
    }

    return applicationRef.id;
  },

  // Get applications for user
  async getUserApplications(userId) {
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', userId),
      orderBy('appliedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    return applications;
  },

  // Get applications for job
  async getJobApplications(jobId) {
    const q = query(
      collection(db, 'applications'),
      where('jobId', '==', jobId),
      orderBy('appliedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    return applications;
  }
};

// Payment operations
export const paymentDB = {
  // Create payment record
  async createPayment(data) {
    const paymentRef = doc(collection(db, 'payments'));
    await setDoc(paymentRef, {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return paymentRef.id;
  },

  // Update payment status
  async updatePayment(paymentId, status, razorpayOrderId = null) {
    const paymentRef = doc(db, 'payments', paymentId);
    await updateDoc(paymentRef, {
      status,
      razorpayOrderId,
      updatedAt: serverTimestamp()
    });
  },

  // Get user payments
  async getUserPayments(userId) {
    const q = query(
      collection(db, 'payments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return payments;
  }
};