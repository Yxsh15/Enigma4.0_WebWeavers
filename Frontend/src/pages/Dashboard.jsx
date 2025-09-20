import React, { useState, useEffect } from 'react';
import { Heart, Users, Target, TrendingUp, MapPin, Calendar, Camera, CheckCircle, AlertCircle, Plus, Filter, Search, Bell, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedProject, setSelectedProject] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    projectsSupported: 0,
    impactPoints: 0
  });
  const [refreshProjects, setRefreshProjects] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // New state for project creation
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    goalAmount: '',
    location: '',
    needsVolunteers: false,
    volunteerFormUrl: '',
    volunteerDescription: '',
    images: [],
    pdfDescription: null
  });

  // File upload handlers
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // Convert files to base64 URLs for preview
      const imagePromises = imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({
            file: file,
            preview: e.target.result,
            name: file.name
          });
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(images => {
        setNewProject(prev => ({
          ...prev,
          images: [...prev.images, ...images]
        }));
      });
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewProject(prev => ({
        ...prev,
        pdfDescription: {
          file: file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) // Size in MB
        }
      }));
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const removeImage = (index) => {
    setNewProject(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removePdf = () => {
    setNewProject(prev => ({
      ...prev,
      pdfDescription: null
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name || "User");
      setEmail(decodedToken.email || "");
    }
  }, []);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/projects/');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, [refreshProjects]);

  const quickDonationAmounts = [10, 25, 50, 100, 250];

  const initiateDonation = async (amount) => {
    setLoading(true);
    try {
      const { data: { order_id, amount: orderAmount } } = await axios.post('http://localhost:8000/donations/order', {
        amount: amount,
        name: name,
        email: email,
        message: message,
        project_id: selectedProject._id
      });

      const options = {
        key: 'rzp_test_RDYHAwuhrCq062',
        amount: orderAmount,
        currency: 'INR',
        name: 'Support This Project',
        description: 'Donation',
        order_id: order_id,
        handler: async function (response) {
          const donationData = {
            name: name,
            email: email,
            amount: parseFloat(donationAmount),
            message: message,
            project_id: selectedProject._id
          };

          await axios.post('http://localhost:8000/donations/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            donation: donationData
          });
          alert('Donation successful!');
          setShowDonationModal(false);
          setDonationAmount('');
          setRefreshProjects(prev => !prev);
          navigate('/payment-successful', { state: { donation: { name, email, amount, message, project_id: selectedProject._id }, project: selectedProject } });
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Donation failed', error);
      alert('Donation failed. Please try again.');
    }
    setLoading(false);
  };

  const handleVolunteerClick = (project) => {
    if (project.volunteerFormUrl) {
      window.open(project.volunteerFormUrl, '_blank');
    } else {
      alert('Volunteer form is not available at the moment.');
    }
  };

  const handleProjectSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('category', newProject.category);
      formData.append('goalAmount', parseFloat(newProject.goalAmount));
      formData.append('location', newProject.location);
      formData.append('needsVolunteers', String(newProject.needsVolunteers));
      if (newProject.needsVolunteers) {
        formData.append('volunteerFormUrl', newProject.volunteerFormUrl);
        formData.append('volunteerDescription', newProject.volunteerDescription);
      }

      newProject.images.forEach((image) => {
        formData.append('images', image.file);
      });

      if (newProject.pdfDescription) {
        formData.append('pdfDescription', newProject.pdfDescription.file);
      }

      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' - browser sets this automatically
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit project');
      }

      // Reset form and show success message
      setNewProject({
        title: '',
        category: '',
        description: '',
        goalAmount: '',
        location: '',
        needsVolunteers: false,
        volunteerFormUrl: '',
        volunteerDescription: '',
        images: [],
        pdfDescription: null
      });
      alert('Project submitted for review!');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again.');
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getImpactText = (project) => {
    const percentage = getProgressPercentage(project.raisedAmount, project.goalAmount);
    if (project.category === 'Environment') {
      const trees = Math.floor((project.raisedAmount / project.goalAmount) * 20);
      return `${trees} trees can be planted with current funds`;
    } else if (project.category === 'Education') {
      const books = Math.floor((project.raisedAmount / project.goalAmount) * 100);
      return `${books} children will receive educational materials`;
    } else if (project.category === 'Health') {
      const families = Math.floor((project.raisedAmount / project.goalAmount) * 200);
      return `${families} families will have access to clean water`;
    }
    return `${percentage.toFixed(0)}% of goal reached`;
  };

  const ProjectCard = ({ project }) => {
    const [donorCount, setDonorCount] = useState(0);

    useEffect(() => {
      const fetchDonorCount = async () => {
        try {
          const response = await fetch(`http://localhost:8000/projects/${project.id}/donor-count`);
          if (!response.ok) {
            throw new Error('Failed to fetch donor count');
          }
          const data = await response.json();
          setDonorCount(data.donor_count);
        } catch (error) {
          console.error(error);
        }
      };

      fetchDonorCount();
    }, [project.id]);

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img src={`http://localhost:8000${project.images[0]}`} alt={project.title} className="w-full h-48 object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {project.category}
            </span>
            {project.needsVolunteers && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Needs Volunteers
              </span>
            )}
          </div>
          {project.verified && (
            <div className="absolute top-3 right-3">
              <CheckCircle className="text-green-500 bg-white rounded-full" size={24} />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin size={16} className="mr-1" />
            <span>{project.location}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">₹{project.raisedAmount.toLocaleString()} of ₹{project.goalAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(project.raisedAmount, project.goalAmount)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {/* <span>{donorCount} donors</span> */}
              {/* <span>{project.daysLeft} days left</span> */}
            </div>
          </div>

          {/* <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{getImpactText(project)}</p>
          </div> */}

          <div className="space-y-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => { setSelectedProject(project); setShowDonationModal(true); }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Donate Now
              </button>
              <button 
                onClick={() => setSelectedProject(project)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
            
            {project.needsVolunteers && (
              <button 
                onClick={() => handleVolunteerClick(project)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                Can't Donate? Become a Volunteer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DonationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
            <button 
              onClick={() => setShowDonationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {selectedProject && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedProject.title}</h4>
              <p className="text-sm text-gray-600">{selectedProject.location}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Quick Amounts</label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {quickDonationAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount.toString())}
                  className={`py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${
                    donationAmount === amount.toString() 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDonationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => donationAmount && initiateDonation(donationAmount)}
              disabled={!donationAmount || donationAmount <= 0 || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : `Donate ₹${donationAmount || 0}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ icon, title, value, change }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-green-600 text-sm mt-1">+{change} this month</p>
          )}
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Fund Dashboard</h1>
              <p className="text-gray-600 mt-1">Make a difference in your local community</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            icon={<Heart size={32} />}
            title="Total Donated"
            value={`₹${userStats.totalDonated.toLocaleString()}`}
            change="₹340"
          />
          <StatsCard 
            icon={<Target size={32} />}
            title="Projects Supported"
            value={userStats.projectsSupported}
            change="2"
          />
                    <StatsCard 
                      icon={<TrendingUp size={32} />} 
                      title="Impact Points"
                      value={userStats.impactScore}
                      change="125"
                    />        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {['discover', 'my-donations', 'create-project'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'discover' && 'Discover Projects'}
              {tab === 'my-donations' && 'My Donations'}
              {tab === 'create-project' && 'Create Project'}
            </button>
          ))}
        </div>

        {/* Discover Projects Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Environment</option>
                <option>Education</option>
                <option>Health</option>
              </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => selectedCategory === 'All Categories' || p.category === selectedCategory)
                .map(project => (
                  <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* My Donations Tab */}
        {activeTab === 'my-donations' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Your Donation History</h3>
              <div className="space-y-4">
                {[
                  { project: "Community Garden Revival", amount: 50, date: "2024-09-15", impact: "Helped plant 2 trees" },
                  { project: "Books for Rural School", amount: 100, date: "2024-09-12", impact: "Provided books for 4 children" },
                  { project: "Clean Water for All", amount: 75, date: "2024-09-10", impact: "Contributed to clean water access" }
                ].map((donation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{donation.project}</h4>
                      <p className="text-sm text-gray-600">{donation.impact}</p>
                      <p className="text-xs text-gray-500">{donation.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{donation.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Project Tab */}
        {activeTab === 'create-project' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Submit a New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community Development">Community Development</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount (₹)</label>
                <input 
                  type="number" 
                  value={newProject.goalAmount}
                  onChange={(e) => setNewProject({...newProject, goalAmount: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              {/* Volunteer Section */}
              <div className="md:col-span-2 border-t pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="needsVolunteers"
                    checked={newProject.needsVolunteers}
                    onChange={(e) => setNewProject({...newProject, needsVolunteers: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="needsVolunteers" className="ml-2 block text-sm font-medium text-gray-700">
                    This project needs volunteers
                  </label>
                </div>
                
                {newProject.needsVolunteers && (
                  <div className="space-y-4 pl-6 border-l-2 border-green-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volunteer Description
                      </label>
                      <textarea
                        rows={3}
                        value={newProject.volunteerDescription}
                        onChange={(e) => setNewProject({...newProject, volunteerDescription: e.target.value})}
                        placeholder="Describe what kind of volunteers you need and what they'll be doing..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Form URL for Volunteer Registration
                      </label>
                      <input
                        type="url"
                        value={newProject.volunteerFormUrl}
                        onChange={(e) => setNewProject({...newProject, volunteerFormUrl: e.target.value})}
                        placeholder="https://forms.google.com/your-volunteer-form"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Create a Google Form to collect volunteer information and paste the sharing link here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Description Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Project Description (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {!newProject.pdfDescription ? (
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label
                        htmlFor="pdf-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-gray-600 mt-2">Upload detailed project description (PDF)</p>
                          <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{newProject.pdfDescription.name}</p>
                          <p className="text-xs text-gray-500">{newProject.pdfDescription.size} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={removePdf}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a detailed PDF document with project plans, budget breakdown, or additional information (Max 10MB)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {newProject.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({newProject.images.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newProject.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Save Draft
                </button>
                <button 
                  onClick={handleProjectSubmit}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && !showDonationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img src={`http://localhost:8000${selectedProject.images[0]}`} alt={selectedProject.title} className="w-full h-64 object-cover" />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selectedProject.verified && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Verified
                      </span>
                    )}
                    {selectedProject.needsVolunteers && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Needs Volunteers
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Funding Progress</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Raised</span>
                        <span className="font-semibold">₹{selectedProject.raisedAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full"
                          style={{ width: `${getProgressPercentage(selectedProject.raisedAmount, selectedProject.goalAmount)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{selectedProject.donorCount} donors</span>
                        <span>Goal: ₹{selectedProject.goalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Milestones</h4>
                    <div className="space-y-3">
                      {selectedProject.milestones.map((milestone, index) => (
                        <div key={index} className={`p-3 rounded-lg ${milestone.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <div className="flex items-center">
                            {milestone.completed ? (
                              <CheckCircle className="text-green-500 mr-2" size={20} />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2" />
                            )}
                            <span className="font-medium">₹{milestone.amount.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-7">{milestone.description}</p>
                          {milestone.completed && milestone.date && (
                            <p className="text-xs text-green-600 ml-7">Completed on {milestone.date}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Volunteer Information */}
                    {selectedProject.needsVolunteers && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                          <UserPlus size={20} />
                          Volunteer Opportunities
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          {selectedProject.volunteerDescription}
                        </p>
                        <button
                          onClick={() => handleVolunteerClick(selectedProject)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Sign Up as Volunteer
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4">Project Updates</h3>
                    {selectedProject.updates.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProject.updates.map(update => (
                          <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm text-gray-500">{update.date}</p>
                            <p className="text-gray-800 mb-2">{update.text}</p>
                            {update.image && (
                              <img src={update.image} alt="Update" className="w-full h-32 object-cover rounded-lg" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No updates yet. Check back soon!</p>
                    )}

                    <div className="mt-6 space-y-3">
                      <button 
                        onClick={() => setShowDonationModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Support This Project
                      </button>
                      
                      {selectedProject.needsVolunteers && (
                        <button
                          onClick={() => handleVolunteerClick(selectedProject)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <UserPlus size={20} />
                          Can't Donate? Become a Volunteer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDonationModal && <DonationModal />}
    </div>
  );
};

export default Dashboard;