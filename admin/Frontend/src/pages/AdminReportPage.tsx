// pages/AdminReportpage.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminReport from "../components/AdminReport"; // Adjust path if needed

export default function AdminReportPage(){
  const router = useRouter();

  

  useEffect(() => {
    // Check session storage to verify if admin is authenticated
    const isAdmin = sessionStorage.getItem("adminAuth") === "true";
    if (!isAdmin) {
      alert("Unauthorized. Redirecting to login.");
      router.push("/loginForm");
    }
  }, [router]);

  return <AdminReport />;
}
