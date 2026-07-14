import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import {
  PRODUCT_SUBCATEGORIES,
  productMatchesCategory,
  productMatchesSearch,
  productMatchesSubcategory,
  SHOP_FILTER_CATEGORIES,
} from '../data/catalog';

type SortType = 'default' | 'low' | 'high' | 'name';

const PAGE_SIZE = 12;

export default function ShopPage() {
  const { presetCategory, setPresetCategory, products, searchQuery, setSearchQuery } = useApp();
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minimumRating, setMinimumRating] = useState(0);
  const [sort, setSort] = useState<SortType>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const catalogProducts = useMemo(
    () => products.filter(product => product.isActive !== false && product.price > 0),
    [products]
  );

  const priceCeiling = useMemo(() => {
    const highestPrice = Math.max(0, ...catalogProducts.map(product => product.price));
    return Math.max(100, Math.ceil(highestPrice / 50) * 50);
  }, [catalogProducts]);
  const selectedMaxPrice = maxPrice ?? priceCeiling;

  useEffect(() => {
    if (presetCategory === 'all') return;
    setCategory(presetCategory);
    setSubcategory('all');
    setPresetCategory('all');
  }, [presetCategory, setPresetCategory]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, subcategory, maxPrice, minimumRating, sort, searchQuery]);

  const filtered = useMemo(() => {
    let result = catalogProducts.filter(product =>
      productMatchesCategory(product, category) &&
      productMatchesSubcategory(product, subcategory) &&
      product.price <= selectedMaxPrice &&
      product.rating >= minimumRating
    );
    if (searchQuery) {
      result = result.filter(product => productMatchesSearch(product, searchQuery));
    }
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [catalogProducts, category, minimumRating, searchQuery, selectedMaxPrice, sort, subcategory]);

  const filterOptions = SHOP_FILTER_CATEGORIES.map(option => ({
    ...option,
    count: catalogProducts.filter(product => productMatchesCategory(product, option.value)).length,
  }));
  const activeCategory = SHOP_FILTER_CATEGORIES.find(option => option.value === category);
  const parentCategoryCount = catalogProducts.filter(product => productMatchesCategory(product, category)).length;
  const subcategoryOptions = (PRODUCT_SUBCATEGORIES[category] || []).map(option => ({
    ...option,
    count: catalogProducts.filter(product =>
      productMatchesCategory(product, category) && productMatchesSubcategory(product, option.value)
    ).length,
  }));
  const visibleProducts = filtered.slice(0, visibleCount);
  const activeFilterCount = Number(maxPrice !== null && maxPrice < priceCeiling) + Number(minimumRating > 0);

  function selectCategory(nextCategory: string) {
    setSearchQuery('');
    setCategory(nextCategory);
    setSubcategory('all');
  }

  function selectSubcategory(nextSubcategory: string) {
    setSearchQuery('');
    setSubcategory(nextSubcategory);
  }

  function clearFilters() {
    selectCategory('all');
    setMaxPrice(null);
    setMinimumRating(0);
    setSort('default');
    setShowFilters(false);
  }

  return (
    <div className="shop-page">
      <header className="shop-intro">
        <div>
          <h1>Shop the catalog</h1>
          <p>Cricket equipment, teamwear, training gear, awards, and custom DTF products in one focused collection.</p>
        </div>
        <button className="btn-neon" onClick={() => selectCategory('cricket')}>Browse cricket</button>
      </header>

      <nav className="shop-category-strip" aria-label="Product categories">
        {filterOptions.map(option => (
          <button
            key={option.value}
            className={category === option.value ? 'is-active' : ''}
            onClick={() => selectCategory(option.value)}
            aria-pressed={category === option.value}
          >
            <span>{option.label}</span>
            <small>{option.count}</small>
          </button>
        ))}
      </nav>

      {subcategoryOptions.length > 0 && activeCategory && (
        <section className="shop-subcategories" aria-labelledby="shop-subcategories-title">
          <div className="shop-subcategories-inner">
            <div className="shop-subcategories-heading">
              <div>
                <h2 id="shop-subcategories-title">Explore {activeCategory.label}</h2>
                <p>Choose a product type to narrow the catalog.</p>
              </div>
              <span>{parentCategoryCount} {parentCategoryCount === 1 ? 'product' : 'products'}</span>
            </div>
            <div className="shop-subcategory-list" role="group" aria-label={`${activeCategory.label} subcategories`}>
              <button
                className={subcategory === 'all' ? 'is-active' : ''}
                onClick={() => selectSubcategory('all')}
                aria-pressed={subcategory === 'all'}
              >
                <span>All {activeCategory.label}</span>
                <small>{parentCategoryCount}</small>
              </button>
              {subcategoryOptions.map(option => (
                <button
                  key={option.value}
                  className={subcategory === option.value ? 'is-active' : ''}
                  onClick={() => selectSubcategory(option.value)}
                  aria-pressed={subcategory === option.value}
                >
                  <span>{option.label}</span>
                  <small>{option.count}</small>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="shop-shell">
        <aside className="shop-filter-sidebar" aria-label="Catalog filters">
          <div className="shop-filter-heading">
            <h2>Refine</h2>
            <button onClick={clearFilters}>Clear all</button>
          </div>
          <ShopFilters
            priceCeiling={priceCeiling}
            selectedMaxPrice={selectedMaxPrice}
            setMaxPrice={setMaxPrice}
            minimumRating={minimumRating}
            setMinimumRating={setMinimumRating}
          />
        </aside>

        <main className="shop-results">
          {searchQuery && (
            <div className="shop-search-notice">
              <span>Results for <strong>“{searchQuery}”</strong></span>
              <small>{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</small>
            </div>
          )}

          <div className="shop-toolbar">
            <p>
              Showing <strong>{Math.min(visibleCount, filtered.length)}</strong> of <strong>{filtered.length}</strong> products
            </p>
            <div>
              <button
                className="shop-mobile-filter-button"
                onClick={() => setShowFilters(current => !current)}
                aria-expanded={showFilters}
                aria-controls="mobile-shop-filters"
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
              <label className="shop-sort">
                <span>Sort</span>
                <select value={sort} onChange={event => setSort(event.target.value as SortType)}>
                  <option value="default">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {showFilters && (
            <section className="shop-mobile-filters" id="mobile-shop-filters">
              <div className="shop-filter-heading">
                <h2>Refine products</h2>
                <button onClick={clearFilters}>Clear all</button>
              </div>
              <ShopFilters
                priceCeiling={priceCeiling}
                selectedMaxPrice={selectedMaxPrice}
                setMaxPrice={setMaxPrice}
                minimumRating={minimumRating}
                setMinimumRating={setMinimumRating}
              />
            </section>
          )}

          {products.length === 0 ? (
            <div className="shop-empty-state">
              <h2>Loading the catalog</h2>
              <p>Products will appear as soon as the store connection responds.</p>
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="shop-product-grid">
                {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              {visibleCount < filtered.length && (
                <div className="shop-load-more">
                  <button onClick={() => setVisibleCount(current => current + PAGE_SIZE)}>Load more products</button>
                  <span>{filtered.length - visibleCount} remaining</span>
                </div>
              )}
            </>
          ) : (
            <div className="shop-empty-state">
              <h2>No products match these filters</h2>
              <p>Try another category, rating, or price range.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface ShopFiltersProps {
  priceCeiling: number;
  selectedMaxPrice: number;
  setMaxPrice: (price: number | null) => void;
  minimumRating: number;
  setMinimumRating: (rating: number) => void;
}

function ShopFilters({ priceCeiling, selectedMaxPrice, setMaxPrice, minimumRating, setMinimumRating }: ShopFiltersProps) {
  return (
    <div className="shop-filter-controls">
      <fieldset>
        <legend>Maximum price</legend>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={25}
          value={selectedMaxPrice}
          onChange={event => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum product price"
        />
        <div><span>CAD 0</span><output>CAD {selectedMaxPrice.toLocaleString('en-CA')}</output></div>
      </fieldset>

      <fieldset>
        <legend>Minimum rating</legend>
        <div className="shop-rating-options">
          {[0, 4, 3].map(rating => (
            <button
              key={rating}
              className={minimumRating === rating ? 'is-active' : ''}
              onClick={() => setMinimumRating(rating)}
              aria-pressed={minimumRating === rating}
            >
              {rating === 0 ? 'Any rating' : `${rating}.0 and above`}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
