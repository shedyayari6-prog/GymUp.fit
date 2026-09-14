// All user-facing text lives here, in three languages. Add a new key
// in all three objects at once so nothing is left untranslated.
// Values that need a number/name plugged in are functions instead of
// plain strings — call them, don't just read them.

export const translations = {
  en: {
    brand: 'GYMUP',
    login: {
      heroTitle1: 'Every membership,',
      heroTitle2: 'tracked to the day.',
      heroSubtitle:
        "Know exactly who's active, who's about to lapse, and what the gym earned this month — without a spreadsheet.",
      heroFooter: 'Built for gym owners.',
      heading: 'Welcome back',
      subheading: "Sign in to your gym's dashboard.",
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'you@yourgym.com',
      submit: 'Sign in',
      submitBusy: 'Signing in…',
      noAccount: 'New to GymUp?',
      createAccountLink: 'Create your gym account'
    },
    
    signup: {
      heroTitle1: 'Set up your gym',
      heroTitle2: 'in two minutes.',
      heroSubtitle: 'One account per gym. Add members, watch renewals, track revenue.',
      heroFooter: 'Built for gym owners.',
      heading: 'Create your account',
      subheading: "It's just you and your members — no setup wizard.",
      gymName: 'Gym name',
      gymNamePlaceholder: 'Iron Yard Gym',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'you@yourgym.com',
      passwordPlaceholder: 'At least 6 characters',
      submit: 'Create account',
      submitBusy: 'Creating account…',
      haveAccount: 'Already have an account?',
      signInLink: 'Sign in',
      confirmNotice: 'Account created. Check your email to confirm, then sign in.'
    },
    sidebar: {
      yourGym: 'Your gym',
      tabActive: 'Active members',
      tabExpired: 'Expired members',
      tabEarnings: 'Earnings',
      signOut: 'Sign out',
      idPrefix: (id) => `ID: ${id}`,
      copied: 'Copied!',
      language: 'Language'
    },
    dashboard: {
      headingActive: 'Active members',
      headingExpired: 'Expired members',
      headingEarnings: 'Earnings',
      addMember: '+ Add member',
      loading: 'Loading members…',
      statActive: 'Active members',
      statExpiring: 'Expiring within 3 days',
      statExpired: 'Expired',
      confirmDelete: (name) => `Remove ${name} from the gym roster?`
    },
    alert: {
      title: 'Membership renewals need attention',
      expired: (n) => (n > 1 ? `${n} members have already expired.` : `${n} member has already expired.`),
      expiring: (n) => (n > 1 ? `${n} members expire within 3 days.` : `${n} member expires within 3 days.`),
      viewExpired: 'View expired'
    },
    memberModal: {
      titleAdd: 'Add new member',
      titleEdit: 'Edit member',
      titleRenew: 'Renew membership',
      uploadPhoto: 'Upload photo',
      noPhoto: 'No photo',
      fullName: 'Full name',
      age: 'Age',
      phone: 'Phone number',
      monthlyFee: 'Monthly fee',
      startDate: 'Subscription start',
      duration: 'Duration (months)',
      monthsToAdd: 'Months to add',
      renewingFrom: (date) => `Renewing from ${date}`,
      month: (n) => (n > 1 ? `${n} months` : `${n} month`),
      customDuration: 'Custom',
      durationInvalid: 'Enter a valid number of months.',
      endsOn: (date) => `Ends on ${date}`,
      cancel: 'Cancel',
      saving: 'Saving…',
      saveChanges: 'Save changes',
      addMember: 'Add member'
    },
    membersTable: {
      colMember: 'Member',
      colAge: 'Age',
      colPhone: 'Phone',
      colStarted: 'Started',
      colEnds: 'Ends',
      colFee: 'Fee',
      colStatus: 'Status',
      colActions: 'Actions',
      empty: 'No active members yet. Add your first one to get started.',
      edit: 'Edit',
      delete: 'Delete',
      statusActive: 'Active',
      statusEndsToday: 'Ends today',
      statusDaysLeft: (n) => `${n}d left`
    },
    expiredTable: {
      colMember: 'Member',
      colEndedOn: 'Ended on',
      colDaysAgo: 'Days ago',
      colActions: 'Actions',
      empty: "No expired memberships right now. Everyone's up to date.",
      renew: 'Renew',
      delete: 'Delete'
    },
    earnings: {
      empty: "No earnings recorded yet — they'll show up here as members join or renew.",
      totalEarned: 'Total earned',
      bestMonth: 'Best month',
      monthsTracked: 'Months tracked',
      tooltipEarned: (total) => `${total.toFixed(2)} TND earned`,
      tooltipBilled: (n) => `${n} member${n !== 1 ? 's' : ''} billed`,
      avgPerMonth: 'Avg. per month',
      avgPerMember: 'Avg. per member',
      growth: 'Growth vs. last month',
      projectedNext: 'Projected next month',
      viewArea: 'Curve',
      viewBar: 'Bars',
      year: 'Year',
      allYears: 'All time',
      setupTitle: 'Protect your earnings',
      lockedTitle: 'Earnings are locked',
      setupHint: 'Create a password to protect your earnings data.',
      lockedHint: 'Enter your earnings password to continue.',
      newPassword: 'New password',
      enterPassword: 'Enter password',
      confirmPassword: 'Confirm password',
      savePassword: 'Save password',
      unlock: 'Unlock earnings',
      changePassword: 'Change password',
      passwordRequired: 'Please enter a password.',
      passwordMismatch: 'Passwords do not match.',
      wrongPassword: 'Incorrect password.'
    },
    loyalty: {
      title: 'Member loyalty',
      subtitle: 'How many times each member has joined or renewed',
      empty: 'No renewal history yet — this fills in as members renew over time.',
      tooltipCount: (n) => `${n} time${n !== 1 ? 's' : ''} subscribed`,
      tooltipRenewals: (n) => `${n} renewal${n !== 1 ? 's' : ''}`
    },
    ageChart: {
      title: 'Age breakdown',
      empty: 'Add ages to your members to see this breakdown.',
      bu20: 'Under 20',
      b20s: '20s',
      b30s: '30s',
      b40s: '40s',
      b50p: '50+'
    },
    renewalRate: {
      title: 'Renewal rate',
      subtitle: 'Completed periods where the member came back within 14 days',
      empty: 'Not enough completed cycles yet to calculate this.',
      detail: (renewed, eligible) => `${renewed} of ${eligible} completed cycles renewed on time`
    },
    notes: {
      title: 'Quick notes',
      placeholder: 'Jot down a reminder…',
      saved: 'Saved',
      saving: 'Saving…',
      localOnly: 'Saved only in this browser, not synced to your account.'
    },
    search: {
      placeholder: 'Search members by name…',
      noResults: 'No members match that name.',
      detailTitle: 'Member details',
      detailEndDate: 'Membership ends',
      detailExpiredAgo: (n) => `Expired ${n}d ago`
    }
  },

  fr: {
    brand: 'GYMUP',
    login: {
      heroTitle1: 'Chaque abonnement,',
      heroTitle2: 'suivi au jour près.',
      heroSubtitle:
        "Sachez qui est actif, qui arrive à échéance, et ce que la salle a gagné ce mois-ci — sans tableur.",
      heroFooter: 'Conçu pour les gérants de salle.',
      heading: 'Content de vous revoir',
      subheading: 'Connectez-vous au tableau de bord de votre salle.',
      email: 'E-mail',
      password: 'Mot de passe',
      emailPlaceholder: 'vous@votresalle.com',
      submit: 'Se connecter',
      submitBusy: 'Connexion…',
      noAccount: 'Nouveau sur GymUp ?',
      createAccountLink: 'Créer votre compte salle'
    },
    signup: {
      heroTitle1: 'Configurez votre salle',
      heroTitle2: 'en deux minutes.',
      heroSubtitle: 'Un compte par salle. Ajoutez des membres, suivez les renouvellements et les revenus.',
      heroFooter: 'Conçu pour les gérants de salle.',
      heading: 'Créer votre compte',
      subheading: 'Juste vous et vos membres — pas d\'assistant de configuration.',
      gymName: 'Nom de la salle',
      gymNamePlaceholder: 'Iron Yard Gym',
      email: 'E-mail',
      password: 'Mot de passe',
      emailPlaceholder: 'vous@votresalle.com',
      passwordPlaceholder: 'Au moins 6 caractères',
      submit: 'Créer le compte',
      submitBusy: 'Création du compte…',
      haveAccount: 'Déjà un compte ?',
      signInLink: 'Se connecter',
      confirmNotice: 'Compte créé. Vérifiez votre e-mail pour confirmer, puis connectez-vous.'
    },
    sidebar: {
      yourGym: 'Votre salle',
      tabActive: 'Membres actifs',
      tabExpired: 'Membres expirés',
      tabEarnings: 'Revenus',
      signOut: 'Se déconnecter',
      idPrefix: (id) => `ID : ${id}`,
      copied: 'Copié !',
      language: 'Langue'
    },
    dashboard: {
      headingActive: 'Membres actifs',
      headingExpired: 'Membres expirés',
      headingEarnings: 'Revenus',
      addMember: '+ Ajouter un membre',
      loading: 'Chargement des membres…',
      statActive: 'Membres actifs',
      statExpiring: 'Expire dans 3 jours',
      statExpired: 'Expirés',
      confirmDelete: (name) => `Retirer ${name} de la liste des membres ?`
    },
    alert: {
      title: 'Des renouvellements demandent votre attention',
      expired: (n) =>
        n > 1 ? `${n} membres ont déjà expiré.` : `${n} membre a déjà expiré.`,
      expiring: (n) =>
        n > 1 ? `${n} membres expirent dans 3 jours.` : `${n} membre expire dans 3 jours.`,
      viewExpired: 'Voir les expirés'
    },
    memberModal: {
      titleAdd: 'Ajouter un membre',
      titleEdit: 'Modifier le membre',
      titleRenew: "Renouveler l'abonnement",
      uploadPhoto: 'Ajouter une photo',
      noPhoto: 'Aucune photo',
      fullName: 'Nom complet',
      age: 'Âge',
      phone: 'Numéro de téléphone',
      monthlyFee: 'Cotisation mensuelle',
      startDate: "Début de l'abonnement",
      duration: 'Durée (mois)',
      monthsToAdd: 'Mois à ajouter',
      renewingFrom: (date) => `Renouvellement à partir du ${date}`,
      month: (n) => (n > 1 ? `${n} mois` : `${n} mois`),
      customDuration: 'Personnalisé',
      durationInvalid: 'Entrez un nombre de mois valide.',
      endsOn: (date) => `Se termine le ${date}`,
      cancel: 'Annuler',
      saving: 'Enregistrement…',
      saveChanges: 'Enregistrer',
      addMember: 'Ajouter le membre'
    },
    membersTable: {
      colMember: 'Membre',
      colAge: 'Âge',
      colPhone: 'Téléphone',
      colStarted: 'Début',
      colEnds: 'Fin',
      colFee: 'Cotisation',
      colStatus: 'Statut',
      colActions: 'Actions',
      empty: "Aucun membre actif pour l'instant. Ajoutez-en un pour commencer.",
      edit: 'Modifier',
      delete: 'Supprimer',
      statusActive: 'Actif',
      statusEndsToday: "Se termine aujourd'hui",
      statusDaysLeft: (n) => `${n}j restants`
    },
    expiredTable: {
      colMember: 'Membre',
      colEndedOn: 'Expiré le',
      colDaysAgo: 'Il y a',
      colActions: 'Actions',
      empty: 'Aucun abonnement expiré pour le moment. Tout est à jour.',
      renew: 'Renouveler',
      delete: 'Supprimer'
    },
    earnings: {
      empty: 'Aucun revenu enregistré pour le moment — il apparaîtra ici dès qu\'un membre rejoint ou renouvelle.',
      totalEarned: 'Total gagné',
      bestMonth: 'Meilleur mois',
      monthsTracked: 'Mois suivis',
      tooltipEarned: (total) => `${total.toFixed(2)} TND gagnés`,
      tooltipBilled: (n) => `${n} membre${n !== 1 ? 's' : ''} facturé${n !== 1 ? 's' : ''}`,
      avgPerMonth: 'Moy. par mois',
      avgPerMember: 'Moy. par membre',
      growth: 'Croissance vs mois dernier',
      projectedNext: 'Mois prochain (projeté)',
      viewArea: 'Courbe',
      viewBar: 'Barres',
      year: 'Année',
      allYears: 'Toutes les années',
       setupTitle: 'Protéger vos revenus',
      lockedTitle: 'Revenus verrouillés',
      setupHint: 'Créez un mot de passe pour protéger vos données de revenus.',
      lockedHint: 'Entrez votre mot de passe des revenus pour continuer.',
      newPassword: 'Nouveau mot de passe',
      enterPassword: 'Entrez le mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      savePassword: 'Enregistrer le mot de passe',
      unlock: 'Déverrouiller les revenus',
      changePassword: 'Modifier le mot de passe',
      passwordRequired: 'Veuillez entrer un mot de passe.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      wrongPassword: 'Mot de passe incorrect.'
    },
    loyalty: {
      title: 'Fidélité des membres',
      subtitle: 'Le nombre de fois où chaque membre a rejoint ou renouvelé',
      empty: 'Aucun historique de renouvellement pour le moment — il se remplira au fil des renouvellements.',
      tooltipCount: (n) => `${n} abonnement${n !== 1 ? 's' : ''}`,
      tooltipRenewals: (n) => `${n} renouvellement${n !== 1 ? 's' : ''}`
    },
    ageChart: {
      title: 'Répartition par âge',
      empty: "Ajoutez l'âge de vos membres pour voir cette répartition.",
      bu20: 'Moins de 20 ans',
      b20s: '20-29 ans',
      b30s: '30-39 ans',
      b40s: '40-49 ans',
      b50p: '50 ans et +'
    },
    renewalRate: {
      title: 'Taux de renouvellement',
      subtitle: 'Périodes terminées où le membre est revenu dans les 14 jours',
      empty: 'Pas encore assez de cycles terminés pour calculer cela.',
      detail: (renewed, eligible) => `${renewed} sur ${eligible} cycles terminés renouvelés à temps`
    },
    notes: {
      title: 'Notes rapides',
      placeholder: 'Notez un rappel…',
      saved: 'Enregistré',
      saving: 'Enregistrement…',
      localOnly: 'Enregistré uniquement dans ce navigateur, non synchronisé avec votre compte.'
    },
    search: {
      placeholder: 'Rechercher un membre par nom…',
      noResults: 'Aucun membre ne correspond à ce nom.',
      detailTitle: 'Détails du membre',
      detailEndDate: "Fin de l'abonnement",
      detailExpiredAgo: (n) => `Expiré il y a ${n}j`
    }
  },

  ar: {
    brand: 'جيم أب',
    login: {
      heroTitle1: 'كل اشتراك،',
      heroTitle2: 'متابع يوماً بيوم.',
      heroSubtitle: 'اعرف بالضبط من نشط، ومن اشتراكه على وشك الانتهاء، وكم ربحت الصالة هذا الشهر — بدون جداول بيانات.',
      heroFooter: 'مصمم لأصحاب صالات اللياقة.',
      heading: 'مرحباً بعودتك',
      subheading: 'سجّل الدخول إلى لوحة تحكم صالتك.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'you@yourgym.com',
      submit: 'تسجيل الدخول',
      submitBusy: 'جارٍ تسجيل الدخول…',
      noAccount: 'جديد على جيم أب؟',
      createAccountLink: 'أنشئ حساب صالتك'
    },
    signup: {
      heroTitle1: 'جهّز صالتك',
      heroTitle2: 'في دقيقتين فقط.',
      heroSubtitle: 'حساب واحد لكل صالة. أضف الأعضاء، تابع التجديدات، وتتبّع الإيرادات.',
      heroFooter: 'مصمم لأصحاب صالات اللياقة.',
      heading: 'أنشئ حسابك',
      subheading: 'أنت وأعضاؤك فقط — بدون خطوات إعداد معقدة.',
      gymName: 'اسم الصالة',
      gymNamePlaceholder: 'صالة الحديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'you@yourgym.com',
      passwordPlaceholder: '6 أحرف على الأقل',
      submit: 'إنشاء الحساب',
      submitBusy: 'جارٍ إنشاء الحساب…',
      haveAccount: 'لديك حساب بالفعل؟',
      signInLink: 'تسجيل الدخول',
      confirmNotice: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني للتأكيد ثم سجّل الدخول.'
    },
    sidebar: {
      yourGym: 'صالتك',
      tabActive: 'الأعضاء النشطون',
      tabExpired: 'الأعضاء المنتهية اشتراكاتهم',
      tabEarnings: 'الأرباح',
      signOut: 'تسجيل الخروج',
      idPrefix: (id) => `المعرّف: ${id}`,
      copied: 'تم النسخ!',
      language: 'اللغة'
    },
    dashboard: {
      headingActive: 'الأعضاء النشطون',
      headingExpired: 'الأعضاء المنتهية اشتراكاتهم',
      headingEarnings: 'الأرباح',
      addMember: '+ إضافة عضو',
      loading: 'جارٍ تحميل الأعضاء…',
      statActive: 'الأعضاء النشطون',
      statExpiring: 'ينتهي خلال 3 أيام',
      statExpired: 'منتهي',
      confirmDelete: (name) => `هل تريد إزالة ${name} من قائمة الصالة؟`
    },
    alert: {
      title: 'هناك تجديدات اشتراكات تحتاج إلى انتباهك',
      expired: (n) => `${n} ${n > 1 ? 'أعضاء انتهت اشتراكاتهم بالفعل.' : 'عضو انتهى اشتراكه بالفعل.'}`,
      expiring: (n) => `${n} ${n > 1 ? 'أعضاء ستنتهي اشتراكاتهم خلال 3 أيام.' : 'عضو سينتهي اشتراكه خلال 3 أيام.'}`,
      viewExpired: 'عرض المنتهية'
    },
    memberModal: {
      titleAdd: 'إضافة عضو جديد',
      titleEdit: 'تعديل بيانات العضو',
      titleRenew: 'تجديد الاشتراك',
      uploadPhoto: 'رفع صورة',
      noPhoto: 'لا توجد صورة',
      fullName: 'الاسم الكامل',
      age: 'العمر',
      phone: 'رقم الهاتف',
      monthlyFee: 'الاشتراك الشهري',
      startDate: 'تاريخ بداية الاشتراك',
      duration: 'المدة (بالأشهر)',
      monthsToAdd: 'عدد الأشهر المضافة',
      renewingFrom: (date) => `التجديد ابتداءً من ${date}`,
      month: (n) => `${n} ${n > 1 ? 'أشهر' : 'شهر'}`,
      customDuration: 'مخصص',
      durationInvalid: 'أدخل عدد أشهر صالحاً.',
      endsOn: (date) => `ينتهي في ${date}`,
      cancel: 'إلغاء',
      saving: 'جارٍ الحفظ…',
      saveChanges: 'حفظ التغييرات',
      addMember: 'إضافة العضو'
    },
    membersTable: {
      colMember: 'العضو',
      colAge: 'العمر',
      colPhone: 'رقم الهاتف',
      colStarted: 'تاريخ البدء',
      colEnds: 'تاريخ الانتهاء',
      colFee: 'الاشتراك',
      colStatus: 'الحالة',
      colActions: 'إجراءات',
      empty: 'لا يوجد أعضاء نشطون بعد. أضف أول عضو للبدء.',
      edit: 'تعديل',
      delete: 'حذف',
      statusActive: 'نشط',
      statusEndsToday: 'ينتهي اليوم',
      statusDaysLeft: (n) => `متبقي ${n} يوم`
    },
    expiredTable: {
      colMember: 'العضو',
      colEndedOn: 'تاريخ الانتهاء',
      colDaysAgo: 'منذ',
      colActions: 'إجراءات',
      empty: 'لا توجد اشتراكات منتهية حالياً. كل شيء محدّث.',
      renew: 'تجديد',
      delete: 'حذف'
    },
    earnings: {
      empty: 'لا توجد أرباح مسجلة بعد — ستظهر هنا عند انضمام أو تجديد الأعضاء.',
      totalEarned: 'إجمالي الأرباح',
      bestMonth: 'أفضل شهر',
      monthsTracked: 'عدد الأشهر المتابَعة',
      tooltipEarned: (total) => `${total.toFixed(2)} د.ت أرباح`,
      tooltipBilled: (n) => `${n} ${n !== 1 ? 'أعضاء تمت فوترتهم' : 'عضو تمت فوترته'}`,
      avgPerMonth: 'متوسط شهري',
      avgPerMember: 'متوسط لكل عضو',
      growth: 'النمو مقارنة بالشهر الماضي',
      projectedNext: 'توقّع الشهر القادم',
      viewArea: 'منحنى',
      viewBar: 'أعمدة',
      year: 'السنة',
      allYears: 'كل الفترات',
      setupTitle: 'حماية الأرباح',
      lockedTitle: 'الأرباح مقفلة',
      setupHint: 'أنشئ كلمة مرور لحماية بيانات أرباحك.',
      lockedHint: 'أدخل كلمة مرور الأرباح للمتابعة.',
      newPassword: 'كلمة المرور الجديدة',
      enterPassword: 'أدخل كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      savePassword: 'حفظ كلمة المرور',
      unlock: 'فتح الأرباح',
      changePassword: 'تغيير كلمة المرور',
      passwordRequired: 'يرجى إدخال كلمة مرور.',
      passwordMismatch: 'كلمتا المرور غير متطابقتين.',
      wrongPassword: 'كلمة المرور غير صحيحة.'
    },
    loyalty: {
      title: 'ولاء الأعضاء',
      subtitle: 'كم مرة انضم أو جدّد كل عضو',
      empty: 'لا يوجد سجل تجديدات بعد — سيظهر هنا مع تجديد الأعضاء.',
      tooltipCount: (n) => `${n} ${n !== 1 ? 'مرات اشتراك' : 'مرة اشتراك'}`,
      tooltipRenewals: (n) => `${n} ${n !== 1 ? 'تجديدات' : 'تجديد'}`
    },
    ageChart: {
      title: 'توزيع الأعمار',
      empty: 'أضف أعمار الأعضاء لرؤية هذا التوزيع.',
      bu20: 'أقل من 20',
      b20s: '20-29',
      b30s: '30-39',
      b40s: '40-49',
      b50p: '50 فما فوق'
    },
    renewalRate: {
      title: 'معدل التجديد',
      subtitle: 'الدورات المكتملة التي عاد فيها العضو خلال 14 يوماً',
      empty: 'لا توجد دورات مكتملة كافية لحساب هذا بعد.',
      detail: (renewed, eligible) => `${renewed} من ${eligible} دورة مكتملة جُدّدت في الوقت المناسب`
    },
    notes: {
      title: 'ملاحظات سريعة',
      placeholder: 'اكتب تذكيراً…',
      saved: 'تم الحفظ',
      saving: 'جارٍ الحفظ…',
      localOnly: 'محفوظ في هذا المتصفح فقط، غير مرتبط بحسابك.'
    },
    search: {
      placeholder: 'ابحث عن عضو بالاسم…',
      noResults: 'لا يوجد عضو مطابق لهذا الاسم.',
      detailTitle: 'تفاصيل العضو',
      detailEndDate: 'تاريخ انتهاء الاشتراك',
      detailExpiredAgo: (n) => `انتهى منذ ${n} يوم`
    }

  }
}

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' }
]