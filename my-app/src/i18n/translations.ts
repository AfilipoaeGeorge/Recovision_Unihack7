export type TranslationKey =
  | 'app.brand'
  | 'auth.login.title'
  | 'auth.login.subtitle'
  | 'auth.login.email'
  | 'auth.login.password'
  | 'auth.login.button'
  | 'auth.login.noAccount'
  | 'auth.login.createOne'
  | 'auth.register.title'
  | 'auth.register.subtitle'
  | 'auth.register.firstName'
  | 'auth.register.lastName'
  | 'auth.register.email'
  | 'auth.register.phone'
  | 'auth.register.button'
  | 'auth.register.back'
  | 'auth.layout.subtitle'
  | 'home.header.kicker'
  | 'home.header.title'
  | 'home.header.subtitle'
  | 'home.feature.profile'
  | 'home.feature.profile.desc'
  | 'home.feature.history'
  | 'home.feature.history.desc'
  | 'home.feature.settings'
  | 'home.feature.settings.desc'
  | 'home.feature.current'
  | 'home.feature.current.desc'
  | 'home.feature.exercise'
  | 'home.feature.exercise.desc'
  | 'profile.title'
  | 'profile.subtitle'
  | 'profile.avatar.title'
  | 'profile.avatar.subtitle'
  | 'profile.document.title'
  | 'profile.document.subtitle'
  | 'profile.form.cnp'
  | 'profile.form.lastName'
  | 'profile.form.firstName'
  | 'profile.form.birthDate'
  | 'profile.form.birthPlace'
  | 'profile.form.idSeries'
  | 'profile.form.idNumber'
  | 'profile.form.sex'
  | 'profile.form.citizenship'
  | 'profile.form.address'
  | 'profile.form.issueDate'
  | 'profile.form.expiryDate'
  | 'profile.form.issuedBy'
  | 'profile.form.userId'
  | 'profile.save'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.camera.title'
  | 'settings.camera.description'
  | 'settings.theme.title'
  | 'settings.theme.description'
  | 'settings.theme.enabled'
  | 'settings.theme.disabled'
  | 'settings.theme.on'
  | 'settings.theme.off'
  | 'settings.language.title'
  | 'settings.language.description'
  | 'currentSurgery.title'
  | 'currentSurgery.subtitle'
  | 'currentSurgery.status'
  | 'currentSurgery.treatment'
  | 'currentSurgery.scar.title'
  | 'currentSurgery.scar.subtitle'
  | 'currentSurgery.scar.upload'
  | 'history.subtitle'
  | 'history.status'
  | 'settings.language.english'
  | 'settings.language.romanian';

export const translations: Record<'en' | 'ro', Record<TranslationKey, string>> = {
  en: {
    'app.brand': 'Recovision',
    'auth.login.title': 'Welcome back',
    'auth.login.subtitle': 'Log in to continue your personalized recovery journey.',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.button': 'Sign in',
    'auth.login.noAccount': 'No account yet?',
    'auth.login.createOne': 'Create one',
    'auth.register.title': 'Create account',
    'auth.register.subtitle':
      'Let’s set up your profile so we can personalize your recovery.',
    'auth.register.firstName': 'First name',
    'auth.register.lastName': 'Last name',
    'auth.register.email': 'Email',
    'auth.register.phone': 'Phone number',
    'auth.register.button': 'Register',
    'auth.register.back': 'Back to login',
    'auth.layout.subtitle': 'Update your card photo and keep your recovery file accurate.',
    'home.header.kicker': 'Dashboard',
    'home.header.title': 'Your recovery hub',
    'home.header.subtitle':
      'Quick actions designed to keep you focused on getting better.',
    'home.feature.profile': 'Profile',
    'home.feature.profile.desc': 'Update your personal recovery details.',
    'home.feature.history': 'History',
    'home.feature.history.desc': 'Review completed practices and surgeries.',
    'home.feature.settings': 'Settings',
    'home.feature.settings.desc': 'Fine-tune notifications and accessibility.',
    'home.feature.current': 'Current Surgery',
    'home.feature.current.desc': 'Track the plan for your current recovery.',
    'home.feature.exercise': 'Exercises',
    'home.feature.exercise.desc': 'Stay on track with guided exercises.',
    'profile.title': 'Identity details',
    'profile.subtitle': 'Update your card photo and keep your recovery file accurate.',
    'profile.avatar.title': 'Profile photo',
    'profile.avatar.subtitle': 'Tap to capture or upload a new photo',
    'profile.document.title': 'ID document',
    'profile.document.subtitle': 'Capture or upload your ID so we can extract the details.',
    'profile.form.cnp': 'CNP',
    'profile.form.lastName': 'Last name',
    'profile.form.firstName': 'First name',
    'profile.form.birthDate': 'Date of birth',
    'profile.form.birthPlace': 'Birth place',
    'profile.form.idSeries': 'ID series',
    'profile.form.idNumber': 'ID number',
    'profile.form.sex': 'Sex',
    'profile.form.citizenship': 'Citizenship',
    'profile.form.address': 'Address',
    'profile.form.issueDate': 'Issue date',
    'profile.form.expiryDate': 'Expiry date',
    'profile.form.issuedBy': 'Issued by',
    'profile.form.userId': 'User ID',
    'profile.save': 'Save changes',
    'settings.title': 'Settings',
    'settings.subtitle': 'Quick preferences for camera, theme, and language.',
    'settings.camera.title': 'Camera access',
    'settings.camera.description':
      'Allow the app to open the camera within the profile and surgery modules.',
    'settings.theme.title': 'Dark mode',
    'settings.theme.description': 'Currently',
    'settings.theme.enabled': 'enabled',
    'settings.theme.disabled': 'disabled',
    'settings.theme.on': 'On',
    'settings.theme.off': 'Off',
    'settings.language.title': 'Primary language',
    'settings.language.description': 'Switch between English and Romanian instantly.',
    'settings.language.english': 'English',
    'settings.language.romanian': 'Română',
    'currentSurgery.title': 'Current surgery',
    'currentSurgery.subtitle': 'Track each procedure, meds, and recovery notes in one place.',
    'currentSurgery.status': 'Post-op status',
    'currentSurgery.treatment': 'Treatment plan',
    'currentSurgery.scar.title': 'Scar tracking',
    'currentSurgery.scar.subtitle':
      'Keep visual evidence of how the incision heals over time.',
    'currentSurgery.scar.upload': 'Upload new scar photo',
    'history.subtitle': 'Browse every surgery from most recent to earliest.',
    'history.status': 'Status',
  },
  ro: {
    'app.brand': 'Recovision',
    'auth.login.title': 'Bine ai revenit',
    'auth.login.subtitle': 'Autentifică-te pentru a continua procesul personalizat de recuperare.',
    'auth.login.email': 'Email',
    'auth.login.password': 'Parolă',
    'auth.login.button': 'Autentificare',
    'auth.login.noAccount': 'Nu ai cont?',
    'auth.login.createOne': 'Creează unul',
    'auth.register.title': 'Creează cont',
    'auth.register.subtitle':
      'Hai să îți configurăm profilul pentru a personaliza recuperarea.',
    'auth.register.firstName': 'Prenume',
    'auth.register.lastName': 'Nume',
    'auth.register.email': 'Email',
    'auth.register.phone': 'Număr de telefon',
    'auth.register.button': 'Înregistrare',
    'auth.register.back': 'Înapoi la login',
    'auth.layout.subtitle':
      'Actualizează fotografia și păstrează fișa de recuperare corectă.',
    'home.header.kicker': 'Tablou de bord',
    'home.header.title': 'Hub-ul tău de recuperare',
    'home.header.subtitle':
      'Acțiuni rapide create ca să rămâi concentrat pe vindecare.',
    'home.feature.profile': 'Profil',
    'home.feature.profile.desc': 'Actualizează datele tale personale.',
    'home.feature.history': 'Istoric',
    'home.feature.history.desc': 'Revizuiește intervențiile și recuperările.',
    'home.feature.settings': 'Setări',
    'home.feature.settings.desc': 'Personalizează notificări și accesibilitate.',
    'home.feature.current': 'Operație curentă',
    'home.feature.current.desc': 'Gestionează planul pentru recuperarea actuală.',
    'home.feature.exercise': 'Exerciții',
    'home.feature.exercise.desc': 'Respectă planul cu exerciții ghidate.',
    'profile.title': 'Detalii de identitate',
    'profile.subtitle':
      'Actualizează fotografia și păstrează fișa de recuperare corectă.',
    'profile.avatar.title': 'Fotografie profil',
    'profile.avatar.subtitle': 'Atinge pentru a face sau încărca o poză nouă',
    'profile.document.title': 'Document identitate',
    'profile.document.subtitle':
      'Fotografiază sau încarcă CI pentru a extrage datele.',
    'profile.form.cnp': 'CNP',
    'profile.form.lastName': 'Nume',
    'profile.form.firstName': 'Prenume',
    'profile.form.birthDate': 'Data nașterii',
    'profile.form.birthPlace': 'Locul nașterii',
    'profile.form.idSeries': 'Serie CI',
    'profile.form.idNumber': 'Număr CI',
    'profile.form.sex': 'Sex',
    'profile.form.citizenship': 'Cetățenie',
    'profile.form.address': 'Adresă',
    'profile.form.issueDate': 'Data emiterii',
    'profile.form.expiryDate': 'Data expirării',
    'profile.form.issuedBy': 'Eliberat de',
    'profile.form.userId': 'User ID',
    'profile.save': 'Salvează modificările',
    'settings.title': 'Setări',
    'settings.subtitle': 'Preferințe rapide pentru cameră, temă și limbă.',
    'settings.camera.title': 'Acces cameră',
    'settings.camera.description':
      'Permite deschiderea camerei în profil și în modulul de operații.',
    'settings.theme.title': 'Mod întunecat',
    'settings.theme.description': 'În prezent',
    'settings.theme.enabled': 'activ',
    'settings.theme.disabled': 'dezactivat',
    'settings.theme.on': 'Pornit',
    'settings.theme.off': 'Oprit',
    'settings.language.title': 'Limba principală',
    'settings.language.description': 'Schimbă instant între engleză și română.',
    'settings.language.english': 'English',
    'settings.language.romanian': 'Română',
    'currentSurgery.title': 'Operație curentă',
    'currentSurgery.subtitle':
      'Urmărește procedura, tratamentele și notițele de recuperare.',
    'currentSurgery.status': 'Stare post-operator',
    'currentSurgery.treatment': 'Plan de tratament',
    'currentSurgery.scar.title': 'Monitorizare cicatrici',
    'currentSurgery.scar.subtitle':
      'Păstrează dovezi vizuale ale vindecării inciziei.',
    'currentSurgery.scar.upload': 'Încarcă poză nouă cu cicatrice',
    'history.subtitle': 'Vezi toate operațiile de la cea mai recentă la cea mai veche.',
    'history.status': 'Status',
  },
};

