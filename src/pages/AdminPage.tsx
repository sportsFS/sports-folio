import { useState, useEffect } from 'react';
import { useApp, Order } from '../context/AppContext';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Product } from '../data/products';

type Tab = 'dashboard' | 'products' | 'orders' | 'users';

const categories = [
  { value: 'bats', label: 'Cricket Bats' },
  { value: 'protection', label: 'Protective Gear' },
  { value: 'gloves', label: 'Gloves & Wicket Keeping' },
  { value: 'balls', label: 'Cricket Balls' },
  { value: 'apparel', label: 'Apparel, Bags & Kits' },
  { value: 'accessories', label: 'Accessories & Training Tools' },
];

export default function AdminPage() {
  const { user, showPage, products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '5rem', marginBottom: 24, opacity: 0.3 }}>🔒</div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', marginBottom: 12, color: 'var(--text)' }}>
            Admin Access Required
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            You don't have permission to access this page.
          </p>
          <button className="btn-neon" onClick={() => showPage('home')}>BACK TO HOME</button>
        </div>
      </div>
    );
  }

  const totalUsers = 1;

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.85rem',
    background: tab === t ? 'var(--neon)' : 'transparent',
    color: tab === t ? 'var(--black)' : 'var(--text)',
    boxShadow: tab === t ? '0 0 15px var(--neon-glow)' : 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal visible" style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            ⚡ Admin
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            Admin Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <button style={tabStyle('dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
          <button style={tabStyle('products')} onClick={() => setTab('products')}>📦 Products ({products.length})</button>
          <button style={tabStyle('orders')} onClick={() => setTab('orders')}>🛒 Orders ({orders.length})</button>
          <button style={tabStyle('users')} onClick={() => setTab('users')}>👥 Users ({totalUsers})</button>
        </div>

        {tab === 'dashboard' && <DashboardTab products={products} totalUsers={totalUsers} orders={orders} showPage={showPage} />}
        {tab === 'products' && <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
        {tab === 'orders' && <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} />}
        {tab === 'users' && <UsersTab />}
      </section>
    </div>
  );
}

/* ── Dashboard ── */
function DashboardTab({ products, totalUsers, orders, showPage }: {
  products: Product[]; totalUsers: number; orders: Order[]; showPage: (p: string) => void;
}) {
  const { user } = useApp();
  const migrateMutation = useMutation(api.migrateProducts.migrate);
  const [syncing, setSyncing] = useState(false);
  const avgRating = products.length ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : '0';

  async function handleSync() {
    if (!user || syncing) return;
    if (!confirm('Replace all products with the new product catalog? This cannot be undone.')) return;
    setSyncing(true);
    try {
      const result = await migrateMutation({ userId: user.id as any }) as any;
      alert(`Sync complete! Inserted ${result.inserted} products, removed ${result.deleted}. Refreshing...`);
      window.location.reload();
    } catch (err: any) {
      alert('Sync failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard icon="📦" label="Total Products" value={products.length} />
        <StatCard icon="👥" label="Registered Users" value={totalUsers} />
        <StatCard icon="🛒" label="Total Orders" value={orders.length} />
        <StatCard icon="⭐" label="Avg Rating" value={avgRating} />
      </div>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 28 }}>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button className="btn-neon" onClick={() => showPage('shop')}>View Store</button>
          <button className="btn-outline" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Sync Products'}
          </button>
          <button className="btn-outline" onClick={() => showPage('home')}>Home</button>
        </div>
      </div>
    </>
  );
}

/* ── Products Tab ── */
function ProductsTab({ products, addProduct, updateProduct, deleteProduct }: {
  products: Product[]; addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, u: Partial<Product>) => void; deleteProduct: (id: string) => void;
}) {
  const [modal, setModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [form, setForm] = useState({ name: '', category: 'bats', price: '', oldPrice: '', rating: '4.5', reviews: '', image: '/images/products/product.jpg', badge: '', badgeClass: '' });
  const [uploading, setUploading] = useState(false);
  const uploadAction = useAction(api.upload.uploadImage);

  function openAdd() {
    setForm({ name: '', category: 'bats', price: '', oldPrice: '', rating: '4.5', reviews: '', image: '/images/products/product.jpg', badge: '', badgeClass: '' });
    setModal({ open: true });
  }

  function openEdit(p: Product) {
    setForm({ name: p.name, category: p.category, price: String(p.price), oldPrice: String(p.oldPrice || ''), rating: String(p.rating), reviews: String(p.reviews || ''), image: p.image, badge: p.badge || '', badgeClass: p.badgeClass || '' });
    setModal({ open: true, editId: p.id });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB'); return; }
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const url = await uploadAction({ file: arrayBuffer }) as string;
      setForm(f => ({ ...f, image: url }));
    } catch (err) {
      alert('Upload failed. Try using an image URL instead.');
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    const data = {
      name: form.name, category: form.category,
      price: Number(form.price), oldPrice: Number(form.oldPrice) || Number(form.price) + 100,
      rating: Number(form.rating) || 4.5, reviews: Number(form.reviews) || 0,
      image: form.image || '/images/products/product.jpg',
      badge: form.badge, badgeClass: form.badgeClass || undefined,
    };
    if (!data.name || !data.price) return;
    if (modal.editId !== undefined) {
      updateProduct(modal.editId, data);
    } else {
      addProduct(data);
    }
    setModal({ open: false });
  }

  const categoryLabel: Record<string, string> = {
    bats: 'Bats', protection: 'Protection', gloves: 'Gloves & WK', balls: 'Balls', apparel: 'Apparel', accessories: 'Accessories',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{products.length} products</span>
        <button className="btn-neon" style={{ padding: '10px 22px', fontSize: '0.85rem' }} onClick={openAdd}>
          + Add Product
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--card-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px' }}>Image</th>
              <th style={{ padding: '12px 8px' }}>Name</th>
              <th style={{ padding: '12px 8px' }}>Category</th>
              <th style={{ padding: '12px 8px' }}>Price</th>
              <th style={{ padding: '12px 8px' }}>Rating</th>
              <th style={{ padding: '12px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text)' }}>
                <td style={{ padding: '10px 8px' }}>
                  <img src={p.image} alt="" loading="lazy" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{categoryLabel[p.category] || p.category}</td>
                <td style={{ padding: '10px 8px' }}>${p.price.toLocaleString('en-US')}</td>
                <td style={{ padding: '10px 8px' }}>{p.rating}</td>
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem' }}>
                      Edit
                    </button>
                    <button onClick={() => { if (confirm('Delete this product?')) deleteProduct(p.id); }}
                      style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #FF3333', background: 'transparent', color: '#FF3333', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem' }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setModal({ open: false })}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
              {modal.editId ? 'Edit Product' : 'Add Product'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input placeholder="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Price ($)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
                <input placeholder="Old Price ($)" type="number" value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Rating (1-5)" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
                <input placeholder="Reviews" type="number" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: 6, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Product Image
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, border: '2px solid var(--card-border)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)' }}>
                    {form.image ? (
                      <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '2rem', opacity: 0.3 }}>📷</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{
                      padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)',
                      background: 'var(--input-bg)', color: 'var(--text)', cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 600,
                      textAlign: 'center', transition: 'all 0.2s',
                    }}>
                      {uploading ? 'Uploading...' : 'Choose File'}
                      <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
                    </label>
                    <input
                      placeholder="Or paste image URL"
                      value={form.image}
                      onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--card-border)', borderRadius: 8, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Badge (e.g. Bestseller)" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="auth-input" style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }} />
                <select value={form.badgeClass} onChange={e => setForm(f => ({ ...f, badgeClass: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem' }}>
                  <option value="">No class</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-neon" style={{ flex: 1, padding: '12px' }} onClick={handleSave}>
                {modal.editId ? 'SAVE CHANGES' : 'ADD PRODUCT'}
              </button>
              <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setModal({ open: false })}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Orders Tab ── */
function OrdersTab({ orders, updateOrderStatus }: { orders: Order[]; updateOrderStatus: (id: string, s: 'pending' | 'shipped' | 'delivered', trackingNumber?: string) => void }) {
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const statusColor = (s: string) => {
    switch (s) {
      case 'pending': return '#FFA500';
      case 'shipped': return '#0088FF';
      case 'delivered': return '#00CC66';
      default: return 'var(--text-secondary)';
    }
  };

  useEffect(() => {
    const map: Record<string, string> = {};
    orders.forEach(o => { if (o.trackingNumber) map[o.id] = o.trackingNumber; });
    setTracking(prev => ({ ...map, ...prev }));
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.3 }}>🛒</div>
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--card-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Order ID</th>
            <th style={{ padding: '12px 8px' }}>Customer</th>
            <th style={{ padding: '12px 8px' }}>Items</th>
            <th style={{ padding: '12px 8px' }}>Total</th>
            <th style={{ padding: '12px 8px' }}>Date</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
            <th style={{ padding: '12px 8px' }}>Tracking</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text)' }}>
              <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{o.id.slice(0, 8)}</td>
              <td style={{ padding: '10px 8px', fontWeight: 600 }}>{o.userName}</td>
              <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td>
              <td style={{ padding: '10px 8px' }}>${o.total.toLocaleString('en-US')}</td>
              <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '10px 8px' }}>
                <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value as 'pending' | 'shipped' | 'delivered', tracking[o.id])}
                  style={{
                    padding: '6px 10px', borderRadius: 8, border: `2px solid ${statusColor(o.status)}`,
                    background: 'var(--input-bg)', color: statusColor(o.status), fontWeight: 600,
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', cursor: 'pointer',
                  }}>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
              <td style={{ padding: '10px 8px' }}>
                <input
                  value={tracking[o.id] || ''}
                  onChange={e => setTracking(t => ({ ...t, [o.id]: e.target.value }))}
                  placeholder="Tracking #"
                  style={{
                    width: 130, padding: '6px 10px', borderRadius: 8,
                    border: '2px solid var(--card-border)',
                    background: 'var(--input-bg)', color: 'var(--text)',
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Users Tab ── */
function UsersTab() {
  const stored: { id: string; name: string; email: string; role: string }[] = (() => {
    try { return JSON.parse(localStorage.getItem('cricket_users') || '[]'); } catch { return []; }
  })();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--card-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>Name</th>
            <th style={{ padding: '12px 8px' }}>Email</th>
            <th style={{ padding: '12px 8px' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {stored.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text)' }}>
              <td style={{ padding: '10px 8px', fontWeight: 600 }}>{u.name}</td>
              <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{u.email}</td>
              <td style={{ padding: '10px 8px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                  background: u.role === 'admin' ? 'rgba(170,255,0,0.15)' : 'var(--input-bg)',
                  color: u.role === 'admin' ? 'var(--neon-dark)' : 'var(--text-secondary)',
                }}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 24 }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--neon-dark)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}
