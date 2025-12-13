import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const checkUserPaymentStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { hasPaid: false, status: 'user_not_found' };
    }
    
    const userData = userDoc.data();
    const paymentRequired = process.env.NEXT_PUBLIC_IS_PAYMENT_REQUIRED === 'true';
    
    // If payment is not required, consider user as paid
    if (!paymentRequired) {
      return { hasPaid: true, status: 'payment_not_required' };
    }
    
    // Check payment status
    const hasPaid = userData.hasPaid === true;
    const paymentStatus = userData.paymentStatus || 'pending';
    
    return {
      hasPaid,
      status: paymentStatus,
      userType: userData.userType,
      plan: userData.paymentPlan
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { hasPaid: false, status: 'error', error: error.message };
  }
};