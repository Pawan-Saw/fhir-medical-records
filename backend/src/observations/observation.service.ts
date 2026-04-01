import pool from '../config/db';

export const createObservation = async (data: {
  patient_id: string;
  type: string;
  value: string;
  unit: string;
  notes: string;
}) => {
  const result = await pool.query(
    `INSERT INTO observations (patient_id, type, value, unit, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.patient_id, data.type, data.value, data.unit, data.notes]
  );
  return result.rows[0];
};

export const getObservationsByPatient = async (patient_id: string) => {
  const result = await pool.query(
    `SELECT * FROM observations WHERE patient_id = $1 ORDER BY created_at DESC`,
    [patient_id]
  );
  return result.rows;
};