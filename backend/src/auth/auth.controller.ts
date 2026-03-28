import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message: '✅ User registered successfully!',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      message: '✅ Login successful!',
      token: result.token,
      user: result.user
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};