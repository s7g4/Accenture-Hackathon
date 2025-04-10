"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const router = useRouter();
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    skills_required: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      await axios.post("http://localhost:8000/recruiter/post", job, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job posted successfully!");
      router.push("/recruiter/jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to post job.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>

      <input
        className="w-full mb-3 p-2 border rounded"
        type="text"
        name="title"
        placeholder="Job Title"
        value={job.title}
        onChange={handleChange}
      />

      <textarea
        className="w-full mb-3 p-2 border rounded"
        name="description"
        placeholder="Job Description"
        rows={4}
        value={job.description}
        onChange={handleChange}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        type="text"
        name="location"
        placeholder="Location"
        value={job.location}
        onChange={handleChange}
      />

      <input
        className="w-full mb-4 p-2 border rounded"
        type="text"
        name="skills_required"
        placeholder="Skills Required (comma-separated)"
        value={job.skills_required}
        onChange={handleChange}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Post Job
      </button>
    </div>
  );
}
