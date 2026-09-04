import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Building,
  Ban,
  Droplet,
  Trash2,
  UserCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SeekerMyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests/my-requests');
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Could not load your blood requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this pending blood request?')) return;

    setCancellingId(requestId);
    try {
      await api.put(`/requests/${requestId}/cancel`);
      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your blood requests..." />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-black uppercase tracking-wider mb-2">
              <Droplet className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>Seeker Request Log</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">My Blood Requests</h1>
            <p className="text-xs text-slate-400">Track and manage your submitted normal and emergency blood requests.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="danger" size="sm" onClick={() => navigate('/seeker/find-blood')}>
              + New Search Request
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">No Requests Found</h3>
              <p className="text-xs text-slate-400">You haven't submitted any blood requests yet.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => navigate('/seeker/find-blood')}>
              Find Blood Near Me
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
              >
                {/* Left Request Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-950 text-red-400 border border-red-800 font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    {req.bloodGroup}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-400">REQ-{req.id}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        req.urgency === 'CRITICAL' || req.urgency === 'URGENT'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {req.urgency} Request
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">{req.hospitalName}</h3>
                    
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Location: <strong>{req.city}</strong></span>
                      <span>•</span>
                      <span>Units Needed: <strong>{req.unitsRequired}</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{req.requiredDate || 'Immediate'}</strong></span>
                    </p>

                    {req.donorName && (
                      <p className="text-xs text-slate-300 font-semibold pt-1 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>Targeted Donor: <strong>{req.donorName}</strong></span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      req.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      req.status === 'CANCELLED' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Actions based on Status */}
                  <div className="flex items-center gap-2">
                    {req.status === 'ACCEPTED' && req.donorPhone && (
                      <a
                        href={`tel:${req.donorPhone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Contact Donor ({req.donorPhone})
                      </a>
                    )}

                    {req.status === 'PENDING' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Trash2}
                        loading={cancellingId === req.id}
                        onClick={() => handleCancelRequest(req.id)}
                        className="bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-300 border-slate-700"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
