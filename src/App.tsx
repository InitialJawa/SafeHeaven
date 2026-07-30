/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppStore } from './stores';
import { auth, onAuthStateChanged } from './lib/firebase';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes';

export default function App() {
  const { user, fetchInitialData, loginWithGoogle } = useAppStore();

  useEffect(() => {
    let hasFetched = false;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user || user.id !== firebaseUser.uid) {
          await loginWithGoogle(
            firebaseUser.email || 'user@gmail.com',
            firebaseUser.displayName || 'Google User',
            firebaseUser.uid
          );
        }
        fetchInitialData();
      } else {
        if (!hasFetched) {
          fetchInitialData();
        }
      }
      hasFetched = true;
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Toaster position="top-right" theme="dark" closeButton />
      <AppRoutes />
    </>
  );
}
