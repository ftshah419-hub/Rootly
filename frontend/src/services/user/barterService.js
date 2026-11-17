import apiClient from '../../api/apiClient.js';

export const barterService = {
  /**
   * Find ranked direct barter matches for the user
   */
  async getBarterMatches() {
    try {
      const response = await apiClient.get('/user/barter/matches');
      return response.data?.matches || response.data || [];
    } catch (error) {
      console.warn('barterService.getBarterMatches warning:', error.message);
      return [];
    }
  },

  /**
   * Get user's saved barter preferences
   */
  async getBarterPreferences() {
    try {
      const response = await apiClient.get('/user/barter/preferences');
      return response.data?.preferences || response.data || null;
    } catch (error) {
      console.warn('barterService.getBarterPreferences warning:', error.message);
      return null;
    }
  },

  /**
   * Save or update barter preferences (what grower has in surplus vs desires in return)
   */
  async saveBarterPreferences(preferencesData) {
    const response = await apiClient.post('/user/barter/preferences', preferencesData);
    return response.data?.preferences || response.data;
  },

  /**
   * Calculate fair parity ratio via heuristic Kerala agro-yield values
   */
  calculateParityRatio(offeredCrop = 'Tapioca', desiredCrop = 'Country Eggs', offeredQty = 1, desiredQty = 1) {
    const cropWeights = {
      'tapioca': 35,
      'country eggs': 10,
      'eggs': 10,
      'nendran bananas': 60,
      'bananas': 45,
      'green chilies': 90,
      'curry leaves': 120,
      'coconuts': 40,
      'moringa': 70,
      'drumsticks': 70,
      'tomatoes': 45,
      'organic tomatoes': 55,
      'ginger': 140,
      'backyard ginger': 150,
      'lemongrass': 80,
      'honey': 400,
      'wild honey': 450,
      'spinach': 30,
      'red amaranth': 35
    };

    const getVal = (name) => {
      const lower = String(name || '').toLowerCase();
      for (const [k, v] of Object.entries(cropWeights)) {
        if (lower.includes(k)) return v;
      }
      return 50; // generic default
    };

    const valOffered = getVal(offeredCrop) * (Number(offeredQty) || 1);
    const valDesired = getVal(desiredCrop) * (Number(desiredQty) || 1);
    const ratioVal = valDesired > 0 ? (valOffered / valDesired).toFixed(2) : '1.0';

    let fairness = 'Fair Community Swap';
    if (ratioVal >= 1.25) {
      fairness = 'Generous Offer from your Garden';
    } else if (ratioVal <= 0.8) {
      fairness = 'Slight surplus deficit. Consider adding a small herb bundle.';
    }

    const recommendedQty = Math.max(0.5, Math.round((valOffered / getVal(desiredCrop)) * 2) / 2);

    return {
      ratio: `1 : ${ratioVal}`,
      fairness,
      recommendedQty
    };
  },

  /**
   * Calculate fair parity ratio via AI / market rate benchmark
   */
  async calculateParity(surplusCrop, quantity, desiredCrop) {
    try {
      const response = await apiClient.post('/user/barter/calculate-ratio', {
        surplusCrop,
        quantity,
        desiredCrop
      });
      return response.data;
    } catch (error) {
      // Fallback heuristic calculator for UI guidance if backend route is unavailable
      const qty = parseFloat(quantity) || 1.0;
      let ratioText = `${qty} kg ${surplusCrop} ⇄ Fair equivalent of ${desiredCrop}`;
      if (desiredCrop.toLowerCase().includes('egg')) {
        const eggs = Math.round(qty * 3.5);
        ratioText = `${qty} kg ${surplusCrop} ⇄ ${eggs} to ${eggs + 2} Fresh Backyard Eggs`;
      } else if (desiredCrop.toLowerCase().includes('honey')) {
        const ml = Math.round(qty * 140);
        ratioText = `${qty} kg ${surplusCrop} ⇄ ~${ml} ml Pure Unprocessed Honey`;
      } else if (desiredCrop.toLowerCase().includes('moringa')) {
        const kg = (qty * 0.7).toFixed(1);
        ratioText = `${qty} kg ${surplusCrop} ⇄ ~${kg} kg Fresh Moringa Pods`;
      }
      return {
        ratioText,
        compatibilityScore: 95,
        parityBasis: 'Heuristic local market nutrition and density benchmark'
      };
    }
  }
};

export default barterService;
