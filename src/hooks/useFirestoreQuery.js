// src/hooks/useFirestoreQuery.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export const useFirestoreQuery = (collectionName, conditions = [], sortConfig = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(conditions), JSON.stringify(sortConfig)]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ref = collection(db, collectionName);
      let q = query(ref);
      
      // Add conditions
      conditions.forEach(cond => {
        q = query(q, where(cond.field, cond.operator, cond.value));
      });
      
      // Try with sorting
      let snapshot;
      try {
        if (sortConfig) {
          q = query(q, orderBy(sortConfig.field, sortConfig.order || 'asc'));
        }
        snapshot = await getDocs(q);
      } catch (orderByError) {
        // If orderBy fails, fetch without it
        console.log('OrderBy failed, fetching without sort:', orderByError.message);
        
        // Remove orderBy and fetch
        let q2 = query(ref);
        conditions.forEach(cond => {
          q2 = query(q2, where(cond.field, cond.operator, cond.value));
        });
        
        snapshot = await getDocs(q2);
      }
      
      let result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Apply client-side sorting if orderBy failed
      if (sortConfig && result.length > 0 && !result[0][sortConfig.field]) {
        result.sort((a, b) => {
          const valA = a[sortConfig.field];
          const valB = b[sortConfig.field];
          if (sortConfig.order === 'desc') {
            return new Date(valB) - new Date(valA);
          } else {
            return new Date(valA) - new Date(valB);
          }
        });
      }
      
      setData(result);
    } catch (err) {
      console.error('Firestore query error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};

// Usage in your components:
const InstituteApplications = () => {
  const currentUser = auth.currentUser;
  
  const { data: applications, loading } = useFirestoreQuery(
    'applications',
    [{ field: 'instituteId', operator: '==', value: currentUser?.uid }],
    { field: 'createdAt', order: 'desc' }
  );
  
  // ... rest of your component
};