import { useEffect, useState } from 'react';

// Point this at your deployed Spring Boot API
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

const STATUS_STYLES = {
  RED: { bg: 'bg-red-100', border: 'border-red-400', dot: 'bg-red-500', label: 'Untouched' },
  YELLOW: { bg: 'bg-yellow-100', border: 'border-yellow-400', dot: 'bg-yellow-500', label: 'In Progress' },
  GREEN: { bg: 'bg-green-100', border: 'border-green-400', dot: 'bg-green-500', label: 'Hydro-Tested & Certified' },
};

export default function Dashboard() {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFloors();
    const interval = setInterval(fetchFloors, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchFloors() {
    try {
      const res = await fetch(`${API_BASE}/floors`);
      if (!res.ok) throw new Error('Failed to load floors');
      const data = await res.json();
      // sort: B1 first, then GF, then numeric floors ascending
      const order = { B1: -2, GF: -1 };
      data.sort((a, b) => {
        const av = order[a.floorNumber] ?? parseInt(a.floorNumber);
        const bv = order[b.floorNumber] ?? parseInt(b.floorNumber);
        return av - bv;
      });
      setFloors(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const total = floors.length;
  const green = floors.filter(f => f.status === 'GREEN').length;
  const yellow = floors.filter(f => f.status === 'YELLOW').length;
  const red = floors.filter(f => f.status === 'RED').length;
  const progressPct = total ? Math.round((green / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Amanora Ascent Avenue — Digital Fire Audit Tracker
          </h1>
          <p className="text-slate-500 mt-1">Live floor-by-floor fire protection progress · KK Fire Services</p>
        </header>

        {/* Overall progress summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-700">Overall Building Progress</span>
            <span className="text-2xl font-bold text-slate-800">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-sm text-slate-600">
            <span>🟢 {green} Certified</span>
            <span>🟡 {yellow} In Progress</span>
            <span>🔴 {red} Untouched</span>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading floor data...</p>}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded p-3">
            Could not reach the API ({API_BASE}). Is the backend running? ({error})
          </p>
        )}

        {/* Floor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {floors.map((floor) => {
            const style = STATUS_STYLES[floor.status] || STATUS_STYLES.RED;
            const sprinklerPct = floor.totalSprinklers
              ? Math.round((floor.testedSprinklers / floor.totalSprinklers) * 100)
              : 0;
            return (
              <div
                key={floor.id}
                className={`rounded-xl border-2 ${style.border} ${style.bg} p-4 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-slate-800">
                    {floor.floorLabel || floor.floorNumber}
                  </h2>
                  <span className={`w-3 h-3 rounded-full ${style.dot}`} />
                </div>
                <p className="text-sm text-slate-600 mb-2">{style.label}</p>
                {floor.totalSprinklers > 0 && (
                  <p className="text-xs text-slate-500">
                    Sprinklers tested: {floor.testedSprinklers}/{floor.totalSprinklers} ({sprinklerPct}%)
                  </p>
                )}
                {floor.notes && (
                  <p className="text-xs text-slate-500 mt-2 italic">"{floor.notes}"</p>
                )}
                {floor.updatedAt && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    Updated: {new Date(floor.updatedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Auto-refreshes every 30 seconds · KK Fire Services Digital Compliance Platform
        </footer>
      </div>
    </div>
  );
}
