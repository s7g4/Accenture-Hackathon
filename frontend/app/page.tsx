'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding} from 'react-icons/fa';

const Home: React.FC = () => {
    // Mock popular jobs data
    const popularJobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            skills: ["React", "TypeScript", "Tailwind CSS"]
        },
        {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "New York, NY",
            skills: ["Python", "Django", "PostgreSQL"]
        },
        {
            id: 3,
            title: "Full Stack Developer",
            company: "InnovateTech",
            location: "Remote",
            skills: ["JavaScript", "Node.js", "MongoDB"]
        },
        {
            id: 4,
            title: "UI/UX Designer",
            company: "CreativeMinds",
            location: "Austin, TX",
            skills: ["Figma", "Adobe XD", "User Research"]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">JF</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">Job Finder</span>
                    </div>
                    <div className="space-x-4">
                        <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800">
                            Login
                        </Link>
                        <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <div className="container mx-auto py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-6">Find Your Dream Job Today</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Job Finder connects talented professionals with top companies.
                            Browse thousands of opportunities and take the next step in your career journey.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/jobs" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Browse Jobs
                            </Link>
                            <Link href="/employers" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                                For Employers
                            </Link>
                        </div>
                    </div>

                    {/* Popular Jobs Section */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Popular Jobs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularJobs.map((job) => (
                                <Link
                                    href="/login"
                                    key={job.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 hover:border-blue-200"
                                >
                                    <div className="flex items-start mb-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center mr-3">
                                            <FaBriefcase/>
                                        </div>
                                        <h3 className="font-bold">{job.title}</h3>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                                        <FaBuilding className="mr-1"/> {job.company}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3 flex items-center">
                                        <FaMapMarkerAlt className="mr-1"/> {job.location}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                                            >
                                                                            {skill}
                                                                        </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-800">
                                View all jobs →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-xl font-bold">Job Finder</p>
                            <p className="text-sm text-gray-400">Finding the perfect match since 2023</p>
                        </div>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                            <a href="mailto:help@jobfinder.com" className="flex items-center hover:text-blue-300">
                                <FaEnvelope className="mr-2"/> help@jobfinder.com
                            </a>
                            <a href="tel:+1234567890" className="flex items-center hover:text-blue-300">
                                <FaPhone className="mr-2"/> +91 7390346337
                            </a>
                            <a href="https://github.com/s7g4/Accenture-Hackathon" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-300">
                                <FaGithub className="mr-2"/> GitHub Repository
                            </a>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Job Finder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;