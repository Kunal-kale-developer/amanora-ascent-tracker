import { useEffect, useState, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

const CHECKLIST_ITEMS = [
  { key: 'sprinklers', label: 'Sprinklers installed' },
  { key: 'piping', label: 'Pipe routing complete' },
  { key: 'valves', label: 'Valves / hose reel installed' },
  { key: 'panel', label: 'Panel connection done (if applicable)' },
];

export default function SiteWalk() {
  const [floors, setFloors] = useState([]);
  const [index, setIndex] = useState(0);
  const [checklist, setChecklist] = useState({});
  const [damaged, setDamaged] = useState(false);
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('walker_name') || '' : ''
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/floors`)
      .then(r => r.json())
      .then(data => {
        const order = { B1: -2, GF: -1 };
        data.sort((a, b) => {
          const av = order[a.floorNumber] ?? parseInt(a.floorNumber);
          const bv = order[b.floorNumber] ?? parseInt(b.floorNumber);
          return av - bv;
        });
        setFloors(data);
      });
  }, []);

  const currentFloor = floors[index];

  function resetForNextFloor() {
    setChecklist({});
    setDamaged(false);
    setNotes('');
    setPhotoPreview(null);
    setPhotoData(null);
    setMessage('');
  }

  function toggleItem(key) {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoData(reader.result); // base64 data URL
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function deriveStatus() {
    const checkedCount = CHECKLIST_ITEMS.filter(i => checklist[i.key]).length;
    if (checkedCount === CHECKLIST_ITEMS.length) return 'GREEN';
    if (checkedCount === 0) return 'RED';
    return 'YELLOW';
  }

  async function handleSaveAndNext() {
    if (!currentFloor) return;
    setSaving(true);
    if (typeof window !== 'undefined') localStorage.setItem('walker_name', updatedBy);

    const checklistSummary = CHECKLIST_ITEMS
      .map(i => `${checklist[i.key] ? '✅' : '❌'} ${i.label}`)
      .join(' | ');
    const fullNotes = [
      checklistSummary,
      damaged ? '⚠️ DAMAGE FOUND — needs redo' : null,
      notes ? `Note: ${notes}` : null,
    ].filter(Boolean).join('\n');

    try {
      await fetch(`${API_BASE}/floors/${currentFloor.floorNumber}/walk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: deriveStatus(),
          notes: fullNotes,
          updatedBy,
          photoData: photoData,
          photoCaption: damaged ? 'Damage found' : 'Site walk photo',
        }),
      });
      setMessage('✅ Saved — moving to next floor');
      setTimeout(() => {
        resetForNextFloor();
        setIndex(i => Math.min(i + 1, floors.length - 1));
      }, 600);
    } catch (err) {
      setMessage('❌ Could not save — check connection, try again');
    } finally {
      setSaving(false);
    }
  }

  if (!floors.length) {
    return <div className="p-6 text-slate-500">Loading floors...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-slate-800">Site Walk</h1>
          <span className="text-sm text-slate-500">
            Floor {index + 1} of {floors.length}
          </span>
        </div>

        {/* progress bar across floors */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-slate-700 transition-all"
            style={{ width: `${((index + 1) / floors.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {currentFloor.floorLabel || currentFloor.floorNumber}
          </h2>

          {/* your name — asked once, remembered */}
          {!updatedBy && (
            <input
              type="text"
              placeholder="Your name (asked once)"
              className="w-full border border-slate-300 rounded-lg p-2 mb-4"
              onBlur={(e) => setUpdatedBy(e.target.value)}
            />
          )}

          {/* checklist — tap as you look around */}
          <div className="space-y-2 mb-4">
            {CHECKLIST_ITEMS.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleItem(item.key)}
                className={`w-full text-left p-3 rounded-lg border-2 flex items-center justify-between ${
                  checklist[item.key]
                    ? 'bg-green-50 border-green-400 text-green-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>{item.label}</span>
                <span>{checklist[item.key] ? '✅' : '⬜'}</span>
              </button>
            ))}
          </div>

          {/* damage toggle */}
          <button
            type="button"
            onClick={() => setDamaged(d => !d)}
            className={`w-full p-3 rounded-lg border-2 mb-4 font-medium ${
              damaged ? 'bg-red-50 border-red-400 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            {damaged ? '⚠️ Damage / redo flagged' : 'Mark damage / redo needed'}
          </button>

          {/* camera capture */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-lg border-2 border-dashed border-slate-300 text-slate-600"
            >
              📷 {photoPreview ? 'Retake photo' : 'Take photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="hidden"
            />
            {photoPreview && (
              <img src={photoPreview} alt="preview" className="mt-2 rounded-lg w-full object-cover max-h-48" />
            )}
          </div>

          {/* quick note */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any quick note (optional)"
            className="w-full border border-slate-300 rounded-lg p-2 mb-4"
            rows={2}
          />

          {message && <p className="text-sm text-center mb-2">{message}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => { resetForNextFloor(); setIndex(i => Math.max(0, i - 1)); }}
              className="flex-1 p-3 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={saving || !updatedBy}
              className="flex-[2] p-3 rounded-lg bg-slate-800 text-white font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : index === floors.length - 1 ? 'Save & Finish' : 'Save & Next Floor →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
