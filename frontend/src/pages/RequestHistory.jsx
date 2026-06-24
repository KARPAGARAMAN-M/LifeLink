import { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BloodGroupBadge from '../components/common/BloodGroupBadge';
import { STATUS_COLORS, URGENCY_COLORS } from '../utils/constants';
import { FaTint, FaCheckCircle, FaTimes, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RequestHistory() {
  const [tab, setTab] = useState('sent');
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get('/requests/my-requests'),
        api.get('/requests/donor-requests').catch(() => ({ data: { data: [] } })),
      ]);
      setMyRequests(sentRes.data.data || []);
      setDonorRequests(receivedRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await api.put(`/requests/${requestId}/${action}`);
      toast.success(`Request ${action}ed successfully`);
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    }
  };

  if (loading) return <LoadingSpinner text="Loading requests..." />;

  const renderRequest = (req, isSent) => (
    <div key={req.id} className={`glass-card p-5 card-hover ${req.urgency === 'CRITICAL' ? 'ring-2 ring-red-500/50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <FaTint className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white">
              {isSent ? `To: ${req.donorName}` : `From: ${req.requesterName}`}
            </p>
            <p className="text-xs text-surface-500">#{req.id} • {new Date(req.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
        <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
      </div>

      <div className="space-y-1 mb-3 text-sm text-surface-600 dark:text-surface-400">
        <p>🏥 {req.hospitalName}, {req.city}</p>
        {req.message && <p className="italic">"{req.message}"</p>}
        {!isSent && req.requesterEmail && <p>📧 {req.requesterEmail}</p>}
        {isSent && req.donorPhone && req.status === 'ACCEPTED' && <p>📞 {req.donorPhone}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={URGENCY_COLORS[req.urgency]}>{req.urgency}</span>
          <span className={STATUS_COLORS[req.status]}>{req.status}</span>
        </div>

        {/* Action buttons for received requests */}
        {!isSent && req.status === 'PENDING' && (
          <div className="flex gap-2">
            <button onClick={() => handleAction(req.id, 'accept')}
              className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
              <FaCheck /> Accept
            </button>
            <button onClick={() => handleAction(req.id, 'reject')}
              className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
              <FaTimes /> Reject
            </button>
          </div>
        )}

        {req.status === 'ACCEPTED' && (
          <button onClick={() => handleAction(req.id, 'complete')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            <FaCheckCircle /> Complete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-8">Request History</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl mb-8">
          <button onClick={() => setTab('sent')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'sent' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500'
            }`}>
            Sent ({myRequests.length})
          </button>
          <button onClick={() => setTab('received')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'received' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500'
            }`}>
            Received ({donorRequests.length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4 animate-fade-in">
          {tab === 'sent' ? (
            myRequests.length > 0 ? myRequests.map(r => renderRequest(r, true)) : (
              <div className="text-center py-16">
                <FaTint className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <p className="text-surface-500 dark:text-surface-400">No sent requests yet</p>
              </div>
            )
          ) : (
            donorRequests.length > 0 ? donorRequests.map(r => renderRequest(r, false)) : (
              <div className="text-center py-16">
                <FaTint className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <p className="text-surface-500 dark:text-surface-400">No received requests yet</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
