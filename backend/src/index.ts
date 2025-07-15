import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import AdminJS from 'adminjs';

const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');

import transactionRoutes from './routes/transactionRoutes';
import authRoutes from './routes/authRoutes';

import { User } from './models/User';
import { Transaction } from './models/Transaction';

AdminJS.registerAdapter(AdminJSMongoose);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        properties: { password: { isVisible: false } }
      }
    },
    { resource: Transaction }
  ],
  rootPath: '/admin',
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password123',
};

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email: string, password: string) => {
    if (email === ADMIN.email && password === ADMIN.password) return ADMIN;
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
});

app.use(adminJs.options.rootPath, adminRouter);

app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🛠️ AdminJS available at http://localhost:${PORT}${adminJs.options.rootPath}`);
});
