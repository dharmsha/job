'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart, Users, Target, Rocket, Shield, Star,
  Award, Globe, TrendingUp, Lightbulb, Sparkles,
  Clock, CheckCircle, ArrowRight, ChevronRight,
  GraduationCap, Briefcase, Building, BookOpen,
  MessageCircle, Phone, Mail, MapPin, Calendar,
  Trophy, Zap, Leaf, HandHeart, Brain, Compass,
  Gem, Crown, Bookmark, Eye, Code, Palette,
  Music, Camera, Gamepad2, Coffee, Pizza,
  Smile, Laugh
} from 'lucide-react';

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);

  // Team Members
  const teamMembers = [
    { name: "Aarav Sharma", role: "Founder & CEO", image: "AS", exp: "10+ years in EdTech", quote: "Every teacher deserves their dream job", color: "from-blue-500 to-cyan-500" },
    { name: "Priya Patel", role: "Head of HR", image: "PP", exp: "8+ years in Recruitment", quote: "Matching passion with purpose", color: "from-purple-500 to-pink-500" },
    { name: "Rohan Verma", role: "Tech Lead", image: "RV", exp: "12+ years in Tech", quote: "Building bridges with code", color: "from-green-500 to-emerald-500" },
    { name: "Neha Kapoor", role: "Career Coach", image: "NK", exp: "15+ years in Education", quote: "Unlocking potential daily", color: "from-orange-500 to-red-500" },
  ];

  // Milestones Timeline
  const milestones = [
    { year: "2018", title: "Humble Beginnings", desc: "Started from a small team of 3 passionate educators", icon: <Seedling className="h-5 w-5" /> },
    { year: "2019", title: "First 100 Jobs", desc: "Successfully placed 100 teachers in dream schools", icon: <Target className="h-5 w-5" /> },
    { year: "2020", title: "Pandemic Support", desc: "Launched free online training during COVID", icon: <Heart className="h-5 w-5" /> },
    { year: "2021", title: "10,000+ Members", desc: "Reached milestone of 10k registered educators", icon: <Users className="h-5 w-5" /> },
    { year: "2022", title: "Award Recognition", desc: "Won 'Best EdTech Startup' award", icon: <Award className="h-5 w-5" /> },
    { year: "2023", title: "Pan-India Expansion", desc: "Expanded to 50+ cities across India", icon: <Globe className="h-5 w-5" /> },
    { year: "2024", title: "Future Vision", desc: "Aiming to transform 1 million teaching careers", icon: <Rocket className="h-5 w-5" /> },
  ];

  // Core Values
  const values = [
    { 
      icon: <Heart className="h-8 w-8" />, 
      title: "Empathy First", 
      desc: "We feel what teachers feel - their struggles, dreams, and aspirations",
      color: "from-rose-500 to-pink-500"
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Trust & Integrity", 
      desc: "Every placement is built on transparency and honest relationships",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      icon: <Lightbulb className="h-8 w-8" />, 
      title: "Innovation", 
      desc: "Constantly evolving to make job hunting smarter and easier",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: <Users className="h-8 w-8" />, 
      title: "Community", 
      desc: "Building a supportive network where educators grow together",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: <Target className="h-8 w-8" />, 
      title: "Excellence", 
      desc: "Settling for nothing less than perfect matches and happy careers",
      color: "from-purple-500 to-violet-500"
    },
    { 
      icon: <Sparkles className="h-8 w-8" />, 
      title: "Magic Moments", 
      desc: "Creating those 'I got the job!' moments that change lives",
      color: "from-cyan-500 to-teal-500"
    },
  ];

  // Fun Facts
  const funFacts = [
    { number: "5,000+", label: "Dream Jobs Created", icon: <Briefcase className="h-5 w-5" /> },
    { number: "10,000+", label: "Happy Educators", icon: <Smile className="h-5 w-5" /> },
    { number: "500+", label: "Partner Schools", icon: <Building className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "2M+", label: "Cups of Coffee", icon: <Coffee className="h-5 w-5" /> },
    { number: "∞", label: "Smiles Generated", icon: <Laugh className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/20">
      {/* Hero Section - Emotional & Professional */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Our Heart's Story
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              More Than a{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Job Portal
              </span>
              <br />
              We're a{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Dream Builder
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where teaching dreams meet reality. Every teacher we place, every school we partner with, 
              every resume we perfect - it's not just business. It's personal. It's emotional. It's changing lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
              >
                <Heart className="h-5 w-5 mr-2" />
                Join Our Family
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 group">
                <PlayCircle className="h-5 w-5 mr-2" />
                Watch Our Story
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Floating Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-cyan-400/20 rounded-full animate-float-delayed" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-400/20 rounded-full animate-float-slow" />
      </section>

      {/* Emotional Quote Section */}
      <section className="py-12 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-12 w-12 text-rose-500 mx-auto mb-6 animate-pulse" />
            <blockquote className="text-2xl md:text-3xl font-serif text-gray-800 italic mb-4 leading-relaxed">
              "We don't just fill vacancies. We build careers. We don't just match resumes. We match dreams."
            </blockquote>
            <p className="text-gray-600 font-medium">- The Creative Jobs Family</p>
          </div>
        </div>
      </section>

      {/* Our Why Section - Emotional */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 text-sm font-medium mb-4">
                <Target className="h-4 w-4 mr-2" />
                Our Heartbeat
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why We Exist? Because{' '}
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Passion Matters
                </span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We saw brilliant teachers struggling, amazing schools searching, and a gap that needed more than just technology - it needed heart.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Spark</h3>
                    <p className="text-gray-600">
                      It started with Priya, a brilliant physics teacher who spent 6 months searching for the right school. 
                      We knew there had to be a better way.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Mission</h3>
                    <p className="text-gray-600">
                      To create magical moments where teachers find schools that value them, and schools find teachers who inspire.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <Rocket className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Vision</h3>
                    <p className="text-gray-600">
                      A world where every educator wakes up excited to teach, and every student learns from passionate teachers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-rose-300" />
                    <h3 className="text-2xl font-bold mb-2">Our Emotional Promise</h3>
                    <p className="text-blue-100">
                      We treat every job application like it's our own. Every resume review with care. Every interview prep like it's for family.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "We cry when you get rejected",
                      "We dance when you get selected",
                      "We celebrate your first day",
                      "We remember your 100th day"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts - Emotional Numbers */}
      <section className="py-16 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Numbers With{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Heartbeats
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Behind every statistic is a story, a dream achieved, a life changed.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {funFacts.map((fact, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${index === 0 ? 'from-rose-500 to-pink-500' : index === 1 ? 'from-blue-500 to-cyan-500' : index === 2 ? 'from-green-500 to-emerald-500' : index === 3 ? 'from-amber-500 to-orange-500' : index === 4 ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-teal-500'}`}>
                  <div className="text-white">{fact.icon}</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 group-hover:scale-110 transition-transform">
                  {fact.number}
                </div>
                <div className="text-sm text-gray-600 mt-2">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 text-sm font-medium mb-4">
                <Gem className="h-4 w-4 mr-2" />
                Our Soul's Compass
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Values That{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Define Our DNA
                </span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These aren't just words on a wall. They're the heartbeat of every decision we make.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${value.color} rounded-2xl p-6 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group`}
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      {value.icon}
                    </div>
                    <div className="text-5xl font-bold text-white/20">0{index + 1}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-white/80">{value.desc}</p>
                  <div className="mt-4 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center text-sm">
                      <span>This means:</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-sm font-medium mb-4">
                <Compass className="h-4 w-4 mr-2" />
                Our Journey So Far
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                From{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dream to Reality
                </span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Every milestone represents countless lives touched and dreams realized.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block" />
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="md:w-1/2 flex justify-center md:justify-start mb-4 md:mb-0">
                      <div className={`text-center md:text-right ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-bold text-gray-900">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-2">{milestone.title}</h3>
                        <p className="text-gray-600 max-w-xs mt-1">{milestone.desc}</p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white shadow-lg" />
                    </div>
                    
                    <div className="md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Heart of Our Organization */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 text-sm font-medium mb-4">
                <Users className="h-4 w-4 mr-2" />
                Heart & Soul
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet the{' '}
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Dream Builders
                </span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                A team that doesn't just work together - they dream together, cry together, and celebrate together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
                        {member.image}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-gray-500 mb-3">{member.exp}</p>
                      <div className="text-gray-600 italic text-sm mb-4">
                        "{member.quote}"
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                        <div className="flex justify-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/careers"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 group"
              >
                <HandHeart className="h-5 w-5 mr-2" />
                We're Hiring Dreamers!
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Emotional */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Write Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Success Story
              </span>
              ?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a teacher searching for meaning or a school seeking inspiration, 
              let's create magic together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?type=teacher"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                I'm a Teacher
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup?type=institute"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 group"
              >
                <Building className="h-5 w-5 mr-2" />
                I'm a School
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              P.S. We'll probably become friends along the way 😊
            </p>
          </div>
        </div>
      </section>

      {/* Fun Office Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Our Playground
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                We Work Hard,{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Dream Harder
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Office? More like a creativity playground where ideas dance and dreams take flight.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Music Mondays", desc: "Work with your favorite tunes", icon: <Music className="h-8 w-8" /> },
                { title: "Pizza Fridays", desc: "Because who doesn't love pizza?", icon: <Pizza className="h-8 w-8" /> },
                { title: "Game Nights", desc: "Unleash your inner child", icon: <Gamepad2 className="h-8 w-8" /> },
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}

// Custom icon components without TypeScript syntax
function Seedling(props) {
  return (
    <svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function PlayCircle(props) {
  return (
    <svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}