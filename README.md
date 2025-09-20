# Kindry - Micro-Donation & Impact Tracking Platform

**Team:** WebWeavers

**Team Members:** Sweety Jha(Team Lead), Vishal Kumar and Yashovardhan Poddar

## Problem Statement

Many people want to support local community projects, such as a school garden, a neighborhood clean-up, or helping a family in crisis. However, they often lack a trusted and transparent platform for making micro-donations. It's difficult to see how a small contribution can make a tangible impact, which can discourage potential donors.

## Objective

Our goal is to create a hyper-local crowdfunding platform where users can donate small amounts to verified local initiatives and see real-time updates on the collective impact. We aim to build a transparent and trustworthy bridge between community members and local causes.

## Key Features

*   **Project Verification & Categorization:** A robust process for submitting and verifying local projects to ensure their legitimacy and proper categorization.
*   **Micro-donation Gateway:** Integration with a payment processor (e.g., Razorpay test API) to allow for small, one-click donations (e.g., ₹1, ₹5, ₹10).
*   **Live Impact Tracker:** A public dashboard for each project that displays the funding goal, the total amount raised, and a visual representation of the progress (e.g., "50% of our goal means we can buy 10 new trees").
*   **Milestone Updates:** Project creators can post updates with photos and descriptions to show donors exactly how the funds are being used, creating a transparent and engaging feedback loop.
*   **User Profiles:** Registered users can track their personal donation history and follow the progress of projects they have supported.

## Tech Stack

*   **Frontend:** React.js, Vite, JavaScript
*   **Backend:** Python, FastAPI
*   **Database:** MongoDB
*   **Payment Gateway:** Razorpay (Test API)

## Setup Instructions

### Prerequisites

*   Node.js and npm
*   Python and pip
*   Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Backend Setup

```bash
cd Backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
```

The backend server will be running on `http://127.0.0.1:8000`.

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend development server will be running on `http://localhost:5173`.
