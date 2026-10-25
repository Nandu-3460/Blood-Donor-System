import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Heart,
  ShieldCheck,
  Award,
  Database,
  Server,
  Code2,
  Lock,
  Users,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blood-50 text-blood-700 text-xs font-bold mb-3">
          <Award className="w-4 h-4 text-blood-600" />
          Full-Stack MERN Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About LifePulse Blood Donor Finder
        </h1>
        <p className="text-base text-slate-600 mt-2">
          An end-to-end healthcare platform bridging the critical gap between blood seekers in emergency situations and willing voluntary donors.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6 sm:p-8 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">The Emergency Problem</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            During medical crises, surgeries, trauma incidents, or severe anemia, families often struggle to locate compatible blood in hospital banks. Informal messages on social media platforms lead to outdated contacts, duplicate efforts, panic, and crucial time loss.
          </p>
        </div>

        <div className="card p-6 sm:p-8 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">The LifePulse Solution</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            LifePulse provides a centralized, authenticated platform. Donors register their blood group and city with strict privacy controls, while seekers broadcast requests with assigned unique IDs, hospital locations, and real-time status transitions.
          </p>
        </div>
      </div>

      {/* Technology Architecture Section */}
      <div className="card p-8 mb-12 bg-white border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blood-600" />
          Technology Stack & Architectural Implementation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <Code2 className="w-4 h-4 text-blood-600" />
              Frontend
            </div>
            <p className="text-xs text-slate-600">
              React.js 18 with Vite for lightning-fast bundling, React Router v6 for client-side routing, and Tailwind CSS for mobile-first responsive styling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <Server className="w-4 h-4 text-blood-600" />
              Backend API
            </div>
            <p className="text-xs text-slate-600">
              Node.js and Express.js RESTful service featuring modular controllers, routes, input sanitization, and centralized error handling middleware.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <Database className="w-4 h-4 text-blood-600" />
              Database
            </div>
            <p className="text-xs text-slate-600">
              MongoDB Atlas cloud cluster with Mongoose ODM schemas, compound indexes for fast donor discovery, timestamps, and relationship population.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <Lock className="w-4 h-4 text-blood-600" />
              Authentication
            </div>
            <p className="text-xs text-slate-600">
              JSON Web Tokens (JWT) for stateless protected endpoints, salted bcrypt hashing for passwords, and role-aware privacy masking.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Medical Disclaimer */}
      <div className="card p-6 sm:p-8 bg-blood-50/60 border border-blood-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blood-100 text-blood-700 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-blood-900">
              Medical Disclaimer & Donor Suitability
            </h4>
            <p className="text-xs sm:text-sm text-blood-800 leading-relaxed">
              This software is designed solely as an information and coordination tool. A donor matching result or blood group label in this system does not guarantee medical compatibility, infectious disease clearance, or suitability. All donations and transfusions must be processed under the direct clinical oversight of certified medical staff at licensed hospitals or blood banks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
