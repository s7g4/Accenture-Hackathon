'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaFileUpload, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaTools } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JobDetailsAndApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form data state
  const [application, setApplication] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
    linkedIn: '',
    portfolio: ''
  });

  // Job data state
  const [job, setJob] = useState({
    id: Number(jobId),
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: {
      age: '',
      skills: [] as string[]
    },
    deadline: '',
    tags: [] as string[]
  });

  // Fetch job data
  useEffect(() => {
    // Fetch from mock data + localStorage
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

    // Get stored jobs
    const storedJobsString = localStorage.getItem('recruiterJobs');
    const storedJobs = storedJobsString ? JSON.parse(storedJobsString) : [];

    // Combine all jobs
    const allJobs = [...mockJobs, ...storedJobs];

    // Find the job
    const foundJob = allJobs.find(j => j.id === Number(jobId));

    if (foundJob) {
      setJob(foundJob);
    }
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file processing
    setIsUploading(true);

    try {
      // This is a mock function - in production, you'd send the file to your backend API
      await simulateFileProcessing(file);

      setApplication(prev => ({
        ...prev,
        resume: file,
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "(123) 456-7890",
        linkedIn: "linkedin.com/in/janesmith",
        portfolio: "janesmith.dev"
      }));

      setUploadSuccess(true);
      toast.success('Resume parsed successfully!');
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process the resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const simulateFileProcessing = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!application.fullName || !application.email || !application.resume) {
      toast.error("Please fill all required fields and upload your resume");
      return;
    }

    // In a real app, send application data to the server
    console.log('Submitting application:', {job: job, application: application});

    // Store application in localStorage for demo purposes
    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      ...application,
      resumeFileName: application.resume?.name,
      appliedAt: new Date().toISOString()
    };

    const existingApplicationsString = localStorage.getItem('candidateApplications');
    const existingApplications = existingApplicationsString
      ? JSON.parse(existingApplicationsString)
      : [];

    localStorage.setItem(
      'candidateApplications',
      JSON.stringify([...existingApplications, applicationData])
    );

    toast.success('Application submitted successfully!');

    // Redirect after a delay
    setTimeout(() => {
      router.push('/dashboard/candidate');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/dashboard/candidate" className="mr-4">
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Job Details & Application</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Job Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{job.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaDollarSign className="mr-2 text-green-600" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2 text-red-600" />
              <span>Apply by: {job.deadline}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Application Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for this Position</h2>

          {/* Resume Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
                <FaFileUpload className="text-blue-500 text-3xl mb-2" />
                <h3 className="text-lg font-medium">Upload Your Resume</h3>
                <p className="text-sm text-gray-500 mb-3">Upload a PDF or Doc file and we'll automatically fill in your details</p>

                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </span>
                  ) : uploadSuccess ? (
                    <span className="flex items-center">
                      <FaCheckCircle className="mr-2" /> Resume Uploaded
                    </span>
                  ) : (
                    "Upload Resume"
                  )}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={application.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={application.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={application.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedIn"
                  value={application.linkedIn}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/yourprofile"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Portfolio/Website</label>
              <input
                type="text"
                name="portfolio"
                value={application.portfolio}
                onChange={handleChange}
                placeholder="yourwebsite.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={application.coverLetter}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us why you're a great fit for this position..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-6">
                By clicking "Submit Application", you agree to our terms and conditions and confirm that your resume and information are accurate.
              </p>
              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard/candidate"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}