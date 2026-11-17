import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import StatsCard from '../../components/admin/StatsCard.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import SimpleChart from '../../components/admin/SimpleChart.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const AIUsageMonitoringPage = () => {
  const { t } = useAdminLanguage();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAIUsage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAIUsageLogs();
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to retrieve AI usage telemetry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIUsage();
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
    return <ErrorState message={error} onRetry={fetchAIUsage} />;
  }

  const summary = data?.summary || {};
  const recentGenerations = data?.recentGenerations || [];
  const recentErrors = data?.recentErrors || [];

  const featureChartData = (summary.featureBreakdown || []).map((fb) => ({
    label: fb._id.replace(/_/g, ' '),
    value: fb.count
  }));

  const genColumns = [
    {
      key: 'feature',
      header: t('feature'),
      render: (g) => (
        <span className="font-bold text-[#3E5035] dark:text-[#adc29f]">
          {g.feature.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'user',
      header: 'Caller',
      render: (g) => g.userId?.name || 'Anonymous'
    },
    {
      key: 'modelUsed',
      header: t('model'),
      render: (g) => (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
          {g.modelUsed}
        </span>
      )
    },
    {
      key: 'tokensUsed',
      header: t('tokens'),
      render: (g) => <span className="font-semibold">{g.tokensUsed || 0} tokens</span>
    },
    {
      key: 'confirmed',
      header: 'Advisory Confirmed',
      render: (g) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.isAdvisoryConfirmedByUser ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
          {g.isAdvisoryConfirmedByUser ? 'Confirmed' : 'Pending / Skipped'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (g) => new Date(g.createdAt).toLocaleString()
    }
  ];

  const errorColumns = [
    {
      key: 'endpoint',
      header: 'Endpoint',
      render: (e) => <span className="font-mono text-xs">{e.endpoint || '/ai/vision'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => <StatusBadge status={e.requestStatus} size="xs" />
    },
    {
      key: 'latencyMs',
      header: t('latency'),
      render: (e) => `${e.latencyMs || 0} ms`
    },
    {
      key: 'errorMessage',
      header: 'Diagnostics',
      render: (e) => (
        <span className="text-rose-700 dark:text-rose-400 font-mono text-[11px] truncate max-w-sm block">
          {e.errorMessage || 'Unknown error'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Time',
      render: (e) => new Date(e.createdAt).toLocaleTimeString()
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#3E5035] dark:text-[#adc29f] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#3E5035]"></span>
          <span>Google Gemini Vision & LLM Telemetry</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('aiTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('aiSubtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon="psychology"
          title="Total Invocations"
          value={summary.totalGenerations || 0}
          subtitle="Real AI requests recorded in MongoDB"
          accent="blue"
        />
        <StatsCard
          icon="bolt"
          title="Default Model"
          value="Gemini 1.5 Flash"
          subtitle="Multimodal vision + localized agronomy"
          accent="olive"
        />
        <StatsCard
          icon="warning"
          title="Telemetry Errors"
          value={recentErrors.length}
          subtitle="Rate limits or network fallbacks"
          accent="terracotta"
        />
      </div>

      {/* Feature Breakdown Chart */}
      <SimpleChart
        type="bar"
        title="AI Capabilities Utilization"
        subtitle="Distribution of invocations across agronomic AI features"
        data={featureChartData}
        height={220}
        emptyMessage="No AI feature invocations recorded yet"
      />

      {/* Recent Generations Table */}
      <div className="space-y-3">
        <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          Recent AI Invocations
        </h3>
        <DataTable
          columns={genColumns}
          data={recentGenerations}
          keyField="_id"
          emptyIcon="psychology"
          emptyTitle="No AI Invocations Recorded"
          emptyDescription="When users invoke produce recognition or harvest planning, audit records appear here."
        />
      </div>

      {/* Error & Rate Limit Table */}
      <div className="space-y-3">
        <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          AI Errors & Diagnostics
        </h3>
        <DataTable
          columns={errorColumns}
          data={recentErrors}
          keyField="_id"
          emptyIcon="check_circle"
          emptyTitle="Zero AI Runtime Errors"
          emptyDescription="No failed or rate-limited Gemini queries logged."
        />
      </div>
    </div>
  );
};

export default AIUsageMonitoringPage;
