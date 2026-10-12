import type { CoreWordId } from './coreWords';

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
  needs: { 'i-want': string; 'i-need': string; water: string; food: string; bathroom: string; hot: string; cold: string; pain: string };
  feelings: { happy: string; sad: string; worried: string; angry: string; scared: string; tired: string; excited: string; okay: string };
  people: { me: string; you: string; mom: string; dad: string; friend: string; teacher: string; nurse: string; caregiver: string };
  medical: { medicine: string; 'it-hurts': string; sick: string; dizzy: string; 'cant-breathe': string; bandage: string; shot: string; rest: string };
  core: Record<CoreWordId, string>;
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
    'quick-words': string;
    'quick-words-hint': string;
    'quick-word-slot': string;
    'quick-word-own': string;
    'quick-word-own-placeholder': string;
    'quick-word-use': string;
    'quick-word-color': string;
    'quick-words-reset': string;
  };
  greeting: { morning: string; afternoon: string; evening: string };
  error: { title: string; body: string; 'try-again': string; reload: string };
};

const en: StringTable = {
  categories: { saved: 'Saved', needs: 'Needs', feelings: 'Feelings', people: 'People', medical: 'Medical' },
  needs: { 'i-want': 'I want', 'i-need': 'I need', water: 'Water', food: 'Food', bathroom: 'Bathroom', hot: 'Hot', cold: 'Cold', pain: 'Pain' },
  feelings: { happy: 'Happy', sad: 'Sad', worried: 'Worried', angry: 'Angry', scared: 'Scared', tired: 'Tired', excited: 'Excited', okay: 'Okay' },
  people: { me: 'Me', you: 'You', mom: 'Mom', dad: 'Dad', friend: 'Friend', teacher: 'Teacher', nurse: 'Nurse', caregiver: 'Caregiver' },
  medical: { medicine: 'Medicine', 'it-hurts': 'It hurts', sick: 'Sick', dizzy: 'Dizzy', 'cant-breathe': "Can't breathe", bandage: 'Bandage', shot: 'Shot', rest: 'Rest' },
  core: { yes: 'Yes', no: 'No', stop: 'Stop', more: 'More', wait: 'Wait', done: 'Done', please: 'Please', thanks: 'Thanks', help: 'Help me', again: 'Again', go: 'Go' },
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
    'quick-words': 'Quick words',
    'quick-words-hint': 'The four buttons under the message bar. There are always four, and they stay in the same place on every page.',
    'quick-word-slot': 'Button {n}',
    'quick-word-own': 'Or type your own word',
    'quick-word-own-placeholder': 'Your word',
    'quick-word-use': 'Use this word',
    'quick-word-color': 'Color',
    'quick-words-reset': 'Reset to Yes, No, Stop, More',
  },
  greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
  error: { title: 'Something went wrong.', body: 'Tap Talk ran into an error. Your words and settings are still saved on this device.', 'try-again': 'Try again', reload: 'Reload the app' },
};

const es: StringTable = {
  categories: { saved: 'Guardadas', needs: 'Necesidades', feelings: 'Sentimientos', people: 'Personas', medical: 'Médico' },
  needs: { 'i-want': 'Quiero', 'i-need': 'Necesito', water: 'Agua', food: 'Comida', bathroom: 'Baño', hot: 'Calor', cold: 'Frío', pain: 'Dolor' },
  feelings: { happy: 'Feliz', sad: 'Triste', worried: 'Preocupado', angry: 'Enojado', scared: 'Asustado', tired: 'Cansado', excited: 'Emocionado', okay: 'Bien' },
  people: { me: 'Yo', you: 'Tú', mom: 'Mamá', dad: 'Papá', friend: 'Amigo', teacher: 'Maestro', nurse: 'Enfermera', caregiver: 'Cuidador' },
  medical: { medicine: 'Medicina', 'it-hurts': 'Me duele', sick: 'Enfermo', dizzy: 'Mareado', 'cant-breathe': 'No puedo respirar', bandage: 'Vendaje', shot: 'Inyección', rest: 'Descanso' },
  core: { yes: 'Sí', no: 'No', stop: 'Para', more: 'Más', wait: 'Espera', done: 'Listo', please: 'Por favor', thanks: 'Gracias', help: 'Ayuda', again: 'Otra vez', go: 'Ir' },
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
    'quick-words': 'Palabras rápidas',
    'quick-words-hint': 'Los cuatro botones debajo de la barra de mensaje. Siempre son cuatro y se quedan en el mismo lugar en cada página.',
    'quick-word-slot': 'Botón {n}',
    'quick-word-own': 'O escribe tu propia palabra',
    'quick-word-own-placeholder': 'Tu palabra',
    'quick-word-use': 'Usar esta palabra',
    'quick-word-color': 'Color',
    'quick-words-reset': 'Restablecer a Sí, No, Para, Más',
  },
  greeting: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' },
  error: { title: 'Algo salió mal.', body: 'Tap Talk tuvo un error. Tus palabras y ajustes siguen guardados en este dispositivo.', 'try-again': 'Intentar de nuevo', reload: 'Recargar la app' },
};

export const STRINGS: Record<LanguageId, StringTable> = { 'en-US': en, 'es-ES': es };

export type StringKey = StringTable; // for consumer type inference
