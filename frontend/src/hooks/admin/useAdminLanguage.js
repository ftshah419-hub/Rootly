import { useTheme } from '../../context/ThemeContext.jsx';

export const translations = {
  en: {
    // Nav & Brand
    brandName: 'ROOTLY',
    brandSubtitle: 'Agronomy Admin Desk',
    navOperations: 'OPERATIONS',
    navOverview: 'Dashboard & Overview',
    navUsers: 'User & Grower Management',
    navProducts: 'Products & Harvest Listings',
    navExchanges: 'Barter & Exchange Logs',
    navHarvests: 'Harvest & Yield Planner',
    navReports: 'Moderation & Reports',
    navVerifications: 'Garden Verification Queue',
    navReviews: 'Reviews & Reputation',
    navSustainability: 'Sustainability Footprint',
    navAIUsage: 'AI Usage & Gemini Logs',
    navNotifications: 'Admin Notifications',
    navAuditLogs: 'System Audit Logs',
    navSettings: 'Analytics & Settings',
    secureNode: 'Secure Node v2.4',
    endSession: 'End Session',
    toggleTheme: 'Switch Theme',
    toggleLanguage: 'Language',

    // Common Buttons & Actions
    searchPlaceholder: 'Search by keyword, name, ID...',
    filter: 'Filter',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
    refresh: 'Refresh',
    actions: 'Actions',
    viewDetails: 'View Details',
    edit: 'Edit',
    save: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm Action',
    approve: 'Approve',
    reject: 'Reject',
    resolve: 'Resolve',
    dismiss: 'Dismiss',
    suspend: 'Suspend',
    activate: 'Activate',
    block: 'Block',
    delete: 'Delete',
    close: 'Close',
    loading: 'Loading data...',
    noDataFound: 'No records found',
    noDataDescription: 'There are currently no records matching this query in the database.',
    errorOccurred: 'An error occurred while communicating with the server.',
    retry: 'Retry',
    reasonRequired: 'Reason is required for this action:',
    reasonPlaceholder: 'Enter official administrative justification...',
    all: 'All',

    // Statuses
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
    BLOCKED: 'Blocked',
    DEACTIVATED: 'Deactivated',
    AVAILABLE: 'Available',
    RESERVED: 'Reserved',
    EXCHANGED: 'Exchanged',
    OUT_OF_STOCK: 'Out of Stock',
    PENDING: 'Pending',
    INVESTIGATING: 'Investigating',
    RESOLVED: 'Resolved',
    DISMISSED: 'Dismissed',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    SUCCESS: 'Success',
    ERROR: 'Error',
    RATE_LIMITED: 'Rate Limited',
    FALLBACK: 'Fallback',

    // Overview Page
    overviewTitle: 'Operations & Agronomy Oversight',
    overviewSubtitle: 'Real-time telemetry, urban produce transactions, and active node governance.',
    totalUsers: 'Total Users',
    activeUsers: 'Active Growers & Traders',
    totalProducts: 'Active Listings',
    completedExchanges: 'Completed Exchanges',
    pendingReports: 'Pending Moderation',
    pendingVerifications: 'Pending Verifications',
    foodWastePrevented: 'Food Waste Diverted',
    co2Saved: 'CO2e Averted',
    aiQueries: 'Gemini AI Invocations',
    recentActivity: 'Recent Administrative Activity',
    recentReportsFeed: 'Urgent Moderation Queue',
    monthlyTrends: 'Exchange & Harvest Volumes (6 Months)',

    // Users Page
    usersTitle: 'User & Grower Directory Management',
    usersSubtitle: 'Verify home gardens, monitor trust scores, inspect porch-box exchanges, and certify yields.',
    userName: 'User / Garden Name',
    contact: 'Contact Info',
    accountStatus: 'Account Status',
    role: 'Role',
    registeredOn: 'Registered',
    verificationBadge: 'Verification',

    // Products Page
    productsTitle: 'Produce & Harvest Listings Oversight',
    productsSubtitle: 'Inspect homegrown listings, manage categories, verify compliance, and audit harvest freshness.',
    productName: 'Produce & Variety',
    category: 'Category',
    exchangeType: 'Exchange Type',
    quantity: 'Available Yield',
    price: 'Price / Trade Item',
    seller: 'Grower',
    organicFlag: 'Organic Self-Declaration',

    // Exchanges Page
    exchangesTitle: 'Barter & Exchange Logs (Dispute Desk)',
    exchangesSubtitle: 'Audit neighbor-to-neighbor trades, monitor reciprocity ratios, and oversee trade disputes.',
    tradeId: 'Trade Reference',
    requester: 'Requester',
    offered: 'Offered In Return',
    exchangeStatus: 'Status',
    dateInitiated: 'Initiated On',

    // Reports Page
    reportsTitle: 'Moderation & Agronomy Reports Desk',
    reportsSubtitle: 'Investigate commercial reseller infringements, non-homegrown produce flags, and community disputes.',
    reportedParty: 'Reported Subject',
    reporter: 'Filed By',
    reportReason: 'Violation Category',
    reportDetails: 'Evidence & Particulars',
    resolutionNotes: 'Resolution Notes',

    // Verification Page
    verificationsTitle: 'Garden & Grower Verification Queue',
    verificationsSubtitle: 'Review terrace garden documentation, community vouches, and certify authentic urban micro-growers.',
    vouchCount: 'Vouches',
    evidencePhotos: 'Garden Documentation Photos',
    reviewNotes: 'Inspector Notes',

    // Reviews Page
    reviewsTitle: 'Community Reviews & Trust Desk',
    reviewsSubtitle: 'Monitor exchange feedback, produce freshness ratings, and neighbor punctuality assessments.',
    rating: 'Overall Rating',
    qualityRating: 'Produce Quality',
    punctuality: 'Punctuality',
    reviewComment: 'Feedback Comment',

    // Sustainability Page
    sustainabilityTitle: 'Sustainability & Carbon Averted Overview',
    sustainabilitySubtitle: 'Empirical environmental savings aggregated from verified completed zero-mile produce exchanges.',
    methodologyNote: 'Methodology Disclaimer',

    // AI Usage Page
    aiTitle: 'AI Usage & Gemini Intelligence Telemetry',
    aiSubtitle: 'Track produce recognition latency, listing generation token usage, and automated advisory requests.',
    feature: 'AI Feature',
    model: 'Gemini Model',
    latency: 'Latency (ms)',
    tokens: 'Tokens Consumed',

    // Audit Logs
    auditTitle: 'System Audit Logs & Security Trail',
    auditSubtitle: 'Immutable chronological ledger of all administrative interventions, status transitions, and config updates.',
    actor: 'Actor',
    actionExecuted: 'Action Executed',
    targetResource: 'Target Resource',
    timestamp: 'Timestamp',

    // Settings Page
    settingsTitle: 'Platform Settings & Agronomy Rules',
    settingsSubtitle: 'Configure operational parameters, fee structures, AI rate-limits, and agricultural exchange policies.'
  },

  ml: {
    // Nav & Brand
    brandName: 'റൂറ്റ്‌ലി',
    brandSubtitle: 'അഡ്മിൻ ഡെസ്ക്',
    navOperations: 'പ്രവർത്തനങ്ങൾ',
    navOverview: 'ഡാഷ്‌ബോർഡ് അവലോകനം',
    navUsers: 'ഉപയോക്തൃ പരിപാലനം',
    navProducts: 'ഉൽപ്പന്ന ലിസ്റ്റിംഗുകൾ',
    navExchanges: 'കൈമാറ്റ രേഖകൾ',
    navHarvests: 'വിളവെടുപ്പ് പ്ലാനർ',
    navReports: 'പരാതികളും റിപ്പോർട്ടുകളും',
    navVerifications: 'തോട്ടം പരിശോധന',
    navReviews: 'അവലോകനങ്ങൾ',
    navSustainability: 'പരിസ്ഥിതി സംരക്ഷണം',
    navAIUsage: 'AI ഉപയോഗ വിവരങ്ങൾ',
    navNotifications: 'അറിയിപ്പുകൾ',
    navAuditLogs: 'ഓഡിറ്റ് ലോഗുകൾ',
    navSettings: 'ക്രമീകരണങ്ങൾ',
    secureNode: 'സുരക്ഷിത നോഡ് v2.4',
    endSession: 'പുറത്തുകടക്കുക',
    toggleTheme: 'തീം മാറ്റുക',
    toggleLanguage: 'ഭാഷ',

    // Common Buttons & Actions
    searchPlaceholder: 'തിരയുക (പേര്, ഐഡി, വിവരങ്ങൾ)...',
    filter: 'ഫിൽട്ടർ',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കുക',
    applyFilters: 'ഫിൽട്ടർ ചെയ്യുക',
    refresh: 'പുതുക്കുക',
    actions: 'നടപടികൾ',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    edit: 'മാറ്റങ്ങൾ വരുത്തുക',
    save: 'സൂക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    confirm: 'ഉറപ്പാക്കുക',
    approve: 'അംഗീകരിക്കുക',
    reject: 'നിരസിക്കുക',
    resolve: 'പരിഹരിക്കുക',
    dismiss: 'തള്ളിക്കളയുക',
    suspend: 'താൽക്കാലികമായി നിർത്തുക',
    activate: 'സജീവമാക്കുക',
    block: 'തടയുക (ബ്ലോക്ക്)',
    delete: 'നീക്കം ചെയ്യുക',
    close: 'അടയ്ക്കുക',
    loading: 'വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...',
    noDataFound: 'വിവരങ്ങളൊന്നും ലഭ്യമല്ല',
    noDataDescription: 'ഡാറ്റാബേസിൽ വിവരങ്ങളൊന്നും കണ്ടെത്താനായില്ല.',
    errorOccurred: 'സെർവറുമായി ബന്ധപ്പെടുന്നതിൽ തകരാർ സംഭവിച്ചു.',
    retry: 'വീണ്ടും ശ്രമിക്കുക',
    reasonRequired: 'ഈ നടപടിക്കുള്ള കാരണം നൽകേണ്ടതാണ്:',
    reasonPlaceholder: 'കാരണം രേഖപ്പെടുത്തുക...',
    all: 'എല്ലാം',

    // Statuses
    ACTIVE: 'സജീവം',
    SUSPENDED: 'സസ്പെൻഡ് ചെയ്തത്',
    BLOCKED: 'തടയപ്പെട്ടത്',
    DEACTIVATED: 'നിർജ്ജീവമാക്കിയത്',
    AVAILABLE: 'ലഭ്യമാണ്',
    RESERVED: 'മാറ്റിവെച്ചത്',
    EXCHANGED: 'കൈമാറ്റം ചെയ്തത്',
    OUT_OF_STOCK: 'ലഭ്യമല്ല',
    PENDING: 'തീർപ്പാക്കാത്തത്',
    INVESTIGATING: 'അന്വേഷണത്തിൽ',
    RESOLVED: 'പരിഹരിച്ചത്',
    DISMISSED: 'തള്ളിയത്',
    SUBMITTED: 'സമർപ്പിച്ചത്',
    UNDER_REVIEW: 'പരിശോധനയിൽ',
    APPROVED: 'അംഗീകരിച്ചു',
    REJECTED: 'നിരസിച്ചു',
    SCHEDULED: 'ഷെഡ്യൂൾ ചെയ്തു',
    COMPLETED: 'പൂർത്തിയായി',
    CANCELLED: 'റദ്ദാക്കി',
    SUCCESS: 'വിജയകരം',
    ERROR: 'തകരാർ',
    RATE_LIMITED: 'പരിധി കവിഞ്ഞു',
    FALLBACK: 'ഫോൾബാക്ക്',

    // Overview Page
    overviewTitle: 'പ്രവർത്തന അവലോകനം',
    overviewSubtitle: 'തത്സമയ വിവരങ്ങൾ, പച്ചക്കറി കൈമാറ്റങ്ങൾ, അഡ്മിനിസ്ട്രേറ്റീവ് നിയന്ത്രണം.',
    totalUsers: 'ആകെ അംഗങ്ങൾ',
    activeUsers: 'സജീവ കർഷകർ',
    totalProducts: 'സജീവ ലിസ്റ്റിംഗുകൾ',
    completedExchanges: 'പൂർത്തിയായ കൈമാറ്റങ്ങൾ',
    pendingReports: 'പരിഹരിക്കാത്ത പരാതികൾ',
    pendingVerifications: 'പരിശോധിക്കാനുള്ള തോട്ടങ്ങൾ',
    foodWastePrevented: 'തടഞ്ഞ ഭക്ഷ്യ പാഴാക്കൽ',
    co2Saved: 'കുറച്ച കാർബൺ പുറന്തള്ളൽ',
    aiQueries: 'AI ഉപയോഗങ്ങൾ',
    recentActivity: 'സമീപകാല അഡ്മിൻ നടപടികൾ',
    recentReportsFeed: 'അടിയന്തര പരാതികൾ',
    monthlyTrends: 'മാസിക കൈമാറ്റ കണക്കുകൾ',

    // Users Page
    usersTitle: 'ഉപയോക്തൃ & കർഷക ഡയറക്ടറി',
    usersSubtitle: 'വീട്ടിലെ തോട്ടങ്ങൾ പരിശോധിക്കുക, വിശ്വാസ്യത വിലയിരുത്തുക, അക്കൗണ്ടുകൾ നിയന്ത്രിക്കുക.',
    userName: 'പേര് / തോട്ടത്തിന്റെ പേര്',
    contact: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ',
    accountStatus: 'അക്കൗണ്ട് അവസ്ഥ',
    role: 'റോൾ',
    registeredOn: 'രജിസ്റ്റർ ചെയ്ത തീയതി',
    verificationBadge: 'പരിശോധന',

    // Products Page
    productsTitle: 'വിളവുകളും ഉൽപ്പന്നങ്ങളും',
    productsSubtitle: 'നാടൻ ഉൽപ്പന്നങ്ങളുടെ ലിസ്റ്റിംഗുകൾ പരിശോധിക്കുക, ഗുണനിലവാരം ഉറപ്പാക്കുക.',
    productName: 'ഉൽപ്പന്നം / ഇനം',
    category: 'വിഭാഗം',
    exchangeType: 'കൈമാറ്റ രീതി',
    quantity: 'ലഭ്യമായ അളവ്',
    price: 'വില / കൈമാറ്റ ഇനം',
    seller: 'കർഷകൻ',
    organicFlag: 'ജൈവ ഉൽപ്പന്നം',

    // Exchanges Page
    exchangesTitle: 'കൈമാറ്റ രേഖകൾ',
    exchangesSubtitle: 'അയൽക്കാർ തമ്മിലുള്ള കൈമാറ്റങ്ങൾ നിരീക്ഷിക്കുക, തർക്കങ്ങൾ പരിഹരിക്കുക.',
    tradeId: 'കൈമാറ്റ ഐഡി',
    requester: 'ആവശ്യപ്പെട്ടയാൾ',
    offered: 'പകരമായി നൽകുന്നത്',
    exchangeStatus: 'അവസ്ഥ',
    dateInitiated: 'ആരംഭിച്ച തീയതി',

    // Reports Page
    reportsTitle: 'പരാതി പരിഹാര കേന്ദ്രം',
    reportsSubtitle: 'വ്യാജ വിൽപനക്കാർ, ചട്ടലംഘനങ്ങൾ എന്നിവയെക്കുറിച്ചുള്ള പരാതികൾ അന്വേഷിക്കുക.',
    reportedParty: 'പരാതിപ്പെട്ട വ്യക്തി/ഉൽപ്പന്നം',
    reporter: 'പരാതി നൽകിയയാൾ',
    reportReason: 'പരാതിയുടെ കാരണം',
    reportDetails: 'വിശദാംശങ്ങൾ',
    resolutionNotes: 'തീർപ്പ് വിവരങ്ങൾ',

    // Verification Page
    verificationsTitle: 'തോട്ടം പരിശോധനാ ക്യൂ',
    verificationsSubtitle: 'ടെറസ് ഗാർഡൻ ചിത്രങ്ങൾ, പരിശോധനകൾ എന്നിവ വഴി കർഷകരെ സാക്ഷ്യപ്പെടുത്തുക.',
    vouchCount: 'പിന്തുണകൾ',
    evidencePhotos: 'തോട്ടത്തിന്റെ ചിത്രങ്ങൾ',
    reviewNotes: 'പരിശോധനാ കുറിപ്പുകൾ',

    // Reviews Page
    reviewsTitle: 'റേറ്റിംഗുകളും അവലോകനങ്ങളും',
    reviewsSubtitle: 'കൈമാറ്റങ്ങളെക്കുറിച്ചുള്ള അഭിപ്രായങ്ങളും പച്ചക്കറിയുടെ ഗുണനിലവാരവും പരിശോധിക്കുക.',
    rating: 'മൊത്തത്തിലുള്ള റേറ്റിംഗ്',
    qualityRating: 'ഗുണനിലവാരം',
    punctuality: 'കൃത്യനിഷ്ഠ',
    reviewComment: 'അഭിപ്രായം',

    // Sustainability Page
    sustainabilityTitle: 'പരിസ്ഥിതി സംരക്ഷണ വിവരങ്ങൾ',
    sustainabilitySubtitle: 'പച്ചക്കറി കൈമാറ്റം വഴി ലാഭിച്ച മാലിന്യവും കാർബൺ കണക്കുകളും.',
    methodologyNote: 'കണക്കുകൂട്ടൽ രീതി',

    // AI Usage Page
    aiTitle: 'AI സാങ്കേതിക ഉപയോഗം',
    aiSubtitle: 'പച്ചക്കറി തിരിച്ചറിയൽ, വില നിർദ്ദേശം എന്നിവയിലെ AI ഉപയോഗ വിവരങ്ങൾ.',
    feature: 'സവിശേഷത',
    model: 'മോഡൽ',
    latency: 'താമസം (ms)',
    tokens: 'ടോക്കണുകൾ',

    // Audit Logs
    auditTitle: 'സിസ്റ്റം ഓഡിറ്റ് ലോഗുകൾ',
    auditSubtitle: 'നടന്ന എല്ലാ അഡ്മിനിസ്ട്രേറ്റീവ് പ്രവർത്തനങ്ങളുടെയും ഔദ്യോഗിക രേഖകൾ.',
    actor: 'നടപടി എടുത്തയാൾ',
    actionExecuted: 'നടപടി',
    targetResource: 'ലക്ഷ്യം',
    timestamp: 'സമയം',

    // Settings Page
    settingsTitle: 'സിസ്റ്റം ക്രമീകരണങ്ങൾ',
    settingsSubtitle: 'പ്ലാറ്റ്‌ഫോം നിയന്ത്രണങ്ങളും നയങ്ങളും ക്രമീകരിക്കുക.'
  }
};

export const useAdminLanguage = () => {
  const { language, setLanguage, toggleLanguage } = useTheme();

  const currentLang = language === 'ml' ? 'ml' : 'en';

  const t = (key, fallback = '') => {
    return translations[currentLang]?.[key] || translations.en[key] || fallback || key;
  };

  return {
    language: currentLang,
    setLanguage,
    toggleLanguage,
    t
  };
};

export default useAdminLanguage;
