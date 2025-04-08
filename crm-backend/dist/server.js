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
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Lead creation endpoint
app.post('/api/leads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, company, status, assignedTo } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
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
