"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CandidateProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    education: "",
    experience: "",
    skills: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    axios
      .get("http://localhost:8000/candidate/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => console.log("Error fetching profile"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8000/candidate/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <input
        className="w-full mb-3 p-2 border rounded"
        name="name"
        placeholder="Name"
        value={profile.name}
        onChange={handleChange}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        name="education"
        placeholder="Education"
        value={profile.education}
        onChange={handleChange}
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        name="experience"
        placeholder="Experience"
        value={profile.experience}
        onChange={handleChange}
      />
      <input
        className="w-full mb-4 p-2 border rounded"
        name="skills"
        placeholder="Skills (comma-separated)"
        value={profile.skills}
        onChange={handleChange}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={handleSubmit}
      >
        Save Profile
      </button>
    </div>
  );
}
