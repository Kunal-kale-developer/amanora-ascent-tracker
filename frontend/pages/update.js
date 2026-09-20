import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

export default function UpdatePage() {
  const [floors, setFloors] = useState([]);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState('YELLOW');
  const [installed, setInstalled] = useState('');
  const [tested, setTested] = useState('');
  const [notes, setNotes] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/floors`)
      .then(r => r.json())
      .then(setFloors)
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/floors/${selected}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          updatedBy,
          installedSprinklers: installed ? parseInt(installed) : undefined,
          testedSprinklers: tested ? parseInt(tested) : undefined,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      setMessage('✅ Floor updated successfully');
      setNotes('');
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Site Update — Ascent Avenue</h1>
        <p className="text-slate-500 text-sm mb-6">Log today's floor progress</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Floor</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
              required
            >
              <option value="">Select floor</option>
              {floors.map(f => (
                <option key={f.id} value={f.floorNumber}>{f.floorLabel || f.floorNumber}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
            >
              <option value="RED">🔴 Untouched</option>
              <option value="YELLOW">🟡 In Progress</option>
              <option value="GREEN">🟢 Hydro-Tested & Certified</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Installed</label>
              <input
                type="number"
                value={installed}
                onChange={(e) => setInstalled(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
                placeholder="Sprinklers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tested</label>
              <input
                type="number"
                value={tested}
                onChange={(e) => setTested(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
                placeholder="Sprinklers"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
              rows={3}
              placeholder="e.g. Pipe fitting done, testing pending"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
              placeholder="Technician name"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-slate-800 text-white rounded-lg p-3 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Floor'}
          </button>

          {message && <p className="text-sm text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
