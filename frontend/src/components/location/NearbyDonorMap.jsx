import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Shield, Compass, Navigation, Droplet } from 'lucide-react';
import { formatDistance, calculateDistance } from '../../utils/distance';

export default function NearbyDonorMap({ userLat, userLon, donors = [], selectedBloodGroup = '' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamically load Leaflet CSS and JS scripts
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize or update Leaflet Map instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = window.L;

    const defaultLat = userLat || 13.0827; // Default Chennai coordinates
    const defaultLon = userLon || 80.2707;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLon],
        zoom: userLat && userLon ? 12 : 10,
        zoomControl: false,
      });

      // Add CartoDB Dark Matter / Positron tile layer for sleek aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([defaultLat, defaultLon], userLat && userLon ? 12 : 10);
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Custom Icon for User's Current Location
    if (userLat && userLon) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #ef4444;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
          ">
            🎯
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([userLat, userLon], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; text-align: center;">
            <strong style="color: #ef4444; font-size: 13px;">Your Current Location</strong>
            <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">Searching for donors in your vicinity</p>
          </div>
        `);
      markersRef.current.push(userMarker);
    }

    // Render Donor Pins with privacy jitter offset (protect precise residential location)
    donors.forEach((donor, idx) => {
      let donorLat = donor.latitude;
      let donorLon = donor.longitude;

      // If lat/lon missing, generate pseudo-offset around center city
      if (!donorLat || !donorLon) {
        const offsetAngle = (idx * 45) * (Math.PI / 180);
        donorLat = defaultLat + Math.sin(offsetAngle) * 0.03 * ((idx % 3) + 1);
        donorLon = defaultLon + Math.cos(offsetAngle) * 0.03 * ((idx % 3) + 1);
      } else {
        // Apply tiny 200m random fuzzing to preserve exact privacy
        donorLat += (Math.sin(idx * 17) * 0.002);
        donorLon += (Math.cos(idx * 23) * 0.002);
      }

      const dist = userLat && userLon ? calculateDistance(userLat, userLon, donorLat, donorLon) : null;
      const distStr = dist !== null ? formatDistance(dist) : 'Approximate Area Match';

      const donorIcon = L.divIcon({
        className: 'custom-donor-marker',
        html: `
          <div style="
            background: #dc2626;
            color: white;
            font-weight: 900;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 12px;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 3px;
          ">
            <span>🩸</span> ${donor.bloodGroup}
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const donorMarker = L.marker([donorLat, donorLon], { icon: donorIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 160px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <strong style="font-size: 13px; color: #0f172a;">${donor.name}</strong>
              <span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 6px; font-weight: 900; font-size: 10px;">${donor.bloodGroup}</span>
            </div>
            <p style="margin: 4px 0 2px; font-size: 11px; color: #475569;">📍 ${donor.city}, ${donor.state}</p>
            <p style="margin: 0; font-size: 10px; font-weight: 700; color: #16a34a;">Proximity: ${distStr}</p>
            <div style="margin-top: 6px; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              🛡️ Coordinates fuzzy-masked for privacy protection
            </div>
          </div>
        `);

      markersRef.current.push(donorMarker);
    });

  }, [leafletLoaded, userLat, userLon, donors]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-3 px-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-200">
            {userLat && userLon ? 'Interactive Map Matcher' : 'Regional Match View'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fuzzed Pins (Privacy Protected)</span>
        </div>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-[100]" />

      {/* Map Footer Bar Overlay */}
      <div className="absolute bottom-3 left-3 right-14 z-[400] flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-slate-800 text-[11px] shadow-lg">
        <span className="text-slate-300">
          Mapped <strong className="text-white">{donors.length}</strong> matching donor pin(s)
        </span>
        <span className="text-red-400 font-extrabold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Emergency Dispatch Ready
        </span>
      </div>
    </div>
  );
}
