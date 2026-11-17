import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin/adminService.js';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import ErrorState from '../../components/admin/ErrorState.jsx';

export const SystemSettingsPage = () => {
  const { t } = useAdminLanguage();

  const [settings, setSettings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit dialog state
  const [editDialog, setEditDialog] = useState({
    isOpen: false,
    key: '',
    value: '',
    description: '',
    category: 'GENERAL',
    isLoading: false
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getSystemSettings();
      setSettings(res.settings || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve system settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleOpenEdit = (setting) => {
    setEditDialog({
      isOpen: true,
      key: setting.key,
      value: typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value),
      description: setting.description,
      category: setting.category,
      isLoading: false
    });
  };

  const handleSaveSetting = async () => {
    const { key, value, description, category } = editDialog;
    if (!key) return;

    setEditDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      let parsedValue = value;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        // Keep as string or primitive
      }

      await adminService.updateSystemSetting(key, {
        value: parsedValue,
        description,
        category
      });
      setEditDialog({ isOpen: false, key: '', value: '', description: '', category: 'GENERAL', isLoading: false });
      fetchSettings();
    } catch (err) {
      alert(err.message || 'Failed to save system setting');
      setEditDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const categories = ['ALL', 'GENERAL', 'SECURITY', 'AI', 'NOTIFICATIONS', 'FEES_AND_LIMITS'];

  const filteredSettings = settings.filter((s) =>
    activeCategory === 'ALL' ? true : s.category === activeCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#C8754D] dark:text-[#ffa276] uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C8754D]"></span>
          <span>Core Node Configuration</span>
        </div>
        <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-[#3E5035] text-[#FFFDF8]'
                : 'text-[#795640] dark:text-[#A5AD91] hover:bg-[#E9D8B9]/40'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSettings} />
      ) : filteredSettings.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] text-center">
          <span className="material-symbols-outlined !text-3xl text-[#795640]/50 dark:text-[#A5AD91]/50 mb-2">
            tune
          </span>
          <h4 className="font-serif-brand text-base font-bold text-[#282B24] dark:text-[#F7F0E3]">
            No Custom Settings Overrides
          </h4>
          <p className="text-xs text-[#795640] dark:text-[#A5AD91] max-w-sm mx-auto mt-1 mb-4">
            The platform is operating on standard agronomy defaults. Administrators can add runtime overrides as needed.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditDialog({
                isOpen: true,
                key: 'MAX_PRODUCE_RADIUS_KM',
                value: '25',
                description: 'Maximum geographical search radius for neighbor produce exchange in kilometers',
                category: 'GENERAL',
                isLoading: false
              })
            }
            className="px-4 py-2 rounded-xl bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920]"
          >
            + Create Setting Override
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSettings.map((setting) => (
            <div
              key={setting._id || setting.key}
              className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#3E5035] dark:text-[#adc29f]">
                    {setting.key}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9D8B9]/60 dark:bg-stone-800 text-[#795640] dark:text-[#A5AD91]">
                    {setting.category}
                  </span>
                </div>
                <p className="text-xs text-[#795640] dark:text-[#A5AD91] mb-3">
                  {setting.description || 'System operational parameter'}
                </p>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-[#E9D8B9]/50 font-mono text-xs overflow-x-auto admin-scrollbar">
                  {typeof setting.value === 'object'
                    ? JSON.stringify(setting.value, null, 2)
                    : String(setting.value)}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E9D8B9]/40 dark:border-stone-700/40 flex items-center justify-between text-[11px]">
                <span className="text-[#795640]/70 dark:text-[#A5AD91]/70">
                  Updated: {new Date(setting.updatedAt || Date.now()).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(setting)}
                  className="px-2.5 py-1 rounded-lg bg-[#3E5035]/10 text-[#3E5035] dark:text-[#adc29f] font-semibold hover:bg-[#3E5035]/20 transition-colors"
                >
                  Modify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Setting Modal */}
      {editDialog.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 rustic-shadow-3">
            <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3] mb-1">
              Configure Platform Setting
            </h3>
            <p className="text-xs text-[#795640] dark:text-[#A5AD91] mb-4">
              Key: <span className="font-mono font-bold">{editDialog.key}</span>
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#795640] dark:text-[#A5AD91] mb-1">
                  Parameter Value (Primitive or JSON)
                </label>
                <textarea
                  rows={4}
                  value={editDialog.value}
                  onChange={(e) => setEditDialog((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-[#E9D8B9] dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-[#3E5035] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#795640] dark:text-[#A5AD91] mb-1">
                  Description / Agronomy Rule Justification
                </label>
                <input
                  type="text"
                  value={editDialog.description}
                  onChange={(e) => setEditDialog((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-[#E9D8B9] dark:border-stone-700 text-xs focus:ring-2 focus:ring-[#3E5035] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-[#E9D8B9]/60 dark:border-stone-700/60">
              <button
                type="button"
                onClick={() => setEditDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl border border-[#E9D8B9] dark:border-stone-700 text-xs font-semibold text-[#795640] dark:text-[#A5AD91]"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveSetting}
                disabled={editDialog.isLoading}
                className="px-4 py-2 rounded-xl bg-[#3E5035] text-white text-xs font-semibold hover:bg-[#283920] shadow-sm"
              >
                {editDialog.isLoading ? 'Saving...' : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettingsPage;
