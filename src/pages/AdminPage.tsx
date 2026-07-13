import { useEffect, useMemo, useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp, Order } from '../context/AppContext';
import { Product } from '../data/products';
import { ADMIN_PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from '../data/catalog';
import './AdminPage.css';

type Tab = 'dashboard' | 'products' | 'orders' | 'users';
type UserRow = { id: string; name: string; email: string; role: string };
type ReturnStatus = NonNullable<Order['returnRequest']>['status'];
type ProductForm = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  rating: string;
  reviews: string;
  image: string;
  badge: string;
  badgeClass: string;
  description: string;
  stockQuantity: string;
  isActive: boolean;
};

const categories = ADMIN_PRODUCT_CATEGORIES;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function emptyProductForm(): ProductForm {
  return {
    name: '', category: 'bats', price: '', oldPrice: '', rating: '4.5', reviews: '',
    image: '/images/products/product.jpg', badge: '', badgeClass: '', description: '',
    stockQuantity: '0', isActive: true,
  };
}

export default function AdminPage() {
  const { user, showPage, products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');
  const usersData = useQuery(api.users.list, user?.role === 'admin' ? {} : 'skip');
  const adminProductsData = useQuery(api.products.listAdmin, user?.role === 'admin' ? {} : 'skip');
  const adminProducts = (adminProductsData ?? products) as Product[];

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-page">
        <div className="admin-access-panel">
          <div className="admin-access-mark" aria-hidden="true">!</div>
          <h1>Admin access required</h1>
          <p>This area is restricted to the SPORTSFOLIO store administrator.</p>
          <button className="admin-button admin-button-primary" onClick={() => showPage('home')}>Return to store</button>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; count?: number }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'products', label: 'Products', count: adminProducts.length },
    { id: 'orders', label: 'Orders', count: orders.length },
    { id: 'users', label: 'Customers', count: usersData?.length },
  ];

  return (
    <div className="admin-page">
      <section className="admin-shell" aria-label="Store administration">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-mark" aria-hidden="true">S</span>
            <span><strong>SPORTSFOLIO</strong><small>Store operations</small></span>
          </div>

          <nav className="admin-nav" aria-label="Admin sections">
            {navItems.map(item => (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item${tab === item.id ? ' is-active' : ''}`}
                aria-current={tab === item.id ? 'page' : undefined}
                onClick={() => setTab(item.id)}
              >
                <span>{item.label}</span>
                {item.count !== undefined && <span className="admin-nav-count">{item.count}</span>}
              </button>
            ))}
          </nav>

          <div className="admin-account">
            <span className="admin-avatar" aria-hidden="true">{initials(user.name)}</span>
            <span><strong>{user.name}</strong><small>Administrator</small></span>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <p className="admin-context">Store administration</p>
              <h1>{navItems.find(item => item.id === tab)?.label}</h1>
            </div>
            <button className="admin-button admin-button-secondary" onClick={() => showPage('shop')}>
              Open storefront <span aria-hidden="true">↗</span>
            </button>
          </div>

          {tab === 'dashboard' && (
            <DashboardTab
              products={adminProducts}
              totalUsers={usersData?.length}
              orders={orders}
              showPage={showPage}
              selectTab={setTab}
            />
          )}
          {tab === 'products' && (
            <ProductsTab products={adminProducts} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />
          )}
          {tab === 'orders' && <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} />}
          {tab === 'users' && <UsersTab users={usersData} />}
        </main>
      </section>
    </div>
  );
}

function DashboardTab({ products, totalUsers, orders, showPage, selectTab }: {
  products: Product[];
  totalUsers?: number;
  orders: Order[];
  showPage: (page: string) => void;
  selectTab: (tab: Tab) => void;
}) {
  const migrateMutation = useMutation(api.migrateProducts.migrate);
  const cleanupMutation = useMutation(api.orders.cleanupStaleOrders);
  const [activeOperation, setActiveOperation] = useState<'sync' | 'cleanup' | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const paidRevenue = orders.filter(order => order.paymentStatus === 'paid').reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const needsPrice = products.filter(product => product.price <= 0).length;
  const outOfStock = products.filter(product => (product.isActive ?? true) && (product.availableQuantity ?? 0) <= 0).length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  async function handleSync() {
    if (activeOperation) return;
    setActiveOperation('sync');
    setNotice(null);
    try {
      const result = await migrateMutation({});
      setNotice({ type: 'success', text: `Catalog synced: ${result.inserted} added, ${result.updated} updated.` });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Catalog sync failed.' });
    } finally {
      setActiveOperation(null);
    }
  }

  async function handleCleanup() {
    if (activeOperation || !confirm('Release all expired unpaid checkout reservations?')) return;
    setActiveOperation('cleanup');
    setNotice(null);
    try {
      const result = await cleanupMutation({});
      setNotice({ type: 'success', text: `${result.cleaned} stale order${result.cleaned === 1 ? '' : 's'} cleaned up.` });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Order cleanup failed.' });
    } finally {
      setActiveOperation(null);
    }
  }

  return (
    <div className="admin-view">
      <dl className="admin-summary" aria-label="Store summary">
        <SummaryItem label="Products" value={products.length} detail={`${outOfStock} out of stock`} warning={outOfStock > 0} />
        <SummaryItem label="Customers" value={totalUsers ?? '—'} detail="Registered accounts" />
        <SummaryItem label="Orders" value={orders.length} detail={`${pendingOrders} awaiting action`} warning={pendingOrders > 0} />
        <SummaryItem label="Paid revenue" value={currency.format(paidRevenue)} detail={`${shippedOrders} currently shipped`} />
      </dl>

      {notice && <div className={`admin-notice admin-notice-${notice.type}`} role="status">{notice.text}</div>}

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-panel-wide" aria-labelledby="recent-orders-title">
          <div className="admin-panel-heading">
            <div><h2 id="recent-orders-title">Recent orders</h2><p>Latest activity across the store</p></div>
            <button className="admin-text-button" onClick={() => selectTab('orders')}>View all</button>
          </div>
          {recentOrders.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table admin-table-compact">
                <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="admin-mono">#{order.id.slice(0, 8)}</td>
                      <td><strong>{order.userName}</strong><small>{formatDate(order.createdAt)}</small></td>
                      <td>{currency.format(order.total)}</td>
                      <td><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title="No orders yet" detail="New purchases will appear here." />}
        </section>

        <section className="admin-panel" aria-labelledby="store-actions-title">
          <div className="admin-panel-heading"><div><h2 id="store-actions-title">Store controls</h2><p>Maintenance and catalog actions</p></div></div>
          <div className="admin-health-list">
            <button type="button" onClick={() => selectTab('products')}>
              <span><strong>Catalog availability</strong><small>Out of stock or missing a price</small></span>
              <span className={needsPrice || outOfStock ? 'admin-health-warning' : 'admin-health-good'}>{needsPrice + outOfStock || 'Ready'}</span>
            </button>
            <button type="button" onClick={() => selectTab('orders')}>
              <span><strong>Fulfilment queue</strong><small>Orders waiting for action</small></span>
              <span className={pendingOrders ? 'admin-health-warning' : 'admin-health-good'}>{pendingOrders || 'Clear'}</span>
            </button>
          </div>
          <div className="admin-action-stack">
            <button className="admin-button admin-button-primary" onClick={() => showPage('shop')}>View live catalog</button>
            <button className="admin-button admin-button-secondary" onClick={handleSync} disabled={activeOperation !== null}>
              {activeOperation === 'sync' ? 'Syncing catalog…' : 'Sync catalog data'}
            </button>
            <button className="admin-button admin-button-quiet" onClick={handleCleanup} disabled={activeOperation !== null}>
              {activeOperation === 'cleanup' ? 'Cleaning orders…' : 'Clean stale orders'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductsTab({ products, addProduct, updateProduct, deleteProduct }: {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}) {
  const [modal, setModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const uploadAction = useAction(api.upload.uploadImage);
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter(product => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);
  const editingProduct = modal.editId ? products.find(product => product.id === modal.editId) : undefined;

  useEffect(() => {
    if (!modal.open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) setModal({ open: false });
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [modal.open, saving]);

  function openAdd() {
    setForm(emptyProductForm());
    setFormError('');
    setModal({ open: true });
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      rating: String(product.rating),
      reviews: String(product.reviews ?? ''),
      image: product.image,
      badge: product.badge ?? '',
      badgeClass: product.badgeClass ?? '',
      description: product.description ?? '',
      stockQuantity: String(product.stockQuantity ?? 0),
      isActive: product.isActive ?? true,
    });
    setFormError('');
    setModal({ open: true, editId: product.id });
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setFormError('Use a JPEG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Product images must be smaller than 5 MB.');
      return;
    }
    setUploading(true);
    setFormError('');
    try {
      const url = await uploadAction({ file: await file.arrayBuffer(), contentType: file.type });
      if (!url) throw new Error('Upload returned no image URL.');
      setForm(current => ({ ...current, image: url }));
    } catch {
      setFormError('Image upload failed. Try again or paste an image URL.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const price = Number(form.price);
    const rating = Number(form.rating);
    const stockQuantity = Number(form.stockQuantity);
    if (!form.name.trim()) return setFormError('Enter a product name.');
    if (!Number.isFinite(price) || price <= 0) return setFormError('Enter a price greater than $0.');
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) return setFormError('Rating must be between 0 and 5.');
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) return setFormError('Stock must be a non-negative whole number.');
    if (!form.image.trim()) return setFormError('Add a product image.');

    const oldPrice = Number(form.oldPrice);
    const data: Omit<Product, 'id'> = {
      name: form.name.trim(),
      category: form.category,
      price,
      oldPrice: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : undefined,
      rating,
      reviews: Math.max(0, Number(form.reviews) || 0),
      image: form.image.trim(),
      badge: form.badge.trim() || undefined,
      badgeClass: form.badgeClass || undefined,
      description: form.description.trim() || undefined,
      stockQuantity,
      isActive: form.isActive,
    };

    setSaving(true);
    setFormError('');
    try {
      if (modal.editId) await updateProduct(modal.editId, data);
      else await addProduct(data);
      setModal({ open: false });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Product could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Product could not be deleted.');
    }
  }

  return (
    <div className="admin-view">
      <div className="admin-toolbar">
        <div className="admin-filters">
          <label className="admin-search">
            <span className="sr-only">Search products</span>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products" />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={event => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <button className="admin-button admin-button-primary" onClick={openAdd}><span aria-hidden="true">+</span> Add product</button>
      </div>

      <section className="admin-panel" aria-label="Product catalog">
        <div className="admin-panel-heading admin-list-heading">
          <div><h2>Catalog</h2><p>{filteredProducts.length} of {products.length} products</p></div>
        </div>
        {filteredProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-product-table">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Inventory</th><th>Status</th><th>Rating</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        <img src={product.image} alt="" loading="lazy" />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{PRODUCT_CATEGORY_LABELS[product.category] || product.category}</td>
                    <td><strong>{currency.format(product.price)}</strong>{product.oldPrice ? <small>{currency.format(product.oldPrice)}</small> : null}</td>
                    <td><strong>{product.availableQuantity ?? 0} available</strong><small>{product.stockQuantity ?? 0} on hand, {product.reservedQuantity ?? 0} reserved</small></td>
                    <td>{product.isActive === false
                      ? <span className="admin-badge admin-badge-neutral">Inactive</span>
                      : product.price <= 0
                        ? <span className="admin-badge admin-badge-warning">Needs price</span>
                        : (product.availableQuantity ?? 0) <= 0
                          ? <span className="admin-badge admin-badge-warning">Out of stock</span>
                          : <span className="admin-badge admin-badge-active">Active</span>}</td>
                    <td>{product.rating.toFixed(1)} <span className="admin-muted">({product.reviews ?? 0})</span></td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="admin-button admin-button-small admin-button-secondary" onClick={() => openEdit(product)}>Edit</button>
                        <button className="admin-button admin-button-small admin-button-danger" onClick={() => void handleDelete(product)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No matching products" detail="Change the search or category filter." />}
      </section>

      {modal.open && (
        <div className="admin-dialog-backdrop" role="presentation" onMouseDown={() => !saving && setModal({ open: false })}>
          <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onMouseDown={event => event.stopPropagation()}>
            <div className="admin-dialog-heading">
              <div><h2 id="product-dialog-title">{modal.editId ? 'Edit product' : 'Add product'}</h2><p>Changes update the live catalog.</p></div>
              <button className="admin-dialog-close" type="button" aria-label="Close product editor" disabled={saving} onClick={() => setModal({ open: false })}>×</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <label className="admin-field admin-field-full"><span>Product name</span><input autoFocus required value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} /></label>
                <label className="admin-field"><span>Category</span><select value={form.category} onChange={event => setForm(current => ({ ...current, category: event.target.value }))}>{categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                <label className="admin-field"><span>Price (USD)</span><input required min="0.01" step="0.01" type="number" value={form.price} onChange={event => setForm(current => ({ ...current, price: event.target.value }))} /></label>
                <label className="admin-field"><span>Stock on hand</span><input required min="0" step="1" type="number" value={form.stockQuantity} onChange={event => setForm(current => ({ ...current, stockQuantity: event.target.value }))} />{editingProduct && <small>{editingProduct.reservedQuantity ?? 0} currently reserved in active checkouts</small>}</label>
                <label className="admin-field"><span>Compare-at price</span><input min="0" step="0.01" type="number" value={form.oldPrice} onChange={event => setForm(current => ({ ...current, oldPrice: event.target.value }))} /></label>
                <label className="admin-field"><span>Rating</span><input min="0" max="5" step="0.1" type="number" value={form.rating} onChange={event => setForm(current => ({ ...current, rating: event.target.value }))} /></label>
                <label className="admin-field"><span>Review count</span><input min="0" step="1" type="number" value={form.reviews} onChange={event => setForm(current => ({ ...current, reviews: event.target.value }))} /></label>
                <label className="admin-field"><span>Badge</span><input placeholder="Bestseller" value={form.badge} onChange={event => setForm(current => ({ ...current, badge: event.target.value }))} /></label>
                <label className="admin-field"><span>Badge style</span><select value={form.badgeClass} onChange={event => setForm(current => ({ ...current, badgeClass: event.target.value }))}><option value="">Standard</option><option value="hot">Hot</option></select></label>
                <label className="admin-availability-field admin-field-full"><input type="checkbox" checked={form.isActive} onChange={event => setForm(current => ({ ...current, isActive: event.target.checked }))} /><span><strong>Visible in storefront</strong><small>Turn this off to hide the product without deleting it.</small></span></label>
                <label className="admin-field admin-field-full"><span>Description</span><textarea rows={3} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} /></label>
              </div>

              <fieldset className="admin-image-fieldset">
                <legend>Product image</legend>
                <div className="admin-image-editor">
                  <div className="admin-image-preview">{form.image ? <img src={form.image} alt="Product preview" /> : <span>No image</span>}</div>
                  <div className="admin-image-controls">
                    <label className="admin-file-button">
                      {uploading ? 'Uploading…' : 'Upload image'}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={handleFileUpload} />
                    </label>
                    <label className="admin-field"><span>Or paste an image URL</span><input value={form.image} onChange={event => setForm(current => ({ ...current, image: event.target.value }))} /></label>
                    <small>JPEG, PNG, WebP, or GIF. Maximum 5 MB.</small>
                  </div>
                </div>
              </fieldset>

              {formError && <div className="admin-form-error" role="alert">{formError}</div>}
              <div className="admin-dialog-actions">
                <button type="button" className="admin-button admin-button-secondary" disabled={saving} onClick={() => setModal({ open: false })}>Cancel</button>
                <button type="submit" className="admin-button admin-button-primary" disabled={saving || uploading}>{saving ? 'Saving…' : modal.editId ? 'Save changes' : 'Add product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, updateOrderStatus }: {
  orders: Order[];
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered', trackingNumber?: string) => Promise<void>;
}) {
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [returnUpdatingId, setReturnUpdatingId] = useState<string | null>(null);
  const [returnStatuses, setReturnStatuses] = useState<Record<string, ReturnStatus>>({});
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});
  const updateReturnMutation = useMutation(api.orders.updateReturnRequest);
  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...orders]
      .filter(order => status === 'all' || order.status === status)
      .filter(order => !normalizedQuery || order.userName.toLowerCase().includes(normalizedQuery) || order.id.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, query, status]);

  useEffect(() => {
    const existingTracking: Record<string, string> = {};
    orders.forEach(order => { if (order.trackingNumber) existingTracking[order.id] = order.trackingNumber; });
    setTracking(current => ({ ...existingTracking, ...current }));
  }, [orders]);

  useEffect(() => {
    const existingStatuses: Record<string, ReturnStatus> = {};
    const existingNotes: Record<string, string> = {};
    orders.forEach(order => {
      if (!order.returnRequest) return;
      existingStatuses[order.id] = order.returnRequest.status;
      existingNotes[order.id] = order.returnRequest.adminNote ?? '';
    });
    setReturnStatuses(current => ({ ...existingStatuses, ...current }));
    setReturnNotes(current => ({ ...existingNotes, ...current }));
  }, [orders]);

  async function saveOrder(order: Order, nextStatus: 'pending' | 'shipped' | 'delivered') {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, nextStatus, tracking[order.id]?.trim() || undefined);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Order could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveReturn(order: Order) {
    if (!order.returnRequest) return;
    setReturnUpdatingId(order.id);
    try {
      await updateReturnMutation({
        id: order.id as any,
        status: returnStatuses[order.id] ?? order.returnRequest.status,
        adminNote: returnNotes[order.id]?.trim() || undefined,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Return request could not be updated.');
    } finally {
      setReturnUpdatingId(null);
    }
  }

  return (
    <div className="admin-view">
      <div className="admin-toolbar">
        <div className="admin-filters">
          <label className="admin-search"><span className="sr-only">Search orders</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search customer or order ID" /></label>
          <label><span className="sr-only">Filter orders by status</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label>
        </div>
        <span className="admin-result-count">{filteredOrders.length} orders</span>
      </div>

      <section className="admin-panel" aria-label="Orders">
        {filteredOrders.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-order-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Delivery address</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Tracking</th><th>Exchange / replacement</th></tr></thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="admin-mono">#{order.id.slice(0, 8)}<small>{formatDate(order.createdAt)}</small></td>
                    <td><strong>{order.userName}</strong></td>
                    <td>{order.shippingAddress ? <address className="admin-address"><strong>{order.shippingAddress.name}</strong><span>{formatAddress(order.shippingAddress)}</span></address> : <span className="admin-muted">Unavailable</span>}</td>
                    <td className="admin-items-cell">{order.items.map(item => `${item.name} ×${item.qty}`).join(', ')}</td>
                    <td><strong>{currency.format(order.total)}</strong></td>
                    <td><PaymentBadge status={order.paymentStatus} />{order.inventoryStatus === 'error' && <small className="admin-inventory-error">Inventory review required</small>}</td>
                    <td>
                      {order.status === 'cancelled' ? <StatusBadge status="cancelled" /> : (
                        <select
                          className="admin-status-select"
                          value={order.status}
                          disabled={updatingId === order.id}
                          aria-label={`Status for order ${order.id}`}
                          onChange={event => void saveOrder(order, event.target.value as 'pending' | 'shipped' | 'delivered')}
                        >
                          <option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <div className="admin-tracking-control">
                        <input value={tracking[order.id] || ''} disabled={order.status === 'cancelled'} onChange={event => setTracking(current => ({ ...current, [order.id]: event.target.value }))} placeholder="Tracking number" aria-label={`Tracking number for order ${order.id}`} />
                        <button className="admin-button admin-button-small admin-button-secondary" disabled={order.status === 'cancelled' || updatingId === order.id} onClick={() => void saveOrder(order, order.status as 'pending' | 'shipped' | 'delivered')}>{updatingId === order.id ? 'Saving…' : 'Save'}</button>
                      </div>
                    </td>
                    <td>
                      {order.returnRequest ? (
                        <div className="admin-return-control">
                          <strong>{order.returnRequest.type}</strong>
                          <small>{order.returnRequest.reason}</small>
                          <select value={returnStatuses[order.id] ?? order.returnRequest.status} disabled={returnUpdatingId === order.id} onChange={event => setReturnStatuses(current => ({ ...current, [order.id]: event.target.value as ReturnStatus }))} aria-label={`Return status for order ${order.id}`}>
                            <option value="requested">Requested</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="received">Received</option><option value="completed">Completed</option>
                          </select>
                          <input value={returnNotes[order.id] ?? ''} maxLength={500} disabled={returnUpdatingId === order.id} onChange={event => setReturnNotes(current => ({ ...current, [order.id]: event.target.value }))} placeholder="Customer instructions" aria-label={`Return instructions for order ${order.id}`} />
                          <button className="admin-button admin-button-small admin-button-secondary" disabled={returnUpdatingId === order.id} onClick={() => void saveReturn(order)}>{returnUpdatingId === order.id ? 'Saving...' : 'Save request'}</button>
                        </div>
                      ) : <span className="admin-muted">None</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title={orders.length ? 'No matching orders' : 'No orders yet'} detail={orders.length ? 'Change the search or status filter.' : 'New purchases will appear here.'} />}
      </section>
    </div>
  );
}

function UsersTab({ users }: { users?: UserRow[] }) {
  const [query, setQuery] = useState('');
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (users ?? []).filter(user => !normalizedQuery || user.name.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery));
  }, [users, query]);

  return (
    <div className="admin-view">
      <div className="admin-toolbar">
        <div className="admin-filters"><label className="admin-search"><span className="sr-only">Search customers</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name or email" /></label></div>
        <span className="admin-result-count">{users ? `${filteredUsers.length} customers` : 'Loading customers…'}</span>
      </div>
      <section className="admin-panel" aria-label="Customers">
        {!users ? <CustomerSkeleton /> : filteredUsers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-customer-table">
              <thead><tr><th>Customer</th><th>Email address</th><th>Access</th></tr></thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td><div className="admin-user-cell"><span className="admin-avatar" aria-hidden="true">{initials(user.name)}</span><strong>{user.name}</strong></div></td>
                    <td>{user.email}</td>
                    <td><span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-neutral'}`}>{user.role === 'admin' ? 'Administrator' : 'Customer'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No matching customers" detail="Try a different name or email address." />}
      </section>
    </div>
  );
}

function SummaryItem({ label, value, detail, warning = false }: { label: string; value: number | string; detail: string; warning?: boolean }) {
  return <div><dt>{label}</dt><dd>{value}</dd><small className={warning ? 'is-warning' : undefined}>{detail}</small></div>;
}

function StatusBadge({ status }: { status: Order['status'] }) {
  return <span className={`admin-badge admin-status-${status}`}>{status}</span>;
}

function PaymentBadge({ status }: { status?: Order['paymentStatus'] }) {
  const value = status ?? 'pending';
  return <span className={`admin-badge admin-payment-${value}`}>{value}</span>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="admin-empty"><strong>{title}</strong><p>{detail}</p></div>;
}

function CustomerSkeleton() {
  return <div className="admin-loading" aria-label="Loading customers">{[0, 1, 2, 3].map(row => <span key={row} />)}</div>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'A';
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAddress(address: NonNullable<Order['shippingAddress']>) {
  return [address.line1, address.line2, [address.city, address.state].filter(Boolean).join(', '), address.postalCode, address.country].filter(Boolean).join(', ');
}
