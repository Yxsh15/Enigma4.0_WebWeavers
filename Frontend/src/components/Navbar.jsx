import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaTimes, FaCamera, FaSignOutAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: null
  });
  const [tempProfileData, setTempProfileData] = useState({});
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.name || "User");
        
        // Initialize profile data from token or localStorage
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData(parsedProfile);
        } else {
          // Initialize from token data
          const initialProfile = {
            firstName: decodedToken.firstName || decodedToken.name?.split(' ')[0] || "",
            lastName: decodedToken.lastName || decodedToken.name?.split(' ')[1] || "",
            email: decodedToken.email || "",
            profilePicture: null
          };
          setProfileData(initialProfile);
        }
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated]);

  const navLinkClass = (path) =>
    `cursor-pointer text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg ${
      location.pathname === path ? "bg-blue-100 text-blue-600" : ""
    }`;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openProfileModal = () => {
    setTempProfileData({ ...profileData });
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setTempProfileData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setTempProfileData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  const saveProfile = () => {
    setProfileData(tempProfileData);
    localStorage.setItem("userProfile", JSON.stringify(tempProfileData));
    
    // Update username display
    const fullName = `${tempProfileData.firstName} ${tempProfileData.lastName}`.trim();
    if (fullName) {
      setUsername(fullName);
    }
    
    closeProfileModal();
  };

  const cancelProfileEdit = () => {
    closeProfileModal();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-white shadow-sm"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-3">
          {/* Left section: Logo + App Name */}
          <div className="flex items-center space-x-3">
            <img src="../public/logo.png" alt="Logo" className="h-10 w-10" />
            <Link to="/" className="text-gray-800 text-2xl font-bold">
              Kindry
            </Link>
          </div>

          {/* Center section: Navigation (only when not authenticated) */}
          {!isAuthenticated && (
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
              <button
                onClick={() => scrollToSection('features')}
                className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about-us')}
                className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                About Us
              </button>
            </div>
          )}

          {/* Center section: Navigation (when authenticated) */}
          {isAuthenticated && (
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/donations" className={navLinkClass("/donations")}>
                My Donations
              </Link>
              <Link to="/submit-project" className={navLinkClass("/submit-project")}>
                Submit a Project
              </Link>
            </div>
          )}

          {/* Right section: Auth */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {username}!</span>
                <div className="relative">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile"
                      className="h-8 w-8 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition-colors"
                      onClick={openProfileModal}
                    />
                  ) : (
                    <FaUserCircle 
                      size={32} 
                      className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" 
                      onClick={openProfileModal} 
                    />
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account</h2>
                <p className="text-sm text-gray-500">Manage your account info.</p>
              </div>
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Profile Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Profile</h3>
                  <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                    Update profile
                  </span>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center mb-4">
                  <div className="relative">
                    {tempProfileData.profilePicture ? (
                      <img
                        src={tempProfileData.profilePicture}
                        alt="Profile"
                        className="h-12 w-12 rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserCircle size={32} className="text-gray-400" />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
                      <FaCamera size={12} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                  <div className="ml-3">
                    <button
                      className="text-sm text-blue-600 hover:underline mr-3"
                      onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                      Upload
                    </button>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={removeProfilePicture}
                    >
                      Remove
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size 1:1, up to 10MB.
                    </p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={tempProfileData.firstName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={tempProfileData.lastName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelProfileEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Email Section */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Email addresses</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{profileData.email}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Primary
                  </span>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Connected accounts</h3>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="text-sm text-gray-700">{profileData.email}</span>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Security</h3>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                >
                  <FaSignOutAlt className="mr-2" size={16} />
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;