'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, Users, GraduationCap, BookOpen, Lightbulb, 
  TrendingUp, Briefcase, Building, Calendar, Star,
  Award, Clock, DollarSign, Zap, Heart, Shield,
  ArrowRight, ChevronRight, CheckCircle, MessageCircle,
  Phone, Mail, MapPin, Video, Download, Share2,
  Search, Filter, Bookmark, Users as UsersIcon,
  FileText, Globe, TrendingUp as Growth, HelpCircle,
  Rocket, Crown, Trophy, ShieldCheck, Brain, Compass,
  PieChart, BarChart, LineChart, Target as TargetIcon,
  Sparkles, Crown as CrownIcon, Check, X, Plus, Minus,
  User // ये जोड़ें
} from 'lucide-react';

export default function CareerAdvicePage() {
  const [activeTab, setActiveTab] = useState('job-seekers');
  const [expandedTips, setExpandedTips] = useState({});
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleTip = (index) => {
    setExpandedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const jobSeekerTips = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Perfect Your Resume",
      description: "Learn how to create a teaching resume that stands out from the competition.",
      detailed: "Include your teaching philosophy, specific achievements (like improved student scores), and relevant certifications. Use action verbs like 'Developed', 'Implemented', 'Led'.",
      time: "5 min read",
      color: "from-blue-500 to-cyan-500",
      tags: ["Resume", "Application", "Beginners"]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Ace Your Interview",
      description: "Master common teaching interview questions with proven answers.",
      detailed: "Prepare for questions about classroom management, lesson planning, and handling difficult parents. Practice your demo lesson thoroughly.",
      time: "7 min read",
      color: "from-purple-500 to-pink-500",
      tags: ["Interview", "Preparation", "Advanced"]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Salary Negotiation",
      description: "Get the salary you deserve with our negotiation guide.",
      detailed: "Research average salaries in your area, know your worth, and be prepared to discuss your qualifications and achievements.",
      time: "6 min read",
      color: "from-green-500 to-emerald-500",
      tags: ["Salary", "Negotiation", "Professional"]
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Certification Guide",
      description: "Complete guide to required certifications for teaching jobs.",
      detailed: "Understand state requirements, alternative certification paths, and continuing education opportunities.",
      time: "8 min read",
      color: "from-orange-500 to-red-500",
      tags: ["Certification", "Requirements", "Guidance"]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Classroom Management",
      description: "Effective strategies for managing diverse classrooms.",
      detailed: "Learn proven techniques for behavior management, student engagement, and creating positive learning environments.",
      time: "6 min read",
      color: "from-indigo-500 to-blue-500",
      tags: ["Management", "Classroom", "Strategies"]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Career Growth",
      description: "Plan your teaching career progression path.",
      detailed: "Explore opportunities for advancement, specialization, and leadership roles in education.",
      time: "9 min read",
      color: "from-yellow-500 to-amber-500",
      tags: ["Growth", "Career", "Planning"]
    }
  ];

  const instituteTips = [
    {
      icon: <UsersIcon className="h-6 w-6" />,
      title: "Hiring Best Teachers",
      description: "Strategies to attract and retain top teaching talent.",
      detailed: "Create compelling job descriptions, offer competitive packages, and build a positive school culture.",
      time: "6 min read",
      color: "from-indigo-500 to-blue-500",
      tags: ["Hiring", "Recruitment", "Strategy"]
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Campus Recruitment",
      description: "Effective campus hiring strategies for schools.",
      detailed: "Partner with teacher training colleges, attend job fairs, and create internship programs.",
      time: "5 min read",
      color: "from-teal-500 to-green-500",
      tags: ["Campus", "Recruitment", "Partnership"]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Budget Planning",
      description: "Optimize your hiring and operational budget.",
      detailed: "Allocate resources effectively, plan for seasonal needs, and maximize ROI on hiring.",
      time: "7 min read",
      color: "from-amber-500 to-orange-500",
      tags: ["Budget", "Planning", "Finance"]
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Retention Strategies",
      description: "Keep your best teachers for longer periods.",
      detailed: "Implement mentorship programs, provide growth opportunities, and create positive work environment.",
      time: "8 min read",
      color: "from-rose-500 to-pink-500",
      tags: ["Retention", "Strategy", "Culture"]
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Compliance & Legal",
      description: "Stay compliant with education laws and regulations.",
      detailed: "Understand employment laws, certification requirements, and safety regulations for educational institutions.",
      time: "7 min read",
      color: "from-blue-500 to-indigo-500",
      tags: ["Compliance", "Legal", "Safety"]
    },
    {
      icon: <Growth className="h-6 w-6" />,
      title: "School Growth",
      description: "Strategies for institutional growth and reputation.",
      detailed: "Build brand reputation, improve academic results, and expand your institution's reach.",
      time: "9 min read",
      color: "from-purple-500 to-pink-500",
      tags: ["Growth", "Reputation", "Strategy"]
    }
  ];

  const successStories = [
    {
      name: "Priya Sharma",
      role: "Math Teacher",
      image: "PS",
      story: "Landed dream job at Delhi Public School within 2 weeks of using Creative Jobs",
      highlight: "50% salary increase",
      stats: { interviews: 3, offers: 2, time: "2 weeks" },
      color: "bg-gradient-to-r from-blue-100 to-indigo-100"
    },
    {
      name: "Ryan International School",
      role: "Private School",
      image: "RIS",
      story: "Hired 15 qualified teachers in one month with our premium recruitment package",
      highlight: "100% retention rate",
      stats: { hires: 15, time: "1 month", satisfaction: "95%" },
      color: "bg-gradient-to-r from-green-100 to-emerald-100"
    },
    {
      name: "Arjun Patel",
      role: "Physics Professor",
      image: "AP",
      story: "Successfully transitioned from corporate sector to teaching with our career guidance",
      highlight: "Career change success",
      stats: { transition: "3 months", salary: "Match", satisfaction: "100%" },
      color: "bg-gradient-to-r from-purple-100 to-pink-100"
    }
  ];

  const quickStats = [
    { label: "Jobs Found", value: "5,000+", icon: <Briefcase className="h-5 w-5" />, change: "+12%" },
    { label: "Happy Teachers", value: "3,200+", icon: <Users className="h-5 w-5" />, change: "+25%" },
    { label: "Partner Schools", value: "850+", icon: <Building className="h-5 w-5" />, change: "+18%" },
    { label: "Success Rate", value: "92%", icon: <TrendingUp className="h-5 w-5" />, change: "+5%" }
  ];

  const faqItems = [
    {
      question: "How long does it take to find a teaching job?",
      answer: "Most teachers find suitable positions within 2-4 weeks using our platform. Premium members often find jobs even faster.",
      category: "job-seekers"
    },
    {
      question: "What certifications do I need?",
      answer: "Requirements vary by state and institution. We provide detailed guides for each region and subject area.",
      category: "job-seekers"
    },
    {
      question: "How much should I expect to earn?",
      answer: "Salaries range from ₹25,000 to ₹1,00,000+ based on experience, location, and institution type. Check our salary calculator.",
      category: "job-seekers"
    },
    {
      question: "How quickly can I hire teachers?",
      answer: "Most schools fill positions within 2-3 weeks using our platform. Premium recruitment services can reduce this to 1 week.",
      category: "institutes"
    },
    {
      question: "What background checks do you perform?",
      answer: "We verify qualifications, certifications, conduct police verification, and check references for all candidates.",
      category: "institutes"
    },
    {
      question: "Can I hire for multiple positions?",
      answer: "Yes! Our bulk hiring packages offer discounts for hiring 3+ teachers. Contact our team for custom solutions.",
      category: "institutes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-indigo-50/20">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-purple-600/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium mb-6 animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                Exclusive Career Insights
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Master Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Teaching Career
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Expert guidance, proven strategies, and powerful tools to help teachers find dream jobs 
                and schools build exceptional teams.
              </p>
              
              {/* Animated Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                      <div className="text-blue-600">{stat.icon}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Tab Navigation */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg">
                <button
                  onClick={() => setActiveTab('job-seekers')}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group ${
                    activeTab === 'job-seekers'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-lg">For Job Seekers</span>
                  {activeTab === 'job-seekers' && <Sparkles className="h-4 w-4 ml-2" />}
                </button>
                <button
                  onClick={() => setActiveTab('institutes')}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group ${
                    activeTab === 'institutes'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span className="text-lg">For Institutes</span>
                  {activeTab === 'institutes' && <Crown className="h-4 w-4 ml-2" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        {/* Tips Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {activeTab === 'job-seekers' ? 'Teacher Success Toolkit' : 'Institutional Excellence Guide'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {activeTab === 'job-seekers' 
                ? 'Everything you need to land your dream teaching job'
                : 'Strategies to build and maintain an exceptional teaching team'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'job-seekers' ? jobSeekerTips : instituteTips).map((tip, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tip.color} group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">{tip.icon}</div>
                    </div>
                    <button
                      onClick={() => toggleTip(index)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedTips[index] ? (
                        <Minus className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Plus className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tip.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {expandedTips[index] ? tip.detailed : tip.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tip.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{tip.time}</span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Save
                      </button>
                      <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Path / Process Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {activeTab === 'job-seekers' ? 'Your 5-Step Success Path' : 'Our 4-Step Recruitment Process'}
                </h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  {activeTab === 'job-seekers' 
                    ? 'Follow this proven roadmap to land your dream teaching position'
                    : 'Streamlined process to find and hire the best teaching talent'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-5 gap-6">
                {(activeTab === 'job-seekers' 
                  ? [
                      { step: '01', title: 'Profile Setup', desc: 'Create compelling profile', icon: <User className="h-6 w-6" /> },
                      { step: '02', title: 'Search & Match', desc: 'Find perfect opportunities', icon: <Search className="h-6 w-6" /> },
                      { step: '03', title: 'Apply Smart', desc: 'Customized applications', icon: <CheckCircle className="h-6 w-6" /> },
                      { step: '04', title: 'Ace Interviews', desc: 'Master your interviews', icon: <Target className="h-6 w-6" /> },
                      { step: '05', title: 'Get Hired', desc: 'Start your journey', icon: <Briefcase className="h-6 w-6" /> }
                    ]
                  : [
                      { step: '01', title: 'Post Job', desc: 'List your requirements', icon: <FileText className="h-6 w-6" /> },
                      { step: '02', title: 'Candidate Match', desc: 'AI-powered matching', icon: <Users className="h-6 w-6" /> },
                      { step: '03', title: 'Interview & Select', desc: 'Coordinated interviews', icon: <Video className="h-6 w-6" /> },
                      { step: '04', title: 'Hire & Onboard', desc: 'Complete the process', icon: <Check className="h-6 w-6" /> },
                      { step: '05', title: 'Success Tracking', desc: 'Monitor performance', icon: <BarChart className="h-6 w-6" /> }
                    ]
                ).map((item, index) => (
                  <div key={index} className="text-center relative">
                    <div className="relative inline-block">
                      <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold mb-4 relative z-10 group hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                        {item.icon}
                      </div>
                      {index < 4 && (
                        <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-white/30 transform -translate-x-1/2" />
                      )}
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Real Success Stories</h2>
              <p className="text-gray-600">Inspiring journeys from our community members</p>
            </div>
            <Link 
              href="/success-stories" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 font-semibold mt-4 md:mt-0 group"
            >
              View all stories
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className={`${story.color} rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 group`}>
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg">
                      {story.image}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      <Trophy className="h-3 w-3 inline mr-1" />
                      Success
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{story.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{story.role}</p>
                    <p className="text-gray-700 mb-3">{story.story}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-blue-700 text-sm font-medium mb-3">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {story.highlight}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {Object.entries(story.stats).map(([key, value]) => (
                        <div key={key} className="bg-white/50 rounded-lg p-2">
                          <div className="font-bold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto">
            {faqItems
              .filter(item => item.category === activeTab)
              .map((item, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full bg-white rounded-xl p-6 text-left hover:shadow-lg transition-shadow duration-300 flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <HelpCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {item.question}
                      </h3>
                    </div>
                    {activeAccordion === index ? (
                      <Minus className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {activeAccordion === index && (
                    <div className="bg-blue-50 rounded-b-xl p-6 border-t border-blue-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Free Resources & Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Download our expert-created templates, guides, and calculators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Resume Template Pack",
                description: "Professional teaching resume templates (Word & PDF)",
                icon: <FileText className="h-6 w-6" />,
                downloads: "2.5K+",
                size: "3.2 MB",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Interview Preparation Kit",
                description: "100+ interview questions with model answers",
                icon: <Video className="h-6 w-6" />,
                downloads: "1.8K+",
                size: "2.1 MB",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Salary Calculator 2024",
                description: "Calculate expected salary based on location & experience",
                icon: <DollarSign className="h-6 w-6" />,
                downloads: "3.2K+",
                size: "1.5 MB",
                color: "from-green-500 to-emerald-500"
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${resource.color}`}>
                    <div className="text-white">{resource.icon}</div>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    {resource.size}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{resource.downloads} downloads</span>
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium group">
                    <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Download Free
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48" />
            <div className="relative">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your {activeTab === 'job-seekers' ? 'Career' : 'Institution'}?
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join thousands of educators and institutions who found success with Creative Jobs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={activeTab === 'job-seekers' ? "/signup?type=teacher" : "/signup?type=institute"}
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Free Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Book a Demo
                  </Link>
                </div>
                <p className="text-blue-200 text-sm mt-6">
                  Free for 30 days • No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Need immediate help?</div>
                <div className="font-bold text-gray-900">+91 98765 43210</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/book-consultation"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
              >
                Book Free Consultation
              </Link>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom styles for animation */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}