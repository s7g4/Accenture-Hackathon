import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useTokenExpiry from "@/utils/useTokenExpiry";

export default function MatchJobs() {
  useTokenExpiry();
  const [matchedJobs, setMatchedJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    axios
      .get("http://localhost:8000/match", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMatchedJobs(res.data))
      .catch((err) => console.log("Failed to fetch matched jobs"));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Recommended Jobs For You</h1>
      {matchedJobs.length === 0 ? (
        <p>No matched jobs based on your profile yet.</p>
      ) : (
        <div className="grid gap-4">
          {matchedJobs.map((job, index) => (
            <div key={index} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">Location: {job.location}</p>
              <p className="text-sm text-gray-500">
                Skills: {job.skills_required}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
