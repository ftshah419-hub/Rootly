import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { reviewService } from '../../../services/user/reviewService';

const ReviewModal = ({ exchange, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !exchange) return null;

  const tags = [
    'Super Fresh',
    'Friendly Neighbour',
    'Pesticide Free Taste',
    'Smooth Porch Pickup',
    'Generous Quantity',
    'Great Communication'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reviewPayload = {
        exchangeId: exchange._id || exchange.id,
        productId: exchange.product?._id || exchange.product || exchange.productId,
        targetUserId: exchange.seller?._id || exchange.seller || exchange.recipient?._id,
        rating,
        comment: selectedTags.length > 0 ? `${comment}\n[Highlights: ${selectedTags.join(', ')}]` : comment,
        tags: selectedTags
      };

      await reviewService.createReview(reviewPayload);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err?.response?.data?.message || err.message || t('common.errorSubmitting', 'Failed to submit review.'));
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

      <div className="relative bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand dark:border-sand/20 pb-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
              {t('review.title', 'Rate Exchange Experience')}
            </h3>
            <p className="text-xs text-earth dark:text-sand/70">
              {t('review.subtitle', 'Build trust in your neighbourhood gardening network')}
            </p>
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
              {t('review.successTitle', 'Warm Thanks for Your Review!')}
            </h4>
            <p className="text-sm text-earth dark:text-sand/80 max-w-xs mx-auto">
              {t('review.successDesc', 'Your feedback helps other home growers and neighbours connect with confidence.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Star Rating */}
            <div className="text-center py-2">
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star 
                          ? 'fill-amber-400 text-amber-500' 
                          : 'text-sand dark:text-sand/30'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-earth dark:text-sand/80 mt-1 block">
                {rating === 5 && '🌟 Outstanding Freshness & Trust'}
                {rating === 4 && '👍 Very Good Experience'}
                {rating === 3 && '👌 Satisfactory'}
                {rating === 2 && '👎 Disappointing Quality'}
                {rating === 1 && '⚠️ Poor / Unresolved issues'}
              </span>
            </div>

            {/* Quick tags */}
            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-2">
                {t('review.quickTags', 'What stood out?')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        isSelected 
                          ? 'bg-olive text-warm-white border-olive' 
                          : 'bg-warm-white dark:bg-darkcard border-sand dark:border-sand/30 text-earth dark:text-sand/90 hover:border-olive'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-bark dark:text-warm-white mb-1.5">
                {t('review.writtenFeedback', 'Written Feedback')}
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('review.commentPlaceholder', 'Tell the neighbourhood how the produce tasted or how smooth the exchange was...')}
                className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-3 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-olive"
              />
            </div>

            {/* Actions */}
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
                {loading ? t('common.submitting', 'Submitting...') : t('review.submit', 'Publish Review')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReviewModal;
