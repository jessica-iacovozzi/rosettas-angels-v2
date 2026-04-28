export type Lang = 'en' | 'fr';

export function getLang(locale?: string): Lang {
  return locale === 'fr' ? 'fr' : 'en';
}

// ---------------------------------------------------------------------------
// Shared sub-types
// ---------------------------------------------------------------------------

interface AccentHeading {
  before: string;
  accent: string;
  after: string;
}

interface CardItem {
  title: string;
  desc: string;
}

// ---------------------------------------------------------------------------
// Top-level translations shape
// ---------------------------------------------------------------------------

export interface Translations {
  skip: string;

  nav: {
    home: string;
    gallery: string;
    team: string;
    volunteer: string;
    donate: string;
    primaryLabel: string;
    langSwitch: string; // label shown on the language-switch link
    langSwitchLocale: Lang; // target locale
  };

  footer: {
    tagline: string;
    explore: string;
    navTeam: string;
    contact: string;
    sendMessage: string;
    transparency: string;
    transparencyText: string;
    rights: string;
    credit: string;
  };

  hero: {
    eyebrow: string;
    headingBefore: string;
    headingAccent: string;
    headingLine2: string;
    headingLine3: string;
    sub: string;
    ctaDonate: string;
    ctaVolunteer: string;
    videoLabel: string;
    videoAria: string;
  };

  story: {
    eyebrow: string;
    heading: AccentHeading;
    body: string;
  };

  mission: {
    eyebrow: string;
    heading: AccentHeading;
    body: string;
  };

  quote: {
    text: string;
    attribution: string;
    attributionRole: string;
  };

  howWeHelp: {
    eyebrow: string;
    heading: AccentHeading;
    cta: string;
    cards: CardItem[];
  };

  stats: {
    srLabel: string;
    labels: string[];
    sinceUnderlined: string;
    sinceRest: string;
  };

  getInvolved: {
    eyebrow: string;
    heading: AccentHeading;
    cards: {
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
      slug: string; // e.g. 'donate' or 'volunteer' — used with getRelativeLocaleUrl
    }[];
  };

  contact: {
    eyebrow: string;
    heading: AccentHeading;
    lede: string;
    direct: string;
  };

  donate: {
    pageTitle: string;
    metaDesc: string;
    heroEyebrow: string;
    heroHeading: AccentHeading;
    heroLede: string;
    gridHeading: string;
    method1Title: string;
    method1Body: string;
    method1Note: string;
    method2Title: string;
    method2Body: string;
    method2BodyAfter: string;
    thanks: string;
    srForm: string;
  };

  volunteer: {
    pageTitle: string;
    metaDesc: string;
    heroEyebrow: string;
    heroHeading: AccentHeading;
    heroLede: string;
    detailsHeading: string;
    when: string;
    where: string;
    whereDetail: string;
    contact: string;
    activitiesHeading: string;
    formHeading: AccentHeading;
    formLede: string;
    singleDayNote: string;
    activities: { title: string; desc: string }[];
  };

  team: {
    pageTitle: string;
    metaDesc: string;
    heroEyebrow: string;
    heroHeading: AccentHeading;
    heroLede: string;
    leadersHeading: string;
    testimonialsEyebrow: string;
    testimonialsHeading: AccentHeading;
    ctaHeading: string;
    ctaCopy: string;
    ctaVolunteer: string;
    ctaContact: string;
    leaders: { name: string; role: string; bio: string }[];
    testimonialRole: string;
    testimonials: { name: string; quote: string }[];
    carouselLabels: {
      region: string;
      prev: string;
      next: string;
      choose: string;
    };
  };

  gallery: {
    pageTitle: string;
    metaDesc: string;
    eyebrow: string;
    heading: AccentHeading;
    lede: string;
    openPhoto: string;
    openVideo: string;
  };

  notFound: {
    pageTitle: string;
    metaDesc: string;
    heading: AccentHeading;
    lede: string;
    home: string;
    donate: string;
  };

  forms: {
    contact: {
      labelName: string;
      labelEmail: string;
      labelPhone: string;
      labelSubject: string;
      labelMessage: string;
      optional: string;
      required: string;
      sending: string;
      sendButton: string;
      legal: string;
      successMsg: string;
      errorRateLimit: string; // contains "{s}" placeholder
      errorFail: string; // contains "{msg}" placeholder
      dismiss: string;
      // Validation errors
      vNameRequired: string;
      vNameTooLong: string;
      vEmailRequired: string;
      vEmailInvalid: string;
      vPhoneInvalid: string;
      vSubjectRequired: string;
      vMessageRequired: string;
    };
    volunteer: {
      labelName: string;
      labelEmail: string;
      labelPhone: string;
      required: string;
      optional: string;
      phoneHint: string;
      labelAdditional: string;
      additionalHint: string;
      labelDelivery: string;
      deliveryHint: string;
      deliveryPlaceholder: string;
      deliveryYes: string;
      deliveryNo: string;
      deliveryMaybe: string;
      labelComments: string;
      commentsHint: string;
      submitting: string;
      submitButton: string;
      legal: string;
      successMsg: string;
      errorFail: string; // contains "{msg}" placeholder
      dismiss: string;
      // Validation errors
      vNameRequired: string;
      vEmailRequired: string;
      vEmailInvalid: string;
      vPhoneRequired: string;
      vPhoneInvalid: string;
      vDeliveryRequired: string;
    };
    mobile: {
      openMenu: string;
      closeMenu: string;
      siteNav: string;
      mobilePrimary: string;
    };
  };
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

const en: Translations = {
  skip: 'Skip to main content',

  nav: {
    home: 'Home',
    gallery: 'Gallery',
    team: 'Team',
    volunteer: 'Volunteer',
    donate: 'Donate',
    primaryLabel: 'Primary',
    langSwitch: 'FR',
    langSwitchLocale: 'fr',
  },

  footer: {
    tagline:
      "A Montreal-based non-profit bringing holiday joy to families in need — carrying on Rosetta's legacy, one basket at a time.",
    explore: 'Explore',
    navTeam: 'Our Team',
    contact: 'Contact',
    sendMessage: 'Send us a message',
    transparency: 'Transparency',
    transparencyText:
      "Rosetta's Angels is a registered non-profit organization. We are not yet able to issue tax receipts as we await official charity status. 100% of donations go toward holiday baskets and family support.",
    rights: 'All rights reserved.',
    credit: 'Made with love by',
  },

  hero: {
    eyebrow: 'Montreal · Holiday Basket Brigade',
    headingBefore: 'We bring ',
    headingAccent: 'joy',
    headingLine2: 'to families',
    headingLine3: 'in\u00a0need.',
    sub: "Carrying on Rosetta's legacy — every December, our volunteers pack and deliver baskets full of food, gifts, and warmth to Montreal families facing hardship.",
    ctaDonate: 'Donate Now',
    ctaVolunteer: 'Volunteer',
    videoLabel: 'Watch our 2025 holiday delivery story',
    videoAria: 'Featured video',
  },

  story: {
    eyebrow: 'Our Story',
    heading: { before: 'Born from ', accent: 'love', after: '.' },
    body: "Rosetta's Angels was born from a profound loss. After Rosetta Malgieri Regillo passed away, her family decided to honour her memory the way she had always lived — by giving. What started with a handful of baskets for neighbours has grown into an annual brigade serving hundreds of Montreal families each holiday season.",
  },

  mission: {
    eyebrow: 'Our Mission',
    heading: { before: 'Holiday joy, ', accent: 'delivered', after: '.' },
    body: 'As a Montreal-based non-profit, we connect generous donors and dedicated volunteers with families facing hardship — providing food, gifts, and a personal moment of warmth at a time when it matters most.',
  },

  quote: {
    text: 'If you are in a position to help others, don\u2019t let the moment pass.',
    attribution: 'Rosetta Malgieri Regillo',
    attributionRole: 'Founder, in spirit',
  },

  howWeHelp: {
    eyebrow: 'How We Support Families',
    heading: {
      before: 'Three ways your ',
      accent: 'generosity',
      after: '\u00a0reaches\u00a0families.',
    },
    cta: 'Become a Volunteer',
    cards: [
      {
        title: 'Nourishment & Home Comfort',
        desc: "Your generosity helps us provide families with fresh produce, nutritious staples, and essential items like refrigerators so they can safely store and prepare wholesome meals. Every food basket is assembled with care, helping families celebrate the season with warmth and dignity.",
      },
      {
        title: 'Everyday Essentials & Mobility',
        desc: "Stability means more than food on the table. Through your contributions, families receive personal care products, household necessities, beds for restful sleep, and bus passes to stay connected to work, school, and vital appointments — supporting their independence all year long.",
      },
      {
        title: 'Warmth & Holiday Joy',
        desc: "Every family deserves to feel cared for during the holidays. Your donations make it possible to provide cozy winter clothing — coats, boots, hats, and gloves — to protect families through Montreal's cold months, alongside thoughtful, personalized gifts that bring joy and connection to every home.",
      },
    ],
  },

  stats: {
    srLabel: 'Our impact by the numbers',
    labels: ['Years of Service', 'Families Supported', 'Annual Volunteers'],
    sinceUnderlined: 'Since 2009',
    sinceRest: ' in Montreal.',
  },

  getInvolved: {
    eyebrow: 'Get Involved',
    heading: { before: 'Join us in making a ', accent: 'difference', after: '.' },
    cards: [
      {
        eyebrow: 'Make a Donation',
        title: 'Fund the next basket.',
        body: 'Every dollar goes directly into food, gifts, and essentials for families this December.',
        cta: 'Donate Now',
        slug: 'donate',
      },
      {
        eyebrow: 'Become a Volunteer',
        title: "Join the next brigade.",
        body: 'Sort, wrap, pack, deliver. A few hours of your time becomes a holiday memory for a family.',
        cta: 'Volunteer Now',
        slug: 'volunteer',
      },
    ],
  },

  contact: {
    eyebrow: 'Get in Touch',
    heading: { before: 'Have a question? ', accent: 'Write us', after: '.' },
    lede: 'Have questions about our holiday basket initiative or want to make a difference?',
    direct: 'Or email us directly at',
  },

  donate: {
    pageTitle: "Donate to Rosetta's Angels | Support Montreal Families",
    metaDesc:
      "Support Rosetta's Angels — your gift helps Montreal families receive holiday baskets full of food, gifts, and warmth. Donate online or by cheque.",
    heroEyebrow: 'Support Our Mission',
    heroHeading: { before: 'Make a ', accent: 'donation', after: '.' },
    heroLede:
      'Your generosity helps us bring holiday joy to Montreal families in need. Every gift becomes a basket — and every basket becomes a memory.',
    gridHeading: 'Two ways to give',
    method1Title: 'Online Donation',
    method1Body:
      'Use the Donorbox form on the right to give online by credit card, Apple Pay, Google Pay, or PayPal.',
    method1Note:
      'While we are a registered non-profit organization, please note that we are not yet able to provide tax receipts as we await our official charity status.',
    method2Title: 'By Cheque',
    method2Body: 'If you prefer to send a cheque, please contact us at',
    method2BodyAfter: 'for mailing information.',
    thanks:
      "Thank you for believing in our mission and for being part of our community. Don't hesitate to contact us if you have any questions or concerns.",
    srForm: 'Online donation form',
  },

  volunteer: {
    pageTitle: "Volunteer in Montreal | Rosetta's Angels Holiday Brigade",
    metaDesc:
      "Sign up to volunteer with Rosetta's Angels and help bring holiday joy to Montreal families in need. Roles include gift wrapping, basket assembly, errand running, and basket delivery.",
    heroEyebrow: 'Volunteer',
    heroHeading: { before: 'Join our volunteer ', accent: 'team', after: '.' },
    heroLede:
      "At Rosetta's Angels, our volunteers are the heart of our holiday basket brigade. Together, we can continue Rosetta's legacy and bring joy to Montreal families this December.",
    detailsHeading: 'Event Details',
    when: 'When',
    where: 'Where',
    whereDetail: 'Montreal — exact location shared with confirmed volunteers.',
    contact: 'Contact',
    activitiesHeading: 'Activities',
    formHeading: { before: 'Fill out the ', accent: 'form', after: '.' },
    formLede:
      "Together, we can continue Rosetta's legacy. We'll be in touch within a few days of receiving your application.",
    singleDayNote:
      "This year's event is a single day, so the availability selector is hidden. Your time slot will be confirmed by email.",
    activities: [
      {
        title: 'Gift Wrapping',
        desc: 'Help create magical moments by wrapping presents for children and families.',
      },
      {
        title: 'Basket Assembly',
        desc: 'Carefully pack food, gifts, and essentials into holiday baskets ready for delivery.',
      },
      {
        title: 'Errand Running',
        desc: 'Help with various errands and supply runs to keep the brigade moving.',
      },
      {
        title: 'Basket Delivery',
        desc: 'Help distribute completed baskets directly to families in the Montreal area.',
      },
    ],
  },

  team: {
    pageTitle: "Our Team",
    metaDesc:
      "Meet the dedicated leaders who make Rosetta's Angels possible — and hear from the volunteers.",
    heroEyebrow: 'Our Team',
    heroHeading: { before: 'The hands behind the ', accent: 'baskets', after: '.' },
    heroLede:
      "Meet the dedicated individuals who lead Rosetta's Angels with passion and commitment — and the volunteers who breathe life into every December.",
    leadersHeading: 'Leadership',
    testimonialsEyebrow: 'Voices from the Brigade',
    testimonialsHeading: {
      before: 'Hear from the volunteers who make our mission ',
      accent: 'possible',
      after: '.',
    },
    ctaHeading: 'Join Our Team',
    ctaCopy: 'Help us make a difference in our community.',
    ctaVolunteer: 'Volunteer',
    ctaContact: 'Contact Us',
    leaders: [
      {
        name: 'Grace',
        role: 'Logistics & Planning',
        bio: 'Grace takes care of the rationing, the planning, the asking and the organizing — turning a year of intentions into a December of delivered baskets.',
      },
      {
        name: 'Tony',
        role: 'Operations & Outreach',
        bio: 'Tony collects donations, advertises, does the research and moves things around — the engine that keeps the brigade rolling.',
      },
      {
        name: 'Yan',
        role: 'Volunteer Coordinator',
        bio: 'Yan never stops helping out — packing, sorting, driving — and his hard work never goes unnoticed.',
      },
    ],
    testimonialRole: 'Volunteer',
    testimonials: [
      {
        name: 'Angelo',
        quote:
          "It's the smile that you see on the face of these people. That moment, that is what makes this so special — for me and for them.",
      },
      {
        name: 'Jinny',
        quote:
          "There's families where the kids sleep on the floor. To bring them a basket and watch their faces… you carry it home with you for weeks.",
      },
      {
        name: 'Kim',
        quote:
          "I am moved at how grateful they are. Every door, every thank-you — it reminds me why we keep coming back every December.",
      },
      {
        name: 'Anna Maria',
        quote:
          "That's what Christmas is all about. Not gifts under a tree — gifts at someone else's door. Rosetta knew that better than anyone.",
      },
    ],
    carouselLabels: {
      region: 'Volunteer testimonials',
      prev: 'Previous testimonial',
      next: 'Next testimonial',
      choose: 'Choose a testimonial',
    },
  },

  gallery: {
    pageTitle: 'Gallery',
    metaDesc:
      "Browse photos and videos from years of Rosetta's Angels holiday basket events in Montreal.",
    eyebrow: 'Gallery',
    heading: { before: 'Sixteen years of ', accent: 'smiles', after: '.' },
    lede: 'Behind every basket is a moment. Browse the photos and videos that capture our volunteers, families, and the Montreal community at its most generous.',
    openPhoto: 'Open photo: ',
    openVideo: 'Open video: ',
  },

  notFound: {
    pageTitle: '404 Not Found',
    metaDesc: 'The page you are looking for does not exist.',
    heading: { before: 'Page not ', accent: 'found', after: '.' },
    lede: 'Sorry, the page you are looking for does not exist. It may have moved, or perhaps the link was mistyped.',
    home: 'Back to Home',
    donate: 'Make a Donation',
  },

  forms: {
    contact: {
      labelName: 'Name',
      labelEmail: 'Email',
      labelPhone: 'Phone',
      labelSubject: 'Subject',
      labelMessage: 'Message',
      required: 'required',
      optional: '(optional)',
      sending: 'Sending\u2026',
      sendButton: 'Send Message',
      legal:
        'Protected by reCAPTCHA. By sending you agree to our use of your contact details to reply.',
      successMsg: 'Message sent successfully! We will get back to you soon.',
      errorRateLimit: 'Please wait {s}s before sending another message.',
      errorFail: 'Failed to send message. Please try again later. ({msg})',
      dismiss: 'Dismiss',
      vNameRequired: 'Name is required',
      vNameTooLong: 'Name must be less than 50 characters',
      vEmailRequired: 'Email is required',
      vEmailInvalid: 'Please enter a valid email',
      vPhoneInvalid: 'Please enter a valid phone number',
      vSubjectRequired: 'Subject is required',
      vMessageRequired: 'Message is required',
    },
    volunteer: {
      labelName: 'Name',
      labelEmail: 'Email',
      labelPhone: 'Phone',
      required: 'required',
      optional: '(optional)',
      phoneHint: "We'll only use your phone for time-sensitive coordination on event day.",
      labelAdditional: 'Names of additional volunteers',
      additionalHint:
        'If you are volunteering with others, please have them complete the form or list their names here.',
      labelDelivery: 'Would you like to deliver?',
      deliveryHint:
        "Delivery is our most popular task. If you choose to deliver, you'll be briefed on our protocol about an hour before the event.",
      deliveryPlaceholder: 'Select an answer',
      deliveryYes: 'Yes, please!',
      deliveryNo: "No, I won't be able to.",
      deliveryMaybe: "Maybe, I'll let you know.",
      labelComments: 'Comments',
      commentsHint: 'Feel free to share any additional information or questions you may have.',
      submitting: 'Submitting\u2026',
      submitButton: 'Submit Application',
      legal: 'Protected by reCAPTCHA. Questions?',
      successMsg: 'Application submitted successfully! We will contact you soon.',
      errorFail: 'Failed to submit application. Please try again later. ({msg})',
      dismiss: 'Dismiss',
      vNameRequired: 'Name is required',
      vEmailRequired: 'Email is required',
      vEmailInvalid: 'Please enter a valid email',
      vPhoneRequired: 'Phone is required',
      vPhoneInvalid: 'Please enter a valid phone number',
      vDeliveryRequired: 'Please select an answer',
    },
    mobile: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      siteNav: 'Site navigation',
      mobilePrimary: 'Mobile primary',
    },
  },
};

// ---------------------------------------------------------------------------
// French
// ---------------------------------------------------------------------------

const fr: Translations = {
  skip: 'Passer au contenu principal',

  nav: {
    home: 'Accueil',
    gallery: 'Galerie',
    team: 'Équipe',
    volunteer: 'Bénévolat',
    donate: 'Faire un don',
    primaryLabel: 'Principale',
    langSwitch: 'EN',
    langSwitchLocale: 'en',
  },

  footer: {
    tagline:
      "Un organisme sans but lucratif montréalais qui apporte la joie des fêtes aux familles dans le besoin — perpétuant l\u2019héritage de Rosetta, un panier à la fois.",
    explore: 'Explorer',
    navTeam: 'Notre équipe',
    contact: 'Contact',
    sendMessage: 'Envoyez-nous un message',
    transparency: 'Transparence',
    transparencyText:
      "Les Anges de Rosetta est un organisme sans but lucratif enregistré. Nous ne sommes pas encore en mesure d\u2019émettre des reçus fiscaux dans l\u2019attente de notre statut officiel d\u2019organisme de bienfaisance. 100\u00a0% des dons sont consacrés aux paniers des fêtes et au soutien aux familles.",
    rights: 'Tous droits réservés.',
    credit: 'Fait avec amour par',
  },

  hero: {
    eyebrow: 'Montréal · Brigade de paniers des fêtes',
    headingBefore: 'Nous apportons ',
    headingAccent: 'la joie',
    headingLine2: 'aux familles',
    headingLine3: 'dans\u00a0le besoin.',
    sub: "Perpétuant l\u2019héritage de Rosetta — chaque décembre, nos bénévoles emballent et livrent des paniers remplis de nourriture, de cadeaux et de chaleur aux familles montréalaises dans le besoin.",
    ctaDonate: 'Faire un don',
    ctaVolunteer: 'Bénévolat',
    videoLabel: 'Regarder notre histoire de livraison 2025',
    videoAria: 'Vidéo vedette',
  },

  story: {
    eyebrow: 'Notre histoire',
    heading: { before: 'Née de ', accent: 'l\u2019amour', after: '.' },
    body: "Les Anges de Rosetta sont nés d\u2019une perte profonde. Après le décès de Rosetta Malgieri Regillo, sa famille a décidé d\u2019honorer sa mémoire comme elle avait toujours vécu — en donnant. Ce qui a commencé avec quelques paniers pour les voisins est devenu une brigade annuelle au service de centaines de familles montréalaises à chaque saison des fêtes.",
  },

  mission: {
    eyebrow: 'Notre mission',
    heading: { before: 'La joie des fêtes, ', accent: 'livrée', after: '.' },
    body: "En tant qu\u2019organisme sans but lucratif basé à Montréal, nous mettons en relation des donateurs généreux et des bénévoles dévoués avec des familles dans le besoin — leur offrant nourriture, cadeaux et un moment de chaleur personnelle au moment qui compte le plus.",
  },

  quote: {
    text: "Si vous êtes en mesure d\u2019aider les autres, ne laissez pas passer le moment.",
    attribution: 'Rosetta Malgieri Regillo',
    attributionRole: 'Fondatrice, en esprit',
  },

  howWeHelp: {
    eyebrow: 'Comment nous soutenons les familles',
    heading: {
      before: 'Trois façons dont votre ',
      accent: 'générosité',
      after: '\u00a0touche les familles.',
    },
    cta: 'Devenir bénévole',
    cards: [
      {
        title: 'Nutrition et confort à la maison',
        desc: "Votre générosité nous permet de fournir aux familles des fruits et légumes frais, des aliments nutritifs essentiels et des articles indispensables comme des réfrigérateurs pour qu\u2019elles puissent stocker et préparer des repas sains. Chaque panier alimentaire est assemblé avec soin, aidant les familles à célébrer la saison avec chaleur et dignité.",
      },
      {
        title: 'Essentiels du quotidien et mobilité',
        desc: "La stabilité va au-delà de la nourriture. Grâce à vos contributions, les familles reçoivent des produits de soins personnels, des articles ménagers, des lits pour un sommeil réparateur et des passes d\u2019autobus pour rester connectées au travail, à l\u2019école et aux rendez-vous essentiels.",
      },
      {
        title: 'Chaleur et joie des fêtes',
        desc: "Chaque famille mérite de se sentir chérie pendant les fêtes. Vos dons permettent de fournir des vêtements d\u2019hiver chauds — manteaux, bottes, chapeaux et gants — pour protéger les familles durant les mois froids de Montréal, ainsi que des cadeaux personnalisés qui apportent joie et liens à chaque foyer.",
      },
    ],
  },

  stats: {
    srLabel: 'Notre impact en chiffres',
    labels: ['Années de service', 'Familles soutenues', 'Bénévoles annuels'],
    sinceUnderlined: 'Depuis 2009',
    sinceRest: ' à Montréal.',
  },

  getInvolved: {
    eyebrow: "S'impliquer",
    heading: { before: 'Rejoignez-nous pour faire une ', accent: 'différence', after: '.' },
    cards: [
      {
        eyebrow: 'Faire un don',
        title: 'Financez le prochain panier.',
        body: 'Chaque dollar est directement consacré à la nourriture, aux cadeaux et aux essentiels pour les familles en décembre.',
        cta: 'Faire un don',
        slug: 'donate',
      },
      {
        eyebrow: 'Devenir bénévole',
        title: 'Rejoignez la brigade.',
        body: "Trier, emballer, préparer, livrer. Quelques heures de votre temps deviennent un souvenir de fêtes pour une famille.",
        cta: 'Devenir bénévole',
        slug: 'volunteer',
      },
    ],
  },

  contact: {
    eyebrow: 'Nous contacter',
    heading: { before: 'Une question\u00a0? ', accent: 'Écrivez-nous', after: '.' },
    lede: "Vous avez des questions sur notre initiative de paniers des fêtes ou souhaitez faire une différence\u00a0?",
    direct: 'Ou écrivez-nous directement à',
  },

  donate: {
    pageTitle: "Faire un don aux Anges de Rosetta | Soutenir les familles de Montréal",
    metaDesc:
      "Soutenez les Anges de Rosetta — votre don aide les familles montréalaises à recevoir des paniers des fêtes remplis de nourriture, de cadeaux et de chaleur. Donnez en ligne ou par chèque.",
    heroEyebrow: 'Soutenir notre mission',
    heroHeading: { before: 'Faites un ', accent: 'don', after: '.' },
    heroLede:
      "Votre générosité nous aide à apporter la joie des fêtes aux familles montréalaises dans le besoin. Chaque don devient un panier — et chaque panier devient un souvenir.",
    gridHeading: 'Deux façons de donner',
    method1Title: 'Don en ligne',
    method1Body:
      'Utilisez le formulaire Donorbox à droite pour donner en ligne par carte de crédit, Apple Pay, Google Pay ou PayPal.',
    method1Note:
      "Bien que nous soyons un organisme sans but lucratif enregistré, veuillez noter que nous ne sommes pas encore en mesure d\u2019émettre des reçus fiscaux dans l\u2019attente de notre statut officiel d\u2019organisme de bienfaisance.",
    method2Title: 'Par chèque',
    method2Body: 'Si vous préférez envoyer un chèque, contactez-nous à',
    method2BodyAfter: 'pour les informations postales.',
    thanks:
      "Merci de croire en notre mission et de faire partie de notre communauté. N\u2019hésitez pas à nous contacter si vous avez des questions.",
    srForm: 'Formulaire de don en ligne',
  },

  volunteer: {
    pageTitle: "Bénévolat à Montréal | Brigade des fêtes des Anges de Rosetta",
    metaDesc:
      "Inscrivez-vous comme bénévole avec les Anges de Rosetta et aidez à apporter la joie des fêtes aux familles montréalaises dans le besoin.",
    heroEyebrow: 'Bénévolat',
    heroHeading: { before: 'Rejoignez notre ', accent: 'équipe', after: ' de bénévoles.' },
    heroLede:
      "Aux Anges de Rosetta, nos bénévoles sont le cœur de notre brigade de paniers des fêtes. Ensemble, nous pouvons perpétuer l\u2019héritage de Rosetta et apporter la joie aux familles montréalaises ce décembre.",
    detailsHeading: "Détails de l\u2019événement",
    when: 'Quand',
    where: 'Où',
    whereDetail: "Montréal — l\u2019emplacement exact est communiqué aux bénévoles confirmés.",
    contact: 'Contact',
    activitiesHeading: 'Activités',
    formHeading: { before: 'Remplissez le ', accent: 'formulaire', after: '.' },
    formLede:
      "Ensemble, nous pouvons perpétuer l\u2019héritage de Rosetta. Nous vous contacterons dans les quelques jours suivant la réception de votre candidature.",
    singleDayNote:
      "L\u2019événement de cette année est d\u2019une seule journée, donc le sélecteur de disponibilité est masqué. Votre plage horaire sera confirmée par courriel.",
    activities: [
      {
        title: 'Emballage de cadeaux',
        desc: "Contribuez à créer des moments magiques en emballant des cadeaux pour les enfants et les familles.",
      },
      {
        title: 'Assemblage de paniers',
        desc: "Emballez soigneusement la nourriture, les cadeaux et les essentiels dans des paniers des fêtes prêts à être livrés.",
      },
      {
        title: 'Courses et commissions',
        desc: "Aidez avec diverses courses et livraisons de fournitures pour maintenir la brigade en mouvement.",
      },
      {
        title: 'Livraison de paniers',
        desc: "Aidez à distribuer les paniers complétés directement aux familles de la région de Montréal.",
      },
    ],
  },

  team: {
    pageTitle: "Notre équipe",
    metaDesc:
      "Rencontrez les leaders dévoués qui rendent les Anges de Rosetta possibles — et découvrez ce que disent les bénévoles.",
    heroEyebrow: 'Notre équipe',
    heroHeading: { before: 'Les mains derrière les ', accent: 'paniers', after: '.' },
    heroLede:
      "Rencontrez les personnes dévouées qui dirigent les Anges de Rosetta avec passion et engagement — et les bénévoles qui donnent vie à chaque décembre.",
    leadersHeading: 'Direction',
    testimonialsEyebrow: 'Voix de la brigade',
    testimonialsHeading: {
      before: 'Entendez les bénévoles qui rendent notre mission ',
      accent: 'possible',
      after: '.',
    },
    ctaHeading: 'Rejoignez notre équipe',
    ctaCopy: 'Aidez-nous à faire une différence dans notre communauté.',
    ctaVolunteer: 'Bénévolat',
    ctaContact: 'Nous contacter',
    leaders: [
      {
        name: 'Grace',
        role: 'Logistique et planification',
        bio: "Grace s\u2019occupe du rationnement, de la planification, des demandes et de l\u2019organisation — transformant une année d\u2019intentions en un décembre de paniers livrés.",
      },
      {
        name: 'Tony',
        role: 'Opérations et rayonnement',
        bio: "Tony collecte les dons, fait la publicité, effectue les recherches et gère la logistique — le moteur qui maintient la brigade en mouvement.",
      },
      {
        name: 'Yan',
        role: 'Coordinateur des bénévoles',
        bio: "Yan ne cesse jamais d\u2019aider — emballer, trier, conduire — et son travail acharné ne passe jamais inaperçu.",
      },
    ],
    testimonialRole: 'Bénévole',
    testimonials: [
      {
        name: 'Angelo',
        quote:
          "C\u2019est le sourire qu\u2019on voit sur le visage de ces gens. Ce moment, c\u2019est ce qui rend tout ça si spécial — pour moi et pour eux.",
      },
      {
        name: 'Jinny',
        quote:
          "Il y a des familles où les enfants dorment par terre. Leur apporter un panier et voir leurs visages… on le porte en soi pendant des semaines.",
      },
      {
        name: 'Kim',
        quote:
          "Je suis émue par leur gratitude. Chaque porte, chaque merci — ça me rappelle pourquoi on revient chaque décembre.",
      },
      {
        name: 'Anna Maria',
        quote:
          "C\u2019est ça, Noël. Pas des cadeaux sous un sapin — des cadeaux à la porte de quelqu\u2019un d\u2019autre. Rosetta le savait mieux que quiconque.",
      },
    ],
    carouselLabels: {
      region: 'Témoignages de bénévoles',
      prev: 'Témoignage précédent',
      next: 'Témoignage suivant',
      choose: 'Choisir un témoignage',
    },
  },

  gallery: {
    pageTitle: 'Galerie',
    metaDesc:
      "Parcourez les photos et vidéos de seize années d\u2019événements de paniers des fêtes des Anges de Rosetta à Montréal.",
    eyebrow: 'Galerie',
    heading: { before: 'Seize ans de ', accent: 'sourires', after: '.' },
    lede: "Derrière chaque panier se cache un moment. Parcourez les photos et vidéos qui capturent nos bénévoles, nos familles et la communauté montréalaise dans toute sa générosité.",
    openPhoto: 'Ouvrir la photo\u00a0: ',
    openVideo: 'Ouvrir la vidéo\u00a0: ',
  },

  notFound: {
    pageTitle: '404 Introuvable',
    metaDesc: "La page que vous recherchez n\u2019existe pas.",
    heading: { before: 'Page non ', accent: 'trouvée', after: '.' },
    lede: "Désolé, la page que vous recherchez n\u2019existe pas. Elle a peut-être été déplacée ou le lien a été mal saisi.",
    home: "Retour à l\u2019accueil",
    donate: 'Faire un don',
  },

  forms: {
    contact: {
      labelName: 'Nom',
      labelEmail: 'Courriel',
      labelPhone: 'Téléphone',
      labelSubject: 'Sujet',
      labelMessage: 'Message',
      optional: '(optionnel)',
      required: 'obligatoire',
      sending: 'Envoi en cours\u2026',
      sendButton: 'Envoyer le message',
      legal:
        "Protégé par reCAPTCHA. En envoyant, vous acceptez que vos coordonnées soient utilisées pour vous répondre.",
      successMsg: 'Message envoyé avec succès\u00a0! Nous vous répondrons bientôt.',
      errorRateLimit: "Veuillez attendre {s}s avant d\u2019envoyer un autre message.",
      errorFail: "Échec de l\u2019envoi. Veuillez réessayer plus tard. ({msg})",
      dismiss: 'Fermer',
      vNameRequired: 'Le nom est obligatoire',
      vNameTooLong: 'Le nom doit contenir moins de 50 caractères',
      vEmailRequired: 'Le courriel est obligatoire',
      vEmailInvalid: 'Veuillez entrer un courriel valide',
      vPhoneInvalid: 'Veuillez entrer un numéro de téléphone valide',
      vSubjectRequired: 'Le sujet est obligatoire',
      vMessageRequired: 'Le message est obligatoire',
    },
    volunteer: {
      labelName: 'Nom',
      labelEmail: 'Courriel',
      labelPhone: 'Téléphone',
      required: 'obligatoire',
      optional: '(optionnel)',
      phoneHint:
        "Votre numéro de téléphone sera utilisé uniquement pour la coordination le jour de l\u2019événement.",
      labelAdditional: 'Noms des bénévoles supplémentaires',
      additionalHint:
        "Si vous faites du bénévolat avec d\u2019autres personnes, demandez-leur de remplir le formulaire ou inscrivez leurs noms ici.",
      labelDelivery: 'Souhaitez-vous effectuer des livraisons\u00a0?',
      deliveryHint:
        "La livraison est notre tâche la plus populaire. Si vous choisissez de livrer, vous serez informé de notre protocole environ une heure avant l\u2019événement.",
      deliveryPlaceholder: 'Sélectionnez une réponse',
      deliveryYes: 'Oui, avec plaisir\u00a0!',
      deliveryNo: "Non, je ne pourrai pas.",
      deliveryMaybe: "Peut-être, je vous le ferai savoir.",
      labelComments: 'Commentaires',
      commentsHint:
        "N\u2019hésitez pas à partager des informations supplémentaires ou des questions.",
      submitting: 'Envoi en cours\u2026',
      submitButton: 'Soumettre la candidature',
      legal: 'Protégé par reCAPTCHA. Des questions\u00a0?',
      successMsg: 'Candidature soumise avec succès\u00a0! Nous vous contacterons bientôt.',
      errorFail: "Échec de la soumission. Veuillez réessayer plus tard. ({msg})",
      dismiss: 'Fermer',
      vNameRequired: 'Le nom est obligatoire',
      vEmailRequired: 'Le courriel est obligatoire',
      vEmailInvalid: 'Veuillez entrer un courriel valide',
      vPhoneRequired: 'Le téléphone est obligatoire',
      vPhoneInvalid: 'Veuillez entrer un numéro de téléphone valide',
      vDeliveryRequired: 'Veuillez sélectionner une réponse',
    },
    mobile: {
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      siteNav: 'Navigation du site',
      mobilePrimary: 'Navigation mobile principale',
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const dict: Record<Lang, Translations> = { en, fr };

export function useTranslations(lang: Lang): Translations {
  return dict[lang];
}

/** Fill a template string — replaces {key} with values. */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));
}
