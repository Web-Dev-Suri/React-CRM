app.post('/api/leads', async (req, res) => {
    const lead = await prisma.lead.create({ data: req.body });
    res.json(lead);
  });
  
  app.get('/api/leads', async (req, res) => {
    const leads = await prisma.lead.findMany();
    res.json(leads);
  });