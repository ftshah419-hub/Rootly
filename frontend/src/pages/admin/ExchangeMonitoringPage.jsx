import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const ExchangeMonitoringPage = () => {
  const { t } = useAdminLanguage();

  const [exchanges, setExchanges] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedExchange, setSelectedExchange] = useState(null);

  const fetchExchanges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getExchanges({
        page,
        limit: 15,
        requestType: typeFilter,
        status: statusFilter
      });
      setExchanges(res.exchanges || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve exchange records');
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter, statusFilter]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  const filterOptions = [
    {
      id: 'requestType',
      label: t('exchangeType'),
      value: typeFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Buy (Cash Trade)', value: 'BUY' },
        { label: 'Barter (Reciprocal)', value: 'BARTER' },
        { label: 'Free (Gift)', value: 'FREE' }
      ]
    },
    {
      id: 'status',
      label: 'Trade Status',
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: t('PENDING'), value: 'PENDING' },
        { label: 'Accepted', value: 'ACCEPTED' },
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: t('COMPLETED'), value: 'COMPLETED' },
        { label: t('REJECTED'), value: 'REJECTED' },
        { label: t('CANCELLED'), value: 'CANCELLED' }
      ]
    }
  ];

  const handleFilterChange = (id, val) => {
    setPage(1);
    if (id === 'requestType') setTypeFilter(val);
    if (id === 'status') setStatusFilter(val);
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setPage(1);
  };

  const columns = [
    {
      key: '_id',
      header: t('tradeId'),
      render: (ex) => (
        <span className="font-mono text-[11px] font-bold text-[#3E5035] dark:text-[#adc29f]">
          #{String(ex._id).slice(-6).toUpperCase()}
        </span>
      )
    },
    {
      key: 'product',
      header: 'Produce Item',
      render: (ex) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3] truncate">
            {ex.productId?.name || 'Listing Removed'}
          </span>
          <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
            Requested: {ex.quantityRequested} {ex.productId?.quantity?.unit || 'kg'}
          </span>
        </div>
      )
    },
    {
      key: 'requestType',
      header: t('exchangeType'),
      render: (ex) => (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9D8B9]/60 dark:bg-stone-800 text-[#795640] dark:text-[#A5AD91]">
          {ex.requestType}
        </span>
      )
    },
    {
      key: 'requesterId',
      header: t('requester'),
      render: (ex) => (
        <div className="flex flex-col truncate">
          <span className="font-semibold truncate">{ex.requesterId?.name || 'Unknown'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 truncate">
            {ex.requesterId?.location?.neighborhood || 'Ernakulam'}
          </span>
        </div>
      )
    },
    {
      key: 'sellerId',
      header: t('seller'),
      render: (ex) => (
        <div className="flex flex-col truncate">
          <span className="font-semibold truncate">{ex.sellerId?.name || 'Unknown'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 truncate">
            {ex.sellerId?.profile?.gardenName || 'Home Grower'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: t('exchangeStatus'),
      render: (ex) => <StatusBadge status={ex.status} size="xs" />
    },
    {
      key: 'createdAt',
      header: t('dateInitiated'),
      render: (ex) => (
        <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {new Date(ex.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (ex) => (
        <button
          type="button"
          onClick={() => setSelectedExchange(ex)}
          className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
          title={t('viewDetails')}
        >
          <span className="material-symbols-outlined !text-lg">visibility</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
          <span>Marketplace Transaction Ledger</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('exchangesTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('exchangesSubtitle')}
        </p>
      </div>

      {/* Filter Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={typeFilter !== 'all' || statusFilter !== 'all'}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchExchanges} />
      ) : (
        <DataTable
          columns={columns}
          data={exchanges}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="sync_problem"
          emptyTitle="No Exchanges Found"
          emptyDescription="No exchange requests or trade records match the filter criteria."
          onRowClick={(ex) => setSelectedExchange(ex)}
          pagination={{
            page,
            totalPages,
            total,
            limit: 15,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      {/* Exchange Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedExchange)}
        title={`Trade Ref #${String(selectedExchange?._id).slice(-6).toUpperCase()}`}
        subtitle={`Initiated on ${selectedExchange ? new Date(selectedExchange.createdAt).toLocaleString() : ''}`}
        onClose={() => setSelectedExchange(null)}
      >
        {selectedExchange && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Status Summary Banner */}
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Exchange Status
                </span>
                <StatusBadge status={selectedExchange.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Trade Model
                </span>
                <span className="font-bold text-sm">{selectedExchange.requestType}</span>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Requester (Neighbor)
                </span>
                <div className="font-bold mt-1">{selectedExchange.requesterId?.name}</div>
                <div className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedExchange.requesterId?.email}
                </div>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Grower (Fulfiller)
                </span>
                <div className="font-bold mt-1">{selectedExchange.sellerId?.name}</div>
                <div className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedExchange.sellerId?.profile?.gardenName || selectedExchange.sellerId?.email}
                </div>
              </div>
            </div>

            {/* Requested Item */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-2">
                Produce Requested
              </span>
              <div className="p-3.5 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">
                    {selectedExchange.productId?.name}
                  </span>
                  <span className="text-[#795640] dark:text-[#A5AD91]">
                    Quantity: {selectedExchange.quantityRequested} {selectedExchange.productId?.quantity?.unit || 'kg'}
                  </span>
                </div>
                {selectedExchange.offeredPrice > 0 && (
                  <span className="font-bold text-sm text-[#3E5035] dark:text-[#adc29f]">
                    ₹{selectedExchange.offeredPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Offered Items in Barter */}
            {selectedExchange.offeredItems && selectedExchange.offeredItems.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-2">
                  Items Offered in Barter Trade
                </span>
                <div className="space-y-2">
                  {selectedExchange.offeredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/50 flex items-center justify-between"
                    >
                      <span className="font-semibold">{item.description}</span>
                      <span className="text-[#795640] dark:text-[#A5AD91]">
                        Est. ₹{item.estimatedValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trade Message */}
            {selectedExchange.message && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Neighbor Trade Note
                </span>
                <p className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 italic">
                  "{selectedExchange.message}"
                </p>
              </div>
            )}

            {/* Rejection / Dispute reason if present */}
            {selectedExchange.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                <span className="font-bold block mb-1">Rejection / Dispute Notice:</span>
                <p>{selectedExchange.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default ExchangeMonitoringPage;
