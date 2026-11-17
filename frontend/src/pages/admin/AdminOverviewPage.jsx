import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import StatsCard from '../../components/admin/StatsCard.jsx';
import SimpleChart from '../../components/admin/SimpleChart.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const AdminOverviewPage = () => {
  const { t } = useAdminLanguage();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getOverview();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load telemetry overview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchOverview} />;
  }

  const metrics = data?.metrics || {};
  const recentReports = data?.recentReports || [];
  const recentUsers = data?.recentUsers || [];
  const recentActions = data?.recentActions || [];
  const monthlyTrends = data?.monthlyTrends || [];

  // Transform monthly trends for chart
  const trendsChartData = monthlyTrends.map((item) => ({
    label: item._id,
    value: item.completed || 0
  }));

  // Distribution chart data
  const statusDistribution = [
    { label: t('ACTIVE'), value: metrics.users?.active || 0, color: '#3E5035' },
    { label: t('BLOCKED'), value: metrics.users?.blockedOrSuspended || 0, color: '#C8754D' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
            <span>Central Operations Desk</span>
          </div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {t('overviewTitle')}
          </h1>
          <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
            {t('overviewSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOverview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-xs font-semibold text-[#282B24] dark:text-[#F7F0E3] hover:bg-[#F7F0E3] dark:hover:bg-[#282B24] transition-colors shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined !text-base">refresh</span>
            <span>{t('refresh')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon="groups"
          title={t('totalUsers')}
          value={metrics.users?.total || 0}
          subtitle={`${metrics.users?.active || 0} active • ${metrics.users?.blockedOrSuspended || 0} restricted`}
          accent="olive"
        />
        <StatsCard
          icon="agriculture"
          title={t('totalProducts')}
          value={metrics.products?.total || 0}
          subtitle={`${metrics.products?.available || 0} available for exchange`}
          accent="sage"
        />
        <StatsCard
          icon="sync_alt"
          title={t('completedExchanges')}
          value={metrics.exchanges?.completed || 0}
          subtitle={`${metrics.exchanges?.total || 0} total trade transactions`}
          accent="amber"
        />
        <StatsCard
          icon="gavel"
          title={t('pendingReports')}
          value={metrics.moderation?.pendingReports || 0}
          subtitle={`${metrics.moderation?.pendingVerifications || 0} garden verifications waiting`}
          accent="terracotta"
        />
      </div>

      {/* Sustainability & AI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon="compost"
          title={t('foodWastePrevented')}
          value={`${metrics.sustainability?.foodWastePreventedKg || 0} kg`}
          subtitle="Diverted from urban landfill"
          accent="sage"
        />
        <StatsCard
          icon="co2"
          title={t('co2Saved')}
          value={`${metrics.sustainability?.co2SavedKg || 0} kg`}
          subtitle="Estimated supply chain emissions averted"
          accent="olive"
        />
        <StatsCard
          icon="psychology"
          title={t('aiQueries')}
          value={metrics.aiUsage?.totalQueries || 0}
          subtitle="Gemini Vision & Agronomy Advisory requests"
          accent="blue"
        />
      </div>

      {/* Real Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleChart
            type="bar"
            title={t('monthlyTrends')}
            subtitle="Verified completed exchanges per month from MongoDB records"
            data={trendsChartData}
            height={240}
            emptyMessage="No completed exchanges recorded in the database yet"
          />
        </div>
        <div className="lg:col-span-1">
          <SimpleChart
            type="donut"
            title="Grower Account Health"
            subtitle="Active vs restricted account distribution"
            data={statusDistribution}
            height={240}
            emptyMessage="No user accounts registered"
          />
        </div>
      </div>

      {/* Real Feeds & Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Moderation Feed */}
        <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-xl text-[#C8754D]">gavel</span>
              <h3 className="font-serif-brand text-lg font-bold text-[#282B24] dark:text-[#F7F0E3]">
                {t('recentReportsFeed')}
              </h3>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-[#3E5035] dark:text-[#adc29f] hover:underline"
            >
              View all ({metrics.moderation?.pendingReports || 0})
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#795640] dark:text-[#A5AD91]">
              No pending reports currently in queue.
            </div>
          ) : (
            <div className="divide-y divide-[#E9D8B9]/40 dark:divide-stone-700/40">
              {recentReports.map((report) => (
                <div key={report._id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
                        {report.reason.replace(/_/g, ' ')}
                      </span>
                      <StatusBadge status={report.status} size="xs" />
                    </div>
                    <p className="text-[11px] text-[#795640] dark:text-[#A5AD91] mt-0.5 line-clamp-1">
                      {report.details}
                    </p>
                    <div className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 mt-1">
                      Filed by: {report.reporterId?.name || 'Anonymous'}
                    </div>
                  </div>
                  <Link
                    to="/admin/reports"
                    className="px-2.5 py-1 rounded-lg bg-[#3E5035]/10 dark:bg-[#adc29f]/20 text-[#3E5035] dark:text-[#adc29f] text-[11px] font-semibold shrink-0 hover:bg-[#3E5035]/20 transition-colors"
                  >
                    Investigate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Admin Actions Audit Feed */}
        <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-xl text-[#3E5035] dark:text-[#adc29f]">
                history_edu
              </span>
              <h3 className="font-serif-brand text-lg font-bold text-[#282B24] dark:text-[#F7F0E3]">
                {t('recentActivity')}
              </h3>
            </div>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-semibold text-[#3E5035] dark:text-[#adc29f] hover:underline"
            >
              Full Trail
            </Link>
          </div>

          {recentActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#795640] dark:text-[#A5AD91]">
              No administrative interventions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E9D8B9]/40 dark:divide-stone-700/40">
              {recentActions.map((act) => (
                <div key={act._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#282B24] dark:text-[#F7F0E3] block">
                      {act.actionType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-[#795640] dark:text-[#A5AD91] block truncate max-w-sm">
                      {act.reason}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 shrink-0">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
