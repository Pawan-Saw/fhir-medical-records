import pool from '../config/db';

export const createPatient = async (data: {
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  phone: string;
  address: string;
  blood_group: string;
}) => {
  const result = await pool.query(
    `INSERT INTO patients 
      (first_name, last_name, birth_date, gender, phone, address, blood_group)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [data.first_name, data.last_name, data.birth_date, 
     data.gender, data.phone, data.address, data.blood_group]
  );
  return result.rows[0];
};

export const getAllPatients = async () => {
  const result = await pool.query(
    `SELECT * FROM patients ORDER BY created_at DESC`
  );
  return result.rows;
};

export const getPatientById = async (id: string) => {
  const result = await pool.query(
    `SELECT * FROM patients WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updatePatient = async (id: string, data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  blood_group?: string;
}) => {
  const result = await pool.query(
    `UPDATE patients SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      phone = COALESCE($3, phone),
      address = COALESCE($4, address),
      blood_group = COALESCE($5, blood_group)
     WHERE id = $6
     RETURNING *`,
    [data.first_name, data.last_name, data.phone, 
     data.address, data.blood_group, id]
  );
  return result.rows[0];
};