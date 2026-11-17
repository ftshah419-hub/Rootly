import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import DataTable from '../../components/admin/DataTable.jsx';
import FilterPanel from '../../components/admin/FilterPanel.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import DetailDrawer from '../../components/admin/DetailDrawer.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const ReviewsManagementPage = () => {
  const { t } = useAdminLanguage();

  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedReview, setSelectedReview] = useState(null);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    review: null,
    isLoading: false
  });

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getReviews({
        page,
        limit: 15,
        rating: ratingFilter
      });
      setReviews(res.reviews || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve community reviews');
    } finally {
      setIsLoading(false);
    }
  }, [page, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleConfirmDelete = async (reason) => {
    const { review } = deleteDialog;
    if (!review) return;

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminService.deleteReview(review._id, { reason });
      setDeleteDialog({ isOpen: false, review: null, isLoading: false });
      if (selectedReview && selectedReview._id === review._id) {
        setSelectedReview(null);
      }
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to remove review');
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filterOptions = [
    {
      id: 'rating',
      label: 'Rating Filter',
      value: ratingFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: '5 Stars ★★★★★', value: '5' },
        { label: '4 Stars ★★★★☆', value: '4' },
        { label: '3 Stars ★★★☆☆', value: '3' },
        { label: '2 Stars ★★☆☆☆', value: '2' },
        { label: '1 Star ★☆☆☆☆', value: '1' }
      ]
    }
  ];

  const columns = [
    {
      key: 'reviewer',
      header: 'Reviewer',
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {r.reviewerId?.name || 'Neighbor'}
          </span>
          <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
            {r.reviewerId?.email}
          </span>
        </div>
      )
    },
    {
      key: 'target',
      header: 'Grower Reviewed',
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-semibold">{r.targetUserId?.name || 'Producer'}</span>
          <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70">
            {r.targetUserId?.profile?.gardenName || 'Home Garden'}
          </span>
        </div>
      )
    },
    {
      key: 'rating',
      header: t('rating'),
      render: (r) => (
        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
          <span>{'★'.repeat(r.rating || 5)}</span>
          <span className="text-[#795640] dark:text-[#A5AD91] font-mono text-[11px]">
            ({r.rating}/5)
          </span>
        </div>
      )
    },
    {
      key: 'comment',
      header: 'Review Feedback',
      render: (r) => (
        <span className="text-xs text-[#282B24] dark:text-[#F7F0E3] line-clamp-1 max-w-sm">
          {r.comment || 'No written comments.'}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Date',
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
            onClick={() => setSelectedReview(r)}
            className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10"
            title={t('viewDetails')}
          >
            <span className="material-symbols-outlined !text-lg">visibility</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialog({ isOpen: true, review: r, isLoading: false })}
            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
            title="Delete Review"
          >
            <span className="material-symbols-outlined !text-lg">delete</span>
          </button>
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
          <span>Community Reputation Desk</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('reviewsTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('reviewsSubtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={(id, val) => {
            setRatingFilter(val);
            setPage(1);
          }}
          onReset={() => {
            setRatingFilter('all');
            setPage(1);
          }}
          hasActiveFilters={ratingFilter !== 'all'}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchReviews} />
      ) : (
        <DataTable
          columns={columns}
          data={reviews}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="reviews"
          emptyTitle="No Reviews Found"
          emptyDescription="There are currently no reviews in the database matching this rating."
          onRowClick={(r) => setSelectedReview(r)}
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
        isOpen={Boolean(selectedReview)}
        title="Community Review Details"
        subtitle={`Submitted on ${selectedReview ? new Date(selectedReview.createdAt).toLocaleString() : ''}`}
        onClose={() => setSelectedReview(null)}
        footer={
          selectedReview ? (
            <button
              type="button"
              onClick={() => setDeleteDialog({ isOpen: true, review: selectedReview, isLoading: false })}
              className="px-3.5 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800"
            >
              Remove Inappropriate Review
            </button>
          ) : null
        }
      >
        {selectedReview && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Rating Breakdown */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                Star Rating
              </span>
              <div className="text-2xl text-amber-600 font-bold mb-2">
                {'★'.repeat(selectedReview.rating)} ({selectedReview.rating} of 5)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-amber-200 dark:border-amber-900/50">
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91]">Produce Quality: </span>
                  <span className="font-bold">{selectedReview.produceQualityRating || 5}/5</span>
                </div>
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91]">Punctuality: </span>
                  <span className="font-bold">{selectedReview.punctualityRating || 5}/5</span>
                </div>
              </div>
            </div>

            {/* Written Comment */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                Written Feedback
              </span>
              <p className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 leading-relaxed text-xs">
                {selectedReview.comment || 'No written feedback submitted with this rating.'}
              </p>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40">
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Reviewer
                </span>
                <div className="font-bold mt-1">{selectedReview.reviewerId?.name}</div>
                <div className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedReview.reviewerId?.email}
                </div>
              </div>
              <div>
                <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px] font-semibold">
                  Producer / Target User
                </span>
                <div className="font-bold mt-1">{selectedReview.targetUserId?.name}</div>
                <div className="text-[10px] text-[#795640] dark:text-[#A5AD91]">
                  {selectedReview.targetUserId?.profile?.gardenName || selectedReview.targetUserId?.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Delete Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Remove Review"
        message="Permanently remove this review from the community directory? This action is recorded in the platform audit log."
        confirmLabel="Remove Review"
        confirmVariant="danger"
        requireReason={true}
        reasonPlaceholder="Specify reason for moderation (e.g. abusive language, commercial spam)..."
        isLoading={deleteDialog.isLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ isOpen: false, review: null, isLoading: false })}
      />
    </div>
  );
};

export default ReviewsManagementPage;
