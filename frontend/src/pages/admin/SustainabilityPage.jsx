import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import StatsCard from '../../components/admin/StatsCard.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const SustainabilityPage = () => {
  const { t } = useAdminLanguage();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSustainability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getSustainabilityMetrics();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to retrieve sustainability metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSustainability();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSustainability} />;
  }

  const totals = data?.totals || {};
  const topContributors = data?.topContributors || [];
  const recentRecords = data?.recentRecords || [];
  const methodology = data?.methodology || '';

  const contributorColumns = [
    {
      key: 'name',
      header: 'Top Urban Grower',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {row.grower?.name || 'Urban Producer'}
          </span>
          <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
            {row.grower?.profile?.gardenName || row.grower?.email}
          </span>
        </div>
      )
    },
    {
      key: 'tradesCount',
      header: 'Trades Completed',
      render: (row) => <span className="font-semibold">{row.tradesCount} exchanges</span>
    },
    {
      key: 'waste',
      header: 'Waste Diverted',
      render: (row) => (
        <span className="font-bold text-[#3E5035] dark:text-[#adc29f]">
          {Math.round((row.totalWastePrevented || 0) * 10) / 10} kg
        </span>
      )
    },
    {
      key: 'co2',
      header: 'CO2e Averted',
      render: (row) => (
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
          {Math.round((row.totalCo2Saved || 0) * 10) / 10} kg
        </span>
      )
    }
  ];

  const recentColumns = [
    {
      key: 'user',
      header: 'Grower',
      render: (rec) => <span>{rec.userId?.name || 'Neighbor'}</span>
    },
    {
      key: 'foodWastePreventedKg',
      header: 'Produce Saved',
      render: (rec) => `${rec.foodWastePreventedKg} kg`
    },
    {
      key: 'foodMilesSavedKm',
      header: 'Transport Miles Averted',
      render: (rec) => `${rec.foodMilesSavedKm} km`
    },
    {
      key: 'co2SavedKg',
      header: 'CO2e Saved',
      render: (rec) => `${rec.co2SavedKg} kg`
    },
    {
      key: 'createdAt',
      header: 'Logged On',
      render: (rec) => new Date(rec.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#3E5035] dark:text-[#adc29f] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#3E5035]"></span>
          <span>Ecological Impact Accounting</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('sustainabilityTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('sustainabilitySubtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon="compost"
          title={t('foodWastePrevented')}
          value={`${totals.totalWastePreventedKg || 0} kg`}
          subtitle="Homegrown harvest kept from landfills"
          accent="sage"
        />
        <StatsCard
          icon="co2"
          title={t('co2Saved')}
          value={`${totals.totalCo2SavedKg || 0} kg`}
          subtitle="GHG emissions avoided via zero-mile trades"
          accent="olive"
        />
        <StatsCard
          icon="commute"
          title="Food Miles Averted"
          value={`${totals.totalMilesSavedKm || 0} km`}
          subtitle="Equivalent commercial freight mileage eliminated"
          accent="amber"
        />
        <StatsCard
          icon="receipt_long"
          title="Exchange Records"
          value={totals.totalRecords || 0}
          subtitle={`Avg ${totals.avgWastePerExchangeKg || 0} kg per trade`}
          accent="terracotta"
        />
      </div>

      {/* Methodology Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/80 dark:border-stone-700/80 rustic-shadow-1">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined !text-2xl text-[#3E5035] dark:text-[#adc29f] shrink-0">
            science
          </span>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3E5035] dark:text-[#adc29f] mb-1">
              {t('methodologyNote')}
            </h4>
            <p className="text-xs text-[#795640] dark:text-[#A5AD91] leading-relaxed">
              {methodology}
            </p>
          </div>
        </div>
      </div>

      {/* Top Urban Producers */}
      <div className="space-y-3">
        <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          Top Ecological Contributors
        </h3>
        <DataTable
          columns={contributorColumns}
          data={topContributors}
          keyField="_id"
          emptyIcon="nature_people"
          emptyTitle="No Sustainability Records Yet"
          emptyDescription="Completed produce exchanges automatically record empirical ecological savings."
        />
      </div>

      {/* Recent Ledger Entries */}
      <div className="space-y-3">
        <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          Recent Zero-Mile Sustainability Ledger
        </h3>
        <DataTable
          columns={recentColumns}
          data={recentRecords}
          keyField="_id"
          emptyIcon="eco"
          emptyTitle="Ledger Empty"
          emptyDescription="No zero-mile exchanges have been recorded in the database yet."
        />
      </div>
    </div>
  );
};

export default SustainabilityPage;
