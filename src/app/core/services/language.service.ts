import { Injectable, signal, computed } from '@angular/core';

export interface Language {
  code: string;
  label: string;
  flagSvg: string;
}
interface LegalSection {
  heading: string;
  content: string;
}
export interface Translations {
  
  nav: { home: string; declareLost: string; declareBrowse: string; about: string; dashboard: string; login: string; register: string; logout: string };

  home: {
    badge: string; heroTitle: string; foundBadge: string;
    foundOn: string; heroHighlight: string; heroSub: string; ctaDeclare: string; ctaBrowse: string;
    recentTitle: string; recentSub: string;
    homeTitle: string; homeSub: string; loadMore: string; viewDetails: string;
    whyChoose: string
    slogan: string ; 
    countriesDescription: string;
    countriesLabel: string;
    usersDescription: string;
    usersLabel: string;
    publicationsDescription: string;
    publicationsLabel: string;
    restorationsDescription: string;
    restorationsLabel: string;
  };

  documents: {
    title: string; total: string; newDeclaration: string;
    filterType: string; filterAll: string; filterLost: string; filterFound: string;
    loadMore: string; deleteConfirmTitle: string; deleteConfirmText: string;
    deleteBtn: string; cancelBtn: string; noDocumentsTitle: string;
    noDocumentsText: string; firstDeclaration: string;
    loading: string;
    see:string;
    enabled:string;
    disabled:string;
    deleted:string;
    seeMore:string;
    noQrTitle:string;
    noQrMessage:string;
    createFirstQr:string;
    restore:string;
    details:string;
    chat:string;
    emptyRestoration:string;
    emptyMessage:string;
    qrModalTitle:string;
    qrModalMessage:string;
    modalDetailR:string;
    modalDetailStatut:string;
    modalDetailRestoreTitle:string;
    modalInformation:string;
    modalActionOpenChat:string;
    rejectDetails: string;
    qrCodeTitle: string;
    restorationTitle: string;
    close:string;
    place:string;
    category:string;
    confirmedRestored:string;
    rejectedRestored:string;
    confirmRestorationTitle: string;
    rejectRestorationTitle: string;
    confirmRestorationDescription: string;
    rejectRestorationDescription: string;
    rejected:              string;
    viewRejectReason:      string;
    rejectModalTitle:      string;
    rejectReasonLabel:     string;
    rejectDescriptionLabel:string;
    rejectNoDetails:       string;
  };

  dashboard: {
    gains: string; 
    expenses: string; 
    restored: string; 
    declared: string;
    balance: string; 
    evolutionFinancial: string; 
    evolutionMonthly: string;
    evolutionYearly: string; 
    viewMonthly: string; 
    viewYearly: string;
    currentYear: string; 
    soldeActuel: string; 
    soldeDisponible: string;
    historyRecent: string; 
    noTransactions: string;
    matched: string;
    totalItems: string;
  };

  auth: {
    welcomeBack: string; loginSub: string; email: string; password: string;
    country: string; forgotPassword: string; rememberDevice: string; signIn: string;
    noAccount: string; registerLink: string; createAccount: string; registerSub: string;
    full_name: string; phone: string; password_confirmation: string;
    acceptTerms: string; terms: string; privacy: string; createBtn: string;
    alreadyAccount: string; signInLink: string; username: string;
    identifierLabel:string; identifierPlaceholder:string; identifierHint:string;
    loginIdentifierRequired:string;passwordRequired:string; passwordMin:string;
    loginSuccess:string; invalidCredentials:string;emailNotVerified:string;
    accountInactive:string;tooManyAttempts:string; serverError:string; recaptchaError:string;
    signingIn:string;
    successOtpMsg:string;
  };

  declare: {
    modeLost: string; modeFound: string;
    titleLost: string; titleFound: string;
    subtitleLost: string; subtitleFound: string;
    dateFound: string; foundLocation: string; descriptionFoundPlaceholder: string;
    documentType: string; documentTypePlaceholder: string;
    passport: string; nationalId: string; driversLicense: string; birthCertificate: string;
    nameOnDocument: string; nameOnDocumentPlaceholder: string;
    documentNumber: string; documentNumberPlaceholder: string;
    dateLost: string; lastKnownLocation: string; lastKnownLocationPlaceholder: string;
    description: string; descriptionPlaceholder: string;
    photos: string; photosHint: string; photosFormat: string; photosMax: string; addMorePhotos: string;
    submit: string; errorRequired: string; errorMin: string;

    successMessage: string; errorGeneral: string; error403: string; error422: string;
    errorCategoryNotFound: string; errorSubCategories: string; errorCategories: string;
    errorFileTooLarge: string; errorFileType: string;
    // Status labels
    statusDraft: string; statusActive: string; statusMatched: string;
    statusReturned: string; statusArchived: string;
    errorNoFiles: string;
  };

  restore: {
    title: string; stepPayment: string; stepRestore: string;
    previewTitle: string; previewRestricted: string; previewLockedTitle: string; previewLockedSub: string;
    termsTitle: string; termsSubtitle: string;
    term1Title: string; term1Sub: string;
    term2Title: string; term2Sub: string;
    term3Title: string; term3Sub: string;
    termsProgress: string; termsAllDone: string;
    checkoutTitle: string; feeLabel: string; storageLabel: string; totalLabel: string;
    operatorLabel: string; phoneLabel: string; pushInfo: string;
    payBtn: string; payLocked: string; payProcessing: string; payHint: string;
    badgeSecure: string; badgeEncrypted: string;
    errorOperator: string; errorPhone: string;
    reduceTxt:string; emptyOperator:string;
    paymentAccepted: string;
    paymentConfirmed: string;
    paymentFailed: string;
    paymentRejected: string;
    verificationInProgress: string;
    paymentDisable: string;
    ownerCanPay: string;
    ownerAmount: string;
    ownerPhoneInformation: string;
    modalNotification: string;
    modalPayTitle: string;
    modalPayText: string;
    modalAwatingConfirmation: string;
    modalUserApproveModalInformation: string;
    NotFoundDocument:string;
    confirmDocumentTitle: string;
    confirmDocumentDescription: string;
    confirmDocumentDescriptionNext: string;
    confirmDocumentBtnLbl: string;
    rejetctDocumentBtnLbl: string;
    warningDocumentBtn: string;
    confirmRestoreTitle: string;
    confirmRestoreDescription: string;
    rejectModalTitle:     string;
    rejectModalMessage:     string;
    rejectModalRefundInfo:  string;
    rejectModalSearchBtn:   string;
    rejectModalDocumentsBtn:string;
  };

  sidebar: {
    dashboard: string; declareLost: string; declareBrowse: string;
    chat: string; documents: string; history: string; settings: string; secureEntity: string;
  };

  secure_object: {
    title: string; subtitle: string; yourInfo: string;
    name: string; email: string; phone: string;
    objectInfo: string; label: string; description: string;
    generating: string; submit: string; help: string;
  };

  search: {
    title: string; heroTitle: string; heroHighlight: string; heroSub: string;
    placeholder: string; searchBtn: string; filtersLabel: string;
    filterAll: string; filterCni: string; filterPassport: string;
    filterBirth: string; filterLicense: string; filterOther: string;
    resultsTitle: string; resultsCount: string; sortBy: string;
    sortDate: string; sortRelevance: string; sortLocation: string;
    foundBadge: string; lostBadge: string; foundOn: string;
    viewDetails: string; loadMore: string; emptyTitle: string; emptySub: string;
  };

  about: {
    title: string; priceTile: string; priceDescription: string;
    chooseCountry: string; loadingMessage: string; loadingErrorMessage: string;
    EmptyPrice: string; descriptionEmptyPrice: string;
    selectCountry: string; selectCountryDescription: string;
  };

  settings: {
    title: string; subtitle: string;
    profileTitle: string; profileSub: string;
    full_name: string; full_namePlaceholder: string;
    username: string; usernamePlaceholder: string;
    email: string; emailReadOnly: string; emailReadOnlyAria: string; emailReadOnlyHint: string;
    phone: string; saveProfile: string; saving: string;
    passwordTitle: string; passwordSub: string;
    currentPassword: string; newPassword: string; password_confirmation: string;
    newPasswordSection: string; passwordMatch: string; savePassword: string;
    prefsTitle: string; prefsSub: string;
    emailNotifTitle: string; emailNotifSub: string;
    twoFATitle: string; twoFASub: string;
    dangerTitle: string; dangerSub: string; dangerBtn: string;
    dangerConfirm: string; dangerConfirmYes: string; dangerConfirmNo: string;
    errorRequired: string; errorUsernamePattern: string; errorUsernameMin: string;
    errorPhonePattern: string; errorPasswordMin: string; errorPasswordMismatch: string;
    togglePasswordVisibility: string;
    language: string;
  };

  footer: {
     rights: string 
     description : string;
     download_on: string;
     get_on: string;
    };

  scanQr: {
    title: string; qrFoundTitle: string; qrReference: string; qrLabel: string;
    declareFound: string; exploreLost: string;
    loginPrompt: string; registerPrompt: string; loginBtn: string; registerBtn: string;
    loading: string; invalidQrTitle: string; invalidQrText: string; backHome: string;
  };

  chat: { 
    title: string;
    selectConversation: string;
    selectConversationSub: string;
    noConversation: string;
    noConversationSub: string;
    searchPlaceholder: string;
    filterAll: string;
    filterOpen: string;
    filterActive: string;
    filterArchived: string;
    typePlaceholder: string;
    send: string;
    sending: string;
    archivedNotice: string;
    noMessages: string;
    statusOpen: string;
    statusActive: string;
    statusArchived: string;
    statusCompleted: string;
    attachFile: string;
    attachmentPreview: string;
    downloadAttachment: string;
    closePreview: string;
    handoverGenerateBtn: string;
    handoverRegenerateBtn: string;
    handoverCodeLabel: string;
    handoverCodeExpired: string;
    handoverConfirmedBadge: string;
    handoverInitiateTooltip: string;
    handoverRegenerateTooltip: string;
    handoverEnterCodeBtn: string;
    handoverEnterCodeTooltip: string;
    loserConfirmTitle: string;
    loserConfirmBtn: string;
    otpModalTitle: string;
    otpModalSubtitle: string;
    otpConfirmBtn: string;
    otpValidating: string;
    otpErrorInvalid: string;
    otpClose: string;
    handoverSystemInitiated: string;
    handoverSystemConfirmed: string;
    handoverSystemComplete: string;
    itemInfoTitle: string;
    paymentStatus: string;
    paymentPaid: string;
    paymentReleased: string;
    finderInfoTitle: string;
    finderStep1: string;
    finderStep2: string;
    finderStep3: string;
    finderStep4: string;
    sendError: string;
    handoverInitError: string;
    handoverConfirmError: string;

    welcomeTitle: string;
    welcomeSubtitle: string;

    conversationTitle: string;
    conversationDescription: string;

    publicPlaceTitle: string;
    publicPlaceDescription: string;

    noMoneyTitle: string;
    noMoneyDescription: string;

    codeTitle: string;
    codeDescription: string;

    footerMessage: string;

    finderWelcomeTitle: string;
    finderWelcomeSubtitle: string;

    finderConversationTitle: string;
    finderConversationDescription: string;

    finderPublicPlaceTitle: string;
    finderPublicPlaceDescription: string;

    finderCodeTitle: string;
    finderCodeDescription: string;

    finderFooterMessage: string;

    restorationSuccessTitle:  string;
    restorationSuccessMessage: string;
    restorationSuccessThanks:  string;
    restorationSuccessHomeBtn: string;
    restorationSuccessStayBtn: string;
    
  };

  legal: {
    title: string; subtitle: string; lastUpdated: string;
    sections: LegalSection[];
  };

  privacyPolicy: {
    title: string; subtitle: string; lastUpdated: string;
    sections: LegalSection[];
  };

  dataProcessing: {
    title: string; subtitle: string;
    intro: string;
    checkboxLabel: string;
    acceptBtn: string;
    declineBtn: string;
    alreadyAccepted: string;
    viewTerms: string;
    viewPrivacy: string;
    modal: {
      title: string;
      body: string;
      confirm: string;
      cancel: string;
    };
    badge: string;
  };

  dpa: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    sections: LegalSection[];
  };

  error: {
    E_429: string;
    E_401:string;
    E_403:string;
    E_404:string;
    E_500: string;
    E_400: string;
    E_validation:string;
    E_network:string;
    E_inscription: string;
    E_cgu: string;
    E_mdp: string;
    E_phone: string;
    E_email: string;
    E_recaptcha: string;
  },
  tutorials: {
    sectionLabel: string;
    sectionTitle:  string;
    sectionSub: string;
    playlistLabel: string;
    seeChannel: string;
    videoCount: string;
    watchVideo:  string;
    noVideos: string;
    pricingLabel:  string;
    pricingFor:  string;
    services:  string;
    toPay:  string;
    toReceive:  string;
    legendPayer:  string;
    legendFinder:  string;
    retry:  string;
    close:  string;
    prev:  string;
    next: string,
  }
}

const T: Record<string, Translations> = {

  // ══════════════════════════════════════════════════════════════════════
  // FRANÇAIS
  // ══════════════════════════════════════════════════════════════════════
  fr: {
    nav: {
      home: 'Accueil',
      declareLost: 'Publier un document trouvé',
      declareBrowse: 'Publier une trouvaille',
      dashboard: 'Tableau de bord',
      about: 'À propos',
      login: 'Connexion',
      logout: 'Déconnexion',
      register: "S'inscrire",
    },

    home: {
      badge: 'Récupération fiable des documents',
      heroTitle: 'Retrouvez vos ',
      heroHighlight: 'Documents Perdus',
      heroSub: 'Rejoignez notre réseau sécurisé pour retrouver vos CNI, passeports, diplômes et bien plus encore.',
      ctaDeclare: 'Publier une trouvaille',
      ctaBrowse: 'Comment Ça Marche ?',
      homeTitle: 'Publications trouvées',
      homeSub: 'Flux des documents signalés',
      recentTitle: 'Récemment trouvés',
      recentSub: 'Flux en direct des documents signalés dans les 24 dernières heures',
      loadMore: 'Charger plus',
      viewDetails: 'Voir les détails',
      foundBadge: 'Trouvé',
      foundOn: 'Trouvé le',
      whyChoose: "Pourquoi choisir",
      slogan: "« Rien ne se perd, tout se restore »",

      countriesDescription: "Grande communauté internationale",
      countriesLabel: "Total pays",

      usersDescription: "Communauté active et grandissante",
      usersLabel: "Nos utilisateurs",

      publicationsDescription: "Publications toutes les heures à travers le monde",
      publicationsLabel: "Nos publications",

      restorationsDescription: "Documents et objets restaurés en temps réel",
      restorationsLabel: "Nos restaurations"
    },

    documents: {
      title: 'Mes documents actifs',
      total: 'document(s)',
      newDeclaration: 'Nouvelle publication',
      filterType: 'Filtrer par type :',
      filterAll: 'Tous',
      filterLost: 'Perdu',
      filterFound: 'Trouvé',
      loadMore: 'Voir plus de documents',
      deleteConfirmTitle: 'Confirmer la suppression',
      deleteConfirmText: 'Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.',
      deleteBtn: 'Supprimer',
      cancelBtn: 'Annuler',
      noDocumentsTitle: 'Aucun document',
      noDocumentsText: 'Commencez par déclarer votre premier document perdu ou trouvé.',
      firstDeclaration: 'Publier mon premier document',
      loading : 'Chargement…',
      see: 'Voir',
      enabled: 'Actif',
      disabled: 'Inactif',
      deleted: 'Supprimer',
      seeMore: ' Charger plus',
      noQrTitle: 'Aucun QR Code',
      noQrMessage: ' Vous n\'avez pas encore créé de QR Code. Créez-en un pour l\'associer à vos objets précieux.',
      createFirstQr: 'Créer mon premier QR Code',
      restore: 'Restauré',
      details : 'Détails' ,
      chat: 'Chat',
      emptyRestoration: ' Aucune restauration',
      emptyMessage: 'Vous n\'avez pas encore récupéré d\'objets. Faites une déclaration pour commencer.',
      qrModalTitle: 'QR Code complet',
      qrModalMessage: '  Utilisez ce QR code pour l\'associer à votre objet.',
      modalDetailR : 'Référence',
      modalDetailStatut: 'Statut',
      modalDetailRestoreTitle: 'Objet restauré',
      modalInformation: 'Informations',
      modalActionOpenChat: 'Ouvrir le chat',
      close: 'Fermer',
      place: 'Lieu',
      category: 'Catégorie',
      rejectDetails: "Détails du rejet",
      qrCodeTitle: "Mes QR codes",
      restorationTitle: "Mes restaurations",
      confirmedRestored: "Restauration confirmée",
      rejectedRestored: "Restauration rejetée",
      confirmRestorationTitle: "Confirmer la restauration",
      rejectRestorationTitle: "Rejeter la restauration",
      confirmRestorationDescription: "Confirmez que la restauration est correcte. Une finalisation sera effectuée.",
      rejectRestorationDescription: "Confirmez le rejet. Un remboursement sera lancé.",
      rejected:              'Rejeté',
      viewRejectReason:      'Voir le motif de rejet',
      rejectModalTitle:      'Déclaration rejetée',
      rejectReasonLabel:     'Motif du rejet',
      rejectDescriptionLabel:'Détails',
      rejectNoDetails:       'Aucun détail disponible. Contactez le support.',
    },

    dashboard: {
      gains: 'Gains',
      expenses: 'Dépenses',
      restored: 'Restaurés',
      declared: 'Déclarés',
      balance: 'Solde actuel',
      evolutionFinancial: 'Évolution financière',
      evolutionMonthly: 'Évolution mensuelle',
      evolutionYearly: 'Répartition annuelle',
      viewMonthly: 'Mensuel',
      viewYearly: 'Annuel',
      currentYear: '{{ selectedYear() }}',
      soldeActuel: 'Solde actuel',
      soldeDisponible: 'Solde disponible',
      historyRecent: 'Historique récent',
      noTransactions: 'Aucune transaction cette année',
      matched: "Match",
      totalItems: "Total des items",
    },

    auth: {
      welcomeBack: 'Bienvenue',
      username: "Nom d'utilisateur",
      country: 'Pays',
      loginSub: 'Entrez vos identifiants pour accéder à vos documents.',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      rememberDevice: 'Se souvenir de cet appareil',
      signIn: 'Se connecter',
      noAccount: 'Pas encore de compte ?',
      registerLink: 'Créer un compte',
      createAccount: 'Créer un compte sécurisé',
      registerSub: 'Commencez à récupérer vos documents critiques en quelques minutes.',
      full_name: 'Nom complet',
      phone: 'Numéro de téléphone',
      password_confirmation: 'Confirmer le mot de passe',
      acceptTerms: "J'accepte les ",
      terms: "Conditions d'utilisation",
      privacy: 'Politique de confidentialité',
      createBtn: 'Créer mon compte',
      alreadyAccount: 'Déjà un compte ?',
      signInLink: 'Se connecter',
      identifierLabel:         "Identifiant",
      identifierPlaceholder:   "Email, nom d'utilisateur ou téléphone",
      identifierHint:          "Connectez-vous avec votre email, votre nom d'utilisateur ou votre numéro de téléphone (ex : 237690000000).",
      loginIdentifierRequired: "Veuillez saisir votre email, nom d'utilisateur ou téléphone.",
      passwordRequired:        "Le mot de passe est obligatoire.",
      passwordMin:             "Le mot de passe doit contenir au moins 8 caractères.",
      loginSuccess:            "Connexion réussie ! Bienvenue.",
      invalidCredentials:      "Identifiant ou mot de passe incorrect.",
      emailNotVerified:        "Votre email n'est pas vérifié. Consultez votre boîte mail.",
      accountInactive:         "Votre compte est désactivé. Contactez le support.",
      tooManyAttempts:         "Trop de tentatives. Réessayez dans quelques minutes.",
      serverError:             "Une erreur est survenue. Réessayez plus tard.",
      recaptchaError:          "Erreur de sécurité. Veuillez réessayer.",
      signingIn:               "Connexion en cours…",
      successOtpMsg:"Compte créé ! Vérifiez votre email pour l'OTP.",
    },

    declare: {
      modeLost: 'Déclaration de perte',
      modeFound: "Publication d'un document trouvé",
      titleLost: 'Déclarer un document perdu',
      titleFound: 'Publier un document trouvé',
      subtitleLost: "Portail officiel de signalement de pièces d'identité perdues.",
      subtitleFound: "Publiez un document trouvé pour aider son propriétaire à le récupérer.",
      documentType: 'Type de document',
      documentTypePlaceholder: 'Sélectionnez un type',
      passport: 'Passeport international',
      nationalId: "Carte nationale d'identité",
      driversLicense: 'Permis de conduire',
      birthCertificate: 'Acte de naissance',
      nameOnDocument: 'Nom sur le document',
      nameOnDocumentPlaceholder: "Nom complet tel qu'il apparaît",
      documentNumber: 'Numéro du document',
      documentNumberPlaceholder: 'ex. A12345678',
      dateLost: 'Date de perte',
      dateFound: 'Date de découverte',
      lastKnownLocation: 'Dernier lieu connu',
      foundLocation: 'Lieu où il a été trouvé',
      lastKnownLocationPlaceholder: 'Ville, rue ou lieu-dit',
      description: 'Description détaillée',
      descriptionPlaceholder: 'Décrivez le document (optionnel)',
      descriptionFoundPlaceholder: "Décrivez le document à travers diverses informations qui pourraient y figurer afin de faciliter la recherche.",
      photos: 'Photos du document',
      photosHint: 'Cliquez ou glissez-déposez vos fichiers ici',
      photosFormat: "PNG, JPG jusqu'à 5 Mo chacun",
      photosMax: '3 fichiers maximum',
      addMorePhotos: 'Ajouter des photos',
      submit: 'Soumettre la publication',
      errorRequired: 'Ce champ est requis.',
      errorMin: 'Valeur trop courte.',
      successMessage: 'Déclaration soumise avec succès ! Vous recevrez un email de confirmation.',
      errorGeneral: 'Erreur lors de la soumission. Veuillez réessayer.',
      error403: 'Vous devez être connecté pour soumettre une déclaration.',
      error422: 'Vérifiez les champs en erreur et réessayez.',
      errorCategoryNotFound: 'Catégorie "Document" introuvable. Contactez le support.',
      errorSubCategories: 'Impossible de charger les types de documents. Réessayez.',
      errorCategories: 'Impossible de charger les catégories. Réessayez.',
      errorFileTooLarge: 'dépasse 5 Mo et a été ignoré.',
      errorFileType: 'Format non accepté. Utilisez JPG ou PNG.',
      statusDraft: 'En cours de vérification',
      statusActive: 'Actif',
      statusMatched: 'En cours de restitution',
      statusReturned: 'Restitué',
      statusArchived: 'Archivé',
      errorNoFiles: 'Veuillez ajouter au moins une photo du document.',
      
    },

    restore: {
      title: 'Finaliser votre restauration',
      stepPayment: 'Confirmation & paiement',
      stepRestore: 'Restauration',
      previewTitle: 'Aperçu de la restauration',
      previewRestricted: 'Accès restreint',
      previewLockedTitle: 'Aperçu verrouillé',
      previewLockedSub: 'Finalisez le paiement pour débloquer la version restaurée.',
      termsTitle: 'Conditions & politique de restauration',
      termsSubtitle: 'Cochez les 3 cases pour activer le paiement.',
      term1Title: 'Garantie de clarté améliorée',
      term1Sub: 'Rassurer vous du matching de vos donnees avant payement',
      term2Title: 'Paiement unique',
      term2Sub: 'Remboursement sous 24h en cas d\'erreur.',
      term3Title: "J'accepte l'accord de traitement des données",
      term3Sub: '',
      termsProgress: 'Cochez les 3 cases pour activer le paiement',
      termsAllDone: '✓ Toutes les conditions acceptées — paiement activé',
      checkoutTitle: 'Paiement mobile sécurisé',
      feeLabel: 'Frais de restauration',
      storageLabel: 'Stockage cloud (24h)',
      totalLabel: 'Montant total',
      operatorLabel: 'Opérateur mobile',
      phoneLabel: 'Numéro Mobile Money',
      pushInfo: 'Une notification push sera envoyée sur votre téléphone pour confirmer le paiement.',
      payBtn: 'Payer & lancer la restauration',
      payLocked: 'Acceptez toutes les conditions',
      payProcessing: 'Traitement en cours…',
      payHint: 'Cochez les 3 conditions ci-contre pour activer le bouton',
      badgeSecure: 'Paiement sécurisé',
      badgeEncrypted: 'Données chiffrées',
      errorOperator: 'Veuillez sélectionner un opérateur.',
      errorPhone: 'Numéro de téléphone invalide.',
      reduceTxt: 'Réduction',
      emptyOperator : 'Aucun opérateur disponible pour ce pays.',
      paymentAccepted: "En attente de confirmation... Paiement initié avec succès. Confirmez sur votre téléphone",
      paymentConfirmed: "Paiement confirmé !",
      paymentFailed: "Paiement échoué",
      paymentRejected: "Paiement rejeté",
      verificationInProgress: "Vérification en cours...",
      paymentDisable: "Paiement désactivé",
      ownerCanPay: "Vous ne pouvez pas effectuer de paiement sur vos propres documents.",
      ownerAmount: "Votre montant du paiement après restauration.",
      ownerPhoneInformation: "Le paiement est sur ce numéro après la restauration du document.",
      modalNotification: "Notifications",
      modalPayTitle: "Confirmez le paiement",
      modalPayText: "Une demande a été envoyée depuis",
      modalAwatingConfirmation: "En attente de confirmation...",
      modalUserApproveModalInformation: "Vous devriez recevoir une notification sur votre téléphone pour confirmer le paiement.",
      NotFoundDocument:'Aucun document trouvé pour la restauration. Veuillez vérifier les détails de votre déclaration ou contacter le support.',
      confirmDocumentTitle: " Ce document vous appartient-il ?",
      confirmDocumentDescription: " Votre paiement a été confirmé.  Vérifiez que le document affiché est bien le vôtre avant de valider.",
      confirmDocumentDescriptionNext: "Cette action est irréversible.",
      confirmDocumentBtnLbl: "Oui, c'est mon document",
      rejetctDocumentBtnLbl: "Non ce n'est pas le mien",
      warningDocumentBtn: "En cas de refus, un remboursement sera automatiquement initié.",
      confirmRestoreTitle: "Restauration confirmée",
      confirmRestoreDescription: "  Le processus de remise est lancé. Vous allez recevoir un email de confirmation.",
      rejectModalTitle:       'Document rejeté',
      rejectModalMessage:     'Vous avez signalé que ce document ne vous appartient pas. Merci pour votre honnêteté.',
      rejectModalRefundInfo:  'Un remboursement a été initié. Le montant sera restitué sous 24 à 48 heures selon votre opérateur Mobile Money.',
      rejectModalSearchBtn:   'Rechercher un autre document',
      rejectModalDocumentsBtn:'Mes documents',
    },

    footer: { 
      rights: 'Tous droits réservés.',
      description: "Retrouvez facilement vos objets perdus grâce à une plateforme moderne, rapide et sécurisée qui met en relation les propriétaires et les personnes ayant retrouvé les objets.",
      download_on: "Télécharger sur",
      get_on: "Disponible sur"
    },

    sidebar: {
      dashboard: 'Tableau de bord',
      declareLost: 'Publier une perte',
      declareBrowse: 'Publier une trouvaille',
      chat: 'Messagerie',
      documents: 'Mes documents',
      history: 'Historique',
      settings: 'Paramètres',
      secureEntity: 'Sécuriser un objet',
    },

    secure_object: {
      title: 'Sécuriser vos objets',
      subtitle: 'Générez un QR Code unique avec vos informations',
      yourInfo: 'Vos informations',
      name: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      objectInfo: 'Informations sur l\'objet',
      label: 'Libellé de l\'objet',
      description: 'Description',
      generating: 'Génération en cours…',
      submit: 'Générer le QR Code',
      help: 'Le QR Code sera stocké de manière sécurisée et lié à votre compte.',
    },

    search: {
      title: 'Recherche',
      heroTitle: 'Rechercher un ',
      heroHighlight: 'Document',
      heroSub: "Parcourez la base de données mondiale des pièces d'identité et documents légaux retrouvés.",
      placeholder: 'Rechercher par nom, numéro , lieu…',
      searchBtn: 'Rechercher',
      filtersLabel: 'Filtrer par catégorie',
      filterAll: 'Tous',
      filterCni: 'CNI',
      filterPassport: 'Passeport',
      filterBirth: 'Acte de naissance',
      filterLicense: 'Permis de conduire',
      filterOther: 'Autre',
      resultsTitle: 'Documents retrouvés',
      resultsCount: 'résultats',
      sortBy: 'Trier par :',
      sortDate: 'Date de découverte',
      sortRelevance: 'Pertinence',
      sortLocation: 'Lieu',
      foundBadge: 'Trouvé',
      lostBadge: 'Perdu',
      foundOn: 'Trouvé le',
      viewDetails: 'Voir les détails',
      loadMore: 'Charger plus de documents',
      emptyTitle: 'Aucun résultat trouvé',
      emptySub: "Essayez avec d'autres termes ou modifiez le filtre de catégorie.",
    },

    settings: {
      title: 'Paramètres du compte',
      language: 'Langue',
      subtitle: 'Gérez vos informations personnelles, sécurisez votre compte et configurez vos préférences.',
      profileTitle: 'Informations du profil',
      profileSub: 'Mettez à jour votre identité publique et vos coordonnées.',
      full_name: 'Nom complet',
      full_namePlaceholder: 'Jean Dupont',
      username: "Nom d'utilisateur",
      usernamePlaceholder: 'mon_pseudo',
      email: 'Adresse e-mail',
      emailReadOnly: 'Non modifiable',
      emailReadOnlyAria: 'E-mail — champ en lecture seule',
      emailReadOnlyHint: 'Contactez le support pour modifier votre adresse e-mail.',
      phone: 'Numéro de téléphone',
      saveProfile: 'Enregistrer le profil',
      saving: 'Enregistrement…',
      passwordTitle: 'Modifier le mot de passe',
      passwordSub: "Choisissez un mot de passe fort d'au moins 8 caractères.",
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      password_confirmation: 'Confirmer le nouveau mot de passe',
      newPasswordSection: 'Nouveau mot de passe',
      passwordMatch: 'Les mots de passe correspondent',
      savePassword: 'Changer le mot de passe',
      prefsTitle: 'Préférences',
      prefsSub: 'Configurez vos notifications et la sécurité de votre compte.',
      emailNotifTitle: 'Notifications par e-mail',
      emailNotifSub: "Recevez les résumés de récupération et les alertes d'archivage.",
      twoFATitle: 'Authentification à deux facteurs',
      twoFASub: 'Ajoutez une couche de sécurité supplémentaire à votre compte.',
      dangerTitle: 'Désactiver le compte',
      dangerSub: 'Une fois désactivé, toutes vos données seront chiffrées et inaccessibles après 30 jours. Cette action est irréversible.',
      dangerBtn: 'Demander la désactivation',
      dangerConfirm: 'Êtes-vous sûr ?',
      dangerConfirmYes: 'Oui, désactiver',
      dangerConfirmNo: 'Annuler',
      errorRequired: 'Ce champ est requis.',
      errorUsernamePattern: 'Lettres, chiffres, _ et - uniquement.',
      errorUsernameMin: 'Minimum 3 caractères.',
      errorPhonePattern: 'Numéro de téléphone invalide.',
      errorPasswordMin: 'Minimum 8 caractères.',
      errorPasswordMismatch: 'Les mots de passe ne correspondent pas.',
      togglePasswordVisibility: 'Afficher/masquer le mot de passe',
    },

    about: {
      title: "Tutoriel d'utilisation",
      priceTile: 'Expertise régionale',
      priceDescription: "Sélectionnez votre pays pour consulter les tarifs d'archivage spécialisés et les protocoles de restauration documentaire localisés.",
      chooseCountry: 'Choisir un pays',
      loadingMessage: 'Chargement des tarifs…',
      loadingErrorMessage: 'Erreur de chargement',
      EmptyPrice: 'Aucun tarif disponible',
      descriptionEmptyPrice: "Aucun tarif n'est configuré pour ce pays pour le moment.",
      selectCountry: 'Sélectionnez un pays',
      selectCountryDescription: 'Choisissez votre région dans la liste à gauche pour afficher les tarifs spécialisés et les protocoles de restauration.',
    },

    scanQr: {
      title: 'Scanner un QR Code',
      qrFoundTitle: 'Objet trouvé',
      qrReference: 'Référence',
      qrLabel: 'Libellé',
      declareFound: 'Déclarer comme trouvé',
      exploreLost: 'Explorer les objets perdus',
      loginPrompt: 'Connectez-vous ou créez un compte pour continuer.',
      registerPrompt: 'Créez un compte pour continuer.',
      loginBtn: 'Se connecter',
      registerBtn: "S'inscrire",
      loading: 'Chargement…',
      invalidQrTitle: 'QR Code invalide',
      invalidQrText: 'Ce QR Code est invalide ou a expiré.',
      backHome: "Retour à l'accueil",
    },

    legal: {
      title: "Conditions Générales d'Utilisation",
      subtitle: "Application TKrestore",
      lastUpdated: "Dernière mise à jour : 07 Mai 2026",
      sections: [
        {
          heading: "1. Définitions",
          content:
            "Application / Plateforme : désigne l'application TKrestore accessible via mobile, web ou tout autre support numérique.\n" +
            "Utilisateur : toute personne physique ou morale utilisant les services de TKrestore.\n" +
            "Compte : espace personnel créé par un utilisateur pour accéder aux fonctionnalités de la plateforme.\n" +
            "Objet perdu : tout document, accessoire ou bien matériel déclaré perdu par un utilisateur.\n" +
            "Objet retrouvé : tout objet ou document retrouvé puis déclaré sur la plateforme.\n" +
            "Services : ensemble des fonctionnalités proposées par TKrestore.",
        },
        {
          heading: "2. Objet de la plateforme",
          content:
            "TKrestore a pour objectif de faciliter :\n" +
            "• La déclaration d'objets ou documents perdus ;\n" +
            "• La publication d'objets retrouvés ;\n" +
            "• La mise en relation entre propriétaires et personnes ayant retrouvé des biens ;\n" +
            "• La gestion sécurisée des demandes de restitution ;\n" +
            "• Le suivi des objets signalés ;\n" +
            "• La notification des utilisateurs concernés.\n\n" +
            "La plateforme agit uniquement comme intermédiaire technique entre les utilisateurs.",
        },
        {
          heading: "3. Acceptation des conditions",
          content:
            "L'utilisation de TKrestore implique l'acceptation intégrale des présentes CGU.\n" +
            "Si l'utilisateur refuse tout ou partie des présentes conditions, il doit immédiatement cesser d'utiliser la plateforme.\n" +
            "TKrestore se réserve le droit de modifier les présentes CGU à tout moment.\n" +
            "Les utilisateurs seront informés des mises à jour via l'application ou par courrier électronique.",
        },
        {
          heading: "4. Conditions d'accès",
          content:
            "L'accès à certaines fonctionnalités nécessite :\n" +
            "• La création d'un compte utilisateur ;\n" +
            "• La fourniture d'informations exactes et à jour ;\n" +
            "• L'acceptation de la politique de confidentialité.\n\n" +
            "L'utilisateur garantit que les informations fournies lors de son inscription sont exactes, complètes et sincères.",
        },
        {
          heading: "5. Création de compte",
          content:
            "Pour créer un compte, l'utilisateur peut être amené à fournir :\n" +
            "• Nom et prénom ;\n" +
            "• Adresse e-mail ;\n" +
            "• Numéro de téléphone ;\n" +
            "• Mot de passe sécurisé ;\n" +
            "• Pièce d'identité (si nécessaire pour certaines vérifications).\n\n" +
            "L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion.",
        },
        {
          heading: "6. Utilisation des services",
          content:
            "L'utilisateur s'engage à utiliser TKrestore de manière légale, honnête et responsable.\n\n" +
            "Il est strictement interdit de :\n" +
            "• Publier de fausses déclarations ;\n" +
            "• Usurper l'identité d'un tiers ;\n" +
            "• Publier des contenus frauduleux, offensants ou illégaux ;\n" +
            "• Utiliser la plateforme à des fins criminelles ;\n" +
            "• Tenter d'accéder frauduleusement aux systèmes de TKrestore ;\n" +
            "• Diffuser des virus ou logiciels malveillants ;\n" +
            "• Vendre ou échanger des objets illicites.",
        },
        {
          heading: "7. Déclaration d'objets et documents",
          content:
            "L'utilisateur déclare être propriétaire légitime de tout objet signalé comme perdu.\n\n" +
            "Pour les objets retrouvés, l'utilisateur s'engage à :\n" +
            "• Fournir des informations exactes ;\n" +
            "• Ne pas détourner l'objet retrouvé ;\n" +
            "• Coopérer avec les procédures de vérification.\n\n" +
            "TKrestore peut demander des justificatifs de propriété avant toute restitution.",
        },
        {
          heading: "8. Procédure de restitution",
          content:
            "La restitution d'un objet peut nécessiter :\n" +
            "• Une vérification d'identité ;\n" +
            "• Une preuve de propriété ;\n" +
            "• Une validation administrative ;\n" +
            "• Un rendez-vous physique ou virtuel.\n\n" +
            "TKrestore se réserve le droit de suspendre une restitution en cas de doute sur la propriété réelle du bien.",
        },
        {
          heading: "9. Responsabilité de TKrestore",
          content:
            "TKrestore agit uniquement comme plateforme intermédiaire. À ce titre, TKrestore ne garantit pas :\n" +
            "• La récupération effective d'un objet perdu ;\n" +
            "• L'authenticité des déclarations des utilisateurs ;\n" +
            "• La disponibilité permanente des services ;\n" +
            "• L'absence totale d'erreurs ou d'interruptions.",
        },
        {
          heading: "10. Données personnelles",
          content:
            "TKrestore collecte et traite certaines données personnelles afin d'assurer le fonctionnement des services.\n\n" +
            "L'utilisateur dispose notamment des droits suivants :\n" +
            "• Droit d'accès ;\n" +
            "• Droit de rectification ;\n" +
            "• Droit de suppression ;\n" +
            "• Droit d'opposition ;\n" +
            "• Droit à la portabilité.",
        },
        {
          heading: "11. Services payants",
          content:
            "Certaines fonctionnalités peuvent être proposées sous forme payante :\n" +
            "• Publication prioritaire ;\n" +
            "• Vérification avancée ;\n" +
            "• Notifications premium ;\n" +
            "• Assistance spéciale ;\n" +
            "• Livraison ou sécurisation des restitutions.\n\n" +
            "Les tarifs applicables seront affichés avant toute souscription.",
        },
        {
          heading: "12. Absence de poursuites contre les déclarants",
          content:
            "Toute personne ayant retrouvé puis déclaré un objet ou un document sur la plateforme TKrestore agit dans une démarche citoyenne et volontaire.\n\n" +
            "En utilisant la plateforme, l'utilisateur reconnaît qu'aucune action judiciaire, poursuite abusive ou réclamation injustifiée ne pourra être engagée contre une personne ayant retrouvé et publié un objet ou document, sauf en cas de fraude avérée ou de mauvaise foi clairement établie par les autorités compétentes.",
        },
        {
          heading: "13. Règles d'utilisation du chat",
          content:
            "Les utilisateurs s'engagent à adopter un comportement respectueux dans les espaces de discussion.\n\n" +
            "Il est notamment interdit :\n" +
            "• D'échanger des propos injurieux, menaçants ou frauduleux ;\n" +
            "• De partager des données bancaires ou codes confidentiels ;\n" +
            "• D'effectuer du harcèlement ou des tentatives d'escroquerie.\n\n" +
            "Les échanges doivent rester strictement liés au processus de restitution.",
        },
        {
          heading: "14. Propriété de l'application",
          content:
            "L'application TKrestore est la propriété exclusive de TKSWIFT SERVICES.\n\n" +
            "Toute reproduction, modification ou utilisation non autorisée est strictement interdite sans accord écrit préalable de TKSWIFT SERVICES.",
        },
        {
          heading: "15. Contact",
          content:
            "Pour toute question relative aux présentes conditions :\n\n" +
            "TKrestore — TKSWIFT SERVICES\n" +
            "E-mail : info@tk-restore.com\n" +
            "Adresse : Yaoundé Biyem-assi GP Melen",
        },
      ],
    },
  
    privacyPolicy: {
      title: "Politique de Confidentialité",
      subtitle: "Application TKrestore",
      lastUpdated: "Dernière mise à jour : 07 Mai 2026",
      sections: [
        {
          heading: "1. Identité du responsable du traitement",
          content:
            "L'application TKrestore est exploitée par TKSWIFT SERVICES, responsable du traitement des données collectées via la plateforme.\n\n" +
            "Les réclamations ou demandes d'informations peuvent être adressées à TKSWIFT SERVICES via les canaux officiels de communication.",
        },
        {
          heading: "2. Données collectées",
          content:
            "TKrestore peut collecter différentes catégories de données :\n\n" +
            "Données d'identification : nom et prénom, pseudonyme, photo de profil, pièce d'identité.\n\n" +
            "Données de contact : numéro de téléphone, adresse e-mail.\n\n" +
            "Données liées aux objets : descriptions, photographies, localisation approximative, catégorie d'objet.\n\n" +
            "Données de paiement : identifiants de transaction, historique des paiements, informations Mobile Money.\n\n" +
            "Données techniques : adresse IP, type d'appareil, système d'exploitation, journaux d'activité.\n\n" +
            "Données de communication : échanges via les chats, confirmations de remise.",
        },
        {
          heading: "3. Finalité de la collecte",
          content:
            "Les données collectées sont utilisées uniquement dans le cadre du fonctionnement de TKrestore, notamment pour :\n" +
            "• Permettre la publication des objets et documents ;\n" +
            "• Faciliter les recherches et mises en relation ;\n" +
            "• Vérifier l'identité des utilisateurs ;\n" +
            "• Sécuriser les restitutions ;\n" +
            "• Prévenir les fraudes ;\n" +
            "• Gérer les paiements ;\n" +
            "• Respecter les obligations légales.",
        },
        {
          heading: "4. Utilisation limitée des données",
          content:
            "Les données publiées sur TKrestore ne seront pas utilisées à d'autres fins non liées au fonctionnement de la plateforme.\n\n" +
            "TKrestore s'engage à ne pas :\n" +
            "• Vendre les données personnelles ;\n" +
            "• Exploiter les données à des fins abusives ;\n" +
            "• Transmettre les données à des tiers non autorisés ;\n" +
            "• Utiliser les données pour des activités illégales.",
        },
        {
          heading: "5. Partage des données",
          content:
            "Certaines données peuvent être partagées uniquement :\n" +
            "• Avec les utilisateurs concernés par une restitution ;\n" +
            "• Avec les prestataires techniques autorisés ;\n" +
            "• Avec les services de paiement ;\n" +
            "• Avec les autorités compétentes en cas d'obligation légale.",
        },
        {
          heading: "6. Modération et surveillance",
          content:
            "Afin d'assurer la sécurité de la plateforme :\n" +
            "• Les publications peuvent être modérées ;\n" +
            "• Les échanges via les chats peuvent être contrôlés ;\n" +
            "• Les activités suspectes peuvent être analysées par des systèmes automatisés et des modérateurs humains.\n\n" +
            "TKrestore utilise des outils de détection de fraude assistés par intelligence artificielle afin de protéger les utilisateurs.",
        },
        {
          heading: "7. Conservation des données",
          content:
            "Les données sont conservées pendant une durée raisonnable nécessaire :\n" +
            "• Au fonctionnement des services ;\n" +
            "• À la gestion des litiges ;\n" +
            "• Aux obligations légales ;\n" +
            "• À la prévention des fraudes.\n\n" +
            "TKrestore peut supprimer ou anonymiser certaines données lorsque leur conservation n'est plus nécessaire.",
        },
        {
          heading: "8. Sécurité des données",
          content:
            "TKrestore met en œuvre des mesures techniques et organisationnelles raisonnables afin de protéger les données contre :\n" +
            "• Les accès non autorisés ;\n" +
            "• La perte de données ;\n" +
            "• Les modifications frauduleuses ;\n" +
            "• Les divulgations abusives ;\n" +
            "• Les cyberattaques.\n\n" +
            "Cependant, aucun système informatique ne peut garantir une sécurité absolue.",
        },
        {
          heading: "9. Droits des utilisateurs",
          content:
            "Les utilisateurs disposent notamment des droits suivants :\n" +
            "• Droit d'accès ;\n" +
            "• Droit de rectification ;\n" +
            "• Droit de suppression ;\n" +
            "• Droit d'opposition ;\n" +
            "• Droit à la limitation ;\n" +
            "• Droit de retirer leur consentement.\n\n" +
            "Toute demande peut être adressée à TKSWIFT SERVICES.",
        },
        {
          heading: "10. Mineurs",
          content:
            "Les utilisateurs mineurs doivent utiliser TKrestore sous la supervision d'un parent ou représentant légal conformément aux lois applicables.",
        },
        {
          heading: "11. Paiements et services tiers",
          content:
            "Les paiements effectués via TKrestore peuvent être traités par des prestataires tiers spécialisés, notamment des services Mobile Money et des passerelles de paiement sécurisées telles que PawaPay.\n\n" +
            "TKrestore n'a pas accès aux mots de passe ou codes secrets liés aux comptes financiers des utilisateurs.",
        },
        {
          heading: "12. Contact",
          content:
            "Pour toute question relative à la confidentialité ou à la protection des données :\n\n" +
            "TKSWIFT SERVICES — Application TKrestore\n" +
            "E-mail : info@tkswift.com\n" +
            "Adresse : Face GP MELEN BIYEM ASSI, YAOUNDE",
        },
      ],
    },
  
    dataProcessing: {
      title: "Accord de traitement des données",
      subtitle: "Consentement requis pour continuer",
      intro:
        "Avant d'utiliser les services de TKrestore, vous devez lire et accepter notre accord de traitement des données personnelles. Vos données sont utilisées exclusivement pour faciliter la restitution de vos documents et objets perdus.",
      checkboxLabel:
        "J'accepte l'accord de traitement des données personnelles de TKrestore",
      acceptBtn: "Accepter et continuer",
      declineBtn: "Refuser",
      alreadyAccepted: "Vous avez déjà accepté l'accord de traitement.",
      viewTerms: "Consulter les CGU",
      viewPrivacy: "Consulter la politique de confidentialité",
      modal: {
        title: "Refus de l'accord",
        body: "En refusant l'accord de traitement des données, vous ne pourrez pas accéder aux fonctionnalités de TKrestore. Êtes-vous sûr de vouloir refuser ?",
        confirm: "Oui, refuser",
        cancel: "Annuler",
      },
      badge: "Données protégées",
    },

    dpa:{
        title: 'Accord de Traitement des Données (DPA)',
        subtitle: 'Application TKrestore — TKSWIFT SERVICES',
        lastUpdated: 'Dernière mise à jour : 07 Mai 2026',
        sections: [
          {
            heading: '1. Identification des parties',
            content:
              'Responsable du traitement : TKSWIFT SERVICES, exploitant de l\'application TKrestore, responsable de la collecte et du traitement des données personnelles effectués via la plateforme.\n\n' +
              'Utilisateur : toute personne physique ou morale utilisant les services proposés par TKrestore.',
          },
          {
            heading: '2. Objet de l\'accord',
            content:
              'Le présent accord a pour objet de définir :\n' +
              '• les modalités de traitement des données personnelles ;\n' +
              '• les obligations de TKrestore ;\n' +
              '• les droits des utilisateurs ;\n' +
              '• les mesures de sécurité appliquées ;\n' +
              '• les conditions d\'utilisation et de conservation des données.',
          },
          {
            heading: '3. Données traitées',
            content:
              'TKrestore peut traiter notamment les catégories de données suivantes :\n\n' +
              'Données d\'identification : nom et prénom, pseudonyme, photo de profil, pièce d\'identité, informations de vérification.\n\n' +
              'Données de contact : numéro de téléphone, adresse e-mail, adresses de contact.\n\n' +
              'Données liées aux objets et documents : descriptions, images, catégories, localisations approximatives, historique des restitutions.\n\n' +
              'Données financières : informations de paiement, identifiants de transaction, confirmations Mobile Money, historiques de paiements.\n\n' +
              'Données techniques : adresse IP, informations de connexion, type d\'appareil, journaux d\'activité, identifiants techniques.\n\n' +
              'Données de communication : messages échangés via les chats, confirmations de remise (« hand over »), signalements et réclamations.',
          },
          {
            heading: '4. Finalités du traitement',
            content:
              'Les données collectées sont utilisées uniquement dans le cadre des services proposés par TKrestore, notamment pour :\n' +
              '• gérer les comptes utilisateurs ;\n' +
              '• faciliter la restitution des objets et documents ;\n' +
              '• vérifier les identités ;\n' +
              '• prévenir les fraudes ;\n' +
              '• sécuriser les transactions ;\n' +
              '• assurer la modération ;\n' +
              '• gérer les paiements ;\n' +
              '• améliorer les performances de la plateforme ;\n' +
              '• traiter les réclamations ;\n' +
              '• respecter les obligations légales.',
          },
          {
            heading: '5. Base légale du traitement',
            content:
              'Le traitement des données personnelles repose notamment sur :\n' +
              '• le consentement des utilisateurs ;\n' +
              '• l\'exécution des services demandés ;\n' +
              '• les obligations légales ;\n' +
              '• les intérêts légitimes liés à la sécurité et à la prévention des fraudes.',
          },
          {
            heading: '6. Utilisation limitée des données',
            content:
              'Les données collectées sur TKrestore ne seront utilisées qu\'aux seules fins du fonctionnement de la plateforme.\n\n' +
              'TKrestore s\'engage à ne pas :\n' +
              '• vendre les données personnelles ;\n' +
              '• exploiter les données à des fins abusives ;\n' +
              '• transmettre les données à des tiers non autorisés ;\n' +
              '• utiliser les données pour des activités illégales.',
          },
          {
            heading: '7. Modération et surveillance',
            content:
              'Afin d\'assurer la sécurité de la plateforme :\n' +
              '• les publications peuvent être vérifiées ;\n' +
              '• les chats peuvent être modérés ;\n' +
              '• les activités suspectes peuvent être analysées ;\n' +
              '• des systèmes d\'intelligence artificielle peuvent être utilisés pour détecter les fraudes.\n\n' +
              'TKrestore peut suspendre des comptes ou limiter certaines fonctionnalités en cas d\'activité suspecte.',
          },
          {
            heading: '8. Partage des données',
            content:
              'Les données peuvent être partagées uniquement :\n' +
              '• avec les utilisateurs concernés par une restitution ;\n' +
              '• avec les prestataires techniques autorisés ;\n' +
              '• avec les services de paiement ;\n' +
              '• avec les autorités compétentes ;\n' +
              '• dans le cadre d\'une enquête de sécurité ou de fraude.\n\n' +
              'TKrestore limite strictement l\'accès aux données aux personnes habilitées.',
          },
          {
            heading: '9. Services tiers et paiements',
            content:
              'Les paiements effectués via TKrestore peuvent être traités par des prestataires tiers sécurisés, notamment des services Mobile Money et des plateformes telles que PawaPay.\n\n' +
              'TKrestore ne conserve pas les codes secrets ou mots de passe financiers des utilisateurs.',
          },
          {
            heading: '10. Liens familiaux et recherche intelligente',
            content:
              'TKrestore peut utiliser certaines informations relationnelles ou familiales fournies volontairement par les utilisateurs afin d\'améliorer les recherches et les restitutions.\n\n' +
              'Ces informations sont utilisées uniquement dans le cadre des fonctionnalités de recherche intelligente et de mise en relation sécurisée.',
          },
          {
            heading: '11. Sécurité des données',
            content:
              'TKrestore met en œuvre des mesures techniques et organisationnelles raisonnables afin de protéger les données contre :\n' +
              '• les accès non autorisés ;\n' +
              '• les pertes accidentelles ;\n' +
              '• les modifications frauduleuses ;\n' +
              '• les divulgations abusives ;\n' +
              '• les cyberattaques.\n\n' +
              'Cependant, aucun système informatique ne peut garantir une sécurité absolue.',
          },
          {
            heading: '12. Conservation des données',
            content:
              'Les données sont conservées pendant une durée raisonnable nécessaire :\n' +
              '• au fonctionnement des services ;\n' +
              '• à la gestion des litiges ;\n' +
              '• à la prévention des fraudes ;\n' +
              '• aux obligations légales et réglementaires.\n\n' +
              'TKrestore peut supprimer ou anonymiser certaines données lorsque leur conservation n\'est plus nécessaire.',
          },
          {
            heading: '13. Droits des utilisateurs',
            content:
              'Les utilisateurs disposent notamment des droits suivants :\n' +
              '• droit d\'accès ;\n' +
              '• droit de rectification ;\n' +
              '• droit de suppression ;\n' +
              '• droit d\'opposition ;\n' +
              '• droit à la limitation ;\n' +
              '• droit de retirer leur consentement.\n\n' +
              'Toute demande relative aux données personnelles peut être adressée à TKSWIFT SERVICES.',
          },
          {
            heading: '14. Transferts internationaux',
            content:
              'Certaines données peuvent être hébergées ou traitées sur des serveurs situés hors du pays de résidence de l\'utilisateur.\n\n' +
              'TKrestore met en œuvre des mesures raisonnables afin de garantir un niveau approprié de protection des données.',
          },
          {
            heading: '15. Confidentialité',
            content:
              'TKrestore s\'engage à préserver la confidentialité des données traitées et à limiter leur accès aux seules personnes autorisées.\n\n' +
              'Les employés, modérateurs, partenaires et prestataires ayant accès aux données sont soumis à des obligations de confidentialité.',
          },
          {
            heading: '16. Violation de données',
            content:
              'En cas d\'incident de sécurité ou de violation de données susceptible d\'affecter les utilisateurs, TKrestore prendra des mesures raisonnables afin :\n' +
              '• de limiter les impacts ;\n' +
              '• de sécuriser les systèmes ;\n' +
              '• d\'informer les utilisateurs concernés lorsque cela est nécessaire ;\n' +
              '• de coopérer avec les autorités compétentes.',
          },
          {
            heading: '17. Modification de l\'accord',
            content:
              'TKrestore se réserve le droit de modifier le présent Accord de Traitement des Données à tout moment.\n\n' +
              'Les utilisateurs seront informés des mises à jour importantes via l\'application ou tout autre moyen approprié.',
          },
          {
            heading: '18. Contact',
            content:
              'TKSWIFT SERVICES\n' +
              'Application : TKrestore\n' +
              'E-mail : info@tkswift.com\n' +
              'Adresse : GP MELEN BIYEM ASSI YAOUNDE',
          },
          {
            heading: '19. Entrée en vigueur',
            content:
              'Le présent Accord de Traitement des Données entre en vigueur dès sa publication sur l\'application TKrestore.',
          },
        ],
    }, 

    error: {
      E_429: 'Trop de tentatives. Réessayez dans quelques minutes.',
      E_401:"Non authentifié. Veuillez vous connecter.",
      E_403:"Vous n\'avez pas les droits pour effectuer cette action.",
      E_404:"La ressource demandée est introuvable.",
      E_500: "Erreur serveur. Veuillez réessayer plus tard.",
      E_400: "Données invalides.Veuillez remplir tous les champs correctement.",
      E_validation:"Veuillez vérifier les champs en erreur.",
      E_network:"Impossible de contacter le serveur. Vérifiez votre connexion.",
      E_inscription: 'Erreur lors de l\'inscription. Veuillez réessayer.',
      E_cgu: 'Veuillez accepter les termes et conditions.',
      E_mdp: 'Les mots de passe ne correspondent pas.',
      E_phone: 'Numéro de téléphone invalide',
      E_email: 'Adresse email invalide',
      E_recaptcha: 'Erreur de sécurité. Veuillez réessayer.',
    },

    chat: {
      title:                     'Messagerie',
      selectConversation:        'Sélectionnez une conversation',
      selectConversationSub:     'Choisissez une discussion dans la liste pour commencer à échanger.',
      noConversation:            'Aucune conversation',
      noConversationSub:         'Aucune discussion disponible pour le moment.',
      searchPlaceholder:         'Rechercher une conversation…',
      filterAll:                 'Toutes',
      filterOpen:                'Ouvertes',
      filterActive:              'Actives',
      filterArchived:            'Archivées',
      typePlaceholder:           'Écrivez votre message…',
      send:                      'Envoyer',
      sending:                   'Envoi…',
      archivedNotice:            'Cette conversation est archivée. Les messages sont désactivés.',
      noMessages:                'Aucun message. Commencez la discussion !',
      statusOpen:                'Ouvert',
      statusActive:              'Actif',
      statusArchived:            'Archivé',
      statusCompleted:           'Terminé',
      attachFile:                'Joindre un fichier',
      attachmentPreview:         'Aperçu',
      downloadAttachment:        'Télécharger',
      closePreview:              'Fermer',
      handoverGenerateBtn:       'Générer mon code de remise',
      handoverRegenerateBtn:     'Régénérer le code',
      handoverCodeLabel:         'Montrez ce code au trouveur',
      handoverCodeExpired:       'Code expiré — régénérez-en un nouveau',
      handoverConfirmedBadge:    'Remise confirmée',
      handoverInitiateTooltip:   'Générer mon code de récupération',
      handoverRegenerateTooltip: 'Régénérer un nouveau code',
      handoverEnterCodeBtn:      'Saisir le code de remise',
      handoverEnterCodeTooltip:  'Saisir le code fourni par le propriétaire',
      loserConfirmTitle:         "Le trouveur a validé le code. Avez-vous récupéré votre document ?",
      loserConfirmBtn:           "Oui, je l'ai récupéré !",
      otpModalTitle:             'Saisir le code de remise',
      otpModalSubtitle:          'Entrez le code à 6 chiffres fourni par le propriétaire.',
      otpConfirmBtn:             'Valider le code',
      otpValidating:             'Validation…',
      otpErrorInvalid:           'Code incorrect. Vérifiez et réessayez.',
      otpClose:                  'Annuler',
      handoverSystemInitiated:   'Le propriétaire a généré son code de remise.',
      handoverSystemConfirmed:   'Code validé par le trouveur. Remise confirmée.',
      handoverSystemComplete:    'Remise terminée. Le paiement va être libéré.',
      itemInfoTitle:             'Votre document',
      paymentStatus:             'Paiement',
      paymentPaid:               'Payé — en attente de remise',
      paymentReleased:           'Libéré vers le trouveur',
      finderInfoTitle:           'Document à remettre',
      finderStep1:               'Demandez au propriétaire de générer son code dans le chat.',
      finderStep2:               'Récupérez le code à 6 chiffres auprès du propriétaire.',
      finderStep3:               'Cliquez sur "Saisir le code" et entrez-le.',
      finderStep4:               'Une fois validé, le paiement vous sera versé.',
      sendError:                 "Erreur lors de l'envoi. Réessayez.",
      handoverInitError:         'Impossible de générer le code. Réessayez.',
      handoverConfirmError:      'Code invalide ou expiré.',

      welcomeTitle: "Bienvenue dans votre espace de récupération",
      welcomeSubtitle: "Vous êtes en contact avec la personne qui a trouvé votre document. Voici quelques consignes importantes :",

      conversationTitle: "Conversation enregistrée",
      conversationDescription: "Tous les échanges de cette conversation sont enregistrés et archivés de manière sécurisée.",

      publicPlaceTitle: "Privilégiez les lieux publics",
      publicPlaceDescription: "Pour la remise, choisissez un endroit fréquenté : centre commercial, gare, café animé. Évitez les lieux isolés.",

      noMoneyTitle: "Ne transférez jamais d'argent",
      noMoneyDescription: "Nous ne serons en aucun cas responsables d'un éventuel envoi d'argent. La plateforme ne demande aucun paiement supplémentaire.",

      codeTitle: "Le code confirme la remise",
      codeDescription: "Une fois face au trouveur, générez votre code (bouton en haut à droite). Ce code prouve que vous êtes bien en possession du document et souhaitez le restituer.",

      footerMessage: "Envoyez un premier message pour démarrer la conversation avec le trouveur."

      
      ,finderWelcomeTitle: "Merci d'avoir trouvé ce document !",
      finderWelcomeSubtitle: "Vous êtes en contact avec le propriétaire légal. Voici comment se passe la remise :",

      finderConversationTitle: "Conversation enregistrée",
      finderConversationDescription: "Tous les échanges de cette conversation sont enregistrés et archivés de manière sécurisée.",

      finderPublicPlaceTitle: "Privilégiez les lieux publics",
      finderPublicPlaceDescription: "Pour la remise, convenez d'un lieu fréquenté : centre commercial, gare, café animé. Évitez les endroits isolés.",

      finderCodeTitle: "La remise se confirme par code",
      finderCodeDescription: "La remise est validée uniquement après avoir saisi le code reçu du propriétaire légal (bouton 🔒 en haut à droite). Sans ce code, la remise n'est pas confirmée.",

      finderFooterMessage: "Envoyez un premier message pour démarrer la conversation avec le propriétaire.",
      
      restorationSuccessTitle:   'Restauration réussie !',
      restorationSuccessMessage: 'Le document a été remis avec succès à son propriétaire. La conversation est maintenant archivée.',
      restorationSuccessThanks:  'Merci d\'avoir utilisé TKRestore. Ensemble, nous contribuons à restituer les documents perdus et à renforcer la confiance dans notre communauté.',
      restorationSuccessHomeBtn: 'Retour à l\'accueil',
      restorationSuccessStayBtn: 'Rester dans le chat',

    },

    tutorials: {
      sectionLabel: 'Tutoriels',
      sectionTitle: 'Apprenez à utiliser TKRestore',
      sectionSub: 'Des guides vidéo pas à pas pour déclarer, retrouver et restituer vos documents perdus.',
      playlistLabel: 'Playlist',
      seeChannel: 'Voir toute la chaîne',
      videoCount: '{{count}} vidéos',
      watchVideo: 'Regarder la vidéo',
      noVideos: 'Aucune vidéo disponible pour cette catégorie',
      pricingLabel: 'Tarification',
      pricingFor: 'Tarifs pour',
      services: 'services',
      toPay: 'à payer',
      toReceive: 'à recevoir',
      legendPayer: 'Montant payé par le propriétaire',
      legendFinder: 'Montant reçu par le trouveur',
      retry: 'Réessayer',
      close: 'Fermer',
      prev: 'Précédent',
      next: 'Suivant',
    }

  },

  // ══════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════════════════════════════════
  en: {
    nav: {
      home: 'Home',
      declareLost: 'Report a Lost Document',
      declareBrowse: 'Declare a Found Item',
      dashboard: 'Dashboard',
      about: 'About Us',
      login: 'Login',
      logout: 'Log out',
      register: 'Register',
    },

    home: {
      badge: 'Reliable document retrieval',
      heroTitle: 'Recover Your ',
      heroHighlight: 'Lost Documents',
      heroSub: 'Join our secure community-driven network helping people reunite with lost IDs, passports, certificates and more.',
      ctaDeclare: 'Declare a Lost Document',
      ctaBrowse: 'How it works ?',
      
      homeTitle: 'Found Publications',
      homeSub: 'Feed of reported documents',
      recentTitle: 'Recently Found',
      recentSub: 'Live feed of items reported in the last 24 hours',
      loadMore: 'Load More',
      viewDetails: 'View Details',
      foundBadge: 'Found',
      foundOn: 'Found on',
      whyChoose: "Why choose",
      slogan: "“Nothing is lost, everything can be restored”",

      countriesDescription: "Large international community",
      countriesLabel: "Countries",

      usersDescription: "Active and growing community",
      usersLabel: "Our users",

      publicationsDescription: "Publications shared every hour worldwide",
      publicationsLabel: "Our publications",

      restorationsDescription: "Documents and items restored in real time",
      restorationsLabel: "Our restorations"
        },

    documents: {
      title: 'My Active Documents',
      total: 'document(s)',
      newDeclaration: 'New Declaration',
      filterType: 'Filter by type:',
      filterAll: 'All',
      filterLost: 'Lost',
      filterFound: 'Found',
      loadMore: 'Load more documents',
      deleteConfirmTitle: 'Confirm deletion',
      deleteConfirmText: 'Are you sure you want to delete this document? This action is irreversible.',
      deleteBtn: 'Delete',
      cancelBtn: 'Cancel',
      noDocumentsTitle: 'No documents',
      noDocumentsText: 'Start by declaring your first lost or found document.',
      firstDeclaration: 'Declare my first document',
      loading: 'Loading',
      see: 'See',
      enabled: 'Active',
      disabled: 'Disabled',
      deleted: 'Deleted',
      seeMore: 'Load more',
      noQrTitle: 'No QR Code',
      noQrMessage: "You haven't created a QR Code yet. Create one to associate it with your precious objects.",
      createFirstQr: 'Create my first QR Code',
      restore: 'Restored',
      details: 'Details',
      chat: 'Chat',
      emptyRestoration: 'No restoration',
      emptyMessage: "You haven't recovered any objects yet. Make a declaration to start.",
      qrModalTitle: 'Full QR Code',
      qrModalMessage: 'Use this QR code to associate it with your object.',
      modalDetailR: 'Reference',
      modalDetailStatut: 'Status',
      modalDetailRestoreTitle: 'Restored object',
      modalInformation: 'Information',
      modalActionOpenChat: 'Open the chat',
      rejectDetails: "Rejection details",
      qrCodeTitle: "My QR Codes",
      restorationTitle: "My recoveries",
      close: 'Close',
      place: 'Place',
      category: 'Category',
      confirmedRestored: 'Restoration confirmed',
      rejectedRestored: 'Restoration rejected',
      confirmRestorationTitle: 'Confirm restoration',
      rejectRestorationTitle: 'Reject restoration',
      confirmRestorationDescription: 'Confirm that the restoration is correct. The process will then be finalized.',
      rejectRestorationDescription: 'Confirm the rejection. A refund process will be initiated.',
      rejected:              'Rejected',
      viewRejectReason:      'View rejection reason',
      rejectModalTitle:      'Rejected declaration',
      rejectReasonLabel:     'Rejection reason',
      rejectDescriptionLabel:'Details',
      rejectNoDetails:       'No details available. Please contact support.',
    },

    dashboard: {
      gains: 'Earnings',
      expenses: 'Expenses',
      restored: 'Restored',
      declared: 'Declared',
      balance: 'Current Balance',
      evolutionFinancial: 'Financial Evolution',
      evolutionMonthly: 'Monthly Evolution',
      evolutionYearly: 'Annual Breakdown',
      viewMonthly: 'Monthly',
      viewYearly: 'Yearly',
      currentYear: '{{ selectedYear() }}',
      soldeActuel: 'Current Balance',
      soldeDisponible: 'Available Balance',
      historyRecent: 'Recent History',
      noTransactions: 'No transactions this year',
      matched: "Matched",
      totalItems: "Total items",
    },

    auth: {
      welcomeBack: 'Welcome back',
      username: 'Username',
      country: 'Country',
      loginSub: 'Enter your credentials to access your documents.',
      email: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      rememberDevice: 'Remember this device',
      signIn: 'Sign in',
      noAccount: "Don't have an account?",
      registerLink: 'Create an account',
      createAccount: 'Create Secure Account',
      registerSub: 'Start recovering your critical documents in minutes.',
      full_name: 'Full Name',
      phone: 'Phone Number',
      password_confirmation: 'Confirm Password',
      acceptTerms: 'I agree to the ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      createBtn: 'Create My Account',
      alreadyAccount: 'Already have an account?',
      signInLink: 'Sign in',
      identifierLabel:         "Identifier",
      identifierPlaceholder:   "Email, username or phone",
      identifierHint:          "Sign in with your email, username or phone number (e.g. 237690000000).",
      loginIdentifierRequired: "Please enter your email, username or phone number.",
      passwordRequired:        "Password is required.",
      passwordMin:             "Password must be at least 8 characters.",
      loginSuccess:            "Login successful! Welcome.",
      invalidCredentials:      "Invalid identifier or password.",
      emailNotVerified:        "Your email is not verified. Please check your inbox.",
      accountInactive:         "Your account is disabled. Please contact support.",
      tooManyAttempts:         "Too many attempts. Please try again in a few minutes.",
      serverError:             "An error occurred. Please try again later.",
      recaptchaError:          "Security error. Please try again.",
      signingIn:               "Signing in…",
      successOtpMsg:            "OTP sent! Please check your email or phone.",
    },

    declare: {
      modeLost: 'Loss Declaration',
      modeFound: 'Found Item Declaration',
      titleLost: 'Declare a Lost Document',
      titleFound: 'Declare a Found Document',
      subtitleLost: 'Official portal for reporting lost identification or legal documents.',
      subtitleFound: 'Report a found document to help its owner recover it.',
      documentType: 'Document Type',
      documentTypePlaceholder: 'Select a document type',
      passport: 'International Passport',
      nationalId: 'National ID Card',
      driversLicense: "Driver's License",
      birthCertificate: 'Birth Certificate',
      nameOnDocument: 'Name on Document',
      nameOnDocumentPlaceholder: 'Full name as it appears',
      documentNumber: 'Document Number',
      documentNumberPlaceholder: 'e.g. A12345678',
      dateLost: 'Date Lost',
      dateFound: 'Date Found',
      lastKnownLocation: 'Last Known Location',
      foundLocation: 'Location Where Found',
      lastKnownLocationPlaceholder: 'City, street or landmark',
      description: 'Detailed Description',
      descriptionPlaceholder: 'Describe the document (optional)',
      descriptionFoundPlaceholder: 'Describe the document by providing various relevant details to make it easier to find.',
      photos: 'Document Photos',
      photosHint: 'Click or drag & drop your files here',
      photosFormat: 'PNG, JPG up to 5 MB each',
      photosMax: '3 files maximum',
      addMorePhotos: 'Add more photos',
      submit: 'Submit Declaration',
      errorRequired: 'This field is required.',
      errorMin: 'Value is too short.',
      successMessage: 'Declaration submitted successfully! You will receive a confirmation email.',
      errorGeneral: 'Submission error. Please try again.',
      error403: 'You must be logged in to submit a declaration.',
      error422: 'Please check the highlighted fields and try again.',
      errorCategoryNotFound: '"Document" category not found. Please contact support.',
      errorSubCategories: 'Unable to load document types. Please try again.',
      errorCategories: 'Unable to load categories. Please try again.',
      errorFileTooLarge: 'exceeds 5 MB and was ignored.',
      errorFileType: 'Format not accepted. Please use JPG or PNG.',
      statusDraft: 'Under review',
      statusActive: 'Active',
      statusMatched: 'Handover in progress',
      statusReturned: 'Returned',
      statusArchived: 'Archived',
      errorNoFiles: 'No photos uploaded. Please add at least one photo of the document.',
    },

    restore: {
      title: 'Complete Your Restoration',
      stepPayment: 'Confirmation & Payment',
      stepRestore: 'Restoration',
      previewTitle: 'Restoration Preview',
      previewRestricted: 'Restricted Access',
      previewLockedTitle: 'Preview Locked',
      previewLockedSub: 'Complete payment to unlock the full restored version.',
      termsTitle: 'Terms & Restoration Policy',
      termsSubtitle: 'Check all 3 boxes to enable payment.',
      term1Title: 'Enhanced Clarity Guarantee',
      term1Sub: 'Minimum improvement guaranteed for damaged text legibility.',
      term2Title: 'One-Time Payment',
      term2Sub: 'No subscription. Pay only for this job.',
      term3Title: 'I agree to the Data Processing Agreement',
      term3Sub: 'Your file will be permanently deleted from our servers after 24 hours.',
      termsProgress: 'Check all 3 boxes to enable payment',
      termsAllDone: '✓ All terms accepted — payment enabled',
      checkoutTitle: 'Secure Mobile Payment',
      feeLabel: 'Restoration fee',
      storageLabel: 'Cloud storage (24h)',
      totalLabel: 'Total amount',
      operatorLabel: 'Mobile operator',
      phoneLabel: 'Mobile Money number',
      pushInfo: 'A push notification will be sent to your phone to confirm the payment.',
      payBtn: 'Pay & Start Restoration',
      payLocked: 'Accept all terms first',
      payProcessing: 'Processing…',
      payHint: 'Check the 3 conditions on the left to enable this button',
      badgeSecure: 'Secure payment',
      badgeEncrypted: 'Encrypted data',
      errorOperator: 'Please select an operator.',
      errorPhone: 'Invalid phone number.',
      reduceTxt:'Discount',
      emptyOperator:'No operators available for this country.',
      paymentAccepted: "Awaiting confirmation... Payment initiated successfully. Confirm on your phone",
      paymentConfirmed: "Payment confirmed!",
      paymentFailed: "Payment failed",
      paymentRejected: "Payment rejected",
      verificationInProgress: "Verification in progress...",
      paymentDisable: "Payment disabled",
      ownerCanPay: "You cannot make payment on your own documents.",
      ownerAmount: "Your payment amount after restoration.",
      ownerPhoneInformation: "The payment is on this number after the document restoration.",
      modalNotification: "Notifications",
      modalPayTitle: "Confirm payment",
      modalPayText: "A request has been sent from",
      modalAwatingConfirmation: "Awaiting confirmation...",
      modalUserApproveModalInformation: "You should receive a notification on your phone to confirm the payment.",
      NotFoundDocument: "Document not found. Please contact support.",
      confirmDocumentTitle: 'Does this document belong to you?',
      confirmDocumentDescription: 'Your payment has been confirmed. Please verify that the displayed document is yours before proceeding.',
      confirmDocumentDescriptionNext: 'This action cannot be undone.',
      confirmDocumentBtnLbl: 'Yes, this is my document',
      rejetctDocumentBtnLbl: 'No, this is not my document',
      warningDocumentBtn: 'If you refuse, a refund will be automatically initiated.',
      confirmRestoreTitle: 'Restoration confirmed',
      confirmRestoreDescription: 'The handover process has been initiated. You will receive a confirmation email shortly.',
      rejectModalTitle:       'Document rejected',
      rejectModalMessage:     'You have reported that this document does not belong to you. Thank you for your honesty.',
      rejectModalRefundInfo:  'A refund has been initiated. The amount will be returned within 24 to 48 hours depending on your Mobile Money operator.',
      rejectModalSearchBtn:   'Search for another document',
      rejectModalDocumentsBtn:'My documents',
    },

    footer: { 
      rights: 'All rights reserved.',
      description: "Easily find your lost items through a modern, fast, and secure platform that connects owners with finders.",
      download_on: "Download on",
      get_on: "Get it on"
     },

    sidebar: {
      dashboard: 'Dashboard',
      declareLost: 'Declare a Loss',
      declareBrowse: 'Declare a Find',
      chat: 'Messages',
      documents: 'My Documents',
      history: 'History',
      settings: 'Settings',
      secureEntity: 'Secure an Item',
    },

    secure_object: {
      title: 'Secure your items',
      subtitle: 'Generate a unique QR Code with your information',
      yourInfo: 'Your information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      objectInfo: 'Item information',
      label: 'Item label',
      description: 'Description',
      generating: 'Generating…',
      submit: 'Generate QR Code',
      help: 'The QR Code will be stored securely and linked to your account.',
    },

    search: {
      title: 'Search',
      heroTitle: 'Find a ',
      heroHighlight: 'Document',
      heroSub: 'Search through the global database for recovered identification and legal documents.',
      placeholder: 'Search by name, document number or location…',
      searchBtn: 'Search',
      filtersLabel: 'Filter by category',
      filterAll: 'All',
      filterCni: 'National ID',
      filterPassport: 'Passport',
      filterBirth: 'Birth Certificate',
      filterLicense: 'Driving License',
      filterOther: 'Other',
      resultsTitle: 'Found Documents',
      resultsCount: 'results',
      sortBy: 'Sort by:',
      sortDate: 'Date Found',
      sortRelevance: 'Relevance',
      sortLocation: 'Location',
      foundBadge: 'Found',
      // ✅ Corrigé — manquait de cohérence
      lostBadge: 'Lost',
      foundOn: 'Found on',
      viewDetails: 'View Details',
      loadMore: 'Load More Documents',
      emptyTitle: 'No results found',
      emptySub: 'Try different search terms or change the category filter.',
    },

    settings: {
      title: 'Account Settings',
      language: 'Language',
      subtitle: 'Manage your personal details, secure your account and configure your preferences.',

      profileTitle: 'Profile Information',
      profileSub: 'Update your public identity and contact information.',
      full_name: 'Full Name',
      full_namePlaceholder: 'John Doe',
      username: 'Username',
      usernamePlaceholder: 'my_username',
      email: 'Email Address',
      emailReadOnly: 'Read only',
      emailReadOnlyAria: 'Email — read-only field',
      emailReadOnlyHint: 'Contact support to change your email address.',
      phone: 'Phone Number',
      saveProfile: 'Save Profile',
      saving: 'Saving…',
      passwordTitle: 'Change Password',
      passwordSub: 'Choose a strong password of at least 8 characters.',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      password_confirmation: 'Confirm New Password',
      newPasswordSection: 'New password',
      passwordMatch: 'Passwords match',
      savePassword: 'Change Password',
      prefsTitle: 'Preferences',
      prefsSub: 'Configure your notifications and account security settings.',
      emailNotifTitle: 'Email Notifications',
      emailNotifSub: 'Receive daily recovery summaries and archival alerts.',
      twoFATitle: 'Two-Factor Authentication',
      twoFASub: 'Add an extra layer of security to your account.',
      dangerTitle: 'Deactivate Account',
      dangerSub: 'Once deactivated, all your file will be encrypted and inaccessible after 30 days. This action is irreversible.',
      dangerBtn: 'Request Deactivation',
      dangerConfirm: 'Are you sure?',
      dangerConfirmYes: 'Yes, deactivate',
      dangerConfirmNo: 'Cancel',
      errorRequired: 'This field is required.',
      errorUsernamePattern: 'Letters, numbers, _ and - only.',
      errorUsernameMin: 'Minimum 3 characters.',
      errorPhonePattern: 'Invalid phone number.',
      errorPasswordMin: 'Minimum 8 characters.',
      errorPasswordMismatch: 'Passwords do not match.',
      togglePasswordVisibility: 'Show/hide password',
    },

    // ✅ Section complètement traduite (était vide)
    about: {
      title: 'User Guide',
      priceTile: 'Regional Expertise',
      priceDescription: 'Select your country to view specialized archiving rates and localized document restoration protocols.',
      chooseCountry: 'Choose a country',
      loadingMessage: 'Loading rates…',
      loadingErrorMessage: 'Loading error',
      EmptyPrice: 'No rates available',
      descriptionEmptyPrice: 'No rates have been configured for this country yet.',
      selectCountry: 'Select a country',
      selectCountryDescription: 'Choose your region from the list on the left to view the specialized rates and restoration protocols.',
    },

    scanQr: {
      title: 'QR Code Scan',
      qrFoundTitle: 'Item found',
      qrReference: 'Reference',
      qrLabel: 'Label',
      declareFound: 'Declare as found',
      exploreLost: 'Browse lost items',
      loginPrompt: 'Login or create an account to continue.',
      registerPrompt: 'Create an account to continue.',
      loginBtn: 'Login',
      registerBtn: 'Register',
      loading: 'Loading…',
      invalidQrTitle: 'Invalid QR Code',
      invalidQrText: 'This QR code is invalid or has expired.',
      backHome: 'Back to home',
    },

    legal: {
      title: "Terms and Conditions",
      subtitle: "TKrestore Application",
      lastUpdated: "Last updated: May 07, 2026",
      sections: [
        {
          heading: "1. Definitions",
          content:
            "Application / Platform: refers to the TKrestore application accessible via mobile, web or any other digital medium.\n" +
            "User: any natural or legal person using TKrestore services.\n" +
            "Account: personal space created by a user to access the platform's features.\n" +
            "Lost item: any document, accessory or material property declared lost by a user.\n" +
            "Found item: any object or document found and then declared on the platform.\n" +
            "Services: all features offered by TKrestore.",
        },
        {
          heading: "2. Purpose of the platform",
          content:
            "TKrestore aims to facilitate:\n" +
            "• The declaration of lost objects or documents;\n" +
            "• The publication of found objects;\n" +
            "• Connecting owners with people who have found their belongings;\n" +
            "• Secure management of restoration requests;\n" +
            "• Tracking of reported objects;\n" +
            "• Notification of concerned users.\n\n" +
            "The platform acts solely as a technical intermediary between users.",
        },
        {
          heading: "3. Acceptance of terms",
          content:
            "Use of TKrestore implies full acceptance of these Terms and Conditions.\n" +
            "If the user refuses any part of these conditions, they must immediately stop using the platform.\n" +
            "TKrestore reserves the right to modify these T&Cs at any time.\n" +
            "Users will be notified of updates via the application or by email.",
        },
        {
          heading: "4. Access conditions",
          content:
            "Access to certain features requires:\n" +
            "• Creating a user account;\n" +
            "• Providing accurate and up-to-date information;\n" +
            "• Acceptance of the privacy policy.\n\n" +
            "The user warrants that the information provided at registration is accurate, complete and truthful.",
        },
        {
          heading: "5. Account creation",
          content:
            "To create an account, the user may need to provide:\n" +
            "• First and last name;\n" +
            "• Email address;\n" +
            "• Phone number;\n" +
            "• Secure password;\n" +
            "• Identity document (if required for certain verifications).\n\n" +
            "The user is solely responsible for the confidentiality of their login credentials.",
        },
        {
          heading: "6. Use of services",
          content:
            "The user agrees to use TKrestore in a legal, honest and responsible manner.\n\n" +
            "It is strictly prohibited to:\n" +
            "• Post false declarations;\n" +
            "• Impersonate a third party;\n" +
            "• Post fraudulent, offensive or illegal content;\n" +
            "• Use the platform for criminal purposes;\n" +
            "• Attempt to fraudulently access TKrestore systems;\n" +
            "• Distribute viruses or malware;\n" +
            "• Sell or exchange illicit items.",
        },
        {
          heading: "7. Declaration of objects and documents",
          content:
            "The user declares being the legitimate owner of any object reported as lost.\n\n" +
            "For found objects, the user undertakes to:\n" +
            "• Provide accurate information;\n" +
            "• Not misappropriate the found object;\n" +
            "• Cooperate with verification procedures.\n\n" +
            "TKrestore may request proof of ownership before any restoration.",
        },
        {
          heading: "8. Restoration procedure",
          content:
            "The restoration of an object may require:\n" +
            "• Identity verification;\n" +
            "• Proof of ownership;\n" +
            "• Administrative validation;\n" +
            "• A physical or virtual appointment.\n\n" +
            "TKrestore reserves the right to suspend a restoration if there is doubt about the actual ownership of the item.",
        },
        {
          heading: "9. TKrestore's liability",
          content:
            "TKrestore acts solely as an intermediary platform. As such, TKrestore does not guarantee:\n" +
            "• The effective recovery of a lost item;\n" +
            "• The authenticity of users' declarations;\n" +
            "• The permanent availability of services;\n" +
            "• The complete absence of errors or interruptions.",
        },
        {
          heading: "10. Personal data",
          content:
            "TKrestore collects and processes certain personal data to ensure the operation of its services.\n\n" +
            "Users have the following rights:\n" +
            "• Right of access;\n" +
            "• Right of rectification;\n" +
            "• Right of deletion;\n" +
            "• Right to object;\n" +
            "• Right to portability.",
        },
        {
          heading: "11. Paid services",
          content:
            "Certain features may be offered on a paid basis:\n" +
            "• Priority publication;\n" +
            "• Advanced verification;\n" +
            "• Premium notifications;\n" +
            "• Special assistance;\n" +
            "• Delivery or securing of restorations.\n\n" +
            "Applicable rates will be displayed before any subscription.",
        },
        {
          heading: "12. No prosecution of finders",
          content:
            "Any person who has found and declared an object or document on the TKrestore platform is acting in a civic and voluntary manner.\n\n" +
            "By using the platform, the user acknowledges that no legal action, abusive prosecution or unjustified claim may be brought against a person who has found and published an object or document, except in cases of proven fraud or bad faith clearly established by competent authorities.",
        },
        {
          heading: "13. Chat usage rules",
          content:
            "Users agree to adopt respectful behaviour in the discussion spaces.\n\n" +
            "It is notably prohibited to:\n" +
            "• Exchange abusive, threatening or fraudulent remarks;\n" +
            "• Share banking data or confidential codes;\n" +
            "• Engage in harassment or scam attempts.\n\n" +
            "Exchanges must remain strictly related to the restoration process.",
        },
        {
          heading: "14. Application ownership",
          content:
            "The TKrestore application is the exclusive property of TKSWIFT SERVICES.\n\n" +
            "Any reproduction, modification or unauthorised use is strictly prohibited without prior written consent from TKSWIFT SERVICES.",
        },
        {
          heading: "15. Contact",
          content:
            "For any questions regarding these terms:\n\n" +
            "TKrestore — TKSWIFT SERVICES\n" +
            "Email: info@tk-restore.com\n" +
            "Address: Yaoundé Biyem-assi GP Melen",
        },
      ],
    },
  
    privacyPolicy: {
      title: "Privacy Policy",
      subtitle: "TKrestore Application",
      lastUpdated: "Last updated: May 07, 2026",
      sections: [
        {
          heading: "1. Data controller identity",
          content:
            "The TKrestore application is operated by TKSWIFT SERVICES, the data controller for data collected via the platform.\n\n" +
            "Claims or information requests can be addressed to TKSWIFT SERVICES through official communication channels.",
        },
        {
          heading: "2. Data collected",
          content:
            "TKrestore may collect different categories of data:\n\n" +
            "Identification data: first and last name, username, profile photo, identity document.\n\n" +
            "Contact data: phone number, email address.\n\n" +
            "Object-related data: descriptions, photographs, approximate location, object category.\n\n" +
            "Payment data: transaction identifiers, payment history, Mobile Money information.\n\n" +
            "Technical data: IP address, device type, operating system, activity logs.\n\n" +
            "Communication data: chat exchanges, handover confirmations.",
        },
        {
          heading: "3. Purpose of data collection",
          content:
            "Collected data is used solely within the framework of TKrestore's operation, notably to:\n" +
            "• Enable the publication of objects and documents;\n" +
            "• Facilitate searches and connections;\n" +
            "• Verify user identity;\n" +
            "• Secure restorations;\n" +
            "• Prevent fraud;\n" +
            "• Manage payments;\n" +
            "• Comply with legal obligations.",
        },
        {
          heading: "4. Limited use of data",
          content:
            "Data published on TKrestore will not be used for purposes unrelated to the platform's operation.\n\n" +
            "TKrestore commits not to:\n" +
            "• Sell personal data;\n" +
            "• Exploit data for abusive purposes;\n" +
            "• Transmit data to unauthorised third parties;\n" +
            "• Use data for illegal activities.",
        },
        {
          heading: "5. Data sharing",
          content:
            "Certain data may only be shared:\n" +
            "• With users involved in a restoration;\n" +
            "• With authorised technical service providers;\n" +
            "• With payment services;\n" +
            "• With competent authorities when legally required.",
        },
        {
          heading: "6. Moderation and monitoring",
          content:
            "To ensure platform security:\n" +
            "• Publications may be moderated;\n" +
            "• Chat exchanges may be monitored;\n" +
            "• Suspicious activities may be analysed by automated systems and human moderators.\n\n" +
            "TKrestore uses AI-assisted fraud detection tools to protect users and secure transactions.",
        },
        {
          heading: "7. Data retention",
          content:
            "Data is retained for a reasonable period necessary for:\n" +
            "• Service operation;\n" +
            "• Dispute management;\n" +
            "• Legal obligations;\n" +
            "• Fraud prevention.\n\n" +
            "TKrestore may delete or anonymise certain data when retention is no longer necessary.",
        },
        {
          heading: "8. Data security",
          content:
            "TKrestore implements reasonable technical and organisational measures to protect data against:\n" +
            "• Unauthorised access;\n" +
            "• Data loss;\n" +
            "• Fraudulent modifications;\n" +
            "• Abusive disclosures;\n" +
            "• Cyberattacks.\n\n" +
            "However, no computer system can guarantee absolute security.",
        },
        {
          heading: "9. User rights",
          content:
            "Users have the following rights:\n" +
            "• Right of access;\n" +
            "• Right of rectification;\n" +
            "• Right of deletion;\n" +
            "• Right to object;\n" +
            "• Right to restriction;\n" +
            "• Right to withdraw consent.\n\n" +
            "Any request can be addressed to TKSWIFT SERVICES.",
        },
        {
          heading: "10. Minors",
          content:
            "Minor users must use TKrestore under the supervision of a parent or legal guardian in accordance with applicable laws.",
        },
        {
          heading: "11. Payments and third-party services",
          content:
            "Payments made via TKrestore may be processed by specialised third-party providers, including Mobile Money services and secure payment gateways such as PawaPay.\n\n" +
            "TKrestore does not have access to passwords or secret codes linked to users' financial accounts.",
        },
        {
          heading: "12. Contact",
          content:
            "For any questions regarding privacy or data protection:\n\n" +
            "TKSWIFT SERVICES — TKrestore Application\n" +
            "Email: info@tkswift.com\n" +
            "Address: Face GP MELEN BIYEM ASSI, YAOUNDE",
        },
      ],
    },
  
    dataProcessing: {
      title: "Data Processing Agreement",
      subtitle: "Consent required to continue",
      intro:
        "Before using TKrestore services, you must read and accept our personal data processing agreement. Your data is used exclusively to facilitate the restoration of your lost documents and objects.",
      checkboxLabel:
        "I accept TKrestore's personal data processing agreement",
      acceptBtn: "Accept and continue",
      declineBtn: "Decline",
      alreadyAccepted: "You have already accepted the processing agreement.",
      viewTerms: "View Terms & Conditions",
      viewPrivacy: "View Privacy Policy",
      modal: {
        title: "Decline agreement",
        body: "By declining the data processing agreement, you will not be able to access TKrestore's features. Are you sure you want to decline?",
        confirm: "Yes, decline",
        cancel: "Cancel",
      },
      badge: "Protected data",
    },

    dpa:{
       title: 'Data Processing Agreement (DPA)',
        subtitle: 'TKrestore Application — TKSWIFT SERVICES',
        lastUpdated: 'Last updated: May 07, 2026',
        sections: [
          {
            heading: '1. Identification of parties',
            content:
              'Data controller: TKSWIFT SERVICES, operator of the TKrestore application, responsible for the collection and processing of personal data carried out via the platform.\n\n' +
              'User: any natural or legal person using the services offered by TKrestore.',
          },
          {
            heading: '2. Purpose of the agreement',
            content:
              'This agreement aims to define:\n' +
              '• the modalities of personal data processing;\n' +
              '• the obligations of TKrestore;\n' +
              '• the rights of users;\n' +
              '• the security measures applied;\n' +
              '• the conditions for use and retention of data.',
          },
          {
            heading: '3. Data processed',
            content:
              'TKrestore may process the following categories of data:\n\n' +
              'Identification data: name and surname, username, profile photo, identity document, verification information.\n\n' +
              'Contact data: phone number, email address, contact addresses.\n\n' +
              'Item and document data: descriptions, images, categories, approximate locations, return history.\n\n' +
              'Financial data: payment information, transaction identifiers, Mobile Money confirmations, payment history.\n\n' +
              'Technical data: IP address, connection information, device type, activity logs, technical identifiers.\n\n' +
              'Communication data: messages exchanged via chats, handover confirmations, reports and complaints.',
          },
          {
            heading: '4. Purposes of processing',
            content:
              'Collected data is used solely within the framework of TKrestore\'s services, including:\n' +
              '• managing user accounts;\n' +
              '• facilitating the return of items and documents;\n' +
              '• verifying identities;\n' +
              '• preventing fraud;\n' +
              '• securing transactions;\n' +
              '• ensuring moderation;\n' +
              '• managing payments;\n' +
              '• improving platform performance;\n' +
              '• processing complaints;\n' +
              '• complying with legal obligations.',
          },
          {
            heading: '5. Legal basis for processing',
            content:
              'The processing of personal data is based on:\n' +
              '• user consent;\n' +
              '• execution of requested services;\n' +
              '• legal obligations;\n' +
              '• legitimate interests related to security and fraud prevention.',
          },
          {
            heading: '6. Limited use of data',
            content:
              'Data collected on TKrestore will only be used for the purposes of operating the platform.\n\n' +
              'TKrestore commits not to:\n' +
              '• sell personal data;\n' +
              '• exploit data for abusive purposes;\n' +
              '• transmit data to unauthorised third parties;\n' +
              '• use data for illegal activities.',
          },
          {
            heading: '7. Moderation and monitoring',
            content:
              'To ensure platform security:\n' +
              '• publications may be verified;\n' +
              '• chats may be moderated;\n' +
              '• suspicious activities may be analysed;\n' +
              '• artificial intelligence systems may be used to detect fraud.\n\n' +
              'TKrestore may suspend accounts or limit certain features in case of suspicious activity.',
          },
          {
            heading: '8. Data sharing',
            content:
              'Data may be shared only:\n' +
              '• with users involved in a return;\n' +
              '• with authorised technical service providers;\n' +
              '• with payment services;\n' +
              '• with competent authorities;\n' +
              '• in the context of a security or fraud investigation.\n\n' +
              'TKrestore strictly limits data access to authorised individuals.',
          },
          {
            heading: '9. Third-party services and payments',
            content:
              'Payments made via TKrestore may be processed by secure third-party providers, including Mobile Money services and platforms such as PawaPay.\n\n' +
              'TKrestore does not store users\' financial secret codes or passwords.',
          },
          {
            heading: '10. Family links and smart search',
            content:
              'TKrestore may use certain relational or family information voluntarily provided by users in order to improve searches and returns.\n\n' +
              'This information is used solely within the framework of smart search features and secure matchmaking.',
          },
          {
            heading: '11. Data security',
            content:
              'TKrestore implements reasonable technical and organisational measures to protect data against:\n' +
              '• unauthorised access;\n' +
              '• accidental loss;\n' +
              '• fraudulent modifications;\n' +
              '• abusive disclosures;\n' +
              '• cyberattacks.\n\n' +
              'However, no computer system can guarantee absolute security.',
          },
          {
            heading: '12. Data retention',
            content:
              'Data is retained for a reasonable period necessary for:\n' +
              '• service operation;\n' +
              '• dispute management;\n' +
              '• fraud prevention;\n' +
              '• legal and regulatory obligations.\n\n' +
              'TKrestore may delete or anonymise certain data when its retention is no longer necessary.',
          },
          {
            heading: '13. User rights',
            content:
              'Users have the following rights:\n' +
              '• right of access;\n' +
              '• right of rectification;\n' +
              '• right of deletion;\n' +
              '• right to object;\n' +
              '• right to restriction;\n' +
              '• right to withdraw consent.\n\n' +
              'Any request relating to personal data can be addressed to TKSWIFT SERVICES.',
          },
          {
            heading: '14. International transfers',
            content:
              'Certain data may be hosted or processed on servers located outside the user\'s country of residence.\n\n' +
              'TKrestore implements reasonable measures to ensure an appropriate level of data protection.',
          },
          {
            heading: '15. Confidentiality',
            content:
              'TKrestore commits to preserving the confidentiality of processed data and limiting access to authorised individuals only.\n\n' +
              'Employees, moderators, partners and service providers with access to data are subject to confidentiality obligations.',
          },
          {
            heading: '16. Data breach',
            content:
              'In the event of a security incident or data breach likely to affect users, TKrestore will take reasonable measures to:\n' +
              '• limit the impact;\n' +
              '• secure the systems;\n' +
              '• inform affected users when necessary;\n' +
              '• cooperate with competent authorities.',
          },
          {
            heading: '17. Agreement updates',
            content:
              'TKrestore reserves the right to modify this Data Processing Agreement at any time.\n\n' +
              'Users will be notified of important updates via the application or any other appropriate means.',
          },
          {
            heading: '18. Contact',
            content:
              'TKSWIFT SERVICES\n' +
              'Application: TKrestore\n' +
              'Email: info@tkswift.com\n' +
              'Address: GP MELEN BIYEM ASSI YAOUNDE',
          },
          {
            heading: '19. Entry into force',
            content:
              'This Data Processing Agreement enters into force upon its publication on the TKrestore application.',
          },
        ],
    },
    
    error: {
      E_429: "Too many attempts. Please try again in a few minutes.",
      E_401: "Unauthenticated. Please sign in.",
      E_403: "You do not have permission to perform this action.",
      E_404: "The requested resource could not be found.",
      E_500: "Server error. Please try again later.",
      E_400: "Invalid data.Please check your input and try again.",
      E_validation: "Please check the fields with errors.",
      E_network: "Unable to reach the server. Please check your connection.",
      E_inscription: "Registration error. Please try again.",
      E_cgu: 'Please accept the terms and conditions.',
      E_mdp: 'Passwords do not match.',
      E_phone: 'Invalid phone number',
      E_email: 'Invalid email address',
      E_recaptcha: 'Security error. Please try again.',
    },
    chat: {
      title:                     'Messaging',
      selectConversation:        'Select a conversation',
      selectConversationSub:     'Choose a chat from the list to start exchanging.',
      noConversation:            'No conversations',
      noConversationSub:         'No discussions available yet.',
      searchPlaceholder:         'Search a conversation…',
      filterAll:                 'All',
      filterOpen:                'Open',
      filterActive:              'Active',
      filterArchived:            'Archived',
      typePlaceholder:           'Write your message…',
      send:                      'Send',
      sending:                   'Sending…',
      archivedNotice:            'This conversation is archived. Messaging is disabled.',
      noMessages:                'No messages yet. Start the conversation!',
      statusOpen:                'Open',
      statusActive:              'Active',
      statusArchived:            'Archived',
      statusCompleted:           'Completed',
      attachFile:                'Attach a file',
      attachmentPreview:         'Preview',
      downloadAttachment:        'Download',
      closePreview:              'Close',
      handoverGenerateBtn:       'Generate my handover code',
      handoverRegenerateBtn:     'Regenerate code',
      handoverCodeLabel:         'Show this code to the finder',
      handoverCodeExpired:       'Code expired — please regenerate',
      handoverConfirmedBadge:    'Handover confirmed',
      handoverInitiateTooltip:   'Generate my recovery code',
      handoverRegenerateTooltip: 'Regenerate a new code',
      handoverEnterCodeBtn:      'Enter handover code',
      handoverEnterCodeTooltip:  'Enter the code provided by the owner',
      loserConfirmTitle:         'The finder validated the code. Did you recover your document?',
      loserConfirmBtn:           'Yes, I got it back!',
      otpModalTitle:             'Enter handover code',
      otpModalSubtitle:          'Enter the 6-digit code provided by the owner.',
      otpConfirmBtn:             'Validate code',
      otpValidating:             'Validating…',
      otpErrorInvalid:           'Incorrect code. Please check and try again.',
      otpClose:                  'Cancel',
      handoverSystemInitiated:   'The owner has generated their handover code.',
      handoverSystemConfirmed:   'Code validated by the finder. Handover confirmed.',
      handoverSystemComplete:    'Handover complete. Payment will be released.',
      itemInfoTitle:             'Your document',
      paymentStatus:             'Payment',
      paymentPaid:               'Paid — awaiting handover',
      paymentReleased:           'Released to finder',
      finderInfoTitle:           'Document to hand over',
      finderStep1:               'Ask the owner to generate their code in the chat.',
      finderStep2:               'Get the 6-digit code from the owner.',
      finderStep3:               'Click "Enter code" and type it in.',
      finderStep4:               'Once validated, the payment will be sent to you.',
      sendError:                 'Error sending message. Please try again.',
      handoverInitError:         'Unable to generate code. Please try again.',
      handoverConfirmError:      'Invalid or expired code.',
      welcomeTitle: "Welcome to your recovery space",
      welcomeSubtitle: "You are in contact with the person who found your document. Here are some important guidelines:",
      conversationTitle: "Conversation recorded",
      conversationDescription: "All messages exchanged in this conversation are securely stored and archived."
      ,publicPlaceTitle: "Prefer public places",
      publicPlaceDescription: "For the handover, choose a busy location such as a shopping center, train station, or café. Avoid isolated places."
      ,noMoneyTitle: "Never send money",
      noMoneyDescription: "We cannot be held responsible for any money transfers. The platform never requests additional payments."
     ,codeTitle: "The code confirms the handover",
      codeDescription: "Once you meet the finder, generate your code (top-right button). This code proves that you are the rightful owner and confirms the document handover."
      ,footerMessage: "Send your first message to start the conversation with the finder.",
          
      finderWelcomeTitle: "Thank you for finding this document!",
      finderWelcomeSubtitle: "You are in contact with the legal owner. Here's how the handover works:",

      finderConversationTitle: "Conversation recorded",
      finderConversationDescription: "All messages exchanged in this conversation are securely stored and archived.",

      finderPublicPlaceTitle: "Prefer public places",
      finderPublicPlaceDescription: "For the handover, agree on a busy location such as a shopping mall, train station, or café. Avoid isolated places.",

      finderCodeTitle: "The handover is confirmed by code",
      finderCodeDescription: "The handover is validated only after entering the code received from the legal owner (lock button at the top right). Without this code, the handover is not confirmed.",

      finderFooterMessage: "Send your first message to start the conversation with the owner.",

      restorationSuccessTitle:   ' Restoration successful!',
      restorationSuccessMessage: 'The document has been successfully returned to its owner. This conversation is now archived.',
      restorationSuccessThanks:  'Thank you for using TKRestore. Together, we help return lost documents and build trust in our community.',
      restorationSuccessHomeBtn: 'Back to home',
      restorationSuccessStayBtn: 'Stay in chat',

    },
    tutorials: {
      sectionLabel: 'Tutorials',
      sectionTitle: 'Learn how to use TKRestore',
      sectionSub: 'Step-by-step video guides to declare, find and recover your lost documents.',
      playlistLabel: 'Playlist',
      seeChannel: 'See full channel',
      videoCount: '{{count}} videos',
      watchVideo: 'Watch video',
      noVideos: 'No videos available for this category',
      pricingLabel: 'Pricing',
      pricingFor: 'Pricing for',
      services: 'services',
      toPay: 'to pay',
      toReceive: 'to receive',
      legendPayer: 'Amount paid by the owner',
      legendFinder: 'Amount received by the finder',
      retry: 'Retry',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // ESPAÑOL
  // ══════════════════════════════════════════════════════════════════════
  es: {
    nav: {
      home: 'Inicio',
      declareLost: 'Reportar un documento perdido',
      declareBrowse: 'Declarar un hallazgo',
      dashboard: 'Panel',
      about: 'Acerca de',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      register: 'Registrarse',
    },

    home: {
      badge: 'Recuperación fiable de documentos',
      heroTitle: 'Recupera tus ',
      heroHighlight: 'Documentos Perdidos',
      heroSub: 'Únete a nuestra red segura para recuperar DNI, pasaportes, diplomas y mucho más.',
      ctaDeclare: 'Declarar documento perdido',
      ctaBrowse: 'Explorar documentos encontrados',
      // ✅ Corrigé — était en français
      homeTitle: 'Publicaciones encontradas',
      homeSub: 'Flujo de documentos reportados',
      recentTitle: 'Encontrados recientemente',
      recentSub: 'Actualizaciones en vivo de artículos reportados en las últimas 24 horas',
      loadMore: 'Cargar más',
      viewDetails: 'Ver detalles',
      foundBadge: 'Encontrado',
      foundOn: 'Encontrado el',
      whyChoose: "¿Por qué elegir",
      slogan: "« Nada se pierde, todo se restaura »",

      countriesDescription: "Gran comunidad internacional",
      countriesLabel: "Países",

      usersDescription: "Comunidad activa y en crecimiento",
      usersLabel: "Nuestros usuarios",

      publicationsDescription: "Publicaciones compartidas cada hora en todo el mundo",
      publicationsLabel: "Nuestras publicaciones",

      restorationsDescription: "Documentos y objetos restaurados en tiempo real",
      restorationsLabel: "Nuestras restauraciones"
    },

    documents: {
      title: 'Mis documentos activos',
      total: 'documento(s)',
      newDeclaration: 'Nueva declaración',
      filterType: 'Filtrar por tipo:',
      filterAll: 'Todos',
      filterLost: 'Perdido',
      filterFound: 'Encontrado',
      loadMore: 'Ver más documentos',
      deleteConfirmTitle: 'Confirmar eliminación',
      deleteConfirmText: '¿Estás seguro de que deseas eliminar este documento? Esta acción es irreversible.',
      deleteBtn: 'Eliminar',
      cancelBtn: 'Cancelar',
      noDocumentsTitle: 'Sin documentos',
      noDocumentsText: 'Comienza declarando tu primer documento perdido o encontrado.',
      firstDeclaration: 'Declarar mi primer documento',
      loading: 'loading',
      see: 'Ver',
      enabled: 'Habilitado',
      disabled: 'Inhabilitado',
      deleted: 'Eliminado',
      seeMore: 'Cargar más',
      noQrTitle: 'Sin código QR',
      noQrMessage: "Aún no has creado un código QR. Crea uno para asociarlo a tus objetos valiosos.",
      createFirstQr: 'Crear mi primer código QR',
      restore: 'Restaurado',
      details: 'Detalles',
      chat: 'Chat',
      emptyRestoration: 'Sin restauración',
      emptyMessage: "Aún no has recuperado ningún objeto. Haz una declaración para comenzar.",
      qrModalTitle: 'Código QR completo',
      qrModalMessage: "Usa este código QR para asociarlo a tu objeto.",
      modalDetailR: 'Referencia',
      modalDetailStatut: 'Estado',
      modalDetailRestoreTitle: 'Objeto restaurado',
      modalInformation: 'Información',
      modalActionOpenChat: 'Abrir chat',
      close: 'Cerrar',
      place: 'Lugar',
      category: 'Categoría',
      rejectDetails: "Detalles del rechazo",
      qrCodeTitle: "Mis códigos QR",
      restorationTitle: "Mis recuperaciones",
      confirmedRestored: "Restaurados confirmados",
      rejectedRestored: "Restaurados rechazados",
      confirmRestorationTitle: 'Confirmar la restauración',
      rejectRestorationTitle: 'Rechazar la restauración',
      confirmRestorationDescription: 'Confirma que la restauración es correcta. A continuación se realizará la finalización del proceso.',
      rejectRestorationDescription: 'Confirma el rechazo. Se iniciará un proceso de reembolso.',
      rejected:              'Rechazado',
      viewRejectReason:      'Ver motivo de rechazo',
      rejectModalTitle:      'Declaración rechazada',
      rejectReasonLabel:     'Motivo del rechazo',
      rejectDescriptionLabel:'Detalles',
      rejectNoDetails:       'No hay detalles disponibles. Contacte con soporte.',
    },

    dashboard: {
      gains: 'Ganancias',
      expenses: 'Gastos',
      restored: 'Restaurados',
      declared: 'Declarados',
      balance: 'Saldo actual',
      evolutionFinancial: 'Evolución financiera',
      evolutionMonthly: 'Evolución mensual',
      evolutionYearly: 'Distribución anual',
      viewMonthly: 'Mensual',
      viewYearly: 'Anual',
      currentYear: '{{ selectedYear() }}',
      soldeActuel: 'Saldo actual',
      soldeDisponible: 'Saldo disponible',
      historyRecent: 'Historial reciente',
      noTransactions: 'Sin transacciones este año',
      matched: "",
      totalItems: "",
    },

    auth: {
      welcomeBack: 'Bienvenido de nuevo',
      username: 'Nombre de usuario',
      country: 'País',
      loginSub: 'Ingresa tus credenciales para acceder a tus documentos.',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      rememberDevice: 'Recordar este dispositivo',
      signIn: 'Iniciar sesión',
      noAccount: '¿No tienes cuenta?',
      registerLink: 'Crear una cuenta',
      createAccount: 'Crear cuenta segura',
      registerSub: 'Comienza a recuperar tus documentos en minutos.',
      full_name: 'Nombre completo',
      phone: 'Número de teléfono',
      password_confirmation: 'Confirmar contraseña',
      acceptTerms: 'Acepto los ',
      terms: 'Términos de servicio',
      privacy: 'Política de privacidad',
      createBtn: 'Crear mi cuenta',
      alreadyAccount: '¿Ya tienes una cuenta?',
      signInLink: 'Iniciar sesión',
      identifierLabel:         "Identificador",
      identifierPlaceholder:   "Correo, usuario o teléfono",
      identifierHint:          "Inicia sesión con tu correo, nombre de usuario o número de teléfono (ej: 237690000000).",
      loginIdentifierRequired: "Por favor ingresa tu correo, nombre de usuario o número de teléfono.",
      passwordRequired:        "La contraseña es obligatoria.",
      passwordMin:             "La contraseña debe tener al menos 8 caracteres.",
      loginSuccess:            "¡Sesión iniciada correctamente! Bienvenido.",
      invalidCredentials:      "Identificador o contraseña incorrectos.",
      emailNotVerified:        "Tu correo no está verificado. Revisa tu bandeja de entrada.",
      accountInactive:         "Tu cuenta está desactivada. Contacta al soporte.",
      tooManyAttempts:         "Demasiados intentos. Inténtalo de nuevo en unos minutos.",
      serverError:             "Ocurrió un error. Por favor inténtalo de nuevo.",
      recaptchaError:          "Error de seguridad. Por favor inténtalo de nuevo.",
      signingIn:               "Iniciando sesión…",
      successOtpMsg:       "¡Código OTP enviado! Revisa tu correo o teléfono para continuar.",
    },

    declare: {
      modeLost: 'Declaración de pérdida',
      modeFound: 'Declaración de hallazgo',
      titleLost: 'Declarar documento perdido',
      titleFound: 'Declarar documento encontrado',
      subtitleLost: 'Portal oficial para reportar la pérdida de documentos de identidad.',
      subtitleFound: 'Reporta un documento encontrado para ayudar a su propietario a recuperarlo.',
      // ✅ Corrigé — mélange FR/ES corrigé
      documentType: 'Tipo de documento',
      documentTypePlaceholder: 'Selecciona un tipo',
      passport: 'Pasaporte internacional',
      nationalId: 'Documento Nacional de Identidad',
      driversLicense: 'Licencia de conducir',
      birthCertificate: 'Acta de nacimiento',
      nameOnDocument: 'Nombre en el documento',
      nameOnDocumentPlaceholder: 'Nombre completo tal como aparece',
      documentNumber: 'Número de documento',
      documentNumberPlaceholder: 'ej. A12345678',
      dateLost: 'Fecha de pérdida',
      dateFound: 'Fecha en que fue encontrado',
      lastKnownLocation: 'Último lugar conocido',
      foundLocation: 'Lugar donde fue encontrado',
      lastKnownLocationPlaceholder: 'Ciudad, calle o punto de referencia',
      description: 'Descripción detallada',
      descriptionPlaceholder: 'Describe las circunstancias de la pérdida (opcional)',
      descriptionFoundPlaceholder: 'Describe el documento proporcionando información relevante para facilitar su búsqueda.',
      photos: 'Fotos del documento',
      // ✅ Corrigé — "photos" en fin de string corrigé
      photosHint: 'Haz clic o arrastra y suelta tus archivos aquí',
      photosFormat: 'PNG, JPG hasta 5 MB cada uno',
      photosMax: '3 archivos máximo',
      addMorePhotos: 'Agregar más fotos',
      submit: 'Enviar declaración',
      errorRequired: 'Este campo es obligatorio.',
      errorMin: 'El valor es demasiado corto.',
       successMessage: '¡Declaración enviada con éxito! Recibirás un correo de confirmación.',
      errorGeneral: 'Error al enviar. Por favor, inténtalo de nuevo.',
      error403: 'Debes iniciar sesión para enviar una declaración.',
      error422: 'Revisa los campos con errores e inténtalo de nuevo.',
      errorCategoryNotFound: 'Categoría "Documento" no encontrada. Contacta con el soporte.',
      errorSubCategories: 'No se pudieron cargar los tipos de documentos. Inténtalo de nuevo.',
      errorCategories: 'No se pudieron cargar las categorías. Inténtalo de nuevo.',
      errorFileTooLarge: 'supera los 5 MB y fue ignorado.',
      errorFileType: 'Formato no aceptado. Usa JPG o PNG.',
      statusDraft: 'En revisión',
      statusActive: 'Activo',
      statusMatched: 'Restitución en curso',
      statusReturned: 'Restituido',
      statusArchived: 'Archivado',
      errorNoFiles: 'Al menos una foto del documento es obligatoria.',
    },

    restore: {
      title: 'Completar tu restauración',
      stepPayment: 'Confirmación & pago',
      stepRestore: 'Restauración',
      previewTitle: 'Vista previa de restauración',
      previewRestricted: 'Acceso restringido',
      previewLockedTitle: 'Vista previa bloqueada',
      previewLockedSub: 'Completa el pago para desbloquear la versión restaurada.',
      termsTitle: 'Términos & política de restauración',
      termsSubtitle: 'Marca las 3 casillas para activar el pago.',
      term1Title: 'Garantía de claridad mejorada',
      term1Sub: 'Mejora mínima garantizada para textos dañados.',
      term2Title: 'Pago único',
      term2Sub: 'Sin suscripción. Solo pagas por este trabajo.',
      term3Title: 'Acepto el Acuerdo de Procesamiento de Datos',
      term3Sub: 'Tu archivo será eliminado de nuestros servidores en 24 horas.',
      termsProgress: 'Marca las 3 casillas para activar el pago',
      termsAllDone: '✓ Todos los términos aceptados — pago activado',
      checkoutTitle: 'Pago móvil seguro',
      feeLabel: 'Tarifa de restauración',
      storageLabel: 'Almacenamiento en la nube (24h)',
      totalLabel: 'Monto total',
      operatorLabel: 'Operador móvil',
      phoneLabel: 'Número de Mobile Money',
      pushInfo: 'Se enviará una notificación push a tu teléfono para confirmar el pago.',
      payBtn: 'Pagar & iniciar restauración',
      payLocked: 'Acepta todos los términos primero',
      payProcessing: 'Procesando…',
      payHint: 'Marca las 3 condiciones para activar este botón',
      badgeSecure: 'Pago seguro',
      badgeEncrypted: 'Datos cifrados',
      errorOperator: 'Por favor selecciona un operador.',
      errorPhone: 'Número de teléfono inválido.',
      reduceTxt: 'Descuento',
      emptyOperator: 'No hay operadores disponibles para este país.',
      paymentAccepted: "Esperando confirmación... Pago iniciado con éxito. Confirma en tu teléfono",
      paymentConfirmed: "¡Pago confirmado!",
      paymentFailed: "Pago fallido",
      paymentRejected: "Pago rechazado",
      verificationInProgress: "Verificación en curso...",
      paymentDisable: "Pago desactivado",
      ownerCanPay: "No puede realizar el pago en sus propios documentos.",
      ownerAmount: "Su monto del pago después de la restauración.",
      ownerPhoneInformation: "El pago está en este número después de la restauración del documento.",
      modalNotification: "Notificaciones",
      modalPayTitle: "Confirmar pago",
      modalPayText: "Se ha enviado una solicitud desde",
      modalAwatingConfirmation: "Esperando confirmación...",
      modalUserApproveModalInformation: "Debería recibir una notificación en su teléfono para confirmar el pago.",
      NotFoundDocument: "Documento no encontrado o no elegible para restauración.",
      confirmDocumentTitle: '¿Este documento le pertenece?',
      confirmDocumentDescription: 'Su pago ha sido confirmado. Verifique que el documento mostrado sea realmente suyo antes de continuar.',
      confirmDocumentDescriptionNext: 'Esta acción es irreversible.',
      confirmDocumentBtnLbl: 'Sí, es mi documento',
      rejetctDocumentBtnLbl: 'No, no es mi documento',
      warningDocumentBtn: 'En caso de rechazo, se iniciará automáticamente un reembolso.',
      confirmRestoreTitle: 'Restauración confirmada',
      confirmRestoreDescription: 'El proceso de entrega ha sido iniciado. Recibirá un correo electrónico de confirmación en breve.',
      rejectModalTitle:       'Documento rechazado',
      rejectModalMessage:     'Has reportado que este documento no te pertenece. Gracias por tu honestidad.',
      rejectModalRefundInfo:  'Se ha iniciado un reembolso. El importe será devuelto en 24 a 48 horas según tu operador de Mobile Money.',
      rejectModalSearchBtn:   'Buscar otro documento',
      rejectModalDocumentsBtn:'Mis documentos',
    },

    footer: { 
      rights: 'Todos los derechos reservados.',
      description: "Encuentra fácilmente tus objetos perdidos gracias a una plataforma moderna, rápida y segura que conecta a los propietarios con quienes encuentran los objetos.",
      download_on: "Descargar en",
      get_on: "Disponible en"
     },

    sidebar: {
      dashboard: 'Panel',
      declareLost: 'Declarar pérdida',
      declareBrowse: 'Declarar hallazgo',
      chat: 'Mensajes',
      documents: 'Mis documentos',
      history: 'Historial',
      settings: 'Configuración',
      secureEntity: 'Asegurar un objeto',
    },

    secure_object: {
      title: 'Asegurar tu objeto',
      subtitle: 'Genera un código QR único con tu información',
      yourInfo: 'Tu información',
      name: 'Nombre',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      objectInfo: 'Información del objeto',
      label: 'Etiqueta del objeto',
      description: 'Descripción',
      generating: 'Generando…',
      submit: 'Generar código QR',
      help: 'El código QR se almacenará de forma segura y estará vinculado a tu cuenta.',
    },

    search: {
      title: 'Búsqueda',
      heroTitle: 'Buscar un ',
      heroHighlight: 'Documento',
      heroSub: 'Busca en la base de datos global documentos de identidad y legales recuperados.',
      placeholder: 'Buscar por nombre, número de documento o lugar…',
      searchBtn: 'Buscar',
      filtersLabel: 'Filtrar por categoría',
      filterAll: 'Todos',
      filterCni: 'DNI',
      filterPassport: 'Pasaporte',
      filterBirth: 'Acta de nacimiento',
      filterLicense: 'Licencia de conducir',
      filterOther: 'Otro',
      resultsTitle: 'Documentos encontrados',
      resultsCount: 'resultados',
      sortBy: 'Ordenar por:',
      sortDate: 'Fecha de hallazgo',
      sortRelevance: 'Relevancia',
      sortLocation: 'Lugar',
      foundBadge: 'Encontrado',
      // ✅ Corrigé — était "Lost" en anglais
      lostBadge: 'Perdido',
      foundOn: 'Encontrado el',
      viewDetails: 'Ver detalles',
      loadMore: 'Cargar más documentos',
      emptyTitle: 'Sin resultados',
      emptySub: 'Prueba otros términos o cambia el filtro de categoría.',
    },

    settings: {
      title: 'Configuración de la cuenta',
      language: 'Idioma',
      subtitle: 'Administra tus datos personales, protege tu cuenta y configura tus preferencias.',
      profileTitle: 'Información del perfil',
      profileSub: 'Actualiza tu identidad pública e información de contacto.',
      full_name: 'Nombre completo',
      full_namePlaceholder: 'Juan García',
      username: 'Nombre de usuario',
      usernamePlaceholder: 'mi_usuario',
      email: 'Correo electrónico',
      emailReadOnly: 'Solo lectura',
      emailReadOnlyAria: 'Correo electrónico — campo de solo lectura',
      emailReadOnlyHint: 'Contacta al soporte para cambiar tu dirección de correo.',
      phone: 'Número de teléfono',
      saveProfile: 'Guardar perfil',
      saving: 'Guardando…',
      passwordTitle: 'Cambiar contraseña',
      passwordSub: 'Elige una contraseña segura de al menos 8 caracteres.',
      currentPassword: 'Contraseña actual',
      newPassword: 'Nueva contraseña',
      password_confirmation: 'Confirmar nueva contraseña',
      newPasswordSection: 'Nueva contraseña',
      passwordMatch: 'Las contraseñas coinciden',
      savePassword: 'Cambiar contraseña',
      prefsTitle: 'Preferencias',
      prefsSub: 'Configura tus notificaciones y la seguridad de tu cuenta.',
      emailNotifTitle: 'Notificaciones por correo',
      emailNotifSub: 'Recibe resúmenes diarios de recuperación y alertas de archivo.',
      twoFATitle: 'Autenticación de dos factores',
      twoFASub: 'Agrega una capa adicional de seguridad a tu cuenta.',
      dangerTitle: 'Desactivar cuenta',
      dangerSub: 'Una vez desactivada, todos tus datos serán cifrados e inaccesibles después de 30 días. Esta acción es irreversible.',
      dangerBtn: 'Solicitar desactivación',
      dangerConfirm: '¿Estás seguro?',
      dangerConfirmYes: 'Sí, desactivar',
      dangerConfirmNo: 'Cancelar',
      errorRequired: 'Este campo es obligatorio.',
      errorUsernamePattern: 'Solo letras, números, _ y -.',
      errorUsernameMin: 'Mínimo 3 caracteres.',
      errorPhonePattern: 'Número de teléfono inválido.',
      errorPasswordMin: 'Mínimo 8 caracteres.',
      errorPasswordMismatch: 'Las contraseñas no coinciden.',
      togglePasswordVisibility: 'Mostrar/ocultar contraseña',
    },

    // ✅ Section complètement traduite (était vide)
    about: {
      title: 'Guía de uso',
      priceTile: 'Experiencia regional',
      priceDescription: 'Selecciona tu país para consultar las tarifas de archivo especializadas y los protocolos de restauración de documentos localizados.',
      chooseCountry: 'Elegir un país',
      loadingMessage: 'Cargando tarifas…',
      loadingErrorMessage: 'Error de carga',
      EmptyPrice: 'Sin tarifas disponibles',
      descriptionEmptyPrice: 'Aún no se han configurado tarifas para este país.',
      selectCountry: 'Selecciona un país',
      selectCountryDescription: 'Elige tu región en la lista de la izquierda para ver las tarifas especializadas y los protocolos de restauración.',
    },

    scanQr: {
      title: 'Escanear QR Code',
      qrFoundTitle: 'Objeto encontrado',
      qrReference: 'Referencia',
      qrLabel: 'Etiqueta',
      declareFound: 'Declarar como encontrado',
      // ✅ Corrigé — était en français "Explorer les objets perdus"
      exploreLost: 'Explorar objetos perdidos',
      loginPrompt: 'Inicia sesión o crea una cuenta para continuar.',
      registerPrompt: 'Crea una cuenta para continuar.',
      loginBtn: 'Iniciar sesión',
      registerBtn: 'Registrarse',
      loading: 'Cargando…',
      invalidQrTitle: 'Código QR inválido',
      invalidQrText: 'Este código QR es inválido o ha expirado.',
      backHome: 'Volver al inicio',
    },

    legal: {
    title: "Términos y Condiciones de Uso",
    subtitle: "Aplicación TKrestore",
    lastUpdated: "Última actualización: 07 de mayo de 2026",
    sections: [
      {
        heading: "1. Definiciones",
        content:
          "Aplicación / Plataforma: se refiere a la aplicación TKrestore accesible a través de dispositivos móviles, web u otros medios digitales.\n" +
          "Usuario: cualquier persona física o jurídica que utilice los servicios de TKrestore.\n" +
          "Cuenta: espacio personal creado por un usuario para acceder a las funciones de la plataforma.\n" +
          "Objeto perdido: cualquier documento, accesorio o bien material declarado como perdido por un usuario.\n" +
          "Objeto encontrado: cualquier objeto o documento encontrado y luego declarado en la plataforma.\n" +
          "Servicios: el conjunto de funcionalidades ofrecidas por TKrestore.",
      },
      {
        heading: "2. Objeto de la plataforma",
        content:
          "TKrestore tiene como objetivo facilitar:\n" +
          "• La declaración de objetos o documentos perdidos;\n" +
          "• La publicación de objetos encontrados;\n" +
          "• La conexión entre propietarios y personas que han encontrado sus pertenencias;\n" +
          "• La gestión segura de las solicitudes de restitución;\n" +
          "• El seguimiento de los objetos reportados;\n" +
          "• La notificación de los usuarios concernidos.\n\n" +
          "La plataforma actúa únicamente como intermediario técnico entre los usuarios.",
      },
      {
        heading: "3. Aceptación de los términos",
        content:
          "El uso de TKrestore implica la aceptación íntegra de los presentes Términos y Condiciones.\n" +
          "Si el usuario rechaza cualquier parte de estos términos, debe dejar de utilizar la plataforma de inmediato.\n" +
          "TKrestore se reserva el derecho de modificar estos T&C en cualquier momento.\n" +
          "Los usuarios serán informados de las actualizaciones a través de la aplicación o por correo electrónico.",
      },
      {
        heading: "4. Condiciones de acceso",
        content:
          "El acceso a ciertas funcionalidades requiere:\n" +
          "• Crear una cuenta de usuario;\n" +
          "• Proporcionar información exacta y actualizada;\n" +
          "• Aceptar la política de privacidad.\n\n" +
          "El usuario garantiza que la información proporcionada al registrarse es exacta, completa y veraz.",
      },
      {
        heading: "5. Creación de cuenta",
        content:
          "Para crear una cuenta, el usuario puede necesitar proporcionar:\n" +
          "• Nombre y apellido;\n" +
          "• Dirección de correo electrónico;\n" +
          "• Número de teléfono;\n" +
          "• Contraseña segura;\n" +
          "• Documento de identidad (si es necesario para ciertas verificaciones).\n\n" +
          "El usuario es el único responsable de la confidencialidad de sus credenciales de acceso.",
      },
      {
        heading: "6. Uso de los servicios",
        content:
          "El usuario se compromete a usar TKrestore de manera legal, honesta y responsable.\n\n" +
          "Está estrictamente prohibido:\n" +
          "• Publicar declaraciones falsas;\n" +
          "• Suplantar la identidad de un tercero;\n" +
          "• Publicar contenido fraudulento, ofensivo o ilegal;\n" +
          "• Utilizar la plataforma con fines delictivos;\n" +
          "• Intentar acceder fraudulentamente a los sistemas de TKrestore;\n" +
          "• Distribuir virus o malware;\n" +
          "• Vender o intercambiar artículos ilícitos.",
      },
      {
        heading: "7. Declaración de objetos y documentos",
        content:
          "El usuario declara ser el legítimo propietario de cualquier objeto reportado como perdido.\n\n" +
          "Para los objetos encontrados, el usuario se compromete a:\n" +
          "• Proporcionar información precisa;\n" +
          "• No apropiarse indebidamente del objeto encontrado;\n" +
          "• Cooperar con los procedimientos de verificación.\n\n" +
          "TKrestore puede solicitar prueba de propiedad antes de cualquier restitución.",
      },
      {
        heading: "8. Procedimiento de restitución",
        content:
          "La restitución de un objeto puede requerir:\n" +
          "• Verificación de identidad;\n" +
          "• Prueba de propiedad;\n" +
          "• Validación administrativa;\n" +
          "• Una cita física o virtual.\n\n" +
          "TKrestore se reserva el derecho de suspender una restitución si hay dudas sobre la propiedad real del artículo.",
      },
      {
        heading: "9. Responsabilidad de TKrestore",
        content:
          "TKrestore actúa únicamente como plataforma intermediaria. Como tal, TKrestore no garantiza:\n" +
          "• La recuperación efectiva de un objeto perdido;\n" +
          "• La autenticidad de las declaraciones de los usuarios;\n" +
          "• La disponibilidad permanente de los servicios;\n" +
          "• La ausencia total de errores o interrupciones.",
      },
      {
        heading: "10. Datos personales",
        content:
          "TKrestore recopila y procesa ciertos datos personales para garantizar el funcionamiento de sus servicios.\n\n" +
          "Los usuarios tienen los siguientes derechos:\n" +
          "• Derecho de acceso;\n" +
          "• Derecho de rectificación;\n" +
          "• Derecho de supresión;\n" +
          "• Derecho de oposición;\n" +
          "• Derecho a la portabilidad.",
      },
      {
        heading: "11. Servicios de pago",
        content:
          "Ciertas funcionalidades pueden ofrecerse de forma de pago:\n" +
          "• Publicación prioritaria;\n" +
          "• Verificación avanzada;\n" +
          "• Notificaciones premium;\n" +
          "• Asistencia especial;\n" +
          "• Entrega o aseguramiento de restituciones.\n\n" +
          "Las tarifas aplicables se mostrarán antes de cualquier suscripción.",
      },
      {
        heading: "12. Sin persecución a los declarantes",
        content:
          "Cualquier persona que haya encontrado y declarado un objeto o documento en la plataforma TKrestore actúa de manera cívica y voluntaria.\n\n" +
          "Al usar la plataforma, el usuario reconoce que ninguna acción legal, persecución abusiva o reclamación injustificada podrá interponerse contra una persona que haya encontrado y publicado un objeto o documento, salvo en casos de fraude comprobado o mala fe claramente establecida por las autoridades competentes.",
      },
      {
        heading: "13. Reglas de uso del chat",
        content:
          "Los usuarios se comprometen a adoptar un comportamiento respetuoso en los espacios de discusión.\n\n" +
          "Está especialmente prohibido:\n" +
          "• Intercambiar comentarios abusivos, amenazantes o fraudulentos;\n" +
          "• Compartir datos bancarios o códigos confidenciales;\n" +
          "• Realizar acoso o intentos de estafa.\n\n" +
          "Los intercambios deben mantenerse estrictamente relacionados con el proceso de restitución.",
      },
      {
        heading: "14. Propiedad de la aplicación",
        content:
          "La aplicación TKrestore es propiedad exclusiva de TKSWIFT SERVICES.\n\n" +
          "Cualquier reproducción, modificación o uso no autorizado está estrictamente prohibido sin el previo consentimiento escrito de TKSWIFT SERVICES.",
      },
      {
        heading: "15. Contacto",
        content:
          "Para cualquier pregunta sobre estos términos:\n\n" +
          "TKrestore — TKSWIFT SERVICES\n" +
          "Correo: info@tk-restore.com\n" +
          "Dirección: Yaoundé Biyem-assi GP Melen",
      },
    ],
  },
 
  privacyPolicy: {
    title: "Política de Privacidad",
    subtitle: "Aplicación TKrestore",
    lastUpdated: "Última actualización: 07 de mayo de 2026",
    sections: [
      {
        heading: "1. Identidad del responsable del tratamiento",
        content:
          "La aplicación TKrestore es operada por TKSWIFT SERVICES, responsable del tratamiento de los datos recopilados a través de la plataforma.\n\n" +
          "Las reclamaciones o solicitudes de información pueden dirigirse a TKSWIFT SERVICES a través de los canales de comunicación oficiales.",
      },
      {
        heading: "2. Datos recopilados",
        content:
          "TKrestore puede recopilar diferentes categorías de datos:\n\n" +
          "Datos de identificación: nombre y apellido, nombre de usuario, foto de perfil, documento de identidad.\n\n" +
          "Datos de contacto: número de teléfono, dirección de correo electrónico.\n\n" +
          "Datos relacionados con objetos: descripciones, fotografías, localización aproximada, categoría del objeto.\n\n" +
          "Datos de pago: identificadores de transacción, historial de pagos, información de Mobile Money.\n\n" +
          "Datos técnicos: dirección IP, tipo de dispositivo, sistema operativo, registros de actividad.\n\n" +
          "Datos de comunicación: intercambios de chat, confirmaciones de entrega.",
      },
      {
        heading: "3. Finalidad de la recopilación",
        content:
          "Los datos recopilados se utilizan únicamente en el marco del funcionamiento de TKrestore, en particular para:\n" +
          "• Permitir la publicación de objetos y documentos;\n" +
          "• Facilitar búsquedas y conexiones;\n" +
          "• Verificar la identidad de los usuarios;\n" +
          "• Asegurar las restituciones;\n" +
          "• Prevenir fraudes;\n" +
          "• Gestionar pagos;\n" +
          "• Cumplir con las obligaciones legales.",
      },
      {
        heading: "4. Uso limitado de los datos",
        content:
          "Los datos publicados en TKrestore no se utilizarán para fines no relacionados con el funcionamiento de la plataforma.\n\n" +
          "TKrestore se compromete a no:\n" +
          "• Vender datos personales;\n" +
          "• Explotar datos con fines abusivos;\n" +
          "• Transmitir datos a terceros no autorizados;\n" +
          "• Utilizar datos para actividades ilegales.",
      },
      {
        heading: "5. Compartir datos",
        content:
          "Ciertos datos solo pueden compartirse:\n" +
          "• Con los usuarios involucrados en una restitución;\n" +
          "• Con proveedores técnicos autorizados;\n" +
          "• Con servicios de pago;\n" +
          "• Con las autoridades competentes cuando lo exija la ley.",
      },
      {
        heading: "6. Moderación y monitoreo",
        content:
          "Para garantizar la seguridad de la plataforma:\n" +
          "• Las publicaciones pueden moderarse;\n" +
          "• Los intercambios de chat pueden monitorearse;\n" +
          "• Las actividades sospechosas pueden analizarse mediante sistemas automatizados y moderadores humanos.\n\n" +
          "TKrestore utiliza herramientas de detección de fraude asistidas por inteligencia artificial para proteger a los usuarios.",
      },
      {
        heading: "7. Conservación de datos",
        content:
          "Los datos se conservan durante un período razonable necesario para:\n" +
          "• El funcionamiento del servicio;\n" +
          "• La gestión de disputas;\n" +
          "• Las obligaciones legales;\n" +
          "• La prevención del fraude.\n\n" +
          "TKrestore puede eliminar o anonimizar ciertos datos cuando su conservación ya no sea necesaria.",
      },
      {
        heading: "8. Seguridad de los datos",
        content:
          "TKrestore implementa medidas técnicas y organizativas razonables para proteger los datos contra:\n" +
          "• Acceso no autorizado;\n" +
          "• Pérdida de datos;\n" +
          "• Modificaciones fraudulentas;\n" +
          "• Divulgaciones abusivas;\n" +
          "• Ciberataques.\n\n" +
          "Sin embargo, ningún sistema informático puede garantizar una seguridad absoluta.",
      },
      {
        heading: "9. Derechos de los usuarios",
        content:
          "Los usuarios tienen los siguientes derechos:\n" +
          "• Derecho de acceso;\n" +
          "• Derecho de rectificación;\n" +
          "• Derecho de supresión;\n" +
          "• Derecho de oposición;\n" +
          "• Derecho a la limitación;\n" +
          "• Derecho a retirar el consentimiento.\n\n" +
          "Cualquier solicitud puede dirigirse a TKSWIFT SERVICES.",
      },
      {
        heading: "10. Menores",
        content:
          "Los usuarios menores deben utilizar TKrestore bajo la supervisión de un padre o tutor legal de conformidad con las leyes aplicables.",
      },
      {
        heading: "11. Pagos y servicios de terceros",
        content:
          "Los pagos realizados a través de TKrestore pueden ser procesados por proveedores externos especializados, incluidos servicios de Mobile Money y pasarelas de pago seguras como PawaPay.\n\n" +
          "TKrestore no tiene acceso a contraseñas o códigos secretos vinculados a las cuentas financieras de los usuarios.",
      },
      {
        heading: "12. Contacto",
        content:
          "Para cualquier pregunta sobre privacidad o protección de datos:\n\n" +
          "TKSWIFT SERVICES — Aplicación TKrestore\n" +
          "Correo: info@tkswift.com\n" +
          "Dirección: Face GP MELEN BIYEM ASSI, YAOUNDE",
      },
    ],
  },
 
  dataProcessing: {
    title: "Acuerdo de tratamiento de datos",
    subtitle: "Se requiere consentimiento para continuar",
    intro:
      "Antes de utilizar los servicios de TKrestore, debes leer y aceptar nuestro acuerdo de tratamiento de datos personales. Tus datos se utilizan exclusivamente para facilitar la restitución de tus documentos y objetos perdidos.",
    checkboxLabel:
      "Acepto el acuerdo de tratamiento de datos personales de TKrestore",
    acceptBtn: "Aceptar y continuar",
    declineBtn: "Rechazar",
    alreadyAccepted: "Ya has aceptado el acuerdo de tratamiento.",
    viewTerms: "Ver Términos y Condiciones",
    viewPrivacy: "Ver Política de Privacidad",
    modal: {
      title: "Rechazar el acuerdo",
      body: "Al rechazar el acuerdo de tratamiento de datos, no podrás acceder a las funcionalidades de TKrestore. ¿Estás seguro de querer rechazar?",
      confirm: "Sí, rechazar",
      cancel: "Cancelar",
    },
    badge: "Datos protegidos",
  },
  dpa:{
    title: 'Acuerdo de Tratamiento de Datos (DPA)',
  subtitle: 'Aplicación TKrestore — TKSWIFT SERVICES',
  lastUpdated: 'Última actualización: 07 de mayo de 2026',
  sections: [
    {
      heading: '1. Identificación de las partes',
      content:
        'Responsable del tratamiento: TKSWIFT SERVICES, operador de la aplicación TKrestore, responsable de la recopilación y el tratamiento de los datos personales realizados a través de la plataforma.\n\n' +
        'Usuario: toda persona física o jurídica que utilice los servicios ofrecidos por TKrestore.',
    },
    {
      heading: '2. Objeto del acuerdo',
      content:
        'El presente acuerdo tiene como objetivo definir:\n' +
        '• las modalidades de tratamiento de datos personales;\n' +
        '• las obligaciones de TKrestore;\n' +
        '• los derechos de los usuarios;\n' +
        '• las medidas de seguridad aplicadas;\n' +
        '• las condiciones de uso y conservación de los datos.',
    },
    {
      heading: '3. Datos tratados',
      content:
        'TKrestore puede tratar las siguientes categorías de datos:\n\n' +
        'Datos de identificación: nombre y apellido, nombre de usuario, foto de perfil, documento de identidad, información de verificación.\n\n' +
        'Datos de contacto: número de teléfono, dirección de correo electrónico, direcciones de contacto.\n\n' +
        'Datos relacionados con objetos y documentos: descripciones, imágenes, categorías, localizaciones aproximadas, historial de restituciones.\n\n' +
        'Datos financieros: información de pago, identificadores de transacción, confirmaciones de Mobile Money, historial de pagos.\n\n' +
        'Datos técnicos: dirección IP, información de conexión, tipo de dispositivo, registros de actividad, identificadores técnicos.\n\n' +
        'Datos de comunicación: mensajes intercambiados a través de los chats, confirmaciones de entrega (« hand over »), reportes y reclamaciones.',
    },
    {
      heading: '4. Finalidades del tratamiento',
      content:
        'Los datos recopilados se utilizan únicamente en el marco de los servicios ofrecidos por TKrestore, en particular para:\n' +
        '• gestionar las cuentas de usuario;\n' +
        '• facilitar la restitución de objetos y documentos;\n' +
        '• verificar identidades;\n' +
        '• prevenir fraudes;\n' +
        '• asegurar las transacciones;\n' +
        '• garantizar la moderación;\n' +
        '• gestionar los pagos;\n' +
        '• mejorar el rendimiento de la plataforma;\n' +
        '• tramitar reclamaciones;\n' +
        '• cumplir con las obligaciones legales.',
    },
    {
      heading: '5. Base legal del tratamiento',
      content:
        'El tratamiento de datos personales se basa en:\n' +
        '• el consentimiento de los usuarios;\n' +
        '• la ejecución de los servicios solicitados;\n' +
        '• las obligaciones legales;\n' +
        '• los intereses legítimos relacionados con la seguridad y la prevención del fraude.',
    },
    {
      heading: '6. Uso limitado de los datos',
      content:
        'Los datos recopilados en TKrestore solo se utilizarán para los fines del funcionamiento de la plataforma.\n\n' +
        'TKrestore se compromete a no:\n' +
        '• vender datos personales;\n' +
        '• explotar datos con fines abusivos;\n' +
        '• transmitir datos a terceros no autorizados;\n' +
        '• utilizar datos para actividades ilegales.',
    },
    {
      heading: '7. Moderación y vigilancia',
      content:
        'Para garantizar la seguridad de la plataforma:\n' +
        '• las publicaciones pueden ser verificadas;\n' +
        '• los chats pueden ser moderados;\n' +
        '• las actividades sospechosas pueden ser analizadas;\n' +
        '• se pueden utilizar sistemas de inteligencia artificial para detectar fraudes.\n\n' +
        'TKrestore puede suspender cuentas o limitar ciertas funcionalidades en caso de actividad sospechosa.',
    },
    {
      heading: '8. Compartición de datos',
      content:
        'Los datos pueden compartirse únicamente:\n' +
        '• con los usuarios involucrados en una restitución;\n' +
        '• con proveedores técnicos autorizados;\n' +
        '• con servicios de pago;\n' +
        '• con las autoridades competentes;\n' +
        '• en el marco de una investigación de seguridad o fraude.\n\n' +
        'TKrestore limita estrictamente el acceso a los datos a las personas autorizadas.',
    },
    {
      heading: '9. Servicios de terceros y pagos',
      content:
        'Los pagos realizados a través de TKrestore pueden ser procesados por proveedores externos seguros, incluidos servicios de Mobile Money y plataformas como PawaPay.\n\n' +
        'TKrestore no almacena los códigos secretos ni las contraseñas financieras de los usuarios.',
    },
    {
      heading: '10. Vínculos familiares y búsqueda inteligente',
      content:
        'TKrestore puede utilizar cierta información relacional o familiar proporcionada voluntariamente por los usuarios para mejorar las búsquedas y las restituciones.\n\n' +
        'Esta información se utiliza únicamente en el marco de las funcionalidades de búsqueda inteligente y conexión segura.',
    },
    {
      heading: '11. Seguridad de los datos',
      content:
        'TKrestore implementa medidas técnicas y organizativas razonables para proteger los datos contra:\n' +
        '• acceso no autorizado;\n' +
        '• pérdidas accidentales;\n' +
        '• modificaciones fraudulentas;\n' +
        '• divulgaciones abusivas;\n' +
        '• ciberataques.\n\n' +
        'Sin embargo, ningún sistema informático puede garantizar una seguridad absoluta.',
    },
    {
      heading: '12. Conservación de los datos',
      content:
        'Los datos se conservan durante el período razonable necesario para:\n' +
        '• el funcionamiento de los servicios;\n' +
        '• la gestión de disputas;\n' +
        '• la prevención del fraude;\n' +
        '• las obligaciones legales y reglamentarias.\n\n' +
        'TKrestore puede eliminar o anonimizar ciertos datos cuando su conservación ya no sea necesaria.',
    },
    {
      heading: '13. Derechos de los usuarios',
      content:
        'Los usuarios disponen de los siguientes derechos:\n' +
        '• derecho de acceso;\n' +
        '• derecho de rectificación;\n' +
        '• derecho de supresión;\n' +
        '• derecho de oposición;\n' +
        '• derecho a la limitación;\n' +
        '• derecho a retirar el consentimiento.\n\n' +
        'Cualquier solicitud relativa a los datos personales puede dirigirse a TKSWIFT SERVICES.',
    },
    {
      heading: '14. Transferencias internacionales',
      content:
        'Ciertos datos pueden alojarse o procesarse en servidores situados fuera del país de residencia del usuario.\n\n' +
        'TKrestore implementa medidas razonables para garantizar un nivel adecuado de protección de los datos.',
    },
    {
      heading: '15. Confidencialidad',
      content:
        'TKrestore se compromete a preservar la confidencialidad de los datos tratados y a limitar su acceso a las personas autorizadas únicamente.\n\n' +
        'Los empleados, moderadores, socios y proveedores con acceso a los datos están sujetos a obligaciones de confidencialidad.',
    },
    {
      heading: '16. Violación de datos',
      content:
        'En caso de incidente de seguridad o violación de datos susceptible de afectar a los usuarios, TKrestore tomará medidas razonables para:\n' +
        '• limitar los impactos;\n' +
        '• asegurar los sistemas;\n' +
        '• informar a los usuarios afectados cuando sea necesario;\n' +
        '• cooperar con las autoridades competentes.',
    },
    {
      heading: '17. Modificación del acuerdo',
      content:
        'TKrestore se reserva el derecho de modificar el presente Acuerdo de Tratamiento de Datos en cualquier momento.\n\n' +
        'Los usuarios serán informados de las actualizaciones importantes a través de la aplicación o cualquier otro medio apropiado.',
    },
    {
      heading: '18. Contacto',
      content:
        'TKSWIFT SERVICES\n' +
        'Aplicación: TKrestore\n' +
        'Correo: info@tkswift.com\n' +
        'Dirección: GP MELEN BIYEM ASSI YAOUNDE',
    },
    {
      heading: '19. Entrada en vigor',
      content:
        'El presente Acuerdo de Tratamiento de Datos entra en vigor a partir de su publicación en la aplicación TKrestore.',
    },
  ],
  },

  error: {
    E_429: 'Demasiados intentos. Por favor, inténtelo de nuevo en unos minutos.',
    E_401: "No autenticado. Por favor, inicie sesión.",
    E_403: "No tiene permisos para realizar esta acción.",
    E_404: "No se encontró el recurso solicitado.",
    E_500: "Error del servidor. Por favor, inténtelo de nuevo más tarde.",
    E_400: "Datos no válidos. Por favor, revise e intente de nuevo.",
    E_validation: "Por favor, revise los campos con errores.",
    E_network: "No se puede contactar con el servidor. Verifique su conexión.",
    E_inscription: 'Error durante el registro. Por favor, inténtelo de nuevo.',
    E_cgu: 'Por favor, acepte los términos y condiciones.',
    E_mdp: 'Las contraseñas no coinciden.',
    E_phone: 'Número de teléfono inválido',
    E_email: 'Dirección de correo electrónico inválida',
    E_recaptcha: 'Error de seguridad. Por favor, inténtelo de nuevo.',
    },
    chat: {
    title:                     'Mensajería',
    selectConversation:        'Selecciona una conversación',
    selectConversationSub:     'Elige un chat de la lista para empezar a intercambiar.',
    noConversation:            'Sin conversaciones',
    noConversationSub:         'No hay discusiones disponibles por el momento.',
    searchPlaceholder:         'Buscar una conversación…',
    filterAll:                 'Todas',
    filterOpen:                'Abiertas',
    filterActive:              'Activas',
    filterArchived:            'Archivadas',
    typePlaceholder:           'Escribe tu mensaje…',
    send:                      'Enviar',
    sending:                   'Enviando…',
    archivedNotice:            'Esta conversación está archivada. La mensajería está desactivada.',
    noMessages:                'Sin mensajes aún. ¡Inicia la conversación!',
    statusOpen:                'Abierto',
    statusActive:              'Activo',
    statusArchived:            'Archivado',
    statusCompleted:           'Completado',
    attachFile:                'Adjuntar archivo',
    attachmentPreview:         'Vista previa',
    downloadAttachment:        'Descargar',
    closePreview:              'Cerrar',
    handoverGenerateBtn:       'Generar mi código de entrega',
    handoverRegenerateBtn:     'Regenerar código',
    handoverCodeLabel:         'Muestra este código al encontrador',
    handoverCodeExpired:       'Código expirado — regenera uno nuevo',
    handoverConfirmedBadge:    'Entrega confirmada',
    handoverInitiateTooltip:   'Generar mi código de recuperación',
    handoverRegenerateTooltip: 'Regenerar un nuevo código',
    handoverEnterCodeBtn:      'Ingresar código de entrega',
    handoverEnterCodeTooltip:  'Ingresa el código proporcionado por el propietario',
    loserConfirmTitle:         '¿El encontrador validó el código. ¿Recuperaste tu documento?',
    loserConfirmBtn:           '¡Sí, lo recuperé!',
    otpModalTitle:             'Ingresar código de entrega',
    otpModalSubtitle:          'Ingresa el código de 6 dígitos proporcionado por el propietario.',
    otpConfirmBtn:             'Validar código',
    otpValidating:             'Validando…',
    otpErrorInvalid:           'Código incorrecto. Verifica e inténtalo de nuevo.',
    otpClose:                  'Cancelar',
    handoverSystemInitiated:   'El propietario ha generado su código de entrega.',
    handoverSystemConfirmed:   'Código validado por el encontrador. Entrega confirmada.',
    handoverSystemComplete:    'Entrega completada. El pago será liberado.',
    itemInfoTitle:             'Tu documento',
    paymentStatus:             'Pago',
    paymentPaid:               'Pagado — en espera de entrega',
    paymentReleased:           'Liberado al encontrador',
    finderInfoTitle:           'Documento a entregar',
    finderStep1:               'Pide al propietario que genere su código en el chat.',
    finderStep2:               'Obtén el código de 6 dígitos del propietario.',
    finderStep3:               'Haz clic en "Ingresar código" e ingrésalo.',
    finderStep4:               'Una vez validado, el pago te será enviado.',
    sendError:                 'Error al enviar el mensaje. Inténtalo de nuevo.',
    handoverInitError:         'No se puede generar el código. Inténtalo de nuevo.',
    handoverConfirmError:      'Código inválido o expirado.',
    welcomeTitle: "Bienvenido a tu espacio de recuperación",
    welcomeSubtitle: "Estás en contacto con la persona que encontró tu documento. Estas son algunas recomendaciones importantes:",
    conversationTitle: "Conversación registrada",
    conversationDescription: "Todos los mensajes intercambiados en esta conversación se almacenan y archivan de forma segura.",
    publicPlaceTitle: "Prefiere lugares públicos",
    publicPlaceDescription: "Para la entrega, elige un lugar concurrido como un centro comercial, una estación o una cafetería. Evita los lugares aislados.",
    noMoneyTitle: "Nunca envíes dinero",
    noMoneyDescription: "No seremos responsables de ningún envío de dinero. La plataforma no solicita pagos adicionales.",
    codeTitle: "El código confirma la entrega",
    codeDescription: "Una vez frente a la persona que encontró el documento, genera tu código (botón superior derecho). Este código demuestra que eres el propietario legítimo y confirma la entrega del documento.",
    footerMessage: "Envía tu primer mensaje para iniciar la conversación con la persona que encontró el documento.",
    finderWelcomeTitle: "¡Gracias por encontrar este documento!",
    finderWelcomeSubtitle: "Estás en contacto con el propietario legal. Así es como funciona la entrega:",

    finderConversationTitle: "Conversación registrada",
    finderConversationDescription: "Todos los mensajes intercambiados en esta conversación se almacenan y archivan de forma segura.",

    finderPublicPlaceTitle: "Prefiere lugares públicos",
    finderPublicPlaceDescription: "Para la entrega, acuerden un lugar concurrido como un centro comercial, una estación o una cafetería. Eviten los lugares aislados.",

    finderCodeTitle: "La entrega se confirma mediante un código",
    finderCodeDescription: "La entrega solo se valida después de introducir el código recibido del propietario legal (botón 🔒 en la parte superior derecha). Sin este código, la entrega no queda confirmada.",

    finderFooterMessage: "Envía un primer mensaje para iniciar la conversación con el propietario.",
    
    restorationSuccessTitle:   '¡Restauración exitosa!',
    restorationSuccessMessage: 'El documento fue devuelto exitosamente a su propietario. Esta conversación está ahora archivada.',
    restorationSuccessThanks:  'Gracias por usar TKRestore. Juntos contribuimos a devolver documentos perdidos y fortalecer la confianza en nuestra comunidad.',
    restorationSuccessHomeBtn: 'Volver al inicio',
    restorationSuccessStayBtn: 'Permanecer en el chat',

  },

  tutorials: {
    sectionLabel: 'Tutoriales',
    sectionTitle: 'Aprende a utilizar TKRestore',
    sectionSub: 'Guías en vídeo paso a paso para declarar, encontrar y recuperar tus documentos perdidos.',
    playlistLabel: 'Lista de reproducción',
    seeChannel: 'Ver canal completo',
    videoCount: '{{count}} vídeos',
    watchVideo: 'Ver vídeo',
    noVideos: 'No hay vídeos disponibles para esta categoría',
    pricingLabel: 'Tarifas',
    pricingFor: 'Tarifas para',
    services: 'servicios',
    toPay: 'a pagar',
    toReceive: 'a recibir',
    legendPayer: 'Importe pagado por el propietario',
    legendFinder: 'Importe recibido por quien encontró el documento',
    retry: 'Reintentar',
    close: 'Cerrar',
    prev: 'Anterior',
    next: 'Siguiente',
  }
  
  },

};

export const LANGUAGES: Language[] = [
  {
    code: 'fr',
    label: 'Français',
    flagSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect width="1" height="2" x="1" fill="#EDEDED"/><rect width="1" height="2" x="2" fill="#ED2939"/></svg>',
  },
  {
    code: 'en',
    label: 'English',
    flagSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="t"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#s)"><path fill="#012169" d="M0 0v30h60V0z"/><path stroke="#fff" stroke-width="6" d="M0 0l60 30m0-30L0 30"/><path clip-path="url(#t)" stroke="#C8102E" stroke-width="4" d="M0 0l60 30m0-30L0 30"/><path stroke="#fff" stroke-width="10" d="M30 0v30M0 15h60"/><path stroke="#C8102E" stroke-width="6" d="M30 0v30M0 15h60"/></g></svg>',
  },
  {
    code: 'es',
    label: 'Español',
    flagSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#AA151B"/><rect width="3" height="1" y=".5" fill="#F1BF00"/></svg>',
  },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentCode = signal<string>(this.getInitialLang());
  readonly t = computed<Translations>(() => T[this.currentCode()] ?? T['fr']);
  readonly currentLang = computed<Language>(
    () => LANGUAGES.find((l) => l.code === this.currentCode()) ?? LANGUAGES[0]
  );

  setLanguage(code: string): void {
    this.currentCode.set(code);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tkrestore.lang', code);
    }
  }

  private getInitialLang(): string {
    if (typeof window === 'undefined') return 'fr';
    const stored = window.localStorage.getItem('tkrestore.lang');
    if (stored && T[stored]) return stored;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return T[browser] ? browser : 'fr';
  }
}