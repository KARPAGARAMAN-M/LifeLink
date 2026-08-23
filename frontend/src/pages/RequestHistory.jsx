import React, { useState, useEffect } from 'react';
import { acceptRequest, rejectRequest, completeRequest, getMyRequests, getDonorRequests } from '../api/requestApi';
import { BloodGroupBadge, StatusBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/Modal';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Check,
  X,
  ChevronRight,
  Send,
  Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestHistory() {
  const [tab, setTab] = useState('sent'); // 'sent' | 'received'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);

  // Confirmation dialog state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    requestId: null,
    action: null,
    title: '',
    message: '',
    confirmText: '',
    variant: 'primary',
  });

  const loadRequests = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        getMyRequests().catch(() => ({ data: { data: [] } })),
        getDonorRequests().catch(() => ({ data: { data: [] } })),
      ]);
      setMyRequests(sentRes.data?.data || []);
      setDonorRequests(receivedRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to load request history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const triggerActionModal = (requestId, action) => {
    const titles = {
      accept: 'Accept Blood Request',
      reject: 'Reject Blood Request',
      complete: 'Complete Donation Match',
    };
    const messages = {
      accept: 'Are you sure you want to accept this blood request? The requester will be notified.',
      reject: 'Are you sure you want to decline this request?',
      complete: 'Marking this request as Completed signifies that the blood donation took place.',
    };
    const variants = {
      accept: 'success',
      reject: 'danger',
      complete: 'primary',
    };
    setDialogState({
      isOpen: true,
      requestId,
      action,
      title: titles[action],
      message: messages[action],
      confirmText: action.toUpperCase(),
      variant: variants[action],
    });
  };

  const handleConfirmAction = async () => {
    const { requestId, action } = dialogState;
    if (!requestId || !action) return;

    try {
      if (action === 'accept') await acceptRequest(requestId);
      else if (action === 'reject') await rejectRequest(requestId);
      else if (action === 'complete') await completeRequest(requestId);

      toast.success(`Request marked as ${action}ed successfully`);
      setDialogState({ ...dialogState, isOpen: false });
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    }
  };

  const currentList = tab === 'sent' ? myRequests : donorRequests;
  const filteredList = currentList.filter((req) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'CRITICAL') return req.urgency === 'CRITICAL';
    return req.status === statusFilter;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Lifecycle Manager
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Blood Request <span className="text-red-600 dark:text-red-500">History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Track, accept, or complete incoming and sent blood donation requests.
          </p>
        </div>

        {/* Tab & Filter Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Primary View Tabs */}
          <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setTab('sent')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                tab === 'sent'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Sent Requests ({myRequests.length})
            </button>
            <button
              onClick={() => setTab('received')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                tab === 'received'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" /> Received ({donorRequests.length})
            </button>
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CRITICAL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Render List */}
        {loading ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredList.length > 0 ? (
          <div className="space-y-6">
            {filteredList.map((req) => {
              const isSent = tab === 'sent';
              return (
                <Card
                  key={req.id}
                  className={`p-6 border-slate-200/80 dark:border-slate-800 shadow-md ${
                    req.urgency === 'CRITICAL' ? 'border-l-4 border-l-red-600' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge group={req.bloodGroup} size="md" />
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{isSent ? `Target Donor: ${req.donorName || 'Donor #' + req.donorId}` : `Requester: ${req.requesterName}`}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Request #{req.id} • Sent {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge urgency={req.urgency} />
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  <CardBody className="py-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Hospital: <strong>{req.hospitalName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Location: <strong>{req.city}</strong></span>
                      </div>
                      {!isSent && req.requesterEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">Contact: {req.requesterEmail}</span>
                        </div>
                      )}
                    </div>

                    {req.message && (
                      <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{req.message}"
                      </p>
                    )}

                    {/* Visual Status Timeline */}
                    <div className="pt-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Lifecycle Timeline</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Requested
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <span className={`flex items-center gap-1 font-bold ${req.status !== 'PENDING' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {req.status === 'REJECTED' ? 'Declined' : 'Accepted'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <span className={`flex items-center gap-1 font-bold ${req.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          Completed
                        </span>
                      </div>
                    </div>
                  </CardBody>

                  {/* Actions Footer */}
                  <CardFooter className="pt-3">
                    <div className="text-xs text-slate-400">
                      {req.status === 'PENDING' ? 'Awaiting action' : `Status: ${req.status}`}
                    </div>

                    {/* Receiver (Donor) Actions */}
                    {!isSent && req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          icon={Check}
                          onClick={() => triggerActionModal(req.id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={X}
                          onClick={() => triggerActionModal(req.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {req.status === 'ACCEPTED' && (
                      <Button
                        size="sm"
                        variant="primary"
                        icon={ShieldCheck}
                        onClick={() => triggerActionModal(req.id, 'complete')}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No Requests Found"
            description="There are no blood requests matching your selected tab or filter."
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationDialog
          isOpen={dialogState.isOpen}
          onClose={() => setDialogState({ ...dialogState, isOpen: false })}
          onConfirm={handleConfirmAction}
          title={dialogState.title}
          message={dialogState.message}
          confirmText={dialogState.confirmText}
          variant={dialogState.variant}
        />
      </div>
    </div>
  );
}
