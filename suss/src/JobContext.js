import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    });
    return () => unsubscribe();
  }, []);

  const addJob = async (title, company, description, location) => {
    const newJob = {
      title,
      company,
      description,
      location,
      isApproved: false,
      createdAt: new Date(),
    };
    await addDoc(collection(db, 'jobs'), newJob);
  };

  const approveJob = async (id) => {
    const jobRef = doc(db, 'jobs', id);
    await updateDoc(jobRef, { isApproved: true });
  };

  const deleteJob = async (id) => {
    await deleteDoc(doc(db, 'jobs', id));
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, approveJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobContext);
}
