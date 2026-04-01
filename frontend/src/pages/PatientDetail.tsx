import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById } from '../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
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

          {/* Patient Details */}
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

        {/* Created At */}
        <div className="bg-white rounded-xl shadow p-4 text-center text-gray-400 text-sm">
          Record created: {new Date(patient.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;