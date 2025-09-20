import React from 'react';

const Donations = () => {
  // Mock data for donation history
  const donationHistory = [
    { project: "Community Garden Revival", amount: 50, date: "2024-09-15", impact: "Helped plant 2 trees" },
    { project: "Books for Rural School", amount: 100, date: "2024-09-12", impact: "Provided books for 4 children" },
    { project: "Clean Water for All", amount: 75, date: "2024-09-10", impact: "Contributed to clean water access" }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Donations</h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Your Donation History</h3>
        <div className="space-y-4">
          {donationHistory.map((donation, index) => (
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
  );
};

export default Donations;