"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// crm-backend/src/server.ts
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Nodemailer setup
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Lead creation endpoint
app.post('/api/leads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const lead = yield prisma.lead.create({
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
                yield transporter.sendMail({
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
            }
            catch (emailError) {
                console.error('Failed to send assignment email:', emailError);
            }
        }
        res.status(201).json(lead);
    }
    catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all leads
app.get('/api/leads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leads = yield prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    }
    catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
