require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'troque_por_uma_chave_segura';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if(!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error: 'Senha inválida' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
});

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({ select: { id:true, name:true, email:true, role:true }});
  res.json(users);
});

app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({ include: { seller: { select: { id:true, name:true } } }});
  res.json(products);
});

app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: { include: { product: true } }, buyer: true, seller: true }});
  res.json(orders);
});

app.post('/api/orders/:id/mark-delivered', async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.update({ where: { id }, data: { status: 'DELIVERED', deliveredAt: new Date() }});
  res.json(order);
});

app.post('/api/orders/:id/send-invoice', async (req, res) => {
  const { id } = req.params;
  // Simula envio de nota: marca invoiceSent=true
  const order = await prisma.order.update({ where: { id }, data: { invoiceSent: true }});
  res.json({ ok: true, order });
});

app.post('/api/commissions/:orderId/pay', async (req, res) => {
  const { orderId } = req.params;
  const order = await prisma.order.update({ where: { id: orderId }, data: { commissionPaid: true }});
  res.json(order);
});

app.listen(port, () => console.log('AI Agenda backend running on', port));
