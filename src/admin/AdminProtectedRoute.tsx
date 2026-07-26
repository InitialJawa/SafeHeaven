/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Redirect } from 'wouter';
import { useAppStore } from '../stores';
import { auth } from '../lib/firebase';
import { PageLoader } from '../components/PageLoader';
import { toast } from 'sonner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppStore();
  const [checkingClaim, setCheckingClaim] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setCheckingClaim(false);
        }
        return;
      }

      try {
        let adminRole = user.role === 'admin';

        // Check Firebase Custom Claim if logged in with Firebase Auth
        if (auth.currentUser) {
          try {
            const tokenResult = await auth.currentUser.getIdTokenResult();
            if (tokenResult.claims && tokenResult.claims.role === 'admin') {
              adminRole = true;
            }
          } catch (e) {
            console.warn('Gagal membaca token claims Firebase Auth, menggunakan role profil:', e);
          }
        }

        if (isMounted) {
          setIsAdmin(adminRole);
          if (!adminRole) {
            toast.error('Akses Ditolak: Anda memerlukan hak akses Admin untuk membuka halaman ini.');
          }
          setCheckingClaim(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsAdmin(user.role === 'admin');
          setCheckingClaim(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (checkingClaim) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};
