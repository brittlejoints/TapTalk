/**
 * Every string the UI shows, in every supported language.
 *
 * Adding a language: copy the English block, translate each value, and add
 * one entry to LANGUAGES. Translations for AAC must be done by a native
 * speaker — the words are someone's voice, and a bad translation misleads.
 *
 * Keys are stable: never rename or remove one (saved tiles reference them).
 */

export const LANGUAGES = [
  { id: 'en-US', label: 'English', nativeLabel: 'English', dir: 'ltr' as const },
  { id: 'es-ES', label: 'Spanish', nativeLabel: 'Español', dir: 'ltr' as const },
];

export type LanguageId = (typeof LANGUAGES)[number]['id'];

export const DEFAULT_LANGUAGE: LanguageId = 'en-US';

/** The browser's language, if we support it. */
export function detectLanguage(nav: Pick<Navigator, 'language' | 'languages'> = navigator): LanguageId {
  const prefs = [...(nav.languages ?? []), nav.language];
  for (const pref of prefs) {
    const match = LANGUAGES.find((l) => pref.toLowerCase().startsWith(l.id.toLowerCase().split('-')[0]));
    if (match) return match.id;
  }
  return DEFAULT_LANGUAGE;
}

type StringTable = {
  categories: { saved: string; needs: string; feelings: string; people: string; medical: string };
  /** Short names for the narrow category tabs. Full names stay everywhere else. */
  tabs: { saved: string; needs: string; feelings: string; people: string; medical: string };
  needs: { 'i-want': string; 'i-need': string; water: string; food: string; bathroom: string; hot: string; cold: string; pain: string };
  feelings: { happy: string; sad: string; worried: string; angry: string; scared: string; tired: string; excited: string; okay: string };
  people: { me: string; you: string; mom: string; dad: string; friend: string; teacher: string; nurse: string; caregiver: string };
  medical: { medicine: string; 'it-hurts': string; sick: string; dizzy: string; 'cant-breathe': string; bandage: string; shot: string; rest: string };
  core: { yes: string; no: string; stop: string; more: string };
  help: {
    title: string;
    'i-need-help': string;
    'call-911': string;
    'cant-breathe': string;
    'chest-pain': string;
    'it-hurts': string;
    dizzy: string;
    medicine: string;
    doctor: string;
    'alert-contacts': string;
    'no-contacts': string;
    'add-contacts': string;
    'tap-send': string;
    'messages-didnt-open': string;
    'call-contact': string;
    'copy-alert': string;
    copied: string;
    note: string;
    'you-said': string;
    'tap-a-phrase': string;
    close: string;
    'confirm-title': string;
    'confirm-body': string;
    'include-location': string;
    cancel: string;
    'open-messages': string;
    'locating-title': string;
    'locating-body': string;
    'skip-location': string;
    'opened-body': string;
    done: string;
  };
  savedPhrases: string[];
  message: {
    placeholder: string;
    'type-a-word': string;
    speak: string;
    stop: string;
    'delete-last-word': string;
    'delete-last-letter': string;
    'save-phrase': string;
    'more-actions': string;
    'message-empty': string;
    'core-words': string;
    'word-categories': string;
    'message-prefix': string;
    'message-full': string;
    'saved-full': string;
    'is-saved': string;
    clear: string;
    'nothing-saved': string;
    'nothing-saved-hint': string;
    'own-words': string;
    'own-words-hint': string;
    'my-words': string;
    more: string;
    back: string;
  };
  welcome: { eyebrow: string; headline: string; body: string; start: string; badge: string };
  settings: {
    title: string;
    back: string;
    'your-tiles': string;
    'add-tile': string;
    'no-tiles': string;
    language: string;
    'language-hint': string;
    'text-size': string;
    'text-size-hint': string;
    small: string;
    medium: string;
    large: string;
    'extra-large': string;
    feel: string;
    playful: string;
    'playful-hint': string;
    seeing: string;
    'high-visibility': string;
    'high-visibility-hint': string;
    talking: string;
    'speak-on-tap': string;
    'speak-on-tap-hint': string;
    voice: string;
    'device-default': string;
    speed: string;
    'test-voice': string;
    'no-speech': string;
    'emergency-contacts': string;
    'emergency-intro': string;
    'your-name': string;
    'your-name-placeholder': string;
    'add-contact': string;
    'contact-limit': string;
    'saved-phrases': string;
    'phrase-hint': string;
    'app-updates': string;
    'update-ready': string;
    'update-ready-hint': string;
    'update-now': string;
    'offline-ready': string;
  };
  greeting: { morning: string; afternoon: string; evening: string };
  error: { title: string; body: string; 'try-again': string; reload: string };
  colors: { keylime: string; mint: string; sea: string; mist: string; lilac: string; butter: string; peach: string; sand: string };
  iconGroups: { people: string; food: string; home: string; play: string; places: string; nature: string; health: string };
  emojiGroups: { feelings: string; people: string; food: string; daily: string; play: string; nature: string; places: string; symbols: string };
  editor: {
    'new-tile': string;
    'edit-tile': string;
    'cancel-back': string;
    'your-word': string;
    'preview': string;
    'word-label': string;
    'word-placeholder': string;
    'category': string;
    'color': string;
    'picture': string;
    'add-tile': string;
    'save-changes': string;
    'delete-confirm-label': string;
    'delete-question': string;
    'keep-it': string;
    'delete': string;
    'delete-tile': string;
    'err-word': string;
    'err-photo': string;
    'err-emoji': string;
    'err-storage': string;
    'picture-type': string;
    'icon': string;
    'emoji': string;
    'photo': string;
    'groups': string;
    'search-icons': string;
    'search-emoji': string;
    'clear-search': string;
    'no-icons': string;
    'no-emoji': string;
    'type-emoji': string;
    'type-emoji-placeholder': string;
    'not-emoji': string;
    'photo-hint': string;
    'chosen-photo': string;
    'change': string;
    'remove': string;
    'add-photo': string;
    'photo-failed': string;
    'photo-not-image': string;
    'photo-no-canvas': string;
    'photo-unreadable': string;
    'icon-label': string;
    'emoji-label': string;
  };
  backup: {
    'title': string;
    'hint': string;
    'export': string;
    'import': string;
    'exported': string;
    'not-backup': string;
    'too-new': string;
    'confirm-title': string;
    'confirm-body': string;
    'replace': string;
    'cancel': string;
    'restored': string;
    'err-storage': string;
  };
  contact: {
    'name': string;
    'name-placeholder': string;
    'phone': string;
    'phone-placeholder': string;
    'relationship': string;
    'relationship-placeholder': string;
    'err-name': string;
    'err-phone-missing': string;
    'err-phone-length': string;
    'err-storage': string;
    'cancel': string;
    'save': string;
    'confirm-remove-label': string;
    'remove-question': string;
    'keep': string;
    'remove': string;
    'remove-contact': string;
  };
};

const en: StringTable = {
  categories: { saved: 'Saved', needs: 'Needs', feelings: 'Feelings', people: 'People', medical: 'Medical' },
  tabs: { saved: 'Saved', needs: 'Needs', feelings: 'Feelings', people: 'People', medical: 'Medical' },
  needs: { 'i-want': 'I want', 'i-need': 'I need', water: 'Water', food: 'Food', bathroom: 'Bathroom', hot: 'Hot', cold: 'Cold', pain: 'Pain' },
  feelings: { happy: 'Happy', sad: 'Sad', worried: 'Worried', angry: 'Angry', scared: 'Scared', tired: 'Tired', excited: 'Excited', okay: 'Okay' },
  people: { me: 'Me', you: 'You', mom: 'Mom', dad: 'Dad', friend: 'Friend', teacher: 'Teacher', nurse: 'Nurse', caregiver: 'Caregiver' },
  medical: { medicine: 'Medicine', 'it-hurts': 'It hurts', sick: 'Sick', dizzy: 'Dizzy', 'cant-breathe': "Can't breathe", bandage: 'Bandage', shot: 'Shot', rest: 'Rest' },
  core: { yes: 'Yes', no: 'No', stop: 'Stop', more: 'More' },
  help: {
    title: 'Help',
    'i-need-help': 'I need help',
    'call-911': 'Call 911 for me',
    'cant-breathe': "Can't breathe",
    'chest-pain': 'Chest pain',
    'it-hurts': 'It hurts',
    dizzy: 'Dizzy',
    medicine: 'Medicine',
    doctor: 'Doctor',
    'alert-contacts': 'Alert my contacts',
    'no-contacts': 'No emergency contacts yet.',
    'add-contacts': 'Add contacts',
    'tap-send': 'Tap Send in Messages',
    'messages-didnt-open': "If Messages didn't open",
    'call-contact': 'Call',
    'copy-alert': 'Copy alert text',
    copied: 'Copied. Paste it into any message.',
    note: 'In a life-threatening emergency, call 911.',
    'you-said': 'You said',
    'tap-a-phrase': 'Tap a phrase to say it',
    close: 'Close help and return to the board',
    'confirm-title': 'Alert your contacts?',
    'confirm-body': 'Your messages app will open with an emergency message to {names}. You’ll tap Send there.',
    'include-location': 'Include my location',
    cancel: 'Cancel',
    'open-messages': 'Open Messages',
    'locating-title': 'Finding your location…',
    'locating-body': 'This can take a few seconds. Your phone may ask for permission.',
    'skip-location': 'Send without location',
    'opened-body': 'Your messages app should be open with the alert ready. It isn’t sent until you tap Send there.',
    done: 'Done',
  },
  savedPhrases: ['I need help', 'Thank you', 'All done', 'Please wait', "I don't understand", 'Say it again', 'I love you', 'Not now', 'Good morning'],
  message: {
    placeholder: 'Tap words, or tap here to type',
    'type-a-word': 'Type a word',
    speak: 'Speak message',
    stop: 'Stop speaking',
    'delete-last-word': 'Delete last word',
    'delete-last-letter': 'Delete last letter',
    'save-phrase': 'Save this phrase',
    'more-actions': 'More actions',
    'message-empty': 'Message is empty',
    'core-words': 'Core words',
    'word-categories': 'Word categories',
    'message-prefix': 'Message',
    'message-full': 'Message is full. Speak it, or delete a word.',
    'saved-full': 'Saved is full. Remove one in Settings first.',
    'is-saved': 'This phrase is saved',
    clear: 'Clear the whole message',
    'nothing-saved': 'Nothing saved yet',
    'nothing-saved-hint': 'Build a message, then tap the star to keep it here.',
    'own-words': 'Your own words grow here',
    'own-words-hint': 'Add names, places and favorites in Settings, under Your tiles.',
    'my-words': 'My words',
    more: 'More',
    back: 'Back',
  },
  welcome: { eyebrow: 'AAC for everyone', headline: 'Your voice, one tap away.', body: 'Build sentences with pictures and words, and Tap Talk says them out loud.', start: 'Start talking', badge: 'Free · No account' },
  settings: {
    title: 'Settings',
    back: 'Back to the board',
    'your-tiles': 'Your tiles',
    'add-tile': 'Add a tile',
    'no-tiles': 'Add words that matter to you, like names, favorite foods or places, with a photo or an icon.',
    language: 'Language',
    'language-hint': 'Changes the built-in words and the voice. Your saved phrases and custom tiles stay as you wrote them.',
    'text-size': 'Text size',
    'text-size-hint': 'Makes labels and the message bar bigger. Tiles stay in the same spots.',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    'extra-large': 'Extra large',
    feel: 'Feel',
    playful: 'Playful touches',
    'playful-hint': "Small, quick animations when you tap, speak and save. Turn off for a calmer screen. Your device's Reduce Motion setting always turns them off.",
    seeing: 'Seeing',
    'high-visibility': 'High-visibility tiles',
    'high-visibility-hint': 'Adds a dark outline to every tile and button.',
    talking: 'Talking',
    'speak-on-tap': 'Speak each tile when tapped',
    'speak-on-tap-hint': 'Says each word right away, as well as adding it to the message.',
    voice: 'Voice',
    'device-default': 'Device default',
    speed: 'Speed',
    'test-voice': 'Test voice',
    'no-speech': "This browser can't speak out loud. Try Safari, Chrome or Edge.",
    'emergency-contacts': 'Emergency contacts',
    'emergency-intro': 'When you tap Alert on the Help screen, your messages app opens with an alert to these people, ready to send. Contacts are saved only on this device.',
    'your-name': 'Your name (shown in alerts)',
    'your-name-placeholder': 'For example: Sam',
    'add-contact': 'Add an emergency contact',
    'contact-limit': 'You can save up to 5 emergency contacts.',
    'saved-phrases': 'Saved phrases',
    'phrase-hint': 'Build a message on the board and tap the star to save it.',
    'app-updates': 'App',
    'update-ready': 'A fresh version is ready',
    'update-ready-hint': 'Updating restarts Tap Talk and clears the message you are building. Update when you are ready.',
    'update-now': 'Update now',
    'offline-ready': 'Ready to use without internet. Tap Talk is saved on this device.',
  },
  greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
  error: { title: 'Something went wrong.', body: 'Tap Talk ran into an error. Your words and settings are still saved on this device.', 'try-again': 'Try again', reload: 'Reload the app' },
  colors: { keylime: 'Keylime', mint: 'Mint', sea: 'Sea glass', mist: 'Mist', lilac: 'Lilac', butter: 'Butter', peach: 'Peach', sand: 'Sand' },
  iconGroups: { people: 'People', food: 'Food & drink', home: 'Home', play: 'Play', places: 'Places', nature: 'Nature', health: 'Health' },
  emojiGroups: { feelings: 'Feelings', people: 'People', food: 'Food & drink', daily: 'Daily life', play: 'Play', nature: 'Nature', places: 'Places', symbols: 'Symbols' },
  editor: {
    'new-tile': 'New tile',
    'edit-tile': 'Edit tile',
    'cancel-back': 'Cancel and go back',
    'your-word': 'Your word',
    'preview': 'Preview · tap to hear it',
    'word-label': 'Word or phrase',
    'word-placeholder': 'For example: Grandma, Swing, Apple juice',
    'category': 'Category',
    'color': 'Color',
    'picture': 'Picture',
    'add-tile': 'Add tile to the board',
    'save-changes': 'Save changes',
    'delete-confirm-label': 'Confirm delete',
    'delete-question': 'Delete “{label}”? This can’t be undone.',
    'keep-it': 'Keep it',
    'delete': 'Delete',
    'delete-tile': 'Delete this tile',
    'err-word': 'Add a word or phrase for this tile.',
    'err-photo': 'Add a photo, or switch to Icon or Emoji.',
    'err-emoji': 'Pick an emoji, or switch to Icon or Photo.',
    'err-storage': 'Couldn’t save: this device’s storage is full. Remove a photo or delete some tiles, then try again.',
    'picture-type': 'Picture type',
    'icon': 'Icon',
    'emoji': 'Emoji',
    'photo': 'Photo',
    'groups': 'Categories',
    'search-icons': 'Search icons, like “dog”',
    'search-emoji': 'Search emoji, like “pizza”',
    'clear-search': 'Clear search',
    'no-icons': 'No icons match “{query}”. Try Emoji, or a different word.',
    'no-emoji': 'No emoji match “{query}”. You can type any emoji below.',
    'type-emoji': 'Or type any emoji from your keyboard',
    'type-emoji-placeholder': 'Tap here, then open the emoji keyboard',
    'not-emoji': 'That isn’t an emoji. Switch to your emoji keyboard and pick one.',
    'photo-hint': 'A real photo is often the easiest to recognize: a person, a pet, a favorite cup.',
    'chosen-photo': 'Chosen photo',
    'change': 'Change',
    'remove': 'Remove',
    'add-photo': 'Add a photo',
    'photo-failed': 'That photo couldn’t be used.',
    'photo-not-image': 'That file isn’t an image.',
    'photo-no-canvas': 'This browser can’t process photos.',
    'photo-unreadable': 'That photo couldn’t be opened. Try a JPEG or PNG.',
    'icon-label': 'Icon',
    'emoji-label': 'Emoji',
  },
  backup: {
    'title': 'Backup',
    'hint': 'Save everything you have set up (tiles, contacts, saved phrases and settings) to a file, or restore it on this or another device. The file is not encrypted and contains phone numbers, so keep it somewhere private.',
    'export': 'Save a backup file',
    'import': 'Restore from a backup file',
    'exported': 'Your browser should now be saving {file}. Check your Downloads.',
    'not-backup': 'That file isn’t a Tap Talk backup.',
    'too-new': 'That backup is from a newer version of Tap Talk. Update the app first.',
    'confirm-title': 'Replace what’s on this device?',
    'confirm-body': 'This backup has {tiles} custom tiles, {contacts} emergency contacts and {phrases} saved phrases. They will replace the ones on this device.',
    'replace': 'Replace',
    'cancel': 'Cancel',
    'restored': 'Backup restored.',
    'err-storage': 'Couldn’t restore everything: this device’s storage is full.',
  },
  contact: {
    'name': 'Name',
    'name-placeholder': 'For example: Mom',
    'phone': 'Mobile number',
    'phone-placeholder': 'Include the country code if abroad',
    'relationship': 'Relationship (optional)',
    'relationship-placeholder': 'Parent, caregiver, neighbor…',
    'err-name': 'Add a name.',
    'err-phone-missing': 'Add a phone number.',
    'err-phone-length': 'Check the phone number. It should have 7 to 15 digits.',
    'err-storage': 'Couldn’t save: this device’s storage is full.',
    'cancel': 'Cancel',
    'save': 'Save contact',
    'confirm-remove-label': 'Confirm remove',
    'remove-question': 'Remove {name} from emergency contacts?',
    'keep': 'Keep',
    'remove': 'Remove',
    'remove-contact': 'Remove this contact',
  },
};

const es: StringTable = {
  categories: { saved: 'Guardadas', needs: 'Necesidades', feelings: 'Sentimientos', people: 'Personas', medical: 'Médico' },
  tabs: { saved: 'Frases', needs: 'Cosas', feelings: 'Siento', people: 'Personas', medical: 'Médico' },
  needs: { 'i-want': 'Quiero', 'i-need': 'Necesito', water: 'Agua', food: 'Comida', bathroom: 'Baño', hot: 'Calor', cold: 'Frío', pain: 'Dolor' },
  feelings: { happy: 'Feliz', sad: 'Triste', worried: 'Preocupado', angry: 'Enojado', scared: 'Asustado', tired: 'Cansado', excited: 'Emocionado', okay: 'Bien' },
  people: { me: 'Yo', you: 'Tú', mom: 'Mamá', dad: 'Papá', friend: 'Amigo', teacher: 'Maestro', nurse: 'Enfermera', caregiver: 'Cuidador' },
  medical: { medicine: 'Medicina', 'it-hurts': 'Me duele', sick: 'Enfermo', dizzy: 'Mareado', 'cant-breathe': 'No puedo respirar', bandage: 'Vendaje', shot: 'Inyección', rest: 'Descanso' },
  core: { yes: 'Sí', no: 'No', stop: 'Para', more: 'Más' },
  help: {
    title: 'Ayuda',
    'i-need-help': 'Necesito ayuda',
    'call-911': 'Llama al 911',
    'cant-breathe': 'No puedo respirar',
    'chest-pain': 'Dolor de pecho',
    'it-hurts': 'Me duele',
    dizzy: 'Mareado',
    medicine: 'Medicina',
    doctor: 'Doctor',
    'alert-contacts': 'Alertar a mis contactos',
    'no-contacts': 'Aún no hay contactos de emergencia.',
    'add-contacts': 'Agregar contactos',
    'tap-send': 'Toca Enviar en Mensajes',
    'messages-didnt-open': 'Si Mensajes no se abrió',
    'call-contact': 'Llamar a',
    'copy-alert': 'Copiar el mensaje',
    copied: 'Copiado. Pégalo en cualquier mensaje.',
    note: 'En una emergencia que amenaza la vida, llama al 911.',
    'you-said': 'Dijiste',
    'tap-a-phrase': 'Toca una frase para decirla',
    close: 'Cerrar la ayuda y volver al tablero',
    'confirm-title': '¿Alertar a tus contactos?',
    'confirm-body': 'Se abrirá tu app de mensajes con un mensaje de emergencia para {names}. Tú tocarás Enviar allí.',
    'include-location': 'Incluir mi ubicación',
    cancel: 'Cancelar',
    'open-messages': 'Abrir Mensajes',
    'locating-title': 'Buscando tu ubicación…',
    'locating-body': 'Puede tardar unos segundos. Tu teléfono puede pedirte permiso.',
    'skip-location': 'Enviar sin ubicación',
    'opened-body': 'Tu app de mensajes debería estar abierta con la alerta lista. No se envía hasta que toques Enviar allí.',
    done: 'Listo',
  },
  savedPhrases: ['Necesito ayuda', 'Gracias', 'Terminé', 'Espera por favor', 'No entiendo', 'Repite por favor', 'Te quiero', 'Ahora no', 'Buenos días'],
  message: {
    placeholder: 'Toca palabras o escribe aquí',
    'type-a-word': 'Escribe una palabra',
    speak: 'Decir el mensaje',
    stop: 'Dejar de hablar',
    'delete-last-word': 'Borrar la última palabra',
    'delete-last-letter': 'Borrar la última letra',
    'save-phrase': 'Guardar esta frase',
    'more-actions': 'Más acciones',
    'message-empty': 'El mensaje está vacío',
    'core-words': 'Palabras básicas',
    'word-categories': 'Categorías de palabras',
    'message-prefix': 'Mensaje',
    'message-full': 'El mensaje está lleno. Dilo, o borra una palabra.',
    'saved-full': 'Guardadas está lleno. Quita una en Ajustes primero.',
    'is-saved': 'Esta frase está guardada',
    clear: 'Borrar todo el mensaje',
    'nothing-saved': 'Aún no has guardado nada',
    'nothing-saved-hint': 'Arma un mensaje y toca la estrella para guardarlo aquí.',
    'own-words': 'Tus propias palabras crecen aquí',
    'own-words-hint': 'Agrega nombres, lugares y favoritos en Ajustes, en Tus mosaicos.',
    'my-words': 'Mis palabras',
    more: 'Más',
    back: 'Atrás',
  },
  welcome: { eyebrow: 'CAA para todos', headline: 'Tu voz, con un toque.', body: 'Arma oraciones con imágenes y palabras, y Tap Talk las dice en voz alta.', start: 'Empezar a hablar', badge: 'Gratis · Sin cuenta' },
  settings: {
    title: 'Ajustes',
    back: 'Volver al tablero',
    'your-tiles': 'Tus mosaicos',
    'add-tile': 'Agregar un mosaico',
    'no-tiles': 'Agrega palabras importantes, como nombres, comidas o lugares favoritos, con una foto o un ícono.',
    language: 'Idioma',
    'language-hint': 'Cambia las palabras y la voz. Tus frases guardadas y mosaicos personales no cambian.',
    'text-size': 'Tamaño del texto',
    'text-size-hint': 'Hace más grandes las etiquetas y la barra del mensaje. Los mosaicos no se mueven.',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    'extra-large': 'Muy grande',
    feel: 'Sensación',
    playful: 'Toques juguetones',
    'playful-hint': 'Animaciones pequeñas y rápidas al tocar, hablar y guardar. Apágalas para una pantalla más calmada. La opción Reducir movimiento del dispositivo también las desactiva.',
    seeing: 'Visión',
    'high-visibility': 'Mosaicos de alta visibilidad',
    'high-visibility-hint': 'Agrega un borde oscuro a cada mosaico y botón.',
    talking: 'Habla',
    'speak-on-tap': 'Decir cada mosaico al tocar',
    'speak-on-tap-hint': 'Dice la palabra enseguida y también la agrega al mensaje.',
    voice: 'Voz',
    'device-default': 'Voz del dispositivo',
    speed: 'Velocidad',
    'test-voice': 'Probar la voz',
    'no-speech': 'Este navegador no puede hablar en voz alta. Prueba Safari, Chrome o Edge.',
    'emergency-contacts': 'Contactos de emergencia',
    'emergency-intro': 'Cuando toques Alertar en la pantalla Ayuda, se abrirá tu app de mensajes con una alerta lista para enviar. Los contactos se guardan solo en este dispositivo.',
    'your-name': 'Tu nombre (aparece en las alertas)',
    'your-name-placeholder': 'Por ejemplo: Sam',
    'add-contact': 'Agregar un contacto de emergencia',
    'contact-limit': 'Puedes guardar hasta 5 contactos de emergencia.',
    'saved-phrases': 'Frases guardadas',
    'phrase-hint': 'Arma un mensaje en el tablero y toca la estrella para guardarlo.',
    'app-updates': 'App',
    'update-ready': 'Hay una versión nueva',
    'update-ready-hint': 'Al actualizar, Tap Talk se reinicia y se borra el mensaje que estás armando. Actualiza cuando estés listo.',
    'update-now': 'Actualizar ahora',
    'offline-ready': 'Listo para usar sin internet. Tap Talk está guardado en este dispositivo.',
  },
  greeting: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' },
  error: { title: 'Algo salió mal.', body: 'Tap Talk tuvo un error. Tus palabras y ajustes siguen guardados en este dispositivo.', 'try-again': 'Intentar de nuevo', reload: 'Recargar la app' },
  colors: { keylime: 'Lima', mint: 'Menta', sea: 'Cristal marino', mist: 'Niebla', lilac: 'Lila', butter: 'Mantequilla', peach: 'Melocotón', sand: 'Arena' },
  iconGroups: { people: 'Personas', food: 'Comida y bebida', home: 'Casa', play: 'Juego', places: 'Lugares', nature: 'Naturaleza', health: 'Salud' },
  emojiGroups: { feelings: 'Sentimientos', people: 'Personas', food: 'Comida y bebida', daily: 'Vida diaria', play: 'Juego', nature: 'Naturaleza', places: 'Lugares', symbols: 'Símbolos' },
  editor: {
    'new-tile': 'Nuevo mosaico',
    'edit-tile': 'Editar mosaico',
    'cancel-back': 'Cancelar y volver',
    'your-word': 'Tu palabra',
    'preview': 'Vista previa · toca para oírlo',
    'word-label': 'Palabra o frase',
    'word-placeholder': 'Por ejemplo: Abuela, Columpio, Jugo de manzana',
    'category': 'Categoría',
    'color': 'Color',
    'picture': 'Imagen',
    'add-tile': 'Agregar mosaico al tablero',
    'save-changes': 'Guardar cambios',
    'delete-confirm-label': 'Confirmar eliminación',
    'delete-question': '¿Eliminar “{label}”? No se puede deshacer.',
    'keep-it': 'Conservarlo',
    'delete': 'Eliminar',
    'delete-tile': 'Eliminar este mosaico',
    'err-word': 'Agrega una palabra o frase para este mosaico.',
    'err-photo': 'Agrega una foto, o cambia a Ícono o Emoji.',
    'err-emoji': 'Elige un emoji, o cambia a Ícono o Foto.',
    'err-storage': 'No se pudo guardar: el almacenamiento de este dispositivo está lleno. Quita una foto o elimina algunos mosaicos e inténtalo de nuevo.',
    'picture-type': 'Tipo de imagen',
    'icon': 'Ícono',
    'emoji': 'Emoji',
    'photo': 'Foto',
    'groups': 'Categorías',
    'search-icons': 'Buscar íconos en inglés, como “dog”',
    'search-emoji': 'Buscar emoji en inglés, como “pizza”',
    'clear-search': 'Borrar la búsqueda',
    'no-icons': 'Ningún ícono coincide con “{query}”. Prueba con Emoji, o con otra palabra.',
    'no-emoji': 'Ningún emoji coincide con “{query}”. Puedes escribir cualquier emoji abajo.',
    'type-emoji': 'O escribe cualquier emoji con tu teclado',
    'type-emoji-placeholder': 'Toca aquí y abre el teclado de emoji',
    'not-emoji': 'Eso no es un emoji. Cambia al teclado de emoji y elige uno.',
    'photo-hint': 'Una foto real suele ser lo más fácil de reconocer: una persona, una mascota, una taza favorita.',
    'chosen-photo': 'Foto elegida',
    'change': 'Cambiar',
    'remove': 'Quitar',
    'add-photo': 'Agregar una foto',
    'photo-failed': 'No se pudo usar esa foto.',
    'photo-not-image': 'Ese archivo no es una imagen.',
    'photo-no-canvas': 'Este navegador no puede procesar fotos.',
    'photo-unreadable': 'No se pudo abrir esa foto. Prueba con un JPEG o PNG.',
    'icon-label': 'Ícono',
    'emoji-label': 'Emoji',
  },
  backup: {
    'title': 'Copia de seguridad',
    'hint': 'Guarda todo lo que has configurado (mosaicos, contactos, frases guardadas y ajustes) en un archivo, o restáuralo en este u otro dispositivo. El archivo no está cifrado y contiene números de teléfono, así que guárdalo en un lugar privado.',
    'export': 'Guardar un archivo de copia',
    'import': 'Restaurar desde un archivo de copia',
    'exported': 'Tu navegador debería estar guardando {file}. Revisa tus Descargas.',
    'not-backup': 'Ese archivo no es una copia de seguridad de Tap Talk.',
    'too-new': 'Esa copia es de una versión más nueva de Tap Talk. Actualiza la app primero.',
    'confirm-title': '¿Reemplazar lo que hay en este dispositivo?',
    'confirm-body': 'Esta copia tiene {tiles} mosaicos, {contacts} contactos de emergencia y {phrases} frases guardadas. Reemplazarán los de este dispositivo.',
    'replace': 'Reemplazar',
    'cancel': 'Cancelar',
    'restored': 'Copia restaurada.',
    'err-storage': 'No se pudo restaurar todo: el almacenamiento de este dispositivo está lleno.',
  },
  contact: {
    'name': 'Nombre',
    'name-placeholder': 'Por ejemplo: Mamá',
    'phone': 'Número de móvil',
    'phone-placeholder': 'Incluye el código de país si estás fuera',
    'relationship': 'Parentesco (opcional)',
    'relationship-placeholder': 'Padre, cuidador, vecino…',
    'err-name': 'Agrega un nombre.',
    'err-phone-missing': 'Agrega un número de teléfono.',
    'err-phone-length': 'Revisa el número de teléfono. Debe tener de 7 a 15 dígitos.',
    'err-storage': 'No se pudo guardar: el almacenamiento de este dispositivo está lleno.',
    'cancel': 'Cancelar',
    'save': 'Guardar contacto',
    'confirm-remove-label': 'Confirmar que se quita',
    'remove-question': '¿Quitar a {name} de los contactos de emergencia?',
    'keep': 'Conservar',
    'remove': 'Quitar',
    'remove-contact': 'Quitar este contacto',
  },
};

export const STRINGS: Record<LanguageId, StringTable> = { 'en-US': en, 'es-ES': es };

export type StringKey = StringTable; // for consumer type inference
