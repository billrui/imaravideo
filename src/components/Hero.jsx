import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCreative } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

// Images
import Logo from "../assets/IMARA.jpg";
// Import your video
import LabVideo from "../assets/HOME.mp4"; // Make sure this path is correct

// Button styles - MOBILE OPTIMIZED
const BUTTON_STYLES = {
  primary: "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full transition-all duration-300 font-medium px-4 py-2 text-xs shadow-lg hover:shadow-xl active:scale-95",
  secondary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-300 font-medium px-4 py-2 text-xs shadow-lg hover:shadow-xl active:scale-95",
  accent: "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full transition-all duration-300 font-medium px-4 py-2 text-xs shadow-lg hover:shadow-xl active:scale-95",
  mobile: "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full transition-all duration-300 font-medium px-6 py-3 text-sm shadow-lg hover:shadow-xl active:scale-95 w-full max-w-xs mx-auto",
};

// Desktop button styles (will override on larger screens)
const DESKTOP_BUTTON_STYLES = {
  primary: "sm:bg-gradient-to-r sm:from-green-500 sm:to-green-600 sm:text-white sm:rounded-full sm:transition-all sm:duration-300 sm:font-medium sm:px-6 sm:py-3 sm:text-base",
  secondary: "sm:bg-gradient-to-r sm:from-blue-500 sm:to-blue-600 sm:text-white sm:rounded-full sm:transition-all sm:duration-300 sm:font-medium sm:px-6 sm:py-3 sm:text-base",
  accent: "sm:bg-gradient-to-r sm:from-purple-500 sm:to-purple-600 sm:text-white sm:rounded-full sm:transition-all sm:duration-300 sm:font-medium sm:px-6 sm:py-3 sm:text-base",
};

// Slide data
const slides = [
  {
    title: "Welcome to Imara Analytical Laboratories",
    rightText: "More Info About Us",
    description: "Imara Analytical Laboratories (IAL) is a leading private testing laboratory headquartered in Kericho, Kenya, serving clients across East Africa.",
    shortDescription: "Accurate. Certified. Trusted laboratory testing services for Agriculture, Environment & Industry.",
    isWelcome: true
  },
  {
    title: "Soil Analysis",
    description: "Comprehensive soil testing for optimal crop production and environmental conservation.",
    table: [
      { name: "Total nitrogen", parameters: "N" },
      { name: "Soil pH", parameters: "pH" },
      { name: "Basic soil analysis", parameters: "pH, P, K, Ca, Mg, Na, OM, N, CEC" },
    ],
    icon: "🌱",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Plant Tissue Analysis",
    description: "Determine nutritional content of plant partitions for deficiency correction and monitoring.",
    table: [
      { name: "Total nitrogen", parameters: "N" },
      { name: "Leaf analysis", parameters: "N, P, K, Ca, Mg, S, Na, Fe, Mn, B, MO, Zn" },
    ],
    icon: "🌿",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Animal Feed Analysis",
    description: "Physical, biological and chemical analysis of various food products to determine quality and safety.",
    table: [
      { name: "Mineral elements in feeds", parameters: "P, K, Ca, Mg, S, Fe, Mn, B, Cu, Mo, Zn" },
      { name: "Heavy metals analysis", parameters: "Cu, Cd, Pb, Co, B, Ni, Zn, Cr, As" },
    ],
    icon: "🐄",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Food Analysis",
    description: "Quality and safety testing for human food products.",
    icon: "🍎",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Fertilizer Analysis",
    description: "Determine quality and chemical composition of fertilizers for optimal crop yield.",
    icon: "🧪",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Compost / Manure Analysis",
    description: "Organic matter evaluation supporting sustainable soil management.",
    icon: "🌿",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Water Analysis",
    description: "Physical, biological, and chemical tests for various water types.",
    table: [
      { name: "Microbial", parameters: "Coliforms, E.coli, TVC, Salmonella" },
      { name: "Complete irrigation water", parameters: "pH, Na, Al, Ca, Mg, Cl, EC, TDS, S, Ni, P, K, B, SO4, Total nitrogen, NH4" },
    ],
    icon: "💧",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "NEMA Effluent Analysis",
    description: "Environmental discharge testing meeting regulatory compliance standards.",
    icon: "🏭",
    metrics: { turnaround: "1-3 days" }
  },
  {
    title: "Research Analysis",
    description: "Advanced analytical support for universities, colleges, and research institutions.",
    table: [
      { name: "Heavy Metals Analysis", parameters: "Se, Ni, Pb, Cd, Co, Cr, Zn" },
    ],
    icon: "🔬",
    metrics: { turnaround: "Custom" }
  },
];

const HeroWithNavbar = forwardRef((props, ref) => {
  const [swiper, setSwiper] = useState(null);
  const [showServicePopup, setShowServicePopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showMobileMenuPopup, setShowMobileMenuPopup] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({ title: "", description: "", table: null, icon: "", metrics: {} });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const whatsappNumber = "+254736351633";
  const serviceTitles = slides.slice(1);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ["hero", "about", "services", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveLink(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body overflow control
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useImperativeHandle(ref, () => ({
    resetSwiper: () => swiper?.slideToLoop(0, 500),
    goToSlide: (index) => swiper?.slideTo(index)
  }));

  // WhatsApp handlers
  const handleWhatsApp = (message) => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleServiceClick = (service) => {
    handleWhatsApp(`Hello, I would like to request: ${service.title}`);
    setShowServicePopup(false);
    setShowMobileMenuPopup(false);
  };

  const handleRequestPrice = () => handleWhatsApp("Hello, I would like the Price List.");
  const handleRequestCallback = () => handleWhatsApp("Hello, I would like a call back.");

  const handleReadMore = (slide) => {
    setCurrentInfo({ 
      title: slide.title, 
      description: slide.description, 
      table: slide.table || null,
      icon: slide.icon || null,
      metrics: slide.metrics || null,
    });
    setShowInfoPopup(true);
  };

  // Navigation functions
  const handleOurServicesClick = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => swiper?.slideToLoop(0, 500), 400);
    setActiveLink("home");
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;
      window.scrollTo({
        top: element.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
    
    setActiveLink(href.replace("#", ""));
  };

  // Menu links
  const menuLinks = [
    { href: "#hero", label: "Home", onClick: handleHomeClick, id: "home" },
    { href: "#about", label: "About", onClick: (e) => handleLinkClick(e, "#about"), id: "about" },
    { href: "#services", label: "Services", onClick: (e) => handleLinkClick(e, "#services"), id: "services" },
    { href: "#contact", label: "Contact", onClick: (e) => handleLinkClick(e, "#contact"), id: "contact" },
  ];

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src={LabVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-blue-900"></div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50 lg:bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 lg:bg-gradient-to-r lg:from-black/60 lg:via-transparent lg:to-transparent"></div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{ 
              y: [null, -30, 30],
              x: [null, Math.random() * 50 - 25],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/80 backdrop-blur-xl py-2" : "bg-transparent py-3 md:py-5"
        }`}
        style={{
          background: scrolled ? "rgba(17, 24, 39, 0.8)" : "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer group"
            onClick={handleHomeClick}
          >
            <div className="relative flex items-center gap-2">
              <img 
                src={Logo} 
                alt="Imara Analytical Laboratories" 
                className="h-8 md:h-12 rounded-lg relative z-10 shadow-lg"
              />
              <div className="hidden lg:block">
                <span className="text-sm font-light text-white/80">Imara Analytical</span>
                <span className="block text-xs text-white/60">Laboratories</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {menuLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                whileHover={{ y: -2 }}
                onClick={link.onClick}
                onHoverStart={() => setHoveredLink(link.id)}
                onHoverEnd={() => setHoveredLink(null)}
                className="relative group cursor-pointer"
              >
                <span className={`text-sm lg:text-base font-medium transition-colors duration-300 ${
                  activeLink === link.id ? "text-white" : "text-white/70 group-hover:text-white"
                }`}>
                  {link.label}
                </span>
                <motion.span 
                  className="absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: activeLink === link.id || hoveredLink === link.id ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* WhatsApp Button */}
            <motion.div
              className="relative hidden sm:block"
              onHoverStart={() => setShowWhatsAppTooltip(true)}
              onHoverEnd={() => setShowWhatsAppTooltip(false)}
            >
              <motion.a
                href="https://wa.me/254736351633"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-md rounded-full transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-green-400 text-lg">📱</span>
                <span className="text-white text-sm font-medium hidden lg:inline">Chat on WhatsApp</span>
                <span className="text-white text-sm font-medium lg:hidden">WhatsApp</span>
              </motion.a>

              <AnimatePresence>
                {showWhatsAppTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-12 right-0 bg-gray-900/90 backdrop-blur-md rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl"
                  >
                    Chat with us 24/7 on WhatsApp
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-lg bg-white/5 backdrop-blur-md shadow-lg z-50 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-4 h-4 flex flex-col justify-center gap-1">
                <motion.span 
                  className="w-full h-0.5 bg-white rounded-full"
                  animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                />
                <motion.span 
                  className="w-full h-0.5 bg-white rounded-full"
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span 
                  className="w-full h-0.5 bg-white rounded-full"
                  animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.98) 100%)" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/5 rounded-full"
                  initial={{ 
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-6 text-center">
              {menuLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={link.onClick}
                  className="group relative block cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="relative text-3xl md:text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-500 group-hover:bg-clip-text transition-all duration-300">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.a
              href="https://wa.me/254736351633"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-md rounded-full cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-green-400 text-2xl">📱</span>
              <span className="text-white font-medium">Chat on WhatsApp</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Action Menu Popup */}
      <AnimatePresence>
        {showMobileMenuPopup && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowMobileMenuPopup(false)}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-xl w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Choose an option</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowServicePopup(true);
                    setShowMobileMenuPopup(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔬</span>
                  <span>Request Service</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleRequestPrice();
                    setShowMobileMenuPopup(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>💰</span>
                  <span>Price List</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleRequestCallback();
                    setShowMobileMenuPopup(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📞</span>
                  <span>Call Back</span>
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMobileMenuPopup(false)}
                className="mt-4 w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors border border-white/10 cursor-pointer"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Swiper */}
      <Swiper
        onSwiper={setSwiper}
        modules={[Pagination, EffectCreative]}
        loop={true}
        speed={1000}
        effect="creative"
        creativeEffect={{
          prev: { 
            translate: [0, 0, -400], 
            opacity: 0,
            scale: 0.9
          },
          next: { 
            translate: [0, 0, -400], 
            opacity: 0,
            scale: 0.9
          },
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          className: "hero-pagination"
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Content */}
              <div className="relative z-10 h-full w-full flex items-start justify-center pt-16 sm:pt-20 md:pt-24 lg:items-center lg:pt-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {slide.isWelcome ? (
                      <>
                        {/* Enhanced Company Name Design */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="mb-4"
                        >
                          {/* Welcome text with elegant styling */}
                          <span className="inline-block text-lg sm:text-xl md:text-2xl text-white/90 font-light tracking-[0.3em] uppercase mb-3 border-b border-white/20 pb-2">
                            Welcome to
                          </span>

                          {/* Main company name with enhanced gradient and effects */}
                          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3">
                            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative inline-block">
                              Imara
                              <span className="absolute -top-1 -right-3 text-2xl text-yellow-300/30 animate-pulse">✨</span>
                            </span>
                            <br className="block sm:hidden" />
                            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative inline-block ml-0 sm:ml-4">
                              Analytical
                              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></span>
                            </span>
                            <br className="block sm:hidden" />
                            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] block mt-2 sm:mt-0 sm:inline-block sm:ml-4">
                              Laboratories
                            </span>
                          </h1>

                          {/* Decorative elements */}
                          <div className="flex items-center justify-center gap-3 mt-2">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
                            <span className="text-yellow-300/50 text-sm">⚛️</span>
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
                          </div>
                        </motion.div>

                        {/* Paragraph */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="text-sm sm:text-base md:text-lg text-white/90 font-medium mb-6 max-w-2xl mx-auto leading-relaxed text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                        >
                          {slide.shortDescription}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                        >
                          {/* Desktop buttons */}
                          <div className="hidden sm:flex sm:flex-row gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowServicePopup(true)}
                              className={`${BUTTON_STYLES.primary} ${DESKTOP_BUTTON_STYLES.primary} cursor-pointer`}
                            >
                              Request Service
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleRequestPrice}
                              className={`${BUTTON_STYLES.secondary} ${DESKTOP_BUTTON_STYLES.secondary} cursor-pointer`}
                            >
                              Price List
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleRequestCallback}
                              className={`${BUTTON_STYLES.accent} ${DESKTOP_BUTTON_STYLES.accent} cursor-pointer`}
                            >
                              Call Back
                            </motion.button>
                          </div>

                          {/* Mobile single button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowMobileMenuPopup(true)}
                            className="sm:hidden bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full transition-all duration-300 font-medium px-8 py-3.5 text-sm shadow-lg hover:shadow-xl active:scale-95 w-full max-w-[200px] mx-auto flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>📱</span>
                            <span>Click Me</span>
                          </motion.button>
                        </motion.div>

                        {/* Our Services button */}
                        <motion.button
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          whileHover={{ scale: 1.1 }}
                          onClick={handleOurServicesClick}
                          className="mt-6 lg:mt-8 group relative 
                            flex items-center justify-center
                            mx-auto w-full max-w-[240px] 
                            px-6 py-3 lg:px-8 lg:py-4 
                            bg-gradient-to-r from-green-500 to-green-600 
                            text-white font-bold text-sm lg:text-base 
                            rounded-full shadow-[0_10px_20px_rgba(34,197,94,0.3)] 
                            hover:shadow-[0_15px_30px_rgba(34,197,94,0.5)] 
                            hover:scale-110 active:scale-95 
                            transition-all duration-300 
                            border-2 border-white/30 
                            backdrop-blur-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span className="tracking-wide">Explore All Services</span>
                            <span className="text-white text-lg lg:text-xl animate-bounce">→</span>
                          </span>
                        </motion.button>
                      </>
                    ) : (
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="relative mb-4 lg:mb-6 inline-block"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-full blur-2xl"></div>
                          <div className="relative text-5xl lg:text-7xl bg-white/10 backdrop-blur-xl rounded-full w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center mx-auto border-2 border-white/30">
                            {slide.icon}
                          </div>
                        </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 text-white drop-shadow-lg"
                        >
                          {slide.title}
                        </motion.h1>

                        {slide.metrics?.turnaround && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-5"
                          >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full text-white text-sm border border-blue-500/30">
                              <span className="text-blue-400">⏱️</span>
                              <span>Turnaround: {slide.metrics.turnaround}</span>
                            </span>
                          </motion.div>
                        )}

                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleReadMore(slide)}
                          className="group relative inline-flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-white/20 cursor-pointer"
                        >
                          <span className="text-sm lg:text-base font-semibold text-white">View Details</span>
                          <span className="text-white animate-pulse">→</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => swiper?.slidePrev()}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
                  w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 
                  flex items-center justify-center
                  text-white/70 hover:text-white
                  bg-black/20 hover:bg-black/40
                  backdrop-blur-sm
                  rounded-full
                  transition-all duration-300
                  hover:scale-110
                  z-30
                  group
                  border border-white/10 hover:border-white/30"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform transition-transform duration-300 group-hover:-translate-x-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => swiper?.slideNext()}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
                  w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 
                  flex items-center justify-center
                  text-white/70 hover:text-white
                  bg-black/20 hover:bg-black/40
                  backdrop-blur-sm
                  rounded-full
                  transition-all duration-300
                  hover:scale-110
                  z-30
                  group
                  border border-white/10 hover:border-white/30"
                aria-label="Next slide"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform transition-transform duration-300 group-hover:translate-x-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide counter */}
              {!slide.isWelcome && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-8 right-4 z-30"
                >
                  <div className="px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white/70 text-xs font-light border border-white/10">
                    {String(index).padStart(2, '0')} / {String(slides.length - 1).padStart(2, '0')}
                  </div>
                </motion.div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Service Popup */}
      <AnimatePresence>
        {showServicePopup && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowServicePopup(false)}
          >
            <motion.div
              className="bg-gray-900/90 backdrop-blur-xl w-full max-w-3xl p-6 rounded-2xl shadow-2xl border border-white/10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Services</h2>
              
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {serviceTitles.map((service, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleServiceClick(service)}
                    className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-left transition-all duration-300 border border-white/5 hover:border-white/20 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative flex items-center gap-4">
                      <span className="text-3xl bg-white/5 rounded-lg w-12 h-12 flex items-center justify-center">
                        {service.icon || "🔬"}
                      </span>
                      <div>
                        <div className="font-semibold text-white mb-1">{service.title}</div>
                        {service.metrics?.turnaround && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="text-blue-400">⏱️</span>
                            {service.metrics.turnaround}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowServicePopup(false)}
                className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all duration-300 font-medium border border-white/10 cursor-pointer"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Popup */}
      <AnimatePresence>
        {showInfoPopup && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowInfoPopup(false)}
          >
            <motion.div
              className="bg-gray-900/90 backdrop-blur-xl w-full max-w-4xl p-6 rounded-2xl shadow-2xl border border-white/10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl bg-white/5 rounded-xl w-14 h-14 flex items-center justify-center">
                  {currentInfo.icon || "🔬"}
                </div>
                <h2 className="text-xl font-bold text-white">{currentInfo.title}</h2>
              </div>

              {currentInfo.metrics?.turnaround && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full text-blue-400 text-sm border border-blue-500/20">
                    <span>⏱️</span>
                    Turnaround: {currentInfo.metrics.turnaround}
                  </span>
                </div>
              )}

              <p className="text-gray-200 leading-relaxed mb-6 text-sm">{currentInfo.description}</p>

              {currentInfo.table && (
                <div className="overflow-x-auto mb-6 rounded-lg border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-300">Analysis Name</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-300">Parameters Included</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentInfo.table.map((row, idx) => (
                        <motion.tr 
                          key={idx} 
                          className="hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <td className="px-3 py-2 text-white">{row.name}</td>
                          <td className="px-3 py-2 text-gray-300">{row.parameters}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowInfoPopup(false);
                    setShowServicePopup(true);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white transition-all duration-300 font-medium shadow-lg cursor-pointer"
                >
                  Request Service
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInfoPopup(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all duration-300 font-medium border border-white/10 cursor-pointer"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .swiper-slide {
          overflow: hidden !important;
        }
        .swiper-container {
          overflow: hidden !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
});

export default HeroWithNavbar;