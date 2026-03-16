'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Globe, Trophy, Star, Target, 
  Heart, Shield, Zap, ArrowRight, Sparkles,
  BookOpen, GraduationCap, Building2
} from 'lucide-react';

const EducationPlatform = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- PREMIUM DYNAMIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <div className="relative z-10 px-4 md:px-6">
        
        {/* --- HERO SECTION --- */}
        <section className="pt-24 pb-16 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">India's Premier Education Career Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1]">
            Where Teaching <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
              Dreams Take Flight
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            We're building a community where passion meets purpose, and every educator finds their perfect classroom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group">
              For Educators <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              For Institutions
            </button>
          </div>
        </section>

        {/* --- STATS GRID (Glassic Style) --- */}
        <section className="py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { val: '525+', label: 'Educators', icon: <Users className="text-blue-400" /> },
              { val: '150+', label: 'Institutions', icon: <Building2 className="text-purple-400" /> },
              { val: '1000+', label: 'Placements', icon: <Trophy className="text-amber-400" /> },
              { val: '95%', label: 'Satisfaction', icon: <Star className="text-emerald-400" /> },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all group">
                <div className="mb-4 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-black mb-1">{stat.val}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- WHAT WE DO --- */}
        <section className="py-20 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What We Do</h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-b from-indigo-600/20 to-transparent border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap size={120} />
              </div>
              <h3 className="text-3xl font-bold mb-6">For Educators</h3>
              <p className="text-slate-400 leading-relaxed text-lg mb-8">
                We provide a platform where your teaching skills are valued and rewarded. No more endless searching - just quality opportunities that match your passion.
              </p>
              <ul className="space-y-4">
                {['Passion for Education', 'Career Growth', 'Top Opportunities'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-semibold text-sm">
                    <Zap className="h-4 w-4 text-indigo-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-gradient-to-b from-emerald-600/20 to-transparent border border-emerald-500/20 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe size={120} />
              </div>
              <h3 className="text-3xl font-bold mb-6">For Institutions</h3>
              <p className="text-slate-400 leading-relaxed text-lg mb-8">
                We connect you with verified, passionate educators who share your vision for quality education. Build your dream team with confidence.
              </p>
              <ul className="space-y-4">
                {['Mission Driven', 'Verified Talent', 'Efficiency'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-semibold text-sm">
                    <Shield className="h-4 w-4 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- IMPACT NUMBERS --- */}
        <section className="py-20 bg-white/[0.02] rounded-[3rem] border border-white/5 my-10 overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
            {[
              { l: 'Response Time', v: '48 Hours' },
              { l: 'Teacher Retention', v: '92%' },
              { l: 'Institute Satisfaction', v: '96%' },
              { l: 'Growth Rate', v: '3x Faster' }
            ].map((x, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-indigo-400 mb-2">{x.v}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{x.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-indigo-600 relative overflow-hidden shadow-2xl shadow-indigo-600/40">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Ready to Be Part of Something Bigger?</h2>
            <p className="text-indigo-100 mb-10 text-lg relative z-10 font-medium">Whether you're looking for your dream role or seeking passionate talent, we're here to make it happen.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:scale-105 transition-transform">Get Started Now</button>
            </div>
          </div>
          
          <footer className="mt-20 py-10 border-t border-white/5 text-slate-500 text-sm">
            <p>© 2026 All rights reserved. Made with ❤️ for education.</p>
          </footer>
        </section>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EducationPlatform;