// crm-backend/src/server.ts
import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Type for request body validation
type LeadInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  assignedTo?: string;
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Lead creation endpoint
app.post('/api/leads', async (req: Request<{}, {}, LeadInput>, res: Response) => {
  try {
    const { name, email, phone, company, status, assignedTo } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Validate email format if provided
    if (assignedTo && !/\S+@\S+\.\S+/.test(assignedTo)) {
      return res.status(400).json({ error: 'Invalid email format for assigned user' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || '',
        phone: phone || '',
        company: company || '',
        status: status || 'New',
        assignedTo: assignedTo || 'Unassigned'
      }
    });

    // Send email notification if assigned
    if (assignedTo && assignedTo !== 'Unassigned') {
      try {
        await transporter.sendMail({
          from: `CRM System <${process.env.EMAIL_USER}>`,
          to: assignedTo,
          subject: 'New Lead Assignment',
          html: `
            <h3>New Lead Assigned</h3>
            <p>You have been assigned a new lead:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
              ${email ? `<li><strong>Email:</strong> ${email}</li>` : ''}
              ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
              <li><strong>Status:</strong> ${status || 'New'}</li>
            </ul>
            <p>Please follow up with this lead promptly.</p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send assignment email:', emailError);
      }
    }

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all leads
app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

