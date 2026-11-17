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

export const UserManagementPage = () => {
  const { t } = useAdminLanguage();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail Drawer state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Status Change Dialog state
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    user: null,
    targetStatus: '',
    isLoading: false
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        page,
        limit: 15,
        search,
        status: statusFilter,
        role: roleFilter
      });
      setUsers(res.users || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to retrieve user directory');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDrawer = async (user) => {
    setSelectedUser(user);
    try {
      const res = await adminService.getUserById(user._id);
      setUserDetails(res);
    } catch (err) {
      console.warn('Failed to load user extra details:', err.message);
    }
  };

  const handleOpenStatusDialog = (user, newStatus, e) => {
    if (e) e.stopPropagation();
    setStatusDialog({
      isOpen: true,
      user,
      targetStatus: newStatus,
      isLoading: false
    });
  };

  const handleConfirmStatusChange = async (reason) => {
    const { user, targetStatus } = statusDialog;
    if (!user || !targetStatus) return;

    setStatusDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await adminService.updateUserStatus(user._id, {
        status: targetStatus,
        reason
      });
      setStatusDialog({ isOpen: false, user: null, targetStatus: '', isLoading: false });
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser((prev) => ({ ...prev, accountStatus: targetStatus }));
      }
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
      setStatusDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filterOptions = [
    {
      id: 'status',
      label: t('accountStatus'),
      value: statusFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: t('ACTIVE'), value: 'ACTIVE' },
        { label: t('SUSPENDED'), value: 'SUSPENDED' },
        { label: t('BLOCKED'), value: 'BLOCKED' },
        { label: t('DEACTIVATED'), value: 'DEACTIVATED' }
      ]
    },
    {
      id: 'role',
      label: t('role'),
      value: roleFilter,
      options: [
        { label: t('all'), value: 'all' },
        { label: 'Grower / User', value: 'USER' },
        { label: 'Administrator', value: 'ADMIN' }
      ]
    }
  ];

  const handleFilterChange = (id, val) => {
    setPage(1);
    if (id === 'status') setStatusFilter(val);
    if (id === 'role') setRoleFilter(val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRoleFilter('all');
    setPage(1);
  };

  const columns = [
    {
      key: 'name',
      header: t('userName'),
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3E5035]/15 dark:bg-[#adc29f]/20 text-[#3E5035] dark:text-[#adc29f] font-bold text-xs flex items-center justify-center shrink-0">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[#282B24] dark:text-[#F7F0E3] truncate">
              {u.name}
            </span>
            <span className="text-[11px] text-[#795640] dark:text-[#A5AD91] truncate">
              {u.profile?.gardenName || 'Home Garden'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: t('contact'),
      render: (u) => (
        <div className="flex flex-col">
          <span className="truncate">{u.email}</span>
          <span className="text-[11px] text-[#795640]/70 dark:text-[#A5AD91]/70">
            {u.phone || 'No phone recorded'}
          </span>
        </div>
      )
    },
    {
      key: 'accountStatus',
      header: t('accountStatus'),
      render: (u) => <StatusBadge status={u.accountStatus} size="xs" />
    },
    {
      key: 'role',
      header: t('role'),
      render: (u) => (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-[#3E5035] text-white' : 'bg-[#E9D8B9]/60 dark:bg-stone-800 text-[#795640] dark:text-[#A5AD91]'}`}>
          {u.role}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: t('registeredOn'),
      render: (u) => (
        <span className="text-[11px] text-[#795640] dark:text-[#A5AD91]">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleOpenDrawer(u)}
            className="p-1.5 rounded-lg text-[#3E5035] dark:text-[#adc29f] hover:bg-[#3E5035]/10 dark:hover:bg-[#adc29f]/20 transition-colors"
            title={t('viewDetails')}
          >
            <span className="material-symbols-outlined !text-lg">visibility</span>
          </button>

          {u.role !== 'ADMIN' && (
            <>
              {u.accountStatus === 'ACTIVE' ? (
                <button
                  type="button"
                  onClick={(e) => handleOpenStatusDialog(u, 'SUSPENDED', e)}
                  className="p-1.5 rounded-lg text-[#C8754D] hover:bg-[#C8754D]/10 transition-colors"
                  title={t('suspend')}
                >
                  <span className="material-symbols-outlined !text-lg">pause_circle</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleOpenStatusDialog(u, 'ACTIVE', e)}
                  className="p-1.5 rounded-lg text-[#3E5035] hover:bg-[#3E5035]/10 transition-colors"
                  title={t('activate')}
                >
                  <span className="material-symbols-outlined !text-lg">check_circle</span>
                </button>
              )}

              {u.accountStatus !== 'BLOCKED' && (
                <button
                  type="button"
                  onClick={(e) => handleOpenStatusDialog(u, 'BLOCKED', e)}
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                  title={t('block')}
                >
                  <span className="material-symbols-outlined !text-lg">block</span>
                </button>
              )}
            </>
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
          <span>Central Agronomy Registry</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('usersTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('usersSubtitle')}
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
          placeholder="Search by grower name, email, garden or ward..."
          className="w-full md:max-w-md"
        />

        <FilterPanel
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={statusFilter !== 'all' || roleFilter !== 'all' || search !== ''}
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          keyField="_id"
          isLoading={isLoading}
          emptyIcon="person_search"
          emptyTitle="No Growers Found"
          emptyDescription="No registered users matching the active filters or search criteria were found in MongoDB."
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

      {/* User Details Slide-over Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedUser)}
        title={selectedUser?.name || 'User Profile'}
        subtitle={`Member since ${selectedUser ? new Date(selectedUser.createdAt).toLocaleDateString() : ''}`}
        onClose={() => {
          setSelectedUser(null);
          setUserDetails(null);
        }}
        footer={
          selectedUser && selectedUser.role !== 'ADMIN' ? (
            <div className="flex items-center gap-2">
              {selectedUser.accountStatus === 'ACTIVE' ? (
                <button
                  type="button"
                  onClick={() => handleOpenStatusDialog(selectedUser, 'SUSPENDED')}
                  className="px-3 py-1.5 rounded-lg border border-[#C8754D] text-[#C8754D] text-xs font-semibold hover:bg-[#C8754D]/10"
                >
                  {t('suspend')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenStatusDialog(selectedUser, 'ACTIVE')}
                  className="px-3 py-1.5 rounded-lg bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920]"
                >
                  {t('activate')}
                </button>
              )}
              {selectedUser.accountStatus !== 'BLOCKED' && (
                <button
                  type="button"
                  onClick={() => handleOpenStatusDialog(selectedUser, 'BLOCKED')}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800"
                >
                  {t('block')}
                </button>
              )}
            </div>
          ) : null
        }
      >
        {selectedUser && (
          <div className="space-y-6 text-xs text-[#282B24] dark:text-[#F7F0E3]">
            {/* Account Status Hero */}
            <div className="p-4 rounded-xl bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border border-[#E9D8B9]/60 dark:border-stone-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  {t('accountStatus')}
                </span>
                <StatusBadge status={selectedUser.accountStatus} size="md" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] block mb-1">
                  Role
                </span>
                <span className="font-bold text-sm">{selectedUser.role}</span>
              </div>
            </div>

            {/* Profile & Garden Details */}
            <div className="space-y-3">
              <h4 className="font-serif-brand text-base font-bold text-[#3E5035] dark:text-[#adc29f]">
                Garden & Contact Profile
              </h4>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/40 dark:border-stone-700/40">
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Email</span>
                  <span className="font-semibold">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Phone</span>
                  <span className="font-semibold">{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Garden Name</span>
                  <span className="font-semibold">{selectedUser.profile?.gardenName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#795640] dark:text-[#A5AD91] block text-[11px]">Neighborhood</span>
                  <span className="font-semibold">{selectedUser.location?.neighborhood || 'Ernakulam Node'}</span>
                </div>
              </div>
            </div>

            {/* Activity Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-center">
                <span className="font-serif-brand text-xl font-bold block">
                  {userDetails?.stats?.listingCount || 0}
                </span>
                <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">Listings</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-center">
                <span className="font-serif-brand text-xl font-bold block">
                  {userDetails?.stats?.exchangeCount || 0}
                </span>
                <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">Exchanges</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-center">
                <span className="font-serif-brand text-xl font-bold block text-rose-700">
                  {userDetails?.stats?.reportCount || 0}
                </span>
                <span className="text-[10px] text-[#795640] dark:text-[#A5AD91]">Reports</span>
              </div>
            </div>

            {/* Audit & Moderation History */}
            {userDetails?.adminActions && userDetails.adminActions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-serif-brand text-base font-bold text-[#3E5035] dark:text-[#adc29f]">
                  Administrative History
                </h4>
                <div className="divide-y divide-[#E9D8B9]/50 dark:divide-stone-700/50">
                  {userDetails.adminActions.map((act) => (
                    <div key={act._id} className="py-2">
                      <span className="font-bold block">{act.actionType}</span>
                      <span className="text-[#795640] dark:text-[#A5AD91]">{act.reason}</span>
                      <span className="text-[10px] text-[#795640]/70 dark:text-[#A5AD91]/70 block mt-0.5">
                        By {act.adminId?.name || 'Admin'} on {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Status Modification Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={statusDialog.isOpen}
        title={`Confirm Account Status: ${statusDialog.targetStatus}`}
        message={`Are you sure you want to transition ${statusDialog.user?.name}'s account to ${statusDialog.targetStatus}? This action is cryptographically recorded in the system audit logs.`}
        confirmLabel={`Apply ${statusDialog.targetStatus}`}
        confirmVariant={statusDialog.targetStatus === 'BLOCKED' ? 'danger' : statusDialog.targetStatus === 'SUSPENDED' ? 'warning' : 'primary'}
        requireReason={statusDialog.targetStatus === 'BLOCKED' || statusDialog.targetStatus === 'SUSPENDED'}
        reasonPlaceholder="Provide the administrative ground for this restriction..."
        isLoading={statusDialog.isLoading}
        onConfirm={handleConfirmStatusChange}
        onClose={() => setStatusDialog({ isOpen: false, user: null, targetStatus: '', isLoading: false })}
      />
    </div>
  );
};

export default UserManagementPage;
