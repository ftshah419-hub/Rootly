import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const HarvestOversightPage = () => {
  const { t } = useAdminLanguage();

  const [harvests, setHarvests] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedHarvest, setSelectedHarvest] = useState(null);

  const fetchHarvests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getHarvests({
        page,
        limit: 15,
        status: statusFilter
      });
      setHarvests(res.harvests || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve harvest planner oversight');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchHarvests();
  }, [fetchHarvests]);

  const filterOptions = [
    {
      id: 'status',
      label: 'Harvest Status',
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Growing', value: 'GROWING' },
        { label: 'Near Harvest', value: 'NEAR_HARVEST' },
        { label: 'Harvested', value: 'HARVESTED' },
        { label: 'Cancelled', value: 'CANCELLED' }
      ]
    }
  ];

  const columns = [
    {
      key: 'produceName',
      header: 'Crop & Variety',
      render: (h) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {h.produceName}
          </span>
          <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
            {h.variety || h.categoryId?.name || 'Local Variety'}
          </span>
        </div>
      )
    },
    {
      key: 'grower',
      header: 'Producer Garden',
      render: (h) => (
        <div className="flex flex-col truncate">
          <span className="font-semibold truncate">{h.growerId?.name || 'Urban Grower'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 truncate">
            {h.growerId?.profile?.gardenName || h.location?.neighborhood || 'Ernakulam Node'}
          </span>
        </div>
      )
    },
    {
      key: 'expectedHarvestDate',
      header: 'Projected Harvest',
      render: (h) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs">
            {new Date(h.expectedHarvestDate).toLocaleDateString()}
          </span>
          {h.estimatedQuantity?.isAIEstimated && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
              AI Projected
            </span>
          )}
        </div>
      )
    },
    {
      key: 'estimatedQuantity',
      header: 'Yield Expectation',
      render: (h) => (
        <span className="text-xs font-semibold">
          {h.estimatedQuantity?.amount} {h.estimatedQuantity?.unit || 'kg'}
        </span>
      )
    },
    {
      key: 'prebooking',
      header: 'Prebooking Activity',
      render: (h) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs">
            {h.prebookedQuantity || 0} / {h.estimatedQuantity?.amount} {h.estimatedQuantity?.unit}
          </span>
          <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
            {h.allowsPrebooking ? 'Prebooking Open' : 'Closed'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Crop Status',
      render: (h) => <StatusBadge status={h.status} size="xs" />
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (h) => (
        <button
          type="button"
          onClick={() => setSelectedHarvest(h)}
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
        <div className="flex items-center gap-2 text-xs font-bold text-[#3E5035] dark:text-[#adc29f] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#3E5035]"></span>
          <span>Agronomy Yield Forecasting</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('navHarvests')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          Oversight of upcoming garden crops, AI yield estimations, and neighborhood prebooking reservations.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={(id, val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          onReset={() => {
            setStatusFilter('all');
            setPage(1);
          }}
          hasActiveFilters={statusFilter !== 'all'}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchHarvests} />
      ) : (
        <DataTable
          columns={columns}
          data={harvests}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="calendar_month"
          emptyTitle="No Harvest Forecasts Active"
          emptyDescription="Growers have not posted upcoming harvest cycles matching this filter."
          onRowClick={(h) => setSelectedHarvest(h)}
          pagination={{
            page,
            totalPages,
            total,
            limit: 15,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedHarvest)}
        title={selectedHarvest?.produceName || 'Harvest Details'}
        subtitle={`Expected: ${selectedHarvest ? new Date(selectedHarvest.expectedHarvestDate).toLocaleDateString() : ''}`}
        onClose={() => setSelectedHarvest(null)}
      >
        {selectedHarvest && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Phenological Status
                </span>
                <StatusBadge status={selectedHarvest.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Estimation Engine
                </span>
                <span className="font-bold text-xs">
                  {selectedHarvest.estimatedQuantity?.isAIEstimated ? 'Gemini 1.5 Flash Vision' : 'Grower Self-Reported'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Grower</span>
                <span className="font-bold">{selectedHarvest.growerId?.name}</span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Location</span>
                <span className="font-bold">{selectedHarvest.location?.neighborhood || 'Ernakulam'}</span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Estimated Yield</span>
                <span className="font-bold">
                  {selectedHarvest.estimatedQuantity?.amount} {selectedHarvest.estimatedQuantity?.unit}
                </span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Prebooking Price</span>
                <span className="font-bold">
                  {selectedHarvest.prebookingPricePerUnit > 0 ? `₹${selectedHarvest.prebookingPricePerUnit} / unit` : 'Trade / Barter'}
                </span>
              </div>
            </div>

            {selectedHarvest.notes && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Grower Cultivation Notes
                </span>
                <p className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 leading-relaxed text-xs">
                  {selectedHarvest.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default HarvestOversightPage;
