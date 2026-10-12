import type { Lang, Quote } from "@/types";

/**
 * Eight quotes. The page assigns each one a vertebral level and a language,
 * reshuffled on every visit (see lib/mix.ts).
 *
 * Attributions were checked against primary or well-documented sources.
 * Where no primary source exists, `attributed: true` renders "attributed to".
 * Quotes that began in Sanskrit, Hindi or Gujarati keep their original line,
 * shown in its own script above the translation.
 */
export const quotes: Quote[] = [
  {
    id: "q1",
    title: { en: "Foundation", hi: "नींव", gu: "પાયો" },
    original: {
      text: "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।",
      script: "devanagari",
    },
    text: {
      en: "Work is finished by effort, not by wishing — deer do not walk into a sleeping lion's mouth.",
      hi: "काम परिश्रम से पूरे होते हैं, केवल इच्छा करने से नहीं — सोए हुए सिंह के मुँह में हिरण अपने आप नहीं आते।",
      gu: "કામ પરિશ્રમથી પૂરાં થાય છે, માત્ર ઇચ્છવાથી નહીં — સૂતેલા સિંહના મોંમાં હરણ સામે ચાલીને આવતાં નથી.",
    },
    author: {
      en: "Sanskrit subhashita",
      hi: "संस्कृत सुभाषित",
      gu: "સંસ્કૃત સુભાષિત",
    },
    source: {
      en: "Traditional; commonly cited to the Hitopadesha",
      hi: "परंपरागत; प्रायः हितोपदेश से उद्धृत",
      gu: "પરંપરાગત; ઘણીવાર હિતોપદેશમાંથી ટાંકવામાં આવે છે",
    },
    note: {
      en: "Wanting it is not studying for it. Open the book.",
      hi: "चाहना पढ़ाई नहीं है। किताब खोलो।",
      gu: "ઇચ્છવું એ અભ્યાસ નથી. પુસ્તક ખોલો.",
    },
  },
  {
    id: "q2",
    title: { en: "Habit", hi: "आदत", gu: "ટેવ" },
    text: {
      en: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      hi: "हम वही हैं जो हम बार-बार करते हैं। इसलिए उत्कृष्टता कोई काम नहीं, एक आदत है।",
      gu: "આપણે વારંવાર જે કરીએ છીએ તે જ આપણે છીએ. એટલે ઉત્કૃષ્ટતા એ કાર્ય નથી, ટેવ છે.",
    },
    author: { en: "Will Durant", hi: "विल ड्यूरेंट", gu: "વિલ ડ્યુરન્ટ" },
    source: {
      en: "The Story of Philosophy, 1926 — summarising Aristotle",
      hi: "द स्टोरी ऑफ़ फ़िलॉसफ़ी, 1926 — अरस्तू का सार",
      gu: "ધ સ્ટોરી ઓફ ફિલોસોફી, 1926 — એરિસ્ટોટલનો સાર",
    },
    note: {
      en: "Not one heroic night. A hundred ordinary ones.",
      hi: "एक वीर रात नहीं। सौ साधारण रातें।",
      gu: "એક વીરતાભરી રાત નહીં. સો સામાન્ય રાતો.",
    },
  },
  {
    id: "q3",
    title: { en: "Movement", hi: "गति", gu: "ગતિ" },
    text: {
      en: "If you can't fly, run; if you can't run, walk; if you can't walk, crawl; but by all means keep moving.",
      hi: "उड़ न सको तो दौड़ो; दौड़ न सको तो चलो; चल न सको तो रेंगो; पर बढ़ते रहो।",
      gu: "ઊડી ન શકો તો દોડો; દોડી ન શકો તો ચાલો; ચાલી ન શકો તો ઘસડાઓ; પણ આગળ વધતા રહો.",
    },
    author: {
      en: "Martin Luther King Jr.",
      hi: "मार्टिन लूथर किंग जूनियर",
      gu: "માર્ટિન લ્યુથર કિંગ જુનિયર",
    },
    source: {
      en: "Address at Spelman College, 1960",
      hi: "स्पेलमैन कॉलेज में भाषण, 1960",
      gu: "સ્પેલમૅન કૉલેજમાં વ્યાખ્યાન, 1960",
    },
    note: {
      en: "Movement is your whole profession. Slow days still count.",
      hi: "गति ही तुम्हारा पूरा पेशा है। धीमे दिन भी गिने जाते हैं।",
      gu: "ગતિ એ જ તમારો આખો વ્યવસાય છે. ધીમા દિવસો પણ ગણાય છે.",
    },
  },
  {
    id: "q4",
    title: { en: "Persistence", hi: "लगन", gu: "ખંત" },
    original: {
      text: "लहरों से डरकर नौका पार नहीं होती, कोशिश करने वालों की हार नहीं होती।",
      script: "devanagari",
      lang: "hi",
    },
    text: {
      en: "No boat ever crossed by fearing the waves. Those who keep trying are never defeated.",
      hi: "लहरों से डरकर नौका पार नहीं होती, कोशिश करने वालों की हार नहीं होती।",
      gu: "મોજાંથી ડરીને નાવ પાર થતી નથી; પ્રયત્ન કરનારની ક્યારેય હાર થતી નથી.",
    },
    author: {
      en: "Sohanlal Dwivedi",
      hi: "सोहनलाल द्विवेदी",
      gu: "સોહનલાલ દ્વિવેદી",
    },
    source: {
      en: "Widely misattributed to Harivansh Rai Bachchan",
      hi: "प्रायः ग़लती से हरिवंश राय बच्चन के नाम से",
      gu: "ઘણીવાર ભૂલથી હરિવંશ રાય બચ્ચનના નામે",
    },
    note: {
      en: "A low mock score is data, not a verdict.",
      hi: "कम अंक आँकड़े हैं, फ़ैसला नहीं।",
      gu: "ઓછા ગુણ એ માહિતી છે, ચુકાદો નહીં.",
    },
  },
  {
    id: "q5",
    title: { en: "Courage", hi: "साहस", gu: "હિંમત" },
    text: {
      en: "I learned that courage was not the absence of fear, but the triumph over it.",
      hi: "मैंने सीखा कि साहस डर का न होना नहीं, बल्कि डर पर विजय है।",
      gu: "મેં શીખ્યું કે હિંમત એટલે ડરનો અભાવ નહીં, પણ ડર પરનો વિજય.",
    },
    author: { en: "Nelson Mandela", hi: "नेल्सन मंडेला", gu: "નેલ્સન મંડેલા" },
    source: {
      en: "Long Walk to Freedom",
      hi: "लॉन्ग वॉक टु फ़्रीडम",
      gu: "લોંગ વૉક ટુ ફ્રીડમ",
    },
    note: {
      en: "Nerves mean it matters. Walk in anyway.",
      hi: "घबराहट का मतलब है यह मायने रखता है। फिर भी भीतर जाओ।",
      gu: "ગભરાટ એટલે એ મહત્ત્વનું છે. તોય અંદર જાઓ.",
    },
  },
  {
    id: "q6",
    title: { en: "Strength", hi: "बल", gu: "બળ" },
    original: {
      text: "હિંમતે મર્દા તો મદદે ખુદા.",
      script: "gujarati",
      lang: "gu",
    },
    text: {
      en: "Show courage, and heaven itself comes to help.",
      hi: "हिम्मत करो, तो ख़ुदा भी मदद करता है।",
      gu: "હિંમતે મર્દા તો મદદે ખુદા.",
    },
    author: {
      en: "Gujarati proverb",
      hi: "गुजराती कहावत",
      gu: "ગુજરાતી કહેવત",
    },
    source: {
      en: "A folk saying; no single author",
      hi: "लोकोक्ति; कोई एक रचयिता नहीं",
      gu: "લોકોક્તિ; કોઈ એક રચયિતા નહીં",
    },
    note: {
      en: "Your own language said this long before I did.",
      hi: "यह बात तुम्हारी अपनी भाषा ने मुझसे पहले कह दी थी।",
      gu: "આ વાત તો તમારી પોતાની ભાષાએ મારા કરતાં પહેલાં કહી દીધી છે.",
    },
  },
  {
    id: "q7",
    title: { en: "Resolve", hi: "संकल्प", gu: "સંકલ્પ" },
    original: {
      text: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।",
      script: "devanagari",
    },
    text: {
      en: "Arise, awake, and stop not till the goal is reached.",
      hi: "उठो, जागो, और तब तक मत रुको जब तक लक्ष्य न मिल जाए।",
      gu: "ઊઠો, જાગો, અને ધ્યેય પ્રાપ્ત ન થાય ત્યાં સુધી અટકો નહીં.",
    },
    author: { en: "Katha Upanishad", hi: "कठोपनिषद्", gu: "કઠોપનિષદ" },
    source: {
      en: "1.3.14 — the line Swami Vivekananda carried to the world",
      hi: "1.3.14 — वही पंक्ति जिसे स्वामी विवेकानंद ने जगत तक पहुँचाया",
      gu: "1.3.14 — એ જ પંક્તિ જેને સ્વામી વિવેકાનંદે જગત સુધી પહોંચાડી",
    },
    note: {
      en: "You are closer than the tired version of you believes.",
      hi: "तुम उससे कहीं ज़्यादा पास हो, जितना थका हुआ मन मानता है।",
      gu: "તમે થાકેલા મનને લાગે છે તેના કરતાં ઘણાં નજીક છો.",
    },
  },
  {
    id: "q8",
    title: { en: "Summit", hi: "शिखर", gu: "શિખર" },
    text: {
      en: "It is better to be a lion for a day than a sheep all your life.",
      hi: "जीवन भर भेड़ बने रहने से बेहतर है एक दिन शेर बनकर जीना।",
      gu: "આખી જિંદગી ઘેટું બની રહેવા કરતાં એક દિવસ સિંહ બનીને જીવવું સારું.",
    },
    author: {
      en: "Sister Elizabeth Kenny",
      hi: "सिस्टर एलिज़ाबेथ केनी",
      gu: "સિસ્ટર એલિઝાબેથ કેની",
    },
    attributed: true,
    source: {
      en: "Nurse who pioneered movement therapy for polio",
      hi: "पोलियो के लिए गति-चिकित्सा की अग्रदूत नर्स",
      gu: "પોલિયો માટે ગતિ-ચિકિત્સાની અગ્રદૂત નર્સ",
    },
    note: {
      en: "Exam day is one day. Be the lion.",
      hi: "परीक्षा का दिन एक ही दिन है। शेर बनो।",
      gu: "પરીક્ષાનો દિવસ એક જ દિવસ છે. સિંહ બનો.",
    },
  },
];

/** Short nudges mixed into the "Need a boost?" pool. */
export const reminders: Record<Lang, string[]> = {
  en: [
    "You already know more than you think you do.",
    "Progress, not perfection. Open the book. One hour.",
    "Rest is part of the programme. Even athletes deload.",
    "Every patient you will ever help is rooting for you.",
    "Breathe in. You have done hard things before.",
    "Done beats perfect. One more question set.",
  ],
  hi: [
    "तुम जितना सोचती हो, उससे कहीं ज़्यादा जानती हो।",
    "पूर्णता नहीं, प्रगति। किताब खोलो। एक घंटा।",
    "आराम भी योजना का हिस्सा है। खिलाड़ी भी भार घटाते हैं।",
    "जिन मरीज़ों की तुम मदद करोगी, वे सब तुम्हारे साथ हैं।",
    "साँस लो। तुमने पहले भी कठिन काम किए हैं।",
    "पूर्ण से बेहतर है पूरा किया हुआ। एक और प्रश्न-सेट।",
  ],
  gu: [
    "તમે ધારો છો એના કરતાં ઘણું વધારે જાણો છો.",
    "સંપૂર્ણતા નહીં, પ્રગતિ. પુસ્તક ખોલો. એક કલાક.",
    "આરામ પણ યોજનાનો ભાગ છે. ખેલાડીઓ પણ ભાર ઘટાડે છે.",
    "જે દર્દીઓને તમે મદદ કરશો, તે બધા તમારી સાથે છે.",
    "શ્વાસ લો. તમે પહેલાં પણ અઘરાં કામ કર્યાં છે.",
    "સંપૂર્ણ કરતાં પૂરું કરેલું સારું. વધુ એક પ્રશ્નસેટ.",
  ],
};
