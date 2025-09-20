import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, Share2, Download, Heart, Star, Users, Calendar, Award } from 'lucide-react';

const PaymentSuccessful = () => {
  const location = useLocation();
  const { donation, project } = location.state || {};

  // Mock data for demonstration if not provided
  const donationData = donation || {
    name: "John Doe",
    amount: 2500,
    message: "Keep up the great work!",
    id: "DON123456"
  };

  const projectData = project || {
    title: "Clean Water Initiative",
    description: "Providing clean water access to rural communities",
    image: "/api/placeholder/400/300"
  };

  const [showConfetti, setShowConfetti] = useState(true);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    const downloadTimer = setTimeout(() => setDownloadReady(true), 1500);
    return () => {
      clearTimeout(timer);
      clearTimeout(downloadTimer);
    };
  }, []);

  if (!donationData || !projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Unable to load donation details.</p>
          </div>
        </div>
      </div>
    );
  }

  const shareOnWhatsApp = () => {
    const message = `🎉 I just made a difference! I donated ₹${donationData.amount} to "${projectData.title}" on Kindry. Every small act of kindness creates ripples of change! ✨`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const message = `Proud to support ${projectData.title} through Kindry! Together we can make a difference. #Philanthropy #SocialImpact #Kindry`;
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const downloadCertificate = () => {
    const link = document.createElement('a');
    link.href = '/Certi.png';
    link.download = 'Certificate.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen my-[50px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-cyan-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 ${
                ['bg-yellow-400', 'bg-pink-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'][i % 5]
              } animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Thank You! 🎉
          </h1>
          <p className="text-xl text-gray-600">Your donation was successful</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Certificate Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 transform hover:scale-105 transition-all duration-300">
            <img src="/Certi.png" alt="Certificate" className="rounded-2xl" />
            {/* Download Button */}
            <div className="mt-4">
              <button
                onClick={downloadCertificate}
                disabled={!downloadReady}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  downloadReady
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4 inline mr-2" />
                {downloadReady ? 'Download Certificate' : 'Preparing Certificate...'}
              </button>
            </div>
          </div>

          {/* Impact & Sharing Section */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                Your Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                  <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-pink-600">{Math.floor(donationData.amount / 100)}</p>
                  <p className="text-sm text-gray-600">Lives Impacted</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">5.0</p>
                  <p className="text-sm text-gray-600">Impact Rating</p>
                </div>
              </div>
            </div>

            {/* Donation Message */}
            {donationData.message && (
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Message</h3>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                  <p className="text-gray-700 italic">"{donationData.message}"</p>
                </div>
              </div>
            )}

            {/* Sharing Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Share2 className="w-6 h-6 text-purple-600 mr-2" />
                Share Your Good Deed
              </h3>
              <p className="text-gray-600 mb-4">Inspire others to make a difference too!</p>
              <div className="space-y-3">
                <button 
                  onClick={shareOnWhatsApp}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Share on WhatsApp
                </button>
                <button 
                  onClick={shareOnLinkedIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </button>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  You'll receive updates on project progress via email
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Tax receipt will be sent within 24 hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Join our community to see your impact in action
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 mb-4">Continue making a difference</p>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Explore More Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;