import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  FileText,
  AlertCircle,
  Siren,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Building,
  MapPin,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DonorRequests() {
  const [requests, setRequests] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDonorRequestsData();
  }, []);

  const fetchDonorRequestsData = async () => {
    setLoading(true);
    try {
      const profRes = await api.get('/donors/my-profile');
      setDonorProfile(profRes.data?.data || null);

      const reqRes = await api.get('/requests/donor-requests');
      setRequests(reqRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load donor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!donorProfile?.availability) {
      alert('You are currently set to UNAVAILABLE. Please enable availability in your profile before accepting requests.');
      return;
    }

    setActionLoading(requestId);
    try {
      await api.put(`/requests/${requestId}/accept`);
      alert('Blood request accepted! The seeker has been notified with your contact details.');
      fetchDonorRequestsData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;

    setActionLoading(requestId);
    try {
      await api.put(`/requests/${requestId}/reject`);
      fetchDonorRequestsData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline request.');
    } finally {
      setActionLoading(null);
    }
  };

  const emergencyRequests = requests.filter(r => r.status === 'PENDING' && (r.urgency === 'CRITICAL' || r.urgency === 'URGENT'));
  const normalRequests = requests.filter(r => r.status === 'PENDING' && r.urgency !== 'CRITICAL' && r.urgency !== 'URGENT');
  const acceptedRequests = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'FULFILLED' || r.status === 'COMPLETED');
  const declinedRequests = requests.filter(r => r.status === 'DECLINED' || r.status === 'REJECTED' || r.status === 'CANCELLED');

  if (loading) return <LoadingSpinner text="Loading blood requests..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-black uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Donor Request Triage</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Blood Requests For You</h1>
          <p className="text-xs text-slate-400">Review incoming emergency & normal requests from blood seekers.</p>
        </div>

        {!donorProfile?.availability && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>You are currently set to UNAVAILABLE. You must switch your availability to 🟢 AVAILABLE to accept requests.</span>
            </div>
          </div>
        )}

        {/* SECTION 1: 🚨 EMERGENCY REQUESTS */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-500 animate-bounce" />
            <span>🚨 Emergency Requests</span>
            <span className="px-2.5 py-0.5 text-xs font-black bg-red-950 text-red-300 border border-red-800 rounded-full">
              {emergencyRequests.length}
            </span>
          </h2>

          {emergencyRequests.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No pending emergency alerts right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyRequests.map((req) => (
                <div key={req.id} className="bg-red-950/30 rounded-3xl border-2 border-red-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded">
                        🚨 EMERGENCY CRITICAL
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">{req.hospitalName}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>Location: <strong>{req.city}</strong></span>
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-400 border border-red-700 font-black text-xl flex items-center justify-center shadow-lg">
                      {req.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                    <p><strong>Required Units:</strong> {req.unitsRequired} Units</p>
                    <p><strong>Required Time:</strong> {req.requiredDate || 'Today / Immediate'}</p>
                    <p><strong>Requester:</strong> {req.requesterName}</p>
                    {req.message && <p className="text-slate-400 italic">"{req.message}"</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="danger"
                      size="md"
                      loading={actionLoading === req.id}
                      onClick={() => handleAcceptRequest(req.id)}
                      className="justify-center font-black text-xs shadow-lg shadow-red-600/30"
                    >
                      [ ACCEPT REQUEST ]
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      loading={actionLoading === req.id}
                      onClick={() => handleDeclineRequest(req.id)}
                      className="justify-center font-black text-xs bg-slate-800 text-slate-300"
                    >
                      [ DECLINE ]
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: 📩 NORMAL REQUESTS */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <span>📩 Normal Requests</span>
            <span className="px-2.5 py-0.5 text-xs font-black bg-slate-800 text-slate-300 rounded-full">
              {normalRequests.length}
            </span>
          </h2>

          {normalRequests.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No pending normal blood requests right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {normalRequests.map((req) => (
                <div key={req.id} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-slate-800 text-slate-300 rounded">
                        NORMAL REQUEST
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">{req.hospitalName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Location: {req.city}</p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 font-black text-xl flex items-center justify-center">
                      {req.bloodGroup}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 text-slate-300">
                    <p><strong>Units Required:</strong> {req.unitsRequired}</p>
                    <p><strong>Requester:</strong> {req.requesterName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      loading={actionLoading === req.id}
                      onClick={() => handleAcceptRequest(req.id)}
                      className="justify-center font-black text-xs bg-rose-600 hover:bg-rose-500"
                    >
                      [ ACCEPT REQUEST ]
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      loading={actionLoading === req.id}
                      onClick={() => handleDeclineRequest(req.id)}
                      className="justify-center font-black text-xs bg-slate-800 text-slate-300"
                    >
                      [ DECLINE ]
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: ✅ ACCEPTED REQUESTS */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>✅ Accepted Requests ({acceptedRequests.length})</span>
          </h2>

          {acceptedRequests.length > 0 && (
            <div className="space-y-3">
              {acceptedRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-900 border border-emerald-900/60 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{req.hospitalName} ({req.bloodGroup})</h4>
                    <p className="text-xs text-slate-400">Requester: {req.requesterName} • Contact: {req.contactNumber || 'Available'}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-black bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
