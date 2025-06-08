import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

const AdminDashboardComponent = dynamic(() => import('../components/admindashboard'), { ssr: false });

export default function AdminDashboardPage() {
  const router = useRouter();

  const assignLecturer = () => {
    alert("Assign lecturer logic to be implemented with GraphQL.");
  };

  const editCourse = () => {
    alert("Course management logic to be implemented with GraphQL.");
  };

  const blockCandidate = () => {
    alert("Block/unblock candidate logic to be implemented with GraphQL.");
  };

  React.useEffect(() => {
   const isAuthenticated = sessionStorage.getItem("adminAuth");
    if (isAuthenticated !== "true") {
      alert("Not authenticated")
      router.push("/loginForm");
    }
  }, [router]);

  return (
    <AdminDashboardComponent
      assignLecturer={assignLecturer}
      blockCandidate={blockCandidate}
      editCourse={editCourse}
    />
  );
}