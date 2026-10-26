'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function Dashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const user = params.get('user');

  return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="logo-wrap">
          <img src="/campx-logo.png" alt="CampX" className="campx-logo" />
        </div>
        <h1 className="welcome">Credentials updated successfully ✅</h1>
        <p className="subtitle">
          {user && (
            <>
              Welcome, <strong>{user}</strong>.{' '}
            </>
          )}
          Your session credentials have been updated successfully — you can leave.
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => router.push('/login')}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}
