import dynamic from 'next/dynamic';// Import router for navigation

import { useRouter } from 'next/router';// Import React for hooks

import React from 'react';// Import React for hooks


const AdminDashboardComponent = dynamic(() => import('../components/admindashboard'), { ssr: false });// Load AdminDashboardComponent only on the client side


export default function AdminDashboardPage() {
  const router = useRouter();

  const assignLecturer = () => {// Placeholder function for assigning a lecturer
    alert("Assign lecturer logic to be implemented with GraphQL.");
  };

  const editCourse = () => {   // Placeholder function for course editing
    alert("Course management logic to be implemented with GraphQL.");
  };

  const blockCandidate = () => { // Placeholder function for blocking/unblocking candidates
    alert("Block/unblock candidate logic to be implemented with GraphQL.");
  };

  React.useEffect(() => { // Check if the admin is authenticated when the page loads
   const isAuthenticated = sessionStorage.getItem("adminAuth");
    if (isAuthenticated !== "true") {
      alert("Not authenticated")
      router.push("/loginForm");
    }
  }, [router]);

  return ( // Render the admin dashboard with feature handlers
    <AdminDashboardComponent
      assignLecturer={assignLecturer}
      blockCandidate={blockCandidate}
      editCourse={editCourse}
    />
  );
}