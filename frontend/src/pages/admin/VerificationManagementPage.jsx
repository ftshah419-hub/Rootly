import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const VerificationManagementPage = () => {
  const { t } = useAdminLanguage();

  const [verifications, setVerifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRecord, setSelectedRecord] = useState(null);

  // Decision Dialog
  const [dialog, setDialog] = useState({
    isOpen: false,
    record: null,
    targetStatus: '',
    isLoading: false
  });

  const fetchVerifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getVerifications({
        page,
        limit: 15,
        status: statusFilter,
        verificationType: typeFilter
      });
      setVerifications(res.verifications || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve garden verifications');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleOpenDialog = (record, newStatus, e) => {
    if (e) e.stopPropagation();
    setDialog({
      isOpen: true,
      record,
      targetStatus: newStatus,
      isLoading: false
    });
  };

  const handleConfirmDecision = async (reviewNotes) => {
    const { record, targetStatus } = dialog;
    if (!record || !targetStatus) return;

    setDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminService.reviewVerification(record._id, {
        status: targetStatus,
        reviewNotes
      });
      setDialog({ isOpen: false, record: null, targetStatus: '', isLoading: false });
      if (selectedRecord && selectedRecord._id === record._id) {
        setSelectedRecord(null);
      }
      fetchVerifications();
    } catch (err) {
      alert(err.message || 'Verification review failed');
      setDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filterOptions = [
    {
      id: 'status',
      label: 'Verification Status',
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: t('SUBMITTED'), value: 'SUBMITTED' },
        { label: t('UNDER_REVIEW'), value: 'UNDER_REVIEW' },
        { label: t('APPROVED'), value: 'APPROVED' },
        { label: t('REJECTED'), value: 'REJECTED' }
      ]
    },
    {
      id: 'type',
      label: 'Verification Class',
      value: typeFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Terrace / Home Garden', value: 'HOME_GARDEN' },
        { label: 'Community Vouch', value: 'COMMUNITY_VOUCH' },
        { label: 'Physical Inspection', value: 'ADMIN_INSPECTION' }
      ]
    }
  ];

  const handleFilterChange = (id, val) => {
    setPage(1);
    if (id === 'status') setStatusFilter(val);
    if (id === 'type') setTypeFilter(val);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setPage(1);
  };

  const columns = [
    {
      key: 'user',
      header: 'Grower & Garden',
      render: (v) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {v.userId?.name || 'Unknown User'}
          </span>
          <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
            {v.userId?.profile?.gardenName || v.userId?.email}
          </span>
        </div>
      )
    },
    {
      key: 'verificationType',
      header: 'Verification Type',
      render: (v) => (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3E5035]/15 text-[#3E5035] dark:text-[#adc29f]">
          {v.verificationType.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Review Status',
      render: (v) => <StatusBadge status={v.status} size="xs" />
    },
    {
      key: 'createdAt',
      header: 'Submitted On',
      render: (v) => (
        <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {new Date(v.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedRecord(v)}
            className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
            title={t('viewDetails')}
          >
            <span className="material-symbols-outlined !text-lg">visibility</span>
          </button>
          {v.status !== 'APPROVED' && (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(v, 'APPROVED', e)}
              className="p-1.5 rounded-lg text-[#3E5035] hover:bg-[#3E5035]/10"
              title="Certify Garden"
            >
              <span className="material-symbols-outlined !text-lg">check_circle</span>
            </button>
          )}
          {v.status !== 'REJECTED' && (
            <button
              type="button"
              onClick={(e) => handleOpenDialog(v, 'REJECTED', e)}
              className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
              title="Decline Certification"
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
          <span>Urban Agro-Verification Desk</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('verificationsTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('verificationsSubtitle')}
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-[#F7F0E3] dark:bg-[#282B24] border border-[#E9D8B9] flex items-center gap-3 text-xs text-[#795640] dark:text-[#A5AD91]">
        <span className="material-symbols-outlined !text-xl text-[#3E5035] shrink-0">shield</span>
        <span>
          <strong>Agronomy Protocol Notice:</strong> Grower verification confirms terrace/backyard homestead legitimacy to eliminate commercial wholesale reselling. It does not certify industrial organic compliance.
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={statusFilter !== 'all' || typeFilter !== 'all'}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchVerifications} />
      ) : (
        <DataTable
          columns={columns}
          data={verifications}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="verified"
          emptyTitle="Verification Queue Clear"
          emptyDescription="No grower verification requests matching the selected filters were found."
          onRowClick={(v) => setSelectedRecord(v)}
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
        isOpen={Boolean(selectedRecord)}
        title={selectedRecord?.userId?.profile?.gardenName || 'Garden Verification Record'}
        subtitle={`Submitted on ${selectedRecord ? new Date(selectedRecord.createdAt).toLocaleString() : ''}`}
        onClose={() => setSelectedRecord(null)}
        footer={
          selectedRecord && selectedRecord.status !== 'APPROVED' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenDialog(selectedRecord, 'REJECTED')}
                className="px-3.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50"
              >
                {t('reject')}
              </button>
              <button
                type="button"
                onClick={() => handleOpenDialog(selectedRecord, 'APPROVED')}
                className="px-3.5 py-1.5 rounded-lg bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920]"
              >
                {t('approve')}
              </button>
            </div>
          ) : null
        }
      >
        {selectedRecord && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Status Card */}
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Queue Status
                </span>
                <StatusBadge status={selectedRecord.status} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Type
                </span>
                <span className="font-bold text-xs">{selectedRecord.verificationType}</span>
              </div>
            </div>

            {/* Grower Information */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                Grower & Garden Location
              </span>
              <div className="font-bold text-sm">{selectedRecord.userId?.name}</div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
                {selectedRecord.userId?.email} • {selectedRecord.userId?.phone || 'No phone'}
              </div>
              <div className="text-[11px] text-[#795640] dark:text-[#A5AD91] mt-1">
                Neighborhood: {selectedRecord.userId?.location?.neighborhood || 'Ernakulam Ward'}
              </div>
            </div>

            {/* Description & Evidence */}
            {selectedRecord.evidence?.description && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Grower Terrace Description
                </span>
                <p className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 leading-relaxed text-xs">
                  {selectedRecord.evidence.description}
                </p>
              </div>
            )}

            {/* Garden Photos */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-2">
                Garden Photographic Documentation ({selectedRecord.evidence?.gardenPhotos?.length || 0})
              </span>
              {selectedRecord.evidence?.gardenPhotos && selectedRecord.evidence.gardenPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedRecord.evidence.gardenPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Garden inspection evidence"
                      className="w-full h-36 rounded-xl object-cover border border-[#E9D8B9]"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-stone-100 dark:bg-stone-800 text-center text-[#795640] dark:text-[#A5AD91]">
                  No photos submitted with this record
                </div>
              )}
            </div>

            {/* Inspector Notes if available */}
            {selectedRecord.reviewNotes && (
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-[#E9D8B9]/60">
                <span className="font-bold block mb-1">Inspector Notes:</span>
                <p>{selectedRecord.reviewNotes}</p>
                <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 block mt-1">
                  Reviewed by {selectedRecord.reviewedBy?.name || 'Admin'}
                </span>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Decision Dialog */}
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        title={`Confirm Garden ${dialog.targetStatus}`}
        message={`Certify or reject the garden verification for ${dialog.record?.userId?.name}. This decision issues an official platform trust badge.`}
        confirmLabel={`Submit ${dialog.targetStatus}`}
        confirmVariant={dialog.targetStatus === 'APPROVED' ? 'primary' : 'danger'}
        requireReason={true}
        reasonPlaceholder="Enter inspector assessment remarks or deficiency reasons..."
        isLoading={dialog.isLoading}
        onConfirm={handleConfirmDecision}
        onClose={() => setDialog({ isOpen: false, record: null, targetStatus: '', isLoading: false })}
      />
    </div>
  );
};

export default VerificationManagementPage;
