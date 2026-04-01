import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, createObservation, getObservationsByPatient } from '../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: '',
    value: '',
    unit: '',
    notes: '',
  });

  useEffect(() => {
    fetchPatient();
    fetchObservations();
  }, []);

  const fetchPatient = async () => {
    try {
      const res = await getPatientById(id!);
      setPatient(res.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchObservations = async () => {
    try {
      const res = await getObservationsByPatient(id!);
      setObservations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createObservation(id!, form);
      setForm({ type: '', value: '', unit: '', notes: '' });
      setShowForm(false);
      fetchObservations();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-400 text-lg">Loading...</p>
    </div>
  );

  if (!patient) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-400 text-lg">Patient not found!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">🏥 FHIR Medical Records</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        {/* Patient Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl">
              {patient.first_name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-gray-500">Patient ID: #{patient.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-sm">Birth Date</p>
              <p className="font-semibold text-gray-800">📅 {patient.birth_date?.split('T')[0]}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-semibold text-gray-800">⚧ {patient.gender}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-sm">Blood Group</p>
              <p className="font-semibold text-red-500">🩸 {patient.blood_group}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-semibold text-gray-800">📞 {patient.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-semibold text-gray-800">📍 {patient.address}</p>
            </div>
          </div>
        </div>

        {/* Observations Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-700">📋 Observations</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              + Add Observation
            </button>
          </div>

          {/* Add Observation Form */}
          {showForm && (
            <form onSubmit={handleAddObservation} className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded p-2 text-sm"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="Blood Sugar">Blood Sugar</option>
                    <option value="Heart Rate">Heart Rate</option>
                    <option value="Temperature">Temperature</option>
                    <option value="Weight">Weight</option>
                    <option value="Hemoglobin">Hemoglobin</option>
                    <option value="Cholesterol">Cholesterol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Value</label>
                  <input
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="e.g. 120/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Unit</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="e.g. mmHg, mg/dL"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Notes</label>
                  <input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Observations List */}
          {observations.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No observations yet</p>
          ) : (
            <div className="space-y-3">
              {observations.map((obs: any) => (
                <div key={obs.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{obs.type}</p>
                      <p className="text-blue-600 font-bold text-lg">{obs.value} <span className="text-gray-400 text-sm">{obs.unit}</span></p>
                      {obs.notes && <p className="text-gray-500 text-sm mt-1">📝 {obs.notes}</p>}
                    </div>
                    <p className="text-gray-400 text-xs">{new Date(obs.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Created At */}
        <div className="bg-white rounded-xl shadow p-4 text-center text-gray-400 text-sm">
          Record created: {new Date(patient.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;