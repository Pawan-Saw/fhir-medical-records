import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'doctor',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(255),
      birth_date DATE,
      gender VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS observations (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      type VARCHAR(100) NOT NULL,
      value VARCHAR(100) NOT NULL,
      unit VARCHAR(50),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Tables created successfully!');
};

pool.connect()
  .then(() => {
    console.log('✅ Database connected successfully!');
    createTables();
  })
  .catch((err) => console.error('❌ Database connection error:', err));

export default pool;