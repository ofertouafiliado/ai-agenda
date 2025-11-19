import React, { useEffect, useState } from "react";

function SimpleProduct({p}) {
  return (<div style={{border:'1px solid #eee', padding:12, borderRadius:8, marginBottom:8}}>
    <div style={{fontWeight:600}}>{p.title} — R${(p.priceCents/100).toFixed(2)}</div>
    <div style={{fontSize:13, color:'#555'}}>{p.description}</div>
  </div>);
}

export default function App(){
  const [status, setStatus] = useState('loading');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(()=> {
    fetch('/api/health').then(r=>r.json()).then(()=>setStatus('ok')).catch(()=>setStatus('offline'));
    fetch('/api/products').then(r=>r.json()).then(setProducts).catch(()=>{});
    fetch('/api/users').then(r=>r.json()).then(setUsers).catch(()=>{});
    fetch('/api/orders').then(r=>r.json()).then(setOrders).catch(()=>{});
  },[]);

  return (<div style={{padding:20, maxWidth:900, margin:'0 auto', fontFamily:'Inter,system-ui', color:'#111'}}>
    <h1>Ai AGENDA — Demo (Frontend)</h1>
    <p>Status backend: <strong>{status}</strong></p>

    <section style={{marginTop:20}}>
      <h2>Produtos (seed)</h2>
      {products.length===0 ? <div>Carregando...</div> : products.map(p => <SimpleProduct key={p.id} p={p} />)}
    </section>

    <section style={{marginTop:20}}>
      <h2>Usuários</h2>
      <ul>
        {users.map(u=> <li key={u.id}>{u.name} — {u.email} — {u.role}</li>)}
      </ul>
    </section>

    <section style={{marginTop:20}}>
      <h2>Pedidos</h2>
      {orders.map(o => (
        <div key={o.id} style={{border:'1px solid #eee', padding:12, borderRadius:8, marginBottom:8}}>
          <div><strong>Pedido</strong> — {(o.totalCents/100).toFixed(2)} — Status: {o.status}</div>
          <div style={{fontSize:13, color:'#555'}}>Vendedor: {o.seller?.name} — Cliente: {o.buyer?.name}</div>
        </div>
      ))}
    </section>

    <div style={{marginTop:30, fontSize:13, color:'#666'}}>Logins seed: admin@aiagenda.test, vendedor1@aiagenda.test, vendedor2@aiagenda.test, cliente@aiagenda.test — senha: password</div>
  </div>);
}
