import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const result = await pool.query(
    `INSERT INTO users (email, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role`,
    [data.email, hashedPassword, data.role]
  );
  
  return result.rows[0];
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [data.email]
  );
  
  const user = result.rows[0];
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const isMatch = await bcrypt.compare(data.password, user.password);
  
  if (!isMatch) {
    throw new Error('Invalid password');
  }
  
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
  
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};