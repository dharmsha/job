'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Filter, MapPin, BookOpen, Briefcase, Star,
  Users, MessageCircle, Phone, Mail, Award, Shield,
  GraduationCap, Clock, Calendar, CheckCircle, Sparkles,
  Heart, Eye, Download, Share2, ArrowRight, ChevronRight,
  Bookmark, BookmarkCheck, Globe, Target, Zap, Crown,
  TrendingUp, Rocket, UserCheck, UserPlus, Languages,
  Microscope, Music, Palette, Laptop, Calculator, Atom,
  Volume2, Globe as GlobeIcon, Filter as FilterIcon,
  X, SlidersHorizontal, ChevronDown, ExternalLink
} from 'lucide-react';

export default function TeachersDirectory() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [experienceRange, setExperienceRange] = useState([0, 30]);
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [savedTeachers, setSavedTeachers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for teachers
  useEffect(() => {
    const mockTeachers = [
      {
        id: 1,
        name: "Dr. Priya Sharma",
        title: "Mathematics Expert",
        experience: 15,
        rating: 4.9,
        reviews: 128,
        subjects: ["Mathematics", "Physics", "Calculus"],
        location: "Delhi",
        available: true,
        hourlyRate: "₹800-₹1200",
        education: "PhD in Mathematics, IIT Delhi",
        bio: "15+ years of teaching experience with 1000+ students successfully placed in top colleges.",
        avatar: "PS",
        tags: ["IIT JEE", "Board Exams", "Olympiad"],
        featured: true,
        verified: true,
        color: "from-blue-500 to-cyan-500"
      },
      {
        id: 2,
        name: "Rohit Verma",
        title: "Physics Specialist",
        experience: 12,
        rating: 4.8,
        reviews: 95,
        subjects: ["Physics", "Electronics", "Mechanics"],
        location: "Mumbai",
        available: true,
        hourlyRate: "₹700-₹1000",
        education: "MSc Physics, BARC Mumbai",
        bio: "Specialized in conceptual physics teaching with innovative methods.",
        avatar: "RV",
        tags: ["NEET", "Engineering", "Competitive"],
        featured: true,
        verified: true,
        color: "from-purple-500 to-pink-500"
      },
      {
        id: 3,
        name: "Anjali Patel",
        title: "Chemistry Mentor",
        experience: 10,
        rating: 4.7,
        reviews: 87,
        subjects: ["Chemistry", "Organic Chemistry", "Biochemistry"],
        location: "Bangalore",
        available: false,
        hourlyRate: "₹600-₹900",
        education: "PhD in Chemistry, IISc Bangalore",
        bio: "Making chemistry fun and understandable for all students.",
        avatar: "AP",
        tags: ["Medical", "Engineering", "Research"],
        featured: false,
        verified: true,
        color: "from-green-500 to-emerald-500"
      },
      {
        id: 4,
        name: "Arjun Singh",
        title: "Biology Expert",
        experience: 8,
        rating: 4.6,
        reviews: 64,
        subjects: ["Biology", "Botany", "Zoology"],
        location: "Hyderabad",
        available: true,
        hourlyRate: "₹500-₹800",
        education: "MSc Biotechnology, University of Hyderabad",
        bio: "Simplifying complex biological concepts with real-world examples.",
        avatar: "AS",
        tags: ["NEET", "Medical", "Life Sciences"],
        featured: false,
        verified: true,
        color: "from-amber-500 to-orange-500"
      },
      {
        id: 5,
        name: "Meera Reddy",
        title: "English Language Coach",
        experience: 20,
        rating: 4.9,
        reviews: 156,
        subjects: ["English", "Literature", "Communication"],
        location: "Chennai",
        available: true,
        hourlyRate: "₹900-₹1400",
        education: "PhD in English Literature, University of Oxford",
        bio: "20+ years of teaching English to students from diverse backgrounds.",
        avatar: "MR",
        tags: ["IELTS", "TOEFL", "Spoken English"],
        featured: true,
        verified: true,
        color: "from-rose-500 to-pink-500"
      },
      {
        id: 6,
        name: "Kunal Malhotra",
        title: "Computer Science Guru",
        experience: 7,
        rating: 4.5,
        reviews: 42,
        subjects: ["Computer Science", "Programming", "AI"],
        location: "Pune",
        available: true,
        hourlyRate: "₹1000-₹1500",
        education: "MTech Computer Science, IIT Bombay",
        bio: "Industry professional turned teacher with real-world coding experience.",
        avatar: "KM",
        tags: ["Coding", "Web Development", "Data Science"],
        featured: false,
        verified: true,
        color: "from-indigo-500 to-blue-500"
      },
      {
        id: 7,
        name: "Sanskriti Sharma",
        title: "Social Studies Expert",
        experience: 18,
        rating: 4.8,
        reviews: 112,
        subjects: ["History", "Geography", "Civics"],
        location: "Kolkata",
        available: false,
        hourlyRate: "₹600-₹900",
        education: "MA History, JNU Delhi",
        bio: "Making history come alive with storytelling and interactive sessions.",
        avatar: "SS",
        tags: ["UPSC", "Board Exams", "Competitive"],
        featured: true,
        verified: true,
        color: "from-teal-500 to-green-500"
      },
      {
        id: 8,
        name: "Vikram Joshi",
        title: "Economics Professor",
        experience: 14,
        rating: 4.7,
        reviews: 89,
        subjects: ["Economics", "Business Studies", "Statistics"],
        location: "Ahmedabad",
        available: true,
        hourlyRate: "₹700-₹1100",
        education: "PhD Economics, Delhi School of Economics",
        bio: "Simplifying economics with real-world examples and case studies.",
        avatar: "VJ",
        tags: ["CA", "Commerce", "Banking"],
        featured: false,
        verified: true,
        color: "from-violet-500 to-purple-500"
      }
    ];

    setTeachers(mockTeachers);
    setFilteredTeachers(mockTeachers);
    setLoading(false);
  }, []);

  // Filter teachers based on criteria
  useEffect(() => {
    let filtered = [...teachers];

    // Search by name, subjects, location
    if (searchQuery) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subjects.some(subject =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        teacher.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by subjects
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(teacher =>
        selectedSubjects.some(subject =>
          teacher.subjects.map(s => s.toLowerCase()).includes(subject.toLowerCase())
        )
      );
    }

    // Filter by locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(teacher =>
        selectedLocations.includes(teacher.location)
      );
    }

    // Filter by experience range
    filtered = filtered.filter(teacher =>
      teacher.experience >= experienceRange[0] &&
      teacher.experience <= experienceRange[1]
    );

    // Filter by availability
    if (availability !== 'all') {
      filtered = filtered.filter(teacher =>
        availability === 'available' ? teacher.available : !teacher.available
      );
    }

    // Sort teachers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'price-low':
          const rateA = parseInt(a.hourlyRate.split('-')[0].replace('₹', ''));
          const rateB = parseInt(b.hourlyRate.split('-')[0].replace('₹', ''));
          return rateA - rateB;
        case 'price-high':
          const rateAHigh = parseInt(a.hourlyRate.split('-')[1].replace('₹', ''));
          const rateBHigh = parseInt(b.hourlyRate.split('-')[1].replace('₹', ''));
          return rateBHigh - rateAHigh;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredTeachers(filtered);
  }, [searchQuery, selectedSubjects, selectedLocations, experienceRange, availability, sortBy, teachers]);

  const subjectsList = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "History",
    "Geography", "Computer Science", "Economics", "Business Studies",
    "Accountancy", "Political Science", "Psychology", "Sociology",
    "Art", "Music", "Physical Education", "Languages"
  ];

  const locationsList = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleSaveTeacher = (teacherId) => {
    setSavedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setSelectedLocations([]);
    setExperienceRange([0, 30]);
    setAvailability('all');
    setSortBy('rating');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-indigo-50/10">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-indigo-50/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                India's Largest Teacher Network
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Teaching Mentor
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Browse 10,000+ verified teachers across India. Filter by subject, location, 
                experience, and availability. Find the perfect match for your learning needs.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by subject, teacher name, location, or keyword..."
                    className="w-full pl-12 pr-40 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg shadow-xl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Filter className="h-5 w-5" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2 text-blue-100">
                  <Users className="h-5 w-5" />
                  <span><strong>10,000+</strong> Teachers</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <BookOpen className="h-5 w-5" />
                  <span><strong>50+</strong> Subjects</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <MapPin className="h-5 w-5" />
                  <span><strong>100+</strong> Cities</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <Star className="h-5 w-5" />
                  <span><strong>4.8</strong> Avg Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {/* Experience Range */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Experience
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{experienceRange[0]} years</span>
                        <span>{experienceRange[1]}+ years</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={experienceRange[1]}
                        onChange={(e) => setExperienceRange([0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex space-x-2">
                        {[0, 5, 10, 15, 20, 25].map(num => (
                          <button
                            key={num}
                            onClick={() => setExperienceRange([0, num])}
                            className={`text-xs px-2 py-1 rounded ${
                              experienceRange[1] === num
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {num}+
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subjects */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Subjects
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {subjectsList.map(subject => (
                        <button
                          key={subject}
                          onClick={() => handleSubjectToggle(subject)}
                          className={`flex items-center w-full text-left p-2 rounded-lg transition-colors ${
                            selectedSubjects.includes(subject)
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className={`h-3 w-3 rounded-full border mr-3 ${
                            selectedSubjects.includes(subject)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`} />
                          <span className="text-sm">{subject}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Locations */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </h3>
                    <div className="space-y-2">
                      {locationsList.map(location => (
                        <button
                          key={location}
                          onClick={() => handleLocationToggle(location)}
                          className={`flex items-center w-full text-left p-2 rounded-lg transition-colors ${
                            selectedLocations.includes(location)
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className={`h-3 w-3 rounded-full border mr-3 ${
                            selectedLocations.includes(location)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`} />
                          <span className="text-sm">{location}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Availability
                    </h3>
                    <div className="flex space-x-2">
                      {['all', 'available', 'unavailable'].map(option => (
                        <button
                          key={option}
                          onClick={() => setAvailability(option)}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                            availability === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Apply Filters Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700">
                    Show {filteredTeachers.length} Teachers
                  </button>
                </div>
                
                {/* CTA Card */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">Are You a Teacher?</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Join our network of 10,000+ educators and reach more students.
                  </p>
                  <Link
                    href="/teachers/signup"
                    className="block w-full py-2.5 bg-white text-green-600 text-center font-medium rounded-lg hover:bg-green-50"
                  >
                    Join as Teacher
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Header with Sort and Results */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Top Teaching Experts
                  </h2>
                  <p className="text-gray-600">
                    Showing {filteredTeachers.length} of {teachers.length} teachers
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="rating">Highest Rating</option>
                      <option value="experience">Most Experienced</option>
                      <option value="reviews">Most Reviews</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FilterIcon className="h-5 w-5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
              
              {/* Teachers Grid */}
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No teachers found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeachers.map(teacher => (
                    <div key={teacher.id} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                        
                        {/* Teacher Header */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                              <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${teacher.color} flex items-center justify-center text-white text-xl font-bold`}>
                                {teacher.avatar}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {teacher.name}
                                  </h3>
                                  {teacher.verified && (
                                    <div className="p-0.5 bg-blue-100 rounded">
                                      <Shield className="h-4 w-4 text-blue-600" />
                                    </div>
                                  )}
                                  {teacher.featured && (
                                    <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full">
                                      <Crown className="h-3 w-3 inline mr-1" />
                                      Featured
                                    </div>
                                  )}
                                </div>
                                <p className="text-blue-600 font-medium text-sm">{teacher.title}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium text-gray-900">{teacher.rating}</span>
                                  <span className="text-xs text-gray-500">({teacher.reviews} reviews)</span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => toggleSaveTeacher(teacher.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {savedTeachers.includes(teacher.id) ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Bookmark className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          
                          {/* Teacher Info */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <Briefcase className="h-4 w-4" />
                              <span>{teacher.experience} years experience</span>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{teacher.location}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <GraduationCap className="h-4 w-4" />
                              <span className="truncate">{teacher.education}</span>
                            </div>
                            
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              teacher.available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              <div className={`h-2 w-2 rounded-full mr-2 ${
                                teacher.available ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              {teacher.available ? 'Available Now' : 'Currently Busy'}
                            </div>
                          </div>
                          
                          {/* Subjects */}
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {teacher.subjects.map((subject, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {teacher.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Bio */}
                          <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                            {teacher.bio}
                          </p>
                        </div>
                        
                        {/* Footer with CTA */}
                        <div className="border-t border-gray-100 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Hourly Rate</div>
                              <div className="text-xl font-bold text-gray-900">{teacher.hourlyRate}</div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <MessageCircle className="h-5 w-5 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Phone className="h-5 w-5 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Mail className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              href={`/teachers/${teacher.id}`}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 text-center flex items-center justify-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Profile</span>
                            </Link>
                            <button className="flex-1 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 text-center flex items-center justify-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Book Trial</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {filteredTeachers.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Previous
                    </button>
                    {[1, 2, 3, '...', 10].map((page, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded-lg ${
                          page === 1
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              <Rocket className="h-4 w-4 mr-2" />
              Join Our Elite Network
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Teacher?
            </h2>
            
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Browse our verified teacher profiles, read reviews, and book a free trial session. 
              Your learning journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Find a Teacher Now
              </Link>
              <Link
                href="/teachers/signup"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Join as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute inset-0" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Mobile filters content - same as desktop */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{experienceRange[0]} years</span>
                      <span>{experienceRange[1]}+ years</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={experienceRange[1]}
                      onChange={(e) => setExperienceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Subjects Mobile */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Subjects
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {subjectsList.map(subject => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectToggle(subject)}
                        className={`flex items-center w-full text-left p-2 rounded-lg ${
                          selectedSubjects.includes(subject)
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full border mr-3 ${
                          selectedSubjects.includes(subject)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`} />
                        <span className="text-sm">{subject}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Locations Mobile */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {locationsList.map(location => (
                      <button
                        key={location}
                        onClick={() => handleLocationToggle(location)}
                        className={`p-2 rounded-lg text-sm ${
                          selectedLocations.includes(location)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Availability Mobile */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'available', 'unavailable'].map(option => (
                      <button
                        key={option}
                        onClick={() => setAvailability(option)}
                        className={`py-2 text-sm font-medium rounded-lg ${
                          availability === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}