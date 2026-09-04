import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchDonors } from '../api/donorApi';
import { BLOOD_GROUPS, INDIAN_STATES } from '../utils/constants';
import useGeolocation from '../utils/useGeolocation';
import { calculateDistance, formatDistance } from '../utils/distance';
import LocationPermission from '../components/location/LocationPermission';
import NearbyDonorMap from '../components/location/NearbyDonorMap';
import EmergencyRequestModal from '../components/common/EmergencyRequestModal';
import ReportModal from '../components/common/ReportModal';
import { BloodGroupBadge, AvailabilityBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  ShieldCheck,
  RotateCcw,
  HeartHandshake,
  Lock,
  Navigation,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SearchDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const geo = useGeolocation();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState(null);
  const [selectedDonorForReport, setSelectedDonorForReport] = useState(null);


  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || 'O+',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    radius: searchParams.get('radius') || '10',
    availableOnly: true,
  });

  const fetchDonors = async (currentFilters) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (currentFilters.bloodGroup) params.bloodGroup = currentFilters.bloodGroup;
      if (currentFilters.city) params.city = currentFilters.city;
      if (currentFilters.state) params.state = currentFilters.state;
      if (currentFilters.radius) params.radius = currentFilters.radius;
      if (geo.latitude && geo.longitude) {
        params.latitude = geo.latitude;
        params.longitude = geo.longitude;
      }
      params.available = currentFilters.availableOnly;

      const res = await searchDonors(params);
      let results = res.data?.data || [];

      // Sort client-side by distance if coordinates available
      if (geo.latitude && geo.longitude) {
        results = results.map((d) => {
          const dist = (d.latitude && d.longitude)
            ? calculateDistance(geo.latitude, geo.longitude, d.latitude, d.longitude)
            : null;
          return { ...d, distanceKm: dist };
        }).sort((a, b) => {
          if (a.availability !== b.availability) return b.availability ? 1 : -1;
          if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
          return 0;
        });
      }

      setDonors(results);
    } catch (err) {
      toast.error('Failed to load donors. Please try again.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors(filters);
  };

  const handleResetFilters = () => {
    const cleared = { bloodGroup: '', city: '', state: '', radius: '10', availableOnly: false };
    setFilters(cleared);
    setSearchParams({});
    fetchDonors(cleared);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" /> Real-Time Location Matcher
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Find Blood <span className="text-red-600 dark:text-red-500">Near You</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Available donors sorted by real-time proximity and eligibility. No account creation required.
          </p>
        </div>

        {/* Location Permission Prompt */}
        <LocationPermission
          onAllowLocation={geo.requestLocation}
          onManualSearch={() => {}}
          loading={geo.loading}
          permissionDenied={geo.permissionDenied}
          latitude={geo.latitude}
          longitude={geo.longitude}
        />

        {/* Search & Filter Bar */}
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <Select
              label="Blood Group *"
              icon={Filter}
              options={BLOOD_GROUPS}
              value={filters.bloodGroup}
              onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
            />

            <Select
              label="Search Radius"
              icon={Navigation}
              options={['5 km', '10 km', '25 km', '50 km']}
              value={`${filters.radius} km`}
              onChange={(e) => setFilters({ ...filters, radius: e.target.value.replace(' km', '') })}
            />

            <Input
              label="City (Manual)"
              icon={MapPin}
              placeholder="e.g. Salem / Chennai"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />

            <Select
              label="State (Manual)"
              icon={MapPin}
              options={INDIAN_STATES}
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              placeholder="All States"
            />

            <div className="flex gap-2">
              <Button type="submit" variant="primary" icon={Search} className="flex-1 justify-center py-3 font-extrabold shadow-lg shadow-red-600/30">
                Find Donors
              </Button>
              <Button
                type="button"
                variant="ghost"
                icon={RotateCcw}
                onClick={handleResetFilters}
                className="px-3"
                title="Reset Filters"
              />
            </div>
          </form>
        </Card>

        {/* Map Visualization */}
        {donors.length > 0 && (
          <NearbyDonorMap
            userLat={geo.latitude}
            userLon={geo.longitude}
            donors={donors}
            selectedBloodGroup={filters.bloodGroup}
          />
        )}

        {/* Results Container */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : donors.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                <span className="text-red-600 dark:text-red-400 text-sm font-extrabold">{donors.length}</span> Available {filters.bloodGroup} Donor(s) Found
              </p>
              {geo.latitude && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                  ✓ Sorted by Proximity
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => {
                const distanceText = donor.distanceKm !== undefined
                  ? formatDistance(donor.distanceKm)
                  : donor.latitude && donor.longitude && geo.latitude
                  ? formatDistance(calculateDistance(geo.latitude, geo.longitude, donor.latitude, donor.longitude))
                  : 'Approximate region match';

                return (
                  <Card key={donor.id} hover className="border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-5 space-y-4">
                    <CardHeader
                      title={donor.name}
                      subtitle={`${donor.city}, ${donor.state}`}
                      action={<BloodGroupBadge group={donor.bloodGroup} size="md" />}
                    />

                    <CardBody className="space-y-3">
                      {/* Availability & Proximity Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <AvailabilityBadge available={donor.availability} />
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {distanceText}
                        </span>
                      </div>

                      {/* Eligibility Status */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>✓ Eligible to donate</span>
                      </div>

                      {/* Masked Privacy Notice */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400">
                        <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Exact contact protected. Direct request notifies donor securely.</span>
                      </div>
                    </CardBody>

                    <CardFooter className="pt-2 flex gap-2">
                      <Button
                        size="md"
                        variant={donor.availability ? 'danger' : 'secondary'}
                        isDisabled={!donor.availability}
                        icon={HeartHandshake}
                        onClick={() => setSelectedDonorForRequest(donor)}
                        className="flex-1 justify-center font-black py-2.5 shadow-md shadow-red-600/30"
                      >
                        Request Blood
                      </Button>
                      <button
                        type="button"
                        onClick={() => setSelectedDonorForReport(donor)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Report Suspicious Donor"
                      >
                        🚩
                      </button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

        ) : searched ? (
          <EmptyState
            icon={Search}
            title="No donors found nearby."
            description="There are currently no available donors matching your search."
            actionText="Broaden Search Filters"
            onAction={handleResetFilters}
          />

        ) : null}
      </div>

      {/* Emergency Request Modal */}
      {selectedDonorForRequest && (
        <EmergencyRequestModal
          donor={selectedDonorForRequest}
          onClose={() => setSelectedDonorForRequest(null)}
          onSuccess={() => fetchDonors(filters)}
        />
      )}

      {/* Abuse Report Modal */}
      {selectedDonorForReport && (
        <ReportModal
          targetType="DONOR"
          targetId={selectedDonorForReport.id}
          targetName={selectedDonorForReport.name}
          onClose={() => setSelectedDonorForReport(null)}
        />
      )}
    </div>
  );
}

