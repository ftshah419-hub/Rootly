import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const ReportsManagementPage = () => {
  const { t } = useAdminLanguage();

  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedReport, setSelectedReport] = useState(null);

  // Resolution Dialog
  const [dialog, setDialog] = useState({
    isOpen: false,
    report: null,
    targetStatus: '',
    isLoading: false
  });

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getReports({
        page,
        limit: 15,
        status: statusFilter,
        reason: reasonFilter
      });
      setReports(res.reports || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve moderation reports');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, reasonFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleOpenDialog = (report, newStatus, e) => {
    if (e) e.stopPropagation();
    setDialog({
      isOpen: true,
      report,
      targetStatus: newStatus,
      isLoading: false
    });
  };

  const handleConfirmResolution = async (resolutionNotes) => {
    const { report, targetStatus } = dialog;
    if (!report || !targetStatus) return;

    setDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminService.resolveReport(report._id, {
        status: targetStatus,
        resolutionNotes
      });
      setDialog({ isOpen: false, report: null, targetStatus: '', isLoading: false });
      if (selectedReport && selectedReport._id === report._id) {
        setSelectedReport(null);
      }
      fetchReports();
    } catch (err) {
      alert(err.message || 'Resolution failed');
      setDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filterOptions = [
    {
      id: 'status',
      label: 'Report Status',
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: t('PENDING'), value: 'PENDING' },
        { label: t('INVESTIGATING'), value: 'INVESTIGATING' },
        { label: t('RESOLVED'), value: 'RESOLVED' },
        { label: t('DISMISSED'), value: 'DISMISSED' }
      ]
    },
    {
      id: 'reason',
      label: t('reportReason'),
      value: reasonFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Commercial Reseller', value: 'COMMERCIAL_RESELLER' },
        { label: 'Not Homegrown', value: 'NOT_HOMEGROWN' },
        { label: 'False Advertising', value: 'FALSE_ADVERTISING' },
        { label: 'Inappropriate Behavior', value: 'INAPPROPRIATE_BEHAVIOR' },
        { label: 'Spam', value: 'SPAM' },
        { label: 'Safety Concern', value: 'SAFETY_CONCERN' },
        { label: 'Other', value: 'OTHER' }
      ]
    }
  ];

  const handleFilterChange = (id, val) => {
    setPage(1);
    if (id === 'status') setStatusFilter(val);
    if (id === 'reason') setReasonFilter(val);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setReasonFilter('all');
    setPage(1);
  };

  const columns = [
    {
      key: 'reason',
      header: t('reportReason'),
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {r.reason.replace(/_/g, ' ')}
          </span>
          <span className="text-[11px] text-[#795640] dark:text-[#A5AD91] line-clamp-1 max-w-xs">
            {r.details}
          </span>
        </div>
      )
    },
    {
      key: 'target',
      header: t('reportedParty'),
      render: (r) => (
        <div className="flex flex-col">
          {r.reportedUserId ? (
            <>
              <span className="font-bold text-rose-800 dark:text-rose-300">
                User: {r.reportedUserId.name}
              </span>
              <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                {r.reportedUserId.email}
              </span>
            </>
          ) : r.reportedProductId ? (
            <>
              <span className="font-bold text-[#3E5035] dark:text-[#adc29f]">
                Listing: {r.reportedProductId.name}
              </span>
              <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                Produce Listing
              </span>
            </>
          ) : (
            <span className="text-[#795640] dark:text-[#A5AD91]">General Marketplace</span>
          )}
        </div>
      )
    },
    {
      key: 'reporterId',
      header: t('reporter'),
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-semibold">{r.reporterId?.name || 'Anonymous Neighbor'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70">
            {r.reporterId?.email}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Moderation Status',
      render: (r) => <StatusBadge status={r.status} size="xs" />
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (r) => (
        <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedReport(r)}
            className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
            title={t('viewDetails')}
          >
            <span className="material-symbols-outlined !text-lg">visibility</span>
          </button>
          {r.status === 'PENDING' && (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(r, 'INVESTIGATING', e)}
              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50"
              title="Mark Under Investigation"
            >
              <span className="material-symbols-outlined !text-lg">search_check</span>
            </button>
          )}
          {r.status !== 'RESOLVED' && (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(r, 'RESOLVED', e)}
              className="p-1.5 rounded-lg text-[#3E5035] hover:bg-[#3E5035]/10"
              title="Resolve Complaint"
            >
              <span className="material-symbols-outlined !text-lg">task_alt</span>
            </button>
          )}
          {r.status !== 'DISMISSED' && (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(r, 'DISMISSED', e)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
              title="Dismiss Invalid Complaint"
            >
              <span className="material-symbols-outlined !text-lg">cancel</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
          <span>Compliance & Neighbor Trust</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('reportsTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('reportsSubtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={statusFilter !== 'all' || reasonFilter !== 'all'}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : (
        <DataTable
          columns={columns}
          data={reports}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="verified_user"
          emptyTitle="Moderation Queue Clear"
          emptyDescription="There are currently no reports awaiting moderation in the database."
          onRowClick={(r) => setSelectedReport(r)}
          pagination={{
            page,
            totalPages,
            total,
            limit: 15,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      {/* Report Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedReport)}
        title={selectedReport ? selectedReport.reason.replace(/_/g, ' ') : 'Report Details'}
        subtitle={`Submitted on ${selectedReport ? new Date(selectedReport.createdAt).toLocaleString() : ''}`}
        onClose={() => setSelectedReport(null)}
        footer={
          selectedReport && selectedReport.status !== 'RESOLVED' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenDialog(selectedReport, 'DISMISSED')}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                {t('dismiss')}
              </button>
              <button
                type="button"
                onClick={() => handleOpenDialog(selectedReport, 'RESOLVED')}
                className="px-3.5 py-1.5 rounded-lg bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920]"
              >
                {t('resolve')}
              </button>
            </div>
          ) : null
        }
      >
        {selectedReport && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Status Card */}
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Investigation Status
                </span>
                <StatusBadge status={selectedReport.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Violation Class
                </span>
                <span className="font-bold text-xs">{selectedReport.reason}</span>
              </div>
            </div>

            {/* Particulars & Details */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                Report Particulars & Evidence
              </span>
              <p className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 leading-relaxed text-xs">
                {selectedReport.details}
              </p>
            </div>

            {/* Evidence Images */}
            {selectedReport.evidenceImages && selectedReport.evidenceImages.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-2">
                  Evidence Media
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.evidenceImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Report evidence"
                      className="w-full h-32 rounded-xl object-cover border border-[#E9D8B9]"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Subject Info */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Reporter
                </span>
                <div className="font-bold mt-0.5">{selectedReport.reporterId?.name || 'Anonymous'}</div>
                <div className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedReport.reporterId?.email}
                </div>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Reported Subject
                </span>
                <div className="font-bold mt-0.5">
                  {selectedReport.reportedUserId?.name || selectedReport.reportedProductId?.name || 'Platform Entry'}
                </div>
                <div className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedReport.reportedUserId?.email || 'Produce ID Listed'}
                </div>
              </div>
            </div>

            {/* Resolution History if resolved */}
            {selectedReport.resolutionNotes && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block mb-1">Official Resolution Record:</span>
                <p>{selectedReport.resolutionNotes}</p>
                <span className="text-[10px] block mt-1 text-emerald-800 dark:text-emerald-300">
                  Resolved by {selectedReport.resolvedBy?.name || 'Admin'} on {new Date(selectedReport.resolvedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Resolution Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={`Confirm Resolution: ${dialog.targetStatus}`}
        message={`Mark report against ${dialog.report?.reason.replace(/_/g, ' ')} as ${dialog.targetStatus}. This action is recorded in the platform audit trail.`}
        confirmLabel={`Submit ${dialog.targetStatus}`}
        confirmVariant={dialog.targetStatus === 'RESOLVED' ? 'primary' : 'warning'}
        requireReason={true}
        reasonPlaceholder="Enter resolution conclusions, agronomic inspection remarks, or dismissal basis..."
        isLoading={dialog.isLoading}
        onConfirm={handleConfirmResolution}
        onClose={() => setDialog({ isOpen: false, report: null, targetStatus: '', isLoading: false })}
      />
    </div>
  );
};

export default ReportsManagementPage;
