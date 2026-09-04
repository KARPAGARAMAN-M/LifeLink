import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import {
  SearchCode,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Building,
  UserCheck,
  MapPin,
  Droplet
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TrackRequest() {
  const [searchParams] = useSearchParams();

  const [requestCode, setRequestCode] = useState(searchParams.get('code') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);

  useEffect(() => {
    if (requestCode) {
      handleTrackRequest();
    }
  }, []);

  const handleTrackRequest = async (e) => {
    if (e) e.preventDefault();
    if (!requestCode) {
      setError('Please enter your Request ID (e.g. LL-REQ-10482)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/requests/track', null, {
        params: { requestCode, phone }
      });
      setRequestDetails(res.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Blood request not found. Check your Request ID and Phone Number.');
      setRequestDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 🟢 Donor Accepted
          </span>
        );
      case 'PENDING':
      case 'MATCHING':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin" /> 🟡 Donor Matching
          </span>
        );
      case 'DECLINED':
      case 'REJECTED':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-red-950 text-red-400 border border-red-800 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> 🔴 No Donor Available
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-black uppercase tracking-wider">
            <SearchCode className="w-4 h-4 text-amber-400" />
            <span>Public Status Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Track Request Status
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Enter your unique Request ID and phone number to view live request updates. No password required.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-950 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleTrackRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Request ID (e.g. LL-REQ-10482) *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="LL-REQ-10482"
                    value={requestCode}
                    onChange={(e) => setRequestCode(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 font-mono font-bold focus:border-amber-500"
                  />
                  <SearchCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Requester Phone Number
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white placeholder-slate-500 pl-10 focus:border-amber-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={SearchCode}
              className="w-full py-4 font-black text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-xl shadow-amber-600/20 justify-center rounded-2xl"
            >
              [ TRACK REQUEST ]
            </Button>
          </form>
        </div>

        {/* Live Status Output Card */}
        {loading ? (
          <LoadingSpinner text="Locating blood request record..." />
        ) : requestDetails && (
          <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">TRACKING RECORD</p>
                <h3 className="text-2xl font-black text-amber-400">{requestDetails.requestCode || `LL-REQ-${requestDetails.id}`}</h3>
              </div>
              <div>{getStatusBadge(requestDetails.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase">Hospital / Facility</span>
                <p className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-500" />
                  {requestDetails.hospitalName}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase">Blood Group & Units</span>
                <p className="text-base font-bold text-red-400 flex items-center gap-2">
                  <Droplet className="w-4 h-4 fill-current text-red-500" />
                  {requestDetails.bloodGroup} ({requestDetails.unitsRequired || 1} Units)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase">Location</span>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {requestDetails.city}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase">Urgency</span>
                <p className="text-sm font-bold text-white uppercase">{requestDetails.urgency}</p>
              </div>
            </div>

            {/* Donor Contact Details if ACCEPTED */}
            {requestDetails.status === 'ACCEPTED' && (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                  <UserCheck className="w-5 h-5" />
                  <span>Donor Accepted Your Request!</span>
                </div>
                <p>Donor Name: <strong>{requestDetails.donorName}</strong></p>
                {requestDetails.donorPhone && (
                  <div className="pt-1">
                    <a
                      href={`tel:${requestDetails.donorPhone}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30"
                    >
                      <Phone className="w-4 h-4" /> Call Donor ({requestDetails.donorPhone})
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
