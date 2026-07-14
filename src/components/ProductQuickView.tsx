import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { findSuggestedAddOns, getProductCategoryLabel } from '../data/catalog';
import type { Product } from '../data/products';

interface Props {
  product: Product;
  onClose: () => void;
}

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'code',
});

export default function ProductQuickView({ product, onClose }: Props) {
  const { addToCart, cart, isLoggedIn, products, showPage, showToast } = useApp();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  const availableQuantity = product.availableQuantity ?? 0;
  const isAvailable = product.isActive !== false && product.price > 0 && availableQuantity > 0;
  const suggestedAddOns = findSuggestedAddOns(product, products, cart);
  const selectedAddOns = suggestedAddOns.filter(addOn => selectedAddOnIds.includes(addOn.id));
  const total = product.price * quantity + selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function toggleAddOn(id: string) {
    setSelectedAddOnIds(current => current.includes(id)
      ? current.filter(addOnId => addOnId !== id)
      : [...current, id]);
  }

  function handleAddToCart() {
    if (!isAvailable) {
      showToast('Out of stock', `${product.name} is not currently available`, 'error');
      return;
    }
    if (!isLoggedIn) {
      closeDialog();
      showToast('Login Required', 'Please login to add items to cart');
      showPage('login');
      return;
    }

    for (let item = 0; item < quantity; item += 1) addToCart(product);
    selectedAddOns.forEach(addOn => addToCart(addOn));
    showToast(product.name, `${quantity} item${quantity === 1 ? '' : 's'} added to your cart`);
    closeDialog();
  }

  return (
    <dialog
      ref={dialogRef}
      className="product-quick-view"
      aria-labelledby={`quick-view-title-${product.id}`}
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="product-quick-view__panel">
        <button className="product-quick-view__close" onClick={closeDialog} aria-label="Close product details">&times;</button>

        <div className="product-quick-view__media">
          {product.badge && <span>{product.badge}</span>}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-quick-view__content">
          <div className="product-quick-view__heading">
            <small>{getProductCategoryLabel(product)}</small>
            <h2 id={`quick-view-title-${product.id}`}>{product.name}</h2>
            <div>
              <strong>{cadFormatter.format(product.price)}</strong>
              <span>{product.rating.toFixed(1)} / 5 ({product.reviews ?? 0} reviews)</span>
            </div>
          </div>

          {product.description && <p className="product-quick-view__description">{product.description}</p>}

          <div className={`product-quick-view__stock ${isAvailable ? '' : 'is-unavailable'}`}>
            {isAvailable ? `${availableQuantity} available` : 'Currently unavailable'}
          </div>

          {isAvailable && (
            <div className="product-quick-view__quantity">
              <span>Quantity</span>
              <div>
                <button onClick={() => setQuantity(current => Math.max(1, current - 1))} disabled={quantity === 1} aria-label="Decrease quantity">&minus;</button>
                <output aria-live="polite">{quantity}</output>
                <button onClick={() => setQuantity(current => Math.min(availableQuantity, current + 1))} disabled={quantity >= availableQuantity} aria-label="Increase quantity">+</button>
              </div>
            </div>
          )}

          {suggestedAddOns.length > 0 && (
            <fieldset className="product-quick-view__addons">
              <legend>Complete your order</legend>
              {suggestedAddOns.map(addOn => (
                <label key={addOn.id}>
                  <input
                    type="checkbox"
                    checked={selectedAddOnIds.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                  />
                  <img src={addOn.image} alt="" loading="lazy" />
                  <span>
                    <strong>{addOn.name}</strong>
                    <small>{cadFormatter.format(addOn.price)}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          <div className="product-quick-view__footer">
            <span><small>Total</small><strong>{cadFormatter.format(total)}</strong></span>
            <button onClick={handleAddToCart} disabled={!isAvailable}>Add to cart</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
