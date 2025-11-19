const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main(){
  await prisma.orderItem.deleteMany().catch(()=>{})
  await prisma.order.deleteMany().catch(()=>{})
  await prisma.product.deleteMany().catch(()=>{})
  await prisma.user.deleteMany().catch(()=>{})

  const pass = await bcrypt.hash('password', 10)

  const admin = await prisma.user.create({ data: { name: 'Admin', email: 'admin@aiagenda.test', password: pass, role: 'ADMIN' } })
  const seller1 = await prisma.user.create({ data: { name: 'Loja Beleza1', email: 'vendedor1@aiagenda.test', password: pass, role: 'SELLER' } })
  const seller2 = await prisma.user.create({ data: { name: 'Loja Perfume', email: 'vendedor2@aiagenda.test', password: pass, role: 'SELLER' } })
  const buyer = await prisma.user.create({ data: { name: 'Cliente Teste', email: 'cliente@aiagenda.test', password: pass, role: 'CLIENT' } })

  const p1 = await prisma.product.create({ data: { title: 'Perfume Masculino 100ml', description: 'Aroma intenso', priceCents: 19900, stock: 10, category: 'Perfume', sellerId: seller2.id } })
  const p2 = await prisma.product.create({ data: { title: 'Pomada Modeladora 150g', description: 'Fixação forte', priceCents: 4500, stock: 20, category: 'Barbearia', sellerId: seller1.id } })
  const p3 = await prisma.product.create({ data: { title: 'Kit Skincare Básico', description: 'Limpeza e hidratação', priceCents: 12900, stock: 5, category: 'Skincare', sellerId: seller1.id } })

  // create orders in different statuses
  const order1 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      sellerId: seller2.id,
      totalCents: p1.priceCents,
      status: 'PAID',
      items: { create: [{ productId: p1.id, qty: 1, priceCents: p1.priceCents }] }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      sellerId: seller1.id,
      totalCents: p2.priceCents,
      status: 'AWAITING_SHIPMENT',
      items: { create: [{ productId: p2.id, qty: 1, priceCents: p2.priceCents }] }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      sellerId: seller1.id,
      totalCents: p3.priceCents,
      status: 'DELIVERED',
      deliveredAt: new Date(),
      commissionPaid: false,
      items: { create: [{ productId: p3.id, qty: 1, priceCents: p3.priceCents }] }
    }
  })

  console.log({ admin: admin.email, seller1: seller1.email, seller2: seller2.email, buyer: buyer.email })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
