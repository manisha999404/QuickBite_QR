// src/app/page.tsx

"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, Clock, Users, ArrowRight, Star, CheckCircle2, ShieldCheck, Zap, Building2, Utensils, ChevronRight, Award, Sparkles, Menu, X, BarChart3, UserPlus, ClipboardList, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ContactModal from "@/components/ContactModal";
import HelpModal from "@/components/HelpModal";

export default function Home() {
  const testimonialsTrackRef = useRef<HTMLDivElement | null>(null);
  // Removed unused isPaused state
  const intervalRef = useRef<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);



  useEffect(() => {
    const node = testimonialsTrackRef.current;
    if (!node) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const speedPxPerSec = 60;
    const stepPx = Math.max(1, Math.round(speedPxPerSec / 60));
    intervalRef.current = window.setInterval(() => {
      if (!node) return;
      const noOverflow = node.scrollWidth <= node.clientWidth + 2;
      if (noOverflow) return;
      const nearEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      node.scrollLeft = nearEnd ? 0 : node.scrollLeft + stepPx;
    }, 1000 / 60);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

	// Detect scroll to enhance navbar visuals
	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section for navbar highlighting
  useEffect(() => {
    const sections = ["how-it-works-owner", "features", "owners", "pricing", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px" }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);



  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const fadeInUp = {
    initial: {
      y: 60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Responsive Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-slate-200 shadow-sm' : 'bg-white/30 backdrop-blur border-transparent'}`}>
        <a href="#features" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-1/2 focus:-translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg">Skip to content</a>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">QuickBiteQR</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Steps */}
              <Link 
                href="#how-it-works-owner" 
                aria-current={activeSection === 'how-it-works-owner' ? 'page' : undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'how-it-works-owner' 
                    ? 'text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="px-1">Steps</span>
                <span className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-all duration-300 ${activeSection === 'how-it-works-owner' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-slate-300'}`}></span>
              </Link>

              <Link 
                href="#owners" 
                aria-current={activeSection === 'owners' ? 'page' : undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'owners' 
                    ? 'text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="px-1">Owners</span>
                <span className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-all duration-300 ${activeSection === 'owners' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-slate-300'}`}></span>
              </Link>
              
              <Link 
                href="#pricing" 
                aria-current={activeSection === 'pricing' ? 'page' : undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'pricing' 
                    ? 'text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="px-1">Pricing</span>
                <span className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-all duration-300 ${activeSection === 'pricing' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-slate-300'}`}></span>
              </Link>
              <Link 
                href="#faq" 
                aria-current={activeSection === 'faq' ? 'page' : undefined}
                className={`group relative text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'faq' 
                    ? 'text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="px-1">FAQ</span>
                <span className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition-all duration-300 ${activeSection === 'faq' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-slate-300'}`}></span>
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4 border-t border-slate-200">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  href="#how-it-works-owner" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeSection === 'how-it-works-owner' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Steps
                </Link>
                
                <Link 
                  href="#owners" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeSection === 'owners' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Owners
                </Link>
                
                <Link 
                  href="#pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeSection === 'pricing' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Pricing
                </Link>
                <Link 
                  href="#faq" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeSection === 'faq' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  FAQ
                </Link>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Video */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-50 blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-indigo-100 shadow-sm mb-6 sm:mb-8"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Revolutionary QR Ordering System</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6"
              >
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Restaurant Experience
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-1 sm:px-0"
              >
                Eliminate wait times, reduce errors, and delight customers with our seamless QR code ordering system. 
                Set up in minutes, scale effortlessly.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center"
              >
              <Link 
                href="/login?next=%2Fdashboard" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                >
                  Start Free Trial
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="#features" 
                  className="text-slate-600 hover:text-slate-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold border border-slate-300 hover:border-slate-400 transition-all duration-200 w-full sm:w-auto text-center"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0"
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">5 min</div>
                  <div className="text-xs sm:text-sm text-slate-600">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">40%</div>
                  <div className="text-xs sm:text-sm text-slate-600">Faster Service</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">99.9%</div>
                  <div className="text-xs sm:text-sm text-slate-600">Uptime</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Video Demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Video Container */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/images/restaurant-ambiance.jpg"
                  >
                    <source src="/images/QrCode (2).mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Video Info */}
                <div className="p-6 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-500 ml-2">QuickBiteQR</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">See it in action</h3>
                  <p className="text-sm text-slate-600">
                    Watch how customers scan, order, and pay seamlessly with our QR system
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step-by-step for Restaurant Owners */}
      <section id="how-it-works-owner" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-100 via-indigo-50 to-white border-y border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-emerald-100 shadow-sm mb-3 sm:mb-4">
              <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>How to use QuickBiteQR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              From Setup to Orders in <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">5 Simple Steps</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2 sm:px-0">
              A clear path for restaurant owners — what to do, where to click, and what happens next.
            </p>
          </motion.div>

          <div className="relative">
            {/* Decorative progress line on large screens */}
            <div className="hidden lg:block absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-full"></div>
            {/* Vertical mobile timeline */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 to-indigo-100 rounded-full"></div>

            <motion.ol
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8"
            >
            {[
              {
                step: 1,
                title: 'Create your account',
                desc: 'Sign up with your email and basic restaurant details. It takes less than a minute.',
                icon: <UserPlus className="w-6 h-6" />,
                action: 'Go to Sign up',
                href: '/signup'
              },
              {
                step: 2,
                title: 'Add menu & items',
                desc: 'Create categories, add items, prices, images and availability from the dashboard.',
                icon: <Utensils className="w-6 h-6" />,
                action: 'Open Dashboard',
                href: '/dashboard/menu'
              },
              {
                step: 3,
                title: 'Generate QR codes',
                desc: 'Create unlimited QRs (no table limit) and print. Place one on each table or zone.',
                icon: <QrCode className="w-6 h-6" />,
                action: 'Generate QR',
                href: '/dashboard/tables'
              },
              {
                step: 4,
                title: 'Start taking orders',
                desc: 'Guests scan, browse, and place orders from their phone. Orders appear live to staff.',
                icon: <Smartphone className="w-6 h-6" />,
                action: 'View Live Orders',
                href: '/dashboard/orders'
              },
              {
                step: 5,
                title: 'Track revenue & insights',
                desc: 'Monitor total revenue, popular items, and peak hours in the analytics dashboard.',
                icon: <BarChart3 className="w-6 h-6" />,
                action: 'See Analytics',
                href: '/dashboard'
              },
            ].map((s, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="relative group bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 lg:p-8 md:pl-6 pl-10 flex flex-col"
              >
                {/* Mobile connector dot */}
                <div className="md:hidden absolute left-3 top-8 w-2 h-2 rounded-full bg-indigo-500"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">Step {s.step}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-1 mb-2">{s.desc}</p>
                <div className="mt-3">
              <Link href={`/login?next=${encodeURIComponent(s.href)}`} aria-label={`Step ${s.step}: ${s.action}`} className="inline-flex md:inline-flex items-center text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md px-2 py-2 -mx-1 text-sm font-semibold transition-colors w-full sm:w-auto justify-center">
                    {s.action}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.li>
            ))}
            </motion.ol>
          </div>

          {/* Visual map of where things live */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
          >

          </motion.div>
        </div>
      </section>

      {/* For Restaurant Owners */}
      <section id="owners" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-indigo-100 shadow-sm mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
              <span>Built for Restaurant Owners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Grow Faster with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">QuickBiteQR</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2 sm:px-0">
              Create unlimited QR menus, take orders from tables, and manage everything from a powerful dashboard.
            </p>
          </motion.div>

          {/* Outcomes KPI band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { k: 'Faster Table Turns', v: '40%', note: 'average improvement' },
                { k: 'Higher Order Value', v: '+25%', note: 'vs. paper menus' },
                { k: 'Paper & Print Cost', v: '₹0', note: 'go fully digital' },
              ].map((m, i) => (
                <div key={i} className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between">
                  <div className="text-sm sm:text-base font-semibold text-slate-800">{m.k}</div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{m.v}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500">{m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Eye-catching Owner Toolbar */}
          <div className="mb-8">
            {/* Gradient border wrapper for subtle premium feel */}
            <div className="relative rounded-[calc(1.5rem-1.5px)] bg-slate-900/90 backdrop-blur-xl overflow-hidden qa-elevation">
              <div className="relative bg-gradient-to-r from-slate-50 to-emerald-50 border border-slate-200 rounded-[calc(1.5rem-1px)] p-6 sm:p-8 overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-15 blur-2xl"></div>
              {/* Subtle radial pattern */}
              <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60rem_60rem_at_-20%_-10%,rgba(59,130,246,0.06),transparent),radial-gradient(50rem_50rem_at_120%_10%,rgba(99,102,241,0.06),transparent)]"></div>
              {/* Animated aurora backdrop */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="aurora one"></div>
                <div className="aurora two"></div>
                <div className="aurora three"></div>
              </div>
              
              {/* Header */}
              <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4"
                >
                  <div className="relative">
                    <div className="absolute -top-8 sm:-top-10 -left-8 sm:-left-10 w-16 sm:w-20 h-16 sm:h-20 bg-blue-400/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 sm:-bottom-8 -right-6 sm:-right-8 w-12 sm:w-16 h-12 sm:h-16 bg-indigo-500/20 rounded-full blur-xl"></div>
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500/30 text-xs font-semibold shadow-sm">Restaurant Tools</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">Quick Actions</h3>
                    <p className="text-slate-700 text-base sm:text-lg max-w-xs sm:max-w-sm md:max-w-md mx-auto">Everything you need to manage your restaurant in one place</p>
                  </div>
                </motion.div>
                <div className="mt-4 sm:mt-6 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 w-36 sm:w-48 mx-auto opacity-100 qa-accent shadow-[0_0_16px_rgba(255,255,255,0.35)]"></div>
              </div>
              
              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-6 md:gap-6 lg:gap-8 relative z-10 px-4 sm:px-4 md:px-6" role="list" aria-label="Quick actions">
                <motion.div 
                  className="h-full rounded-2xl group" 
                  role="listitem"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className="toolbar-card three-d card-delay-1 seq-1 relative h-full flex flex-col gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-gradient-to-br from-sky-200 to-cyan-300 text-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2 focus-within:ring-offset-white overflow-hidden">
                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-white/30 rounded-full blur-2xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-sky-400/40 rounded-full blur-xl -ml-6 sm:-ml-8 -mb-6 sm:-mb-8"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-gradient-to-br from-cyan-200 to-sky-300 rounded-full opacity-20 blur-3xl"></div>
                    
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="icon-glow p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-700 ring-1 ring-sky-200 shadow-md w-fit">
                        <QrCode className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Generate QR Codes</h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">Create custom QR codes for each table to streamline ordering</p>
                    </div>
                    
                    <div className="mt-auto pt-2">
                      <Link 
                        href="/login?next=%2Fdashboard%2Ftables" 
                        aria-label="Generate QR codes" 
                        className="inline-flex items-center justify-between w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-sky-600/90 text-white text-sm sm:text-base font-medium hover:bg-sky-700 transition-all duration-300 group-hover:shadow-md"
                      >
                        <span>Create QR Codes</span>
                        <motion.span 
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="h-full rounded-2xl group" 
                  role="listitem"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className="toolbar-card three-d card-delay-2 seq-2 relative h-full flex flex-col gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-gradient-to-br from-emerald-200 to-teal-300 text-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 focus-within:ring-offset-white overflow-hidden">
                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-white/30 rounded-full blur-2xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-emerald-400/40 rounded-full blur-xl -ml-6 sm:-ml-8 -mb-6 sm:-mb-8"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-gradient-to-br from-teal-200 to-emerald-300 rounded-full opacity-20 blur-3xl"></div>
                    
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="icon-glow p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 ring-1 ring-emerald-200 shadow-md w-fit">
                        <Utensils className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Manage Menu</h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">Create and update your menu with dishes, prices, and photos</p>
                    </div>
                    
                    <div className="mt-auto pt-2">
                      <Link 
                        href="/login?next=%2Fdashboard%2Fmenu" 
                        aria-label="Add menu items" 
                        className="inline-flex items-center justify-between w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-600/90 text-white text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all duration-300 group-hover:shadow-md"
                      >
                        <span>Edit Menu Items</span>
                        <motion.span 
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="h-full rounded-2xl group" 
                  role="listitem"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className="toolbar-card three-d card-delay-3 seq-3 relative h-full flex flex-col gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-gradient-to-br from-fuchsia-200 to-violet-300 text-slate-900 transition-all duration-300 shadow-lg hover:shadow-2xl focus-within:ring-2 focus-within:ring-fuchsia-400 focus-within:ring-offset-2 focus-within:ring-offset-white overflow-hidden">
                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-white/30 rounded-full blur-2xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-fuchsia-400/40 rounded-full blur-xl -ml-6 sm:-ml-8 -mb-6 sm:-mb-8"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-gradient-to-br from-violet-200 to-fuchsia-300 rounded-full opacity-20 blur-3xl"></div>
                    
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="icon-glow p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-fuchsia-100 to-violet-100 text-fuchsia-700 ring-1 ring-fuchsia-200 shadow-md w-fit">
                        <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900">Track Orders</h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">Monitor live orders and manage your queue in real-time</p>
                    </div>
                    
                    <div className="mt-auto pt-2">
                      <Link 
                        href="/login?next=%2Fdashboard%2Forders" 
                        aria-label="View live orders" 
                        className="inline-flex items-center justify-between w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-fuchsia-600/90 text-white text-sm sm:text-base font-medium hover:bg-fuchsia-700 transition-all duration-300 group-hover:shadow-md"
                      >
                        <span>View Live Orders</span>
                        <motion.span 
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="h-full rounded-2xl group" 
                  role="listitem"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className="toolbar-card three-d card-delay-4 seq-4 relative h-full flex flex-col gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 shadow-lg hover:shadow-2xl focus-within:ring-2 focus-within:ring-white/60 focus-within:ring-offset-2 focus-within:ring-offset-blue-600 overflow-hidden">
                    {/* Enhanced decorative elements */}
                    <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-white/20 rounded-full blur-2xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-indigo-300/30 rounded-full blur-xl -ml-6 sm:-ml-8 -mb-6 sm:-mb-8"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl"></div>
                    
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="icon-glow p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 text-white ring-1 ring-white/30 shadow-md w-fit">
                        <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-white">Main Dashboard</h4>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">Access analytics, settings, and all restaurant management tools</p>
                    </div>
                    
                    <div className="mt-auto pt-2">
                      <Link 
                        href="/login?next=%2Fdashboard" 
                        aria-label="Open dashboard" 
                        className="inline-flex items-center justify-between w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/20 text-white text-sm sm:text-base font-medium hover:bg-white/30 transition-all duration-300 group-hover:shadow-md"
                      >
                        <span>Open Dashboard</span>
                        <motion.span 
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Toolbar styles */}
              <style jsx>{`
                @keyframes auroraMove {
                  0% { transform: translate(-10%, -10%) scale(1); opacity: 0.6; }
                  50% { transform: translate(10%, 10%) scale(1.1); opacity: 0.9; }
                  100% { transform: translate(-10%, -10%) scale(1); opacity: 0.6; }
                }
                .aurora {
                  position: absolute;
                  filter: blur(40px);
                  opacity: 0.5;
                  mix-blend-mode: multiply;
                  animation: auroraMove 16s linear infinite;
                }
                .aurora.one { top: -20%; left: -10%; width: 50%; height: 60%; background: radial-gradient(60% 60% at 50% 50%, rgba(16,185,129,0.28), transparent); }
                .aurora.two { bottom: -25%; right: -15%; width: 55%; height: 65%; background: radial-gradient(60% 60% at 50% 50%, rgba(20,184,166,0.28), transparent); animation-duration: 20s; }
                .aurora.three { top: 10%; right: 10%; width: 35%; height: 40%; background: radial-gradient(60% 60% at 50% 50%, rgba(132,204,22,0.20), transparent); animation-duration: 24s; }

                .toolbar-card::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  border-radius: inherit;
                  background: linear-gradient(120deg, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.0) 60%);
                  transform: translateX(-120%);
                  transition: transform 0.6s ease;
                  pointer-events: none;
                }
                .toolbar-card:hover::before { transform: translateX(120%); }

                @keyframes gradientBorderShift {
                  0% { filter: hue-rotate(0deg); }
                  100% { filter: hue-rotate(20deg); }
                }
                .border-animate { animation: gradientBorderShift 6s linear infinite alternate; }

                /* Non-hover animations */
                @keyframes cardFloat {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-3px); }
                  100% { transform: translateY(0px); }
                }
                /* Remove float animation, rely on hover micro-interactions */
                .toolbar-card { animation: none; }
                .card-delay-1, .card-delay-2, .card-delay-3, .card-delay-4 { animation-delay: 0s; }

                /* Sequential scale pulse (one by one) - more pronounced */
                @keyframes seqPulse {
                  0%, 100% {
                    transform: scale(1) translateZ(0);
                    box-shadow: 0 18px 30px -12px rgba(2,6,23,0.30), 0 8px 16px -8px rgba(2,6,23,0.22), inset 0 1px 0 0 rgba(255,255,255,0.6);
                  }
                  50% {
                    transform: scale(1.04) translateZ(0);
                    box-shadow: 0 28px 60px -18px rgba(2,6,23,0.45), 0 16px 30px -12px rgba(2,6,23,0.32), inset 0 1px 0 0 rgba(255,255,255,0.6);
                  }
                }
                /* Disable scale pulse */
                .seq-1, .seq-2, .seq-3, .seq-4 { animation: none !important; transform-origin: center; }

                /* Disable icon motion to keep only border movement */
                .icon-glow { animation: none; }

                /* Border sheen animation */
                @keyframes borderSheen {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 200% 50%; }
                }
                .shine-border { position: relative; }
                .shine-border::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  border-radius: inherit;
                  background-image: linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05), rgba(255,255,255,0.25));
                  background-size: 200% 100%;
                  animation: borderSheen 4s linear infinite;
                  pointer-events: none;
                }

                @keyframes conicSpin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .conic-rotate {
                  background: var(--ring-gradient);
                  animation: none;
                }

                /* 3D effect without hover */
                .three-d {
                  transform: perspective(1200px) rotateX(1.2deg) rotateY(-1.2deg) translateZ(0);
                  box-shadow:
                    0 18px 30px -12px rgba(2,6,23,0.35),
                    0 8px 16px -8px rgba(2,6,23,0.25),
                    inset 0 1px 0 0 rgba(255,255,255,0.6);
                  will-change: transform;
                }

                /* Enhanced 3D effect for mobile only */
                @media (max-width: 640px) {
                  .three-d {
                    transform: perspective(800px) rotateX(2.5deg) rotateY(-2.5deg) translateZ(8px);
                    box-shadow:
                      0 25px 40px -15px rgba(2,6,23,0.45),
                      0 12px 20px -10px rgba(2,6,23,0.35),
                      0 4px 8px -4px rgba(2,6,23,0.25),
                      inset 0 1px 0 0 rgba(255,255,255,0.7);
                  }
                }

                /* Respect motion preferences */
                @media (prefers-reduced-motion: reduce) {
                  .aurora { display: none; }
                  .toolbar-card::before { transition: none; }
                  .seq-1, .seq-2, .seq-3, .seq-4 { animation: none !important; }
                }
              `}</style>
              <style jsx>{`
                .qa-elevation {
                  box-shadow:
                    0 20px 50px -20px rgba(2,6,23,0.55),
                    0 8px 24px -10px rgba(2,6,23,0.35),
                    0 0 0 1px rgba(255,255,255,0.04);
                }
                @keyframes barFlow {
                  0% { background-position: 200% 50%; }
                  100% { background-position: -100% 50%; }
                }
                .qa-accent {
                  background-size: 400% 100%;
                  animation: barFlow 3.5s linear infinite;
                  will-change: background-position;
                }
              `}</style>
              {/* Animated gradient border around action cards */}
              <style jsx>{`
                @keyframes toolbarBarFlow {
                  0% { background-position: 200% 50%; }
                  100% { background-position: -100% 50%; }
                }
                .toolbar-card { position: relative; }
                .toolbar-card::after {
                  content: none !important;
                  display: none !important;
                  animation: none !important;
                  background: none !important;
                }
                /* Also disable the sheen overlay */
                .toolbar-card::before { display: none !important; }
              `}</style>
              {/* Per-card themed borders matching tile colors (target any direct child) */}
              <style jsx>{`
                [role="list"][aria-label="Quick actions"] > *:nth-child(1) .toolbar-card::after {
                  background: linear-gradient(90deg, rgba(56,189,248,1), rgba(34,211,238,1), rgba(14,165,233,1)) !important; /* sky/cyan/blue */
                }
                [role="list"][aria-label="Quick actions"] > *:nth-child(2) .toolbar-card::after {
                  background: linear-gradient(90deg, rgba(52,211,153,1), rgba(16,185,129,1), rgba(20,184,166,1)) !important; /* emerald/teal */
                }
                [role="list"][aria-label="Quick actions"] > *:nth-child(3) .toolbar-card::after {
                  background: linear-gradient(90deg, rgba(240,171,252,1), rgba(217,70,239,1), rgba(139,92,246,1)) !important; /* fuchsia/violet */
                }
                [role="list"][aria-label="Quick actions"] > *:nth-child(4) .toolbar-card::after {
                  background: linear-gradient(90deg, rgba(96,165,250,1), rgba(37,99,235,1), rgba(79,70,229,1)) !important; /* blue/indigo */
                }
              `}</style>
              {/* Subtle 3D elevation and bevel for cards */}
              <style jsx>{`
                .toolbar-card {
                  transform-style: preserve-3d;
                  box-shadow:
                    0 12px 18px -10px rgba(2,6,23,0.45),
                    0 30px 60px -24px rgba(2,6,23,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.55),
                    inset 0 -1px 0 rgba(2,6,23,0.06);
                  transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
                }
                .toolbar-card:hover {
                  box-shadow:
                    0 16px 24px -12px rgba(2,6,23,0.5),
                    0 40px 80px -28px rgba(2,6,23,0.38),
                    inset 0 1px 0 rgba(255,255,255,0.6),
                    inset 0 -1px 0 rgba(2,6,23,0.08);
                  transform: translateY(-3px);
                }
                .toolbar-card:focus-within {
                  transform: translateY(-2px);
                  box-shadow:
                    0 16px 26px -12px rgba(2,6,23,0.52),
                    0 44px 84px -30px rgba(2,6,23,0.40),
                    inset 0 1px 0 rgba(255,255,255,0.65),
                    inset 0 -1px 0 rgba(2,6,23,0.10);
                }

                /* Color-tinted inner ring on hover/focus for each card */
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(1):hover,
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(1):focus-within {
                  box-shadow:
                    0 16px 26px -12px rgba(2,6,23,0.5),
                    0 44px 84px -30px rgba(2,6,23,0.38),
                    inset 0 0 0 2px rgba(56,189,248,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.65),
                    inset 0 -1px 0 rgba(2,6,23,0.10);
                }
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(2):hover,
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(2):focus-within {
                  box-shadow:
                    0 16px 26px -12px rgba(2,6,23,0.5),
                    0 44px 84px -30px rgba(2,6,23,0.38),
                    inset 0 0 0 2px rgba(16,185,129,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.65),
                    inset 0 -1px 0 rgba(2,6,23,0.10);
                }
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(3):hover,
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(3):focus-within {
                  box-shadow:
                    0 16px 26px -12px rgba(2,6,23,0.5),
                    0 44px 84px -30px rgba(2,6,23,0.38),
                    inset 0 0 0 2px rgba(217,70,239,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.65),
                    inset 0 -1px 0 rgba(2,6,23,0.10);
                }
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(4):hover,
                [role="list"][aria-label="Quick actions"] .toolbar-card:nth-of-type(4):focus-within {
                  box-shadow:
                    0 16px 26px -12px rgba(2,6,23,0.5),
                    0 44px 84px -30px rgba(2,6,23,0.38),
                    inset 0 0 0 2px rgba(37,99,235,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.65),
                    inset 0 -1px 0 rgba(2,6,23,0.10);
                }
              `}</style>
              {/* Bring back sliding sheen inside cards (override disable with stronger selector) */}
              <style jsx>{`
                [role="list"][aria-label="Quick actions"] .toolbar-card::before {
                  content: "" !important;
                  display: block !important;
                  position: absolute;
                  inset: 0;
                  border-radius: inherit;
                  background: linear-gradient(120deg, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.0) 65%);
                  transform: translateX(-130%);
                  transition: transform .8s ease;
                  pointer-events: none;
                }
                [role="list"][aria-label="Quick actions"] .toolbar-card:hover::before,
                [role="list"][aria-label="Quick actions"] .toolbar-card:focus-within::before {
                  transform: translateX(130%);
                }
              `}</style>
                  </div>
                </div>
                </div>
        </div>
      </section>


      {/* Product Mockup Section (Simplified) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Fast, clean, and easy to use
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              A simple, modern interface that looks great on any device.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto px-0 sm:px-2">
            {/* Laptop device (desktop only) */}
            <div className="hidden lg:block">
              <div className="relative rounded-[1.2rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.6)] p-2 sm:p-3 md:p-4 mx-auto w-full max-w-[900px]">
                {/* Camera dot inside bezel */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-400/90 shadow"></div>
                {/* Screen */}
                <div className="relative rounded-[0.6rem] sm:rounded-[0.8rem] overflow-hidden bg-black aspect-[16/10] ring-1 ring-black/50">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    poster="/images/restaurant-ambiance.jpg"
                  >
                    <source src="/images/mockup.mp4" type="video/mp4" />
                  </video>
                  {/* Subtle screen reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_20%)]"></div>
                </div>
                {/* Bottom light strip */}
                <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-40 h-1 rounded-full bg-white/10 blur-sm"></div>
              </div>
              {/* Laptop hinge and base */}
              <div className="mx-auto mt-2 h-1.5 w-28 sm:w-40 rounded-full bg-slate-400/90"></div>
              <div className="relative mx-auto mt-2 h-5 w-[96%] sm:w-[90%] rounded-b-2xl bg-gradient-to-b from-slate-400 to-slate-600 shadow-[0_24px_40px_-16px_rgba(2,6,23,0.5)]">
                {/* rubber feet */}
                <div className="absolute left-4 bottom-0 translate-y-1 w-4 h-1.5 rounded-full bg-slate-700"></div>
                <div className="absolute right-4 bottom-0 translate-y-1 w-4 h-1.5 rounded-full bg-slate-700"></div>
              </div>
              <div className="mx-auto mt-1 h-1 w-40 sm:w-56 rounded-full bg-slate-400/80"></div>
            </div>

            {/* Phone device (mobile only) */}
            <div className="block md:hidden lg:hidden">
              <div className="flex justify-center">
                <div className="relative w-[180px] sm:w-[200px] md:w-[220px] aspect-[9/19] rounded-[1.6rem] bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/80 rounded-b-2xl z-20"></div>
                  <div className="absolute inset-[9px] sm:inset-[10px] md:inset-[12px] rounded-[1.2rem] bg-black overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                      poster="/images/restaurant-ambiance.jpg"
                    >
                      <source src="/images/mockup2.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet device (tablet only) */}
            <div className="hidden md:block lg:hidden">
              <div className="flex justify-center">
                {/* Outer chassis */}
                <div className="relative w-[440px] md:w-[600px] aspect-[3/4] rounded-[2.4rem] bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.6)] border-2 border-slate-800 overflow-hidden">
                  {/* Metallic edge highlight */}
                  <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] ring-1 ring-white/5"></div>

                  {/* Camera and speaker slot */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    <div className="w-10 h-1 rounded-full bg-black/70 ring-1 ring-white/10"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400/90 shadow" />
                  </div>

                  {/* Side buttons */}
                  <div className="absolute right-0 top-24 w-1.5 h-10 rounded-l-md bg-slate-700/80"></div>
                  <div className="absolute right-0 top-40 w-1.5 h-7 rounded-l-md bg-slate-700/80"></div>

                  {/* Inner glass with bezel */}
                  <div className="absolute inset-3 md:inset-5 rounded-[1.8rem] bg-black overflow-hidden ring-1 ring-black/60">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                      poster="/images/restaurant-ambiance.jpg"
                    >
                      <source src="/images/mockup3.mp4" type="video/mp4" />
                    </video>
                    {/* Glass reflection */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),transparent_35%)]"></div>
                  </div>

                  {/* Shadow base */}
                  <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-4 rounded-full bg-black/40 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature chips */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {[
              'No app required',
              'Works on any phone',
              'Real-time orders',
              'Simple dashboard',
            ].map((chip, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-sm bg-white shadow-sm">
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-100 via-green-50 to-white border-y border-slate-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100 shadow-sm mb-4">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Flexible Pricing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2 sm:px-0">
              Start free and scale as you grow. No hidden fees, no long-term contracts. 
              Cancel or upgrade anytime.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              {
                name: "Starter",
                icon: <Users className="w-6 h-6" />,
                price: "Free",
                period: "forever",
                originalPrice: null,
                description: "Perfect for small cafes and food trucks",
                features: [
                  { text: "Up to 5 tables", included: true },
                  { text: "Basic menu management", included: true },
                  { text: "QR code generation", included: true },
                  { text: "Email support", included: true },
                  { text: "Basic analytics", included: true },
                  { text: "Real-time orders", included: false },
                  { text: "Staff management", included: false }
                ],
                cta: "Get Started Free",
                ctaStyle: "secondary",
                popular: false
              },
              {
                name: "Pro",
                icon: <Zap className="w-6 h-6" />,
                price: "₹2,999",
                period: "per month",
                originalPrice: "₹3,999",
                description: "Ideal for growing restaurants",
                features: [
                  { text: "Unlimited tables", included: true },
                  { text: "Advanced menu management", included: true },
                  { text: "Real-time order tracking", included: true },
                  { text: "Staff management", included: true },
                  { text: "Priority support", included: true },
                  { text: "Advanced analytics", included: true },
                  { text: "Custom branding", included: true },
                  { text: "API access", included: false }
                ],
                cta: "Start Pro Trial",
                ctaStyle: "primary",
                popular: true
              },
              {
                name: "Business",
                icon: <Building2 className="w-6 h-6" />,
                price: "₹4,999",
                period: "per month",
                originalPrice: null,
                description: "For multi-location restaurants",
                features: [
                  { text: "Everything in Pro", included: true },
                  { text: "Multi-location support", included: true },
                  { text: "Advanced reporting", included: true },
                  { text: "API access", included: true },
                  { text: "Dedicated account manager", included: true },
                  { text: "Custom integrations", included: true },
                  { text: "White-label options", included: true },
                  { text: "24/7 phone support", included: true }
                ],
                cta: "Contact Sales",
                ctaStyle: "secondary",
                popular: false
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.03 }}
                className="relative group"
              >
                {/* Popular Plan Ribbon */}
                {plan.popular && (
                  <div className="absolute -top-4 sm:-top-5 md:-top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold shadow-lg flex items-center gap-1.5 sm:gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 transition-all duration-300 group-hover:shadow-2xl flex flex-col h-full ${
                  plan.popular 
                    ? 'border-blue-500 bg-gradient-to-b from-blue-50/50 to-white' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  {/* Plan Icon and Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    } transition-colors duration-300`}>
                      {plan.icon}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">{plan.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-4 sm:mb-6">
                      {plan.originalPrice && (
                        <div className="text-sm text-slate-500 line-through mb-1">
                          {plan.originalPrice}/month
                        </div>
                      )}
                      <div className="flex items-baseline justify-center">
                        <span className={`text-4xl sm:text-5xl font-bold ${
                          plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-slate-900'
                        }`}>
                          {plan.price}
                        </span>
                        <span className="text-slate-600 ml-2 text-sm sm:text-lg">/{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                          Save ₹1,000/month
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          feature.included 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {feature.included ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/login?next=%2Fdashboard"
                    className={`w-full mt-auto block text-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform group-hover:scale-105 ${
                      plan.ctaStyle === 'primary'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                        : plan.popular
                        ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-lg hover:shadow-xl'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="inline-block ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">All plans include</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Responsive Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-100 border-y border-slate-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-orange-100 shadow-sm mb-3 sm:mb-4">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 fill-current" />
              <span>Customer Stories</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Restaurants</span> Worldwide
            </h2>
            {/* <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Restaurants</span> Worldwide
            </h2> */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Join thousands of satisfied restaurant owners who have transformed their dining experience with QuickBiteQR.
            </p>
          </motion.div>

          {(() => {
            const base = [
              { 
                quote: "QuickBiteQR streamlined our ordering and reduced wait times by 40%. Our customers love the seamless experience!", 
                name: "Aisha Khan", 
                role: "Owner, Spice Route", 
                avatar: "https://i.pravatar.cc/150?img=47",
                restaurant: "Spice Route",
                location: "Mumbai, India",
                rating: 5
              },
              { 
                quote: "Setup took minutes. Our customers love the seamless experience and our staff can focus on what matters most.", 
                name: "Marco Rossi", 
                role: "Manager, Trattoria Roma", 
                avatar: "https://i.pravatar.cc/150?img=12",
                restaurant: "Trattoria Roma",
                location: "Rome, Italy",
                rating: 5
              },
              { 
                quote: "We replaced paper menus across 3 locations in a day. The transition was incredibly smooth and our customers adapted quickly.", 
                name: "Sofia García", 
                role: "GM, Casa Verde", 
                avatar: "https://i.pravatar.cc/150?img=32",
                restaurant: "Casa Verde",
                location: "Barcelona, Spain",
                rating: 5
              },
              { 
                quote: "The analytics helped us optimize our menu for higher margins. We've seen a 25% increase in average order value.", 
                name: "Neha Verma", 
                role: "Founder, Café Bloom", 
                avatar: "https://i.pravatar.cc/150?img=5",
                restaurant: "Café Bloom",
                location: "Delhi, India",
                rating: 5
              },
              { 
                quote: "Our staff focus on guests, not on taking orders. The efficiency gains have been remarkable.", 
                name: "David Miller", 
                role: "Owner, Harbor Grill", 
                avatar: "https://i.pravatar.cc/150?img=22",
                restaurant: "Harbor Grill",
                location: "New York, USA",
                rating: 5
              },
              { 
                quote: "Customers love scanning and paying right from the table. It's the future of dining and we're proud to be early adopters.", 
                name: "Linh Tran", 
                role: "Café Manager", 
                avatar: "https://i.pravatar.cc/150?img=68",
                restaurant: "Golden Dragon",
                location: "Ho Chi Minh, Vietnam",
                rating: 5
              },
            ];
            const testimonials = [...base, ...base]; // duplicate to ensure overflow for auto-scroll
            return (
              <div className="relative">
                {/* Responsive Navigation Controls */}
                {/* Removed manualScrollBy navigation buttons as the function was unused and deleted */}

                {/* Responsive Testimonials Carousel */}
                <div ref={testimonialsTrackRef} className="overflow-x-auto sm:overflow-hidden px-1 pb-2 pr-4 sm:pr-6 lg:pr-8">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 sm:marquee will-change-transform snap-x snap-mandatory">
                    {testimonials.map((t, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="shrink-0 w-[85%] xs:w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] 2xl:w-[30%] group snap-center"
                      >
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 lg:p-8 xl:p-10 shadow-md sm:shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-slate-300 relative overflow-hidden h-full">
                          {/* Quote Icon */}
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 opacity-10">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">&ldquo;</span>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 lg:mb-6">
                            {Array.from({ length: t.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-400 fill-current" />
                            ))}
                          </div>

                          {/* Quote Text */}
                          <blockquote className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 lg:mb-8 relative z-10 pr-2">
                            &ldquo;{t.quote}&rdquo;
                          </blockquote>

                          {/* Customer Info */}
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 ring-2 sm:ring-4 ring-slate-100">
                                <AvatarImage src={t.avatar} alt={t.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                                  {t.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {/* Online Status Indicator */}
                              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg leading-tight truncate">{t.name}</h4>
                              <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">{t.role}</p>
                              <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                                <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 flex-shrink-0" />
                                <span className="text-xs text-slate-500 truncate">{t.restaurant}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500 truncate">{t.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Decorative Elements */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-b-2xl sm:rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced CSS Animation */}
                <style jsx>{`
                  @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .marquee {
                    animation: marquee 20s linear infinite;
                  }
                  .marquee:hover {
                    animation-play-state: paused;
                  }
                  @media (max-width: 640px) {
                    .marquee {
                      animation: marquee 15s linear infinite;
                    }
                  }
                `}</style>
              </div>
            );
          })()}

          {/* Responsive Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">10,000+</div>
              <div className="text-sm sm:text-base text-slate-600">Happy Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">50M+</div>
              <div className="text-sm sm:text-base text-slate-600">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">4.9/5</div>
              <div className="text-sm sm:text-base text-slate-600">Average Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white border-y border-slate-200 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-purple-100 shadow-sm mb-3 sm:mb-4">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Help & Support</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2 sm:px-0">
              Everything you need to know about QuickBiteQR. Can&apos;t find what you&apos;re looking for? 
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-medium ml-1">
                Contact our support team
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-3 sm:space-y-4"
          >
            {[
              {
                question: "How quickly can I set up QuickBiteQR?",
                answer: "Setup takes less than 5 minutes. Simply create your account, add your menu items, and generate QR codes for your tables. No technical knowledge required.",
                category: "Setup",
                icon: <Clock className="w-5 h-5" />
              },
              {
                question: "Do customers need to download an app?",
                answer: "No! Customers simply scan the QR code with their phone's camera and access your menu instantly through their web browser. No app downloads required.",
                category: "Customer Experience",
                icon: <Smartphone className="w-5 h-5" />
              },
              {
                question: "Can I customize the menu design?",
                answer: "Yes! You can customize colors, fonts, and layout to match your restaurant's branding. We also offer white-label options for complete customization.",
                category: "Customization",
                icon: <Award className="w-5 h-5" />
              },
              {
                question: "Is there a limit on orders or tables?",
                answer: "Our free plan supports up to 5 tables. Pro and Business plans offer unlimited tables and orders with advanced features.",
                category: "Pricing",
                icon: <Users className="w-5 h-5" />
              },
             
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors duration-300">
                      {faq.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {faq.question}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                    
                    {/* Expand Icon */}
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                    </div>
                  </div>
                </div>
                
                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 lg:p-12 border border-purple-100"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Our support team is here to help you get the most out of QuickBiteQR. 
                Get in touch and we&apos;ll respond within 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contact Support
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsHelpModalOpen(true)}
                  className="text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                >
                  Help Center
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants already using QuickBiteQR to provide exceptional dining experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login?next=%2Fdashboard" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="#features" 
                className="text-white border-2 border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">QuickBiteQR</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Revolutionizing restaurant dining with seamless QR code ordering. 
                Transform your customer experience in minutes.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login?next=%2Fdashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="#owners" className="text-slate-400 hover:text-white transition-colors">Owner</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><button onClick={() => setIsHelpModalOpen(true)} className="text-slate-400 hover:text-white transition-colors">Help Center</button></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 QuickBiteQR. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
}