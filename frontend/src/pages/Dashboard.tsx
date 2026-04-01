import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPatients } from '../services/api';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();
      setPatients(res.data.entry);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredPatients = patients.filter((patient: any) =>
    `${patient.first_name} ${patient.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">🏥 FHIR Medical Records</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            👤 {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Stats Bar */}
      <div className="bg-white shadow px-6 py-4 flex gap-6">
        <div className="bg-blue-50 rounded-lg px-6 py-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
          <p className="text-gray-500 text-sm">Total Patients</p>
        </div>
        <div className="bg-green-50 rounded-lg px-6 py-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {user.role?.toUpperCase()}
          </p>
          <p className="text-gray-500 text-sm">Your Role</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">All Patients</h2>
          <button
            onClick={() => navigate('/add-patient')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
          >
            + Add Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search patient by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400 text-lg">Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400 text-lg">No patients found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient: any) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/patient/${patient.id}`)}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition border border-gray-100 cursor-pointer hover:border-blue-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {patient.first_name[0]}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {patient.first_name} {patient.last_name}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>🩸 Blood Group: <span className="font-semibold text-red-500">{patient.blood_group}</span></p>
                  <p>📞 Phone: {patient.phone}</p>
                  <p>📍 Address: {patient.address}</p>
                  <p>⚧ Gender: {patient.gender}</p>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-blue-500 text-sm font-semibold">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;