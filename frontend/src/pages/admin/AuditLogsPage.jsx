import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const AuditLogsPage = () => {
  const { t } = useAdminLanguage();

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAuditLogs({
        page,
        limit: 20,
        search,
        actorRole: roleFilter
      });
      setLogs(res.logs || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve system audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filterOptions = [
    {
      id: 'role',
      label: 'Actor Role',
      value: roleFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Administrator', value: 'ADMIN' },
        { label: 'User / Grower', value: 'USER' },
        { label: 'Anonymous System', value: 'ANONYMOUS' }
      ]
    }
  ];

  const columns = [
    {
      key: 'action',
      header: t('actionExecuted'),
      render: (log) => (
        <span className="font-mono text-xs font-bold text-[#3E5035] dark:text-[#adc29f]">
          {log.action}
        </span>
      )
    },
    {
      key: 'actor',
      header: t('actor'),
      render: (log) => (
        <div className="flex flex-col">
          <span className="font-semibold">{log.actorId?.name || 'Automated Service'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70">
            {log.actorRole} {log.actorId?.email ? `• ${log.actorId.email}` : ''}
          </span>
        </div>
      )
    },
    {
      key: 'resource',
      header: t('targetResource'),
      render: (log) => (
        <span className="font-mono text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {log.resource || 'Global System'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Outcome',
      render: (log) => (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            log.status === 'SUCCESS'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {log.status}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: t('timestamp'),
      render: (log) => (
        <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (log) => (
        <button
          type="button"
          onClick={() => setSelectedLog(log)}
          className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
          title="Inspect Audit Metadata"
        >
          <span className="material-symbols-outlined !text-lg">data_object</span>
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
          <span>Security & Governance Ledger</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('auditTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('auditSubtitle')}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Filter by action code, resource ID..."
          className="w-full sm:max-w-md"
        />

        <FilterPanel
          filters={filterOptions}
          onFilterChange={(id, val) => {
            setRoleFilter(val);
            setPage(1);
          }}
          onReset={() => {
            setRoleFilter('all');
            setSearch('');
            setPage(1);
          }}
          hasActiveFilters={roleFilter !== 'all' || search !== ''}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchLogs} />
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="history_edu"
          emptyTitle="Audit Trail Pristine"
          emptyDescription="No administrative interventions or security audit records matching this filter were found in MongoDB."
          onRowClick={(log) => setSelectedLog(log)}
          pagination={{
            page,
            totalPages,
            total,
            limit: 20,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      {/* Metadata Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedLog)}
        title="Audit Log Entry"
        subtitle={`Event Ref: ${selectedLog?._id}`}
        onClose={() => setSelectedLog(null)}
      >
        {selectedLog && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div className="font-bold text-sm text-[#3E5035] dark:text-[#adc29f]">
                {selectedLog.action}
              </div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91] mt-1">
                Resource: {selectedLog.resource || 'None specified'}
              </div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
                Timestamp: {new Date(selectedLog.createdAt).toISOString()}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-2">
                Payload & Context Details
              </span>
              <pre className="p-4 rounded-xl bg-[#282B24] text-[#F7F0E3] font-mono text-[11px] overflow-x-auto admin-scrollbar max-h-72">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Actor</span>
                <span className="font-bold">{selectedLog.actorId?.name || selectedLog.actorRole}</span>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">IP Address</span>
                <span className="font-mono">{selectedLog.ipAddress || '127.0.0.1'}</span>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default AuditLogsPage;
