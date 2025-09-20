import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// --- Icon Components (to resolve react-icons error) ---
const FaIcon = ({ size = 28, className = "", children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    {children}
  </svg>
);

const FaHandsHelping = (props) => (
  <FaIcon {...props}>
    <path d="M11.5,12.5c0,3.25-2.25,5-5,5S1.5,15.75,1.5,12.5S3.75,7.5,6.5,7.5S11.5,9.25,11.5,12.5z M6.5,9C5,9,4,10.25,4,12.5 s1,3.5,2.5,3.5s2.5-1.25,2.5-3.5S8,9,6.5,9z M18,7.75c-2.25,0-4,1-4,3s1.75,3,4,3s4-1,4-3S20.25,7.75,18,7.75z M22.5,12.5 c0,3.25-2.25,5-5,5s-5-1.75-5-5s2.25-5,5-5S22.5,9.25,22.5,12.5z M17.5,9c-1.5,0-2.5,1.25-2.5,3.5s1,3.5,2.5,3.5s2.5-1.25,2.5-3.5 S19,9,17.5,9z" />
  </FaIcon>
);
const FaSeedling = (props) => (
  <FaIcon {...props}>
    <path d="M12,2C9.2,2,7,4.2,7,7v3.5c0,1.9-1.6,3.5-3.5,3.5S0,12.4,0,10.5S1.6,7,3.5,7H7V6C7,3.8,8.8,2,11,2h1V2z M17,7 c-2.8,0-5,2.2-5,5v3.5c0,1.9,1.6,3.5,3.5,3.5S19,17.4,19,15.5S17.4,12,15.5,12H12v-1c0-2.2,1.8-4,4-4h1V7z" />
  </FaIcon>
);
const FaChartLine = (props) => (
  <FaIcon {...props}>
    <path d="M3.5,18.5l6-6.5l4,4l8-9.5" stroke="currentColor" fill="none" strokeWidth="2" />
    <polyline points="16,3 21.5,3 21.5,8.5" stroke="currentColor" fill="none" strokeWidth="2" />
  </FaIcon>
);
const FaBullhorn = (props) => (
  <FaIcon {...props}>
    <path d="M14,3.25l-6,4.5H2v8h6l6,4.5V3.25z M18,8c1.65,1.65,1.65,4.35,0,6" stroke="currentColor" fill="none" strokeWidth="2" />
    <path d="M20,6c2.75,2.75,2.75,7.25,0,10" stroke="currentColor" fill="none" strokeWidth="2" />
  </FaIcon>
);
const FaUserCheck = (props) => (
  <FaIcon {...props}>
    <path d="M16,21.5v-2c0-2.2-1.8-4-4-4H5c-2.2,0-4,1.8-4,4v2" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="7.5" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    <polyline points="17,11.5 19,13.5 23,9.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </FaIcon>
);
const FaSearch = (props) => (
  <FaIcon {...props}>
    <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" fill="none" stroke="currentColor" strokeWidth="2" />
  </FaIcon>
);
const FaDonate = (props) => (
  <FaIcon {...props}>
    <path d="M12,21.5c-3.15-2.1-8.5-5.9-8.5-10.3C3.5,6.5,7.3,3,12,3s8.5,3.5,8.5,8.2C20.5,15.6,15.15,19.4,12,21.5z" />
  </FaIcon>
);
const FaCamera = (props) => (
  <FaIcon {...props}>
    <path d="M20,6h-4l-2-3h-8L4,6H0v14h24V6z M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18z" />
    <circle cx="12" cy="12" r="3" />
  </FaIcon>
);

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <FaHandsHelping size={28} className="text-green-600" />,
      title: "Support Local Causes",
      description:
        "Donate as little as ₹1 to verified community projects like school gardens, clean-ups, or family relief efforts.",
    },
    {
      icon: <FaSeedling size={28} className="text-emerald-500" />,
      title: "Impact You Can See",
      description:
        "Track how small donations add up—like 50% of the goal funding 10 new trees or meals for families.",
    },
    {
      icon: <FaChartLine size={28} className="text-blue-600" />,
      title: "Live Progress Dashboard",
      description:
        "Each project shows a transparent progress bar with real-time updates and milestones unlocked.",
    },
    {
      icon: <FaBullhorn size={28} className="text-orange-500" />,
      title: "Project Updates",
      description:
        "Creators share milestone updates with photos and stories so you know exactly where funds go.",
    },
    {
      icon: <FaUserCheck size={28} className="text-purple-600" />,
      title: "Verified Projects",
      description:
        "Every initiative goes through a submission and moderation process to ensure trust and legitimacy.",
    },
  ];

  const howItWorksSteps = [
    {
      icon: <FaSearch size={22} className="text-blue-600" />,
      title: "1. Find a Cause",
      description:
        "Browse verified local projects and choose one that matters to you.",
    },
    {
      icon: <FaDonate size={22} className="text-blue-600" />,
      title: "2. Donate Securely",
      description: "Make a small donation (₹1, ₹5, etc.) with a single click.",
    },
    {
      icon: <FaChartLine size={22} className="text-blue-600" />,
      title: "3. Track Progress",
      description:
        "Your donation adds to the collective goal, updated in real-time.",
    },
    {
      icon: <FaCamera size={22} className="text-blue-600" />,
      title: "4. See the Impact",
      description:
        "Receive photo updates from creators showing your money at work.",
    },
  ];

  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center shadow-[0_30px_40px_-10px_rgba(0,0,0,0.5)]"
        style={{ backgroundImage: "url('Hero.jpg" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-center px-6"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl py-2 font-extrabold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent drop-shadow-lg"
          >
            Kindness Made Simple!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-base md:text-lg text-white max-w-xl mx-auto drop-shadow-md"
          >
            A hyper-local micro-donation platform where small contributions
            create big changes. Support verified causes, track progress, and see
            real impact in your neighborhood.
          </motion.p>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 w-full flex flex-col items-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl font-semibold text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3))",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            Get Started
          </button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-3 text-sm text-white font-medium"
          >
            Begin your journey of community impact
          </motion.p>
        </motion.div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-50 py-24 px-6"
        style={{ scrollMarginTop: "100px" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Small Donations, Big Community Impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-600 mb-12"
          >
            Discover how your ₹1, ₹5, or ₹10 can transform neighborhoods,
            schools, and families in need.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 text-left shadow-md hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-white text-gray-800 py-24 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
          >
            Simple, Transparent, Impactful.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-600 mb-20"
          >
            See your contribution in action. From donating to impact in seconds.
          </motion.p>

          <div className="relative">
            <div
              className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 w-full md:w-3/4 mx-auto"
              aria-hidden="true"
            ></div>
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto"
          >
            <p className="text-gray-700 italic">
              "Your <span className="font-semibold text-blue-700">₹10 donation</span> just helped
              us buy <span className="font-semibold text-green-700">2 new saplings</span> for the community garden!"
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Us Section - NEWLY ADDED */}
      <section id="about-us" className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connecting Communities, One Rupee at a Time
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Community Fund was born from a simple idea: what if everyone could contribute to their neighborhood's well-being, no matter how small the amount? We believe in the power of collective action and transparent giving.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to build a trusted platform that empowers individuals to support verified, hyper-local projects. We provide the tools for creators to bring their community initiatives to life and for donors to see the tangible impact of their generosity, fostering a stronger, more connected community for everyone.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-80 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="Help.jpg"
              alt="Community volunteers working together"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;

