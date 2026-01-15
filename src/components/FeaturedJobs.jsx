'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, Target, Users, Award, Sparkles, 
  Star, TrendingUp, Shield, BookOpen, 
  GraduationCap, Trophy, Gem, Rocket
} from 'lucide-react';

const OrganizationPage = () => {
  const [counter, setCounter] = useState({
    teachers: 0,
    institutes: 0,
    placements: 0,
    success: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => ({
        teachers: prev.teachers < 525 ? prev.teachers + 100 : 525,
        institutes: prev.institutes < 150 ? prev.institutes + 50 : 150,
        placements: prev.placements < 1000 ? prev.placements + 200 : 1000,
        success: prev.success < 95 ? prev.success + 1 : 95
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const coreValues = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Passion for Education',
      description: 'We believe every teacher deserves the perfect platform to share their knowledge'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Mission Driven',
      description: 'Connecting passionate educators with institutions that value quality education'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Trust & Integrity',
      description: 'Building relationships based on transparency and mutual respect'
    }
  ];

  const achievements = [
    { number: `${counter.teachers}+`, label: 'Educators Connected', icon: '👨‍🏫' },
    { number: `${counter.institutes}+`, label: 'Institutions Partnered', icon: '🏫' },
    { number: `${counter.placements}+`, label: 'Successful Placements', icon: '🎓' },
    { number: `${counter.success}%`, label: 'Satisfaction Rate', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Organization Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-8">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-semibold">India's Premier Education Career Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Teaching Dreams
            </span> Take Flight
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            We're building a community where passion meets purpose, and every educator finds their perfect classroom.
          </p>

          {/* Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {achievements.map((item, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{item.number}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Story</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Born from a simple idea: Great teachers deserve great opportunities. 
              We're on a mission to transform education by connecting talent with opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl w-fit mb-6">
                  <div className="text-blue-600">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What We <span className="text-purple-600">Do</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">For Educators</h3>
                  <p className="text-gray-600">
                    We provide a platform where your teaching skills are valued and rewarded. 
                    No more endless searching - just quality opportunities that match your passion.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">For Institutions</h3>
                  <p className="text-gray-600">
                    We connect you with verified, passionate educators who share your vision 
                    for quality education. Build your dream team with confidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <div className="text-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Average Response Time', value: '48 hours', color: 'text-green-600' },
                  { label: 'Teacher Retention Rate', value: '92%', color: 'text-blue-600' },
                  { label: 'Institute Satisfaction', value: '96%', color: 'text-purple-600' },
                  { label: 'Career Growth Rate', value: '3x faster', color: 'text-orange-600' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl">
                    <span className="text-gray-700">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why We're <span className="text-yellow-600">Different</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Focus on Quality',
                description: 'Every connection is meaningful and purpose-driven'
              },
              {
                icon: '🤝',
                title: 'Human-Centric',
                description: 'Real people, real support - no algorithms deciding your future'
              },
              {
                icon: '🚀',
                title: 'Fast & Efficient',
                description: 'From application to placement in record time'
              },
              {
                icon: '❤️',
                title: 'Passionate Team',
                description: 'We genuinely care about education and educators'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="h-12 w-12 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our <span className="text-orange-600">Vision</span> for the Future
          </h2>
          
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-3xl p-8 md:p-12">
            <Gem className="h-16 w-16 text-yellow-300 mx-auto mb-6" />
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              We envision an India where every talented educator finds their perfect platform, 
              every student learns from passionate teachers, and education truly transforms lives.
            </p>
            <div className="text-blue-200 text-lg">
              Join us in building the future of education.
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Trophy className="h-12 w-12 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Be Part of Something <span className="text-green-600">Bigger</span>?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you're an educator looking for your dream role or an institution seeking passionate talent, 
            we're here to make it happen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <span className="flex items-center justify-center">
                <GraduationCap className="mr-3 h-5 w-5" />
                For Educators
              </span>
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <span className="flex items-center justify-center">
                <Building className="mr-3 h-5 w-5" />
                For Institutions
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="bg-gray-900 text-white py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Education Career Platform</span>
          </div>
          <p className="text-gray-400 mb-6">
            Building bridges between talent and opportunity in education
          </p>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} All rights reserved. Made with ❤️ for education.
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

// Missing icon component
const Building = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default OrganizationPage;