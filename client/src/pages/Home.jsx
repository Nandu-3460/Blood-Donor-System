import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Search,
  PlusCircle,
  Heart,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedGroup) params.append('bloodGroup', selectedGroup);
    if (city.trim()) params.append('city', city.trim());
    navigate(`/find-donors?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blood-900 via-blood-800 to-blood-950 text-white py-16 lg:py-24">
        {/* Subtle background blood drop shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blood-500 filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blood-700/60 border border-blood-500/40 text-blood-100 text-xs sm:text-sm font-medium">
                <Heart className="w-4 h-4 text-blood-300 fill-blood-300" />
                <span>Every donation can save up to 3 lives</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Connect Fast. <br />
                <span className="text-blood-300">Find Blood Donors</span> In Your City.
              </h1>

              <p className="text-base sm:text-lg text-blood-100/90 max-w-2xl leading-relaxed">
                LifePulse bridges the critical gap between blood seekers in medical emergencies and compassionate voluntary donors ready to donate.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/create-request"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blood-800 font-semibold shadow-lg hover:bg-blood-50 active:scale-95 transition"
                >
                  <PlusCircle className="w-5 h-5 text-blood-600" />
                  Post Emergency Blood Request
                </Link>
                <Link
                  to="/donor-profile"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blood-700/80 hover:bg-blood-600 text-white font-semibold border border-blood-500/50 active:scale-95 transition"
                >
                  <Heart className="w-5 h-5 text-white" />
                  Become a Voluntary Donor
                </Link>
              </div>
            </div>

            {/* Quick Search Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blood-100 flex items-center justify-center text-blood-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Immediate Donor Search</h3>
                    <p className="text-xs text-slate-500">Query verified donors by group & city</p>
                  </div>
                </div>

                <form onSubmit={handleQuickSearch} className="space-y-4">
                  <div>
                    <label className="label">Blood Group Needed</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Any Blood Group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Group
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">City / Location</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, Delhi, Bangalore"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-with-icon"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary !py-3 font-semibold text-base shadow-md shadow-blood-600/20"
                  >
                    Search Available Donors
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <Link
                    to="/find-donors"
                    className="text-xs font-semibold text-blood-600 hover:text-blood-800 transition inline-flex items-center gap-1"
                  >
                    Advanced filters & all active requests <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blood-600 mb-2">
              Simple & Rapid Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How The Blood Request Workflow Works
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Every feature is connected to MongoDB Atlas for real-time request tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card p-6 border-t-4 border-t-blood-600 relative">
              <div className="w-12 h-12 rounded-xl bg-blood-50 text-blood-600 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Create Request</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hospitalized patients or families submit a blood requirement specifying hospital, required blood group, units, urgency, and deadline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card p-6 border-t-4 border-t-blood-600 relative">
              <div className="w-12 h-12 rounded-xl bg-blood-50 text-blood-600 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Donor Accepts</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nearby registered voluntary donors inspect matching requests on their portal and accept to pledge units. The requester gets real-time dashboard updates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card p-6 border-t-4 border-t-blood-600 relative">
              <div className="w-12 h-12 rounded-xl bg-blood-50 text-blood-600 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Donation Completed</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upon medical screening at the blood bank and transfusion, the request is marked completed, updating donor donation records in MongoDB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Compatibility Guide */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blood-600 mb-2">
              Medical Reference
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Blood Compatibility Matrix
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Understanding which donor groups can safely give to which recipients.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3.5">Recipient Blood Group</th>
                    <th className="px-6 py-3.5">Compatible Red Cell Donors</th>
                    <th className="px-6 py-3.5">Compatible Plasma Donors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { recipient: 'O-', canReceive: 'O-', plasma: 'O, A, B, AB' },
                    { recipient: 'O+', canReceive: 'O+, O-', plasma: 'O, A, B, AB' },
                    { recipient: 'A-', canReceive: 'A-, O-', plasma: 'A, AB' },
                    { recipient: 'A+', canReceive: 'A+, A-, O+, O-', plasma: 'A, AB' },
                    { recipient: 'B-', canReceive: 'B-, O-', plasma: 'B, AB' },
                    { recipient: 'B+', canReceive: 'B+, B-, O+, O-', plasma: 'B, AB' },
                    { recipient: 'AB-', canReceive: 'AB-, A-, B-, O-', plasma: 'AB only' },
                    { recipient: 'AB+ (Universal Recipient)', canReceive: 'All Blood Types', plasma: 'AB only' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-blood-50/50 transition">
                      <td className="px-6 py-3 font-semibold text-blood-700">{row.recipient}</td>
                      <td className="px-6 py-3 text-slate-700">{row.canReceive}</td>
                      <td className="px-6 py-3 text-slate-500">{row.plasma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blood-700 to-blood-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-3xl font-extrabold tracking-tight">
                Ready to Make a Difference?
              </h3>
              <p className="text-blood-100 text-sm sm:text-base leading-relaxed">
                Join our network of voluntary blood donors. Keep your profile updated and be ready to answer calls for help when patients need blood the most.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link
                  to="/register"
                  className="btn-primary !bg-white !text-blood-800 hover:!bg-blood-50 font-semibold"
                >
                  Create Your Free Account
                </Link>
                <Link
                  to="/about"
                  className="btn-secondary !bg-blood-800/80 !text-white !border-blood-500 hover:!bg-blood-700 font-semibold"
                >
                  Learn More About The Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
