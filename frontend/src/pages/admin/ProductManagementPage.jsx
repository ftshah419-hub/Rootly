import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const ProductManagementPage = () => {
  const { t } = useAdminLanguage();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail Drawer state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reports, setReports] = useState([]);

  // Removal / Status Dialog
  const [dialog, setDialog] = useState({
    isOpen: false,
    product: null,
    targetStatus: '',
    isLoading: false
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getProducts({
        page,
        limit: 15,
        search,
        exchangeType: typeFilter,
        availabilityStatus: statusFilter
      });
      setProducts(res.products || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve produce listings');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenDrawer = async (p) => {
    setSelectedProduct(p);
    try {
      const res = await adminService.getProductById(p._id);
      setReports(res.reports || []);
    } catch {
      setReports([]);
    }
  };

  const handleOpenDialog = (product, newStatus, e) => {
    if (e) e.stopPropagation();
    setDialog({
      isOpen: true,
      product,
      targetStatus: newStatus,
      isLoading: false
    });
  };

  const handleConfirmAction = async (reason) => {
    const { product, targetStatus } = dialog;
    if (!product) return;

    setDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      if (targetStatus === 'DELETE') {
        await adminService.deleteProduct(product._id, { reason });
      } else {
        await adminService.updateProductStatus(product._id, {
          availabilityStatus: targetStatus,
          reason
        });
      }
      setDialog({ isOpen: false, product: null, targetStatus: '', isLoading: false });
      if (selectedProduct && selectedProduct._id === product._id) {
        setSelectedProduct(null);
      }
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Action failed');
      setDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filterOptions = [
    {
      id: 'exchangeType',
      label: t('exchangeType'),
      value: typeFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Sell (Cash)', value: 'SELL' },
        { label: 'Barter (Trade)', value: 'BARTER' },
        { label: 'Free (Gift)', value: 'FREE' }
      ]
    },
    {
      id: 'status',
      label: 'Availability',
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: t('AVAILABLE'), value: 'AVAILABLE' },
        { label: t('RESERVED'), value: 'RESERVED' },
        { label: t('EXCHANGED'), value: 'EXCHANGED' },
        { label: t('OUT_OF_STOCK'), value: 'OUT_OF_STOCK' }
      ]
    }
  ];

  const handleFilterChange = (id, val) => {
    setPage(1);
    if (id === 'exchangeType') setTypeFilter(val);
    if (id === 'status') setStatusFilter(val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  const columns = [
    {
      key: 'name',
      header: t('productName'),
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.images && p.images[0]?.url ? (
            <img
              src={p.images[0].url}
              alt={p.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#E9D8B9] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#F7F0E3] dark:bg-[#282B24] border border-[#E9D8B9] flex items-center justify-center text-[#3E5035] dark:text-[#adc29f] shrink-0">
              <span className="material-symbols-outlined !text-xl">eco</span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[#282B24] dark:text-[#F7F0E3] truncate">
              {p.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#795640] dark:text-[#A5AD91]">
              <span>{p.categoryId?.name || 'Produce'}</span>
              {p.organicDeclaration && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-sm">
                  Bio / Organic
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'exchangeType',
      header: t('exchangeType'),
      render: (p) => (
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            p.exchangeType === 'SELL'
              ? 'bg-amber-100 text-amber-900'
              : p.exchangeType === 'BARTER'
              ? 'bg-[#3E5035]/15 text-[#3E5035] dark:text-[#adc29f]'
              : 'bg-emerald-100 text-emerald-900'
          }`}
        >
          {p.exchangeType}
        </span>
      )
    },
    {
      key: 'pricing',
      header: t('price'),
      render: (p) => (
        <span className="font-semibold text-xs">
          {p.exchangeType === 'SELL'
            ? `₹${p.pricing?.price || 0} / ${p.pricing?.unit || 'kg'}`
            : p.exchangeType === 'BARTER'
            ? 'Produce Trade'
            : 'Free Community Share'}
        </span>
      )
    },
    {
      key: 'quantity',
      header: t('quantity'),
      render: (p) => (
        <span className="text-xs">
          {p.quantity?.available} {p.quantity?.unit || 'kg'}
        </span>
      )
    },
    {
      key: 'seller',
      header: t('seller'),
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-semibold truncate">{p.sellerId?.name || 'Unknown'}</span>
          <span className="text-[11px] text-[#795640]/70 dark:text-[#A5AD91]/70 truncate">
            {p.location?.neighborhood || 'Ernakulam'}
          </span>
        </div>
      )
    },
    {
      key: 'availabilityStatus',
      header: 'Status',
      render: (p) => <StatusBadge status={p.availabilityStatus} size="xs" />
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleOpenDrawer(p)}
            className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
            title={t('viewDetails')}
          >
            <span className="material-symbols-outlined !text-lg">visibility</span>
          </button>
          {p.availabilityStatus === 'AVAILABLE' ? (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(p, 'OUT_OF_STOCK', e)}
              className="p-1.5 rounded-lg text-[#C8754D] hover:bg-[#C8754D]/10"
              title="Delist from active marketplace"
            >
              <span className="material-symbols-outlined !text-lg">visibility_off</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(p, 'AVAILABLE', e)}
              className="p-1.5 rounded-lg text-[#3E5035] hover:bg-[#3E5035]/10"
              title="Restore to Available"
            >
              <span className="material-symbols-outlined !text-lg">restore</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handleOpenDialog(p, 'DELETE', e)}
            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
            title="Administratively remove listing"
          >
            <span className="material-symbols-outlined !text-lg">delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
          <span>Produce Compliance & Moderation</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('productsTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('productsSubtitle')}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by vegetable, description, neighborhood..."
          className="w-full md:max-w-md"
        />

        <FilterPanel
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={typeFilter !== 'all' || statusFilter !== 'all' || search !== ''}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="psychiatry"
          emptyTitle="No Listings Found"
          emptyDescription="No produce listings match the active filter criteria in the database."
          onRowClick={handleOpenDrawer}
          pagination={{
            page,
            totalPages,
            total,
            limit: 15,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      {/* Product Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedProduct)}
        title={selectedProduct?.name || 'Produce Listing Details'}
        subtitle={`Listed on ${selectedProduct ? new Date(selectedProduct.createdAt).toLocaleDateString() : ''}`}
        onClose={() => setSelectedProduct(null)}
        footer={
          selectedProduct ? (
            <div className="flex items-center gap-2">
              {selectedProduct.availabilityStatus === 'AVAILABLE' ? (
                <button
                  type="button"
                  onClick={() => handleOpenDialog(selectedProduct, 'OUT_OF_STOCK')}
                  className="px-3.5 py-1.5 rounded-lg border border-[#C8754D] text-[#C8754D] text-xs font-semibold hover:bg-[#C8754D]/10"
                >
                  Unlist Produce
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenDialog(selectedProduct, 'AVAILABLE')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920]"
                >
                  Restore to Available
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenDialog(selectedProduct, 'DELETE')}
                className="px-3.5 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800"
              >
                {t('delete')}
              </button>
            </div>
          ) : null
        }
      >
        {selectedProduct && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Images Gallery */}
            {selectedProduct.images && selectedProduct.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={selectedProduct.name}
                    className="w-full h-36 rounded-xl object-cover border border-[#E9D8B9]"
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-center text-[#795640] dark:text-[#A5AD91]">
                No photographs uploaded by grower
              </div>
            )}

            {/* Description */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                Description & Growing Practices
              </span>
              <p className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 leading-relaxed text-xs">
                {selectedProduct.description}
              </p>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Exchange Type</span>
                <span className="font-bold">{selectedProduct.exchangeType}</span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Harvest State</span>
                <span className="font-bold">{selectedProduct.harvestStatus}</span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Pricing Terms</span>
                <span className="font-bold">
                  {selectedProduct.exchangeType === 'SELL' ? `₹${selectedProduct.pricing?.price}` : 'Barter / Free'}
                </span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Available Yield</span>
                <span className="font-bold">
                  {selectedProduct.quantity?.available} {selectedProduct.quantity?.unit}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                Producer Information
              </span>
              <div className="font-bold">{selectedProduct.sellerId?.name}</div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
                {selectedProduct.sellerId?.email}
              </div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91] mt-1">
                Ward / Node: {selectedProduct.location?.neighborhood || 'Ernakulam District'}
              </div>
            </div>

            {/* Moderation Flags against this product */}
            {reports.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-2">
                  Complaints / Reports ({reports.length})
                </span>
                <div className="divide-y divide-rose-200 dark:divide-rose-900/40">
                  {reports.map((r) => (
                    <div key={r._id} className="py-2">
                      <span className="font-bold block text-rose-800 dark:text-rose-300">
                        {r.reason}
                      </span>
                      <p className="text-xs text-[#795640] dark:text-[#A5AD91]">{r.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={dialog.targetStatus === 'DELETE' ? 'Delist Listing' : `Mark as ${dialog.targetStatus}`}
        message={`Are you sure you want to alter the availability of ${dialog.product?.name}? This action is recorded in the platform audit log.`}
        confirmLabel={dialog.targetStatus === 'DELETE' ? 'Delist Listing' : 'Confirm Update'}
        confirmVariant={dialog.targetStatus === 'DELETE' ? 'danger' : 'warning'}
        requireReason={true}
        reasonPlaceholder="Provide official compliance note or delisting ground..."
        isLoading={dialog.isLoading}
        onConfirm={handleConfirmAction}
        onClose={() => setDialog({ isOpen: false, product: null, targetStatus: '', isLoading: false })}
      />
    </div>
  );
};

export default ProductManagementPage;
