import React, { useState } from 'react';
import { X, User, Phone, MapPin, Sprout, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { userService } from '../../../services/user/userService';

const EditProfileModal = ({ user, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gardenName, setGardenName] = useState(user?.gardenName || user?.garden?.name || '');
  const [bio, setBio] = useState(user?.bio || user?.garden?.description || '');
  const [address, setAddress] = useState(user?.location?.address || '');
  const [porchBoxEnabled, setPorchBoxEnabled] = useState(user?.porchBoxEnabled ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        phone,
        gardenName,
        bio,
        location: {
          ...user?.location,
          address
        },
        porchBoxEnabled
      };

      await userService.updateProfile(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to update grower profile.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-bark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
                {t('profile.editTitle', 'Grower & Garden Profile')}
              </h3>
              <p className="text-xs text-earth dark:text-sand/70">
                {t('profile.editSubtitle', 'Configure your neighbourhood grower identity')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-earth dark:text-sand hover:bg-sand/30 dark:hover:bg-sand/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-olive dark:text-sage mx-auto animate-bounce" />
            <h4 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
              {t('profile.updatedSuccess', 'Profile Updated Successfully!')}
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                  {t('profile.fullName', 'Full Name')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                  {t('profile.phoneNumber', 'Phone Number')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98460 00000"
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                {t('profile.gardenName', 'Backyard Garden / Homestead Name')}
              </label>
              <input
                type="text"
                value={gardenName}
                onChange={(e) => setGardenName(e.target.value)}
                placeholder="e.g. Hilltop Organic Terrace, Vypin Greens"
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                {t('profile.neighbourhoodAddress', 'Approximate Neighbourhood Area / Street')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Panampilly Nagar, Kochi"
                  className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl px-3 py-2 text-bark dark:text-warm-white pl-9 focus:outline-none focus:ring-1 focus:ring-olive"
                />
                <MapPin className="w-4 h-4 text-terracotta absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-earth/70 dark:text-sand/60 mt-1">
                {t('profile.privacyTip', 'Only approximate vicinity is shown publicly. Exact house location stays private until exchange acceptance.')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1">
                {t('profile.gardenBio', 'Garden Bio & Practices')}
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('profile.bioPlaceholder', 'Share your compost methods, heirloom seeds, or what you enjoy growing in your backyard...')}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Porch Box preference */}
            <label className="flex items-center gap-3 p-3 bg-sand/20 dark:bg-sand/10 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={porchBoxEnabled}
                onChange={(e) => setPorchBoxEnabled(e.target.checked)}
                className="rounded text-olive focus:ring-olive w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-semibold text-bark dark:text-warm-white block">
                  {t('profile.enablePorchBox', 'Enable Contactless Porch-Box Exchange')}
                </span>
                <span className="text-earth dark:text-sand/70">
                  Allow neighbours to pick up produce from your porch drop box using 4-digit verification code.
                </span>
              </div>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-earth dark:text-sand hover:text-bark dark:hover:text-warm-white transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-olive hover:bg-olive/90 text-warm-white text-sm font-medium rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {loading ? t('common.submitting', 'Saving...') : t('common.saveChanges', 'Save Profile')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default EditProfileModal;
