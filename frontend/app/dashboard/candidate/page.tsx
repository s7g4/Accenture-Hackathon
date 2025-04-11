'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaTools, FaSearch, FaFilter} from 'react-icons/fa';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock data - same structure as recruiter jobs
const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced frontend developer with strong React skills to join our team.",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        requirements: {
            age: "18+",
            skills: ["React", "TypeScript", "CSS", "HTML"]
        },
        deadline: "2025-12-31",
        tags: ["Remote", "Full-time", "Senior"]
    },
    {
        id: 2,
        title: "Backend Engineer",
        description: "Seeking a skilled backend engineer to develop and maintain our server infrastructure.",
        location: "New York, NY",
        salary: "$110,000 - $140,000",
        requirements: {
            age: "18+",
            skills: ["Node.js", "Python", "SQL", "MongoDB"]
        },
        deadline: "2025-12-15",
        tags: ["On-site", "Full-time"]
    },
    {
        id: 3,
        title: "UI/UX Designer",
        description: "Join our creative team as a UI/UX designer to create beautiful and functional user interfaces.",
        location: "Remote",
        salary: "$90,000 - $120,000",
        requirements: {
            age: "18+",
            skills: ["Figma", "Adobe XD", "User Research", "Prototyping"]
        },
        deadline: "2025-11-30",
        tags: ["Remote", "Contract"]
    }
];

export default function CandidateDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState(mockJobs);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        /*if (!token || role !== 'candidate') {
          router.push('/login');
        }*/

        // Load additional jobs from localStorage (posted by recruiters)
        const storedJobs = localStorage.getItem('recruiterJobs');
        if (storedJobs) {
            const parsedJobs = JSON.parse(storedJobs);
            setJobs([...mockJobs, ...parsedJobs]);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };

    // Filter jobs based on search term and location
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.requirements.skills.some(skill =>
                skill.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation = filterLocation === '' ||
            job.location.toLowerCase().includes(filterLocation.toLowerCase());

        return matchesSearch && matchesLocation;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000}/>

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 mr-10">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">JF</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">Job Finder</span>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-800">Candidate Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/dashboard/candidate/profile"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                            My Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="Search jobs by title, skills, or keywords"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-grow md:flex-grow-0 md:w-1/3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                placeholder="Filter by location"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={filterLocation}
                                onChange={e => setFilterLocation(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Available Job Opportunities</h2>
                    <p className="text-gray-600">{filteredJobs.length} jobs found</p>
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{job.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaMapMarkerAlt className="mr-2 text-blue-600"/>
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaDollarSign className="mr-2 text-green-600"/>
                                        {job.salary}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaCalendarAlt className="mr-2 text-red-600"/>
                                        Deadline: {job.deadline}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/dashboard/candidate/job/${job.id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm text-center"
                                >
                                    View Details & Apply
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">No jobs found matching your criteria</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}