import type { PreviewLocale } from './previewLocale';

export interface TrustCenterCopy {
  sticky: {
    allProducts: string;
    searchPlaceholder: string;
    subscribe: string;
    askAiAgent: string;
  };
  identity: {
    taglineLight: string;
    /** Shown in profile headline and sticky nav (Trust Center display name). */
    trustCenterDisplayName: string;
    body: string;
    tagDocuments: string;
    tagFaqs: string;
    tagCerts: string;
    tagActive: string;
    quickLinksTitle: string;
    quickLinkHome: string;
    quickLinkPrivacy: string;
    quickLinkStatus: string;
    quickLinkVuln: string;
    quickLinkHomeUrl: string;
    quickLinkPrivacyUrl: string;
    quickLinkStatusUrl: string;
    quickLinkVulnUrl: string;
  };
  certificationsTitle: string;
  documentsFaqsTitle: string;
  reviewingLabel: string;
  documentsCardTitle: string;
  knowledgeFaqsCardTitle: string;
  answersSuffix: string;
  philosophyTitle: string;
  philosophyBody: string;
  philosophyAuthor: string;
  philosophyAuthorTitle: string;
  comingSoon: string;
  quickSummaryTitle: string;
  subprocessorsTitle: string;
  spColName: string;
  spColLocation: string;
  spColUsage: string;
  spShowAll: string;
  spShowLess: string;
  spLastUpdated: string;
  spSubscribeUpdates: string;
  spViewAs: string;
  trustedByTitle: string;
  featuredTitle: string;
  featuredViewBy: string;
  featuredViewAll: string;
  announcementsTitle: string;
  announcementsAddCard: string;
  whatWeOfferTitle: string;
  typicalData: string;
  certificationsInline: string;
  videoTitle: string;
  footerPowered: string;
  footerLearnMore: string;
}

const en: TrustCenterCopy = {
  sticky: {
    allProducts: 'All Products',
    searchPlaceholder: 'Search the trust center...',
    subscribe: 'Subscribe',
    askAiAgent: 'Ask AI Agent',
  },
  identity: {
    taglineLight: 'Digital media experts',
    trustCenterDisplayName: 'Mediacore',
    body: "Everything you need to complete your security review is here. Browse documents, certifications, and compliance details with confidence. Our Trust Center is regularly updated to reflect the latest audit results, and subprocessor disclosures. Reach out at trust@mediacore.com.",
    tagDocuments: '28 Documents',
    tagFaqs: '57 FAQs',
    tagCerts: '6 Certifications',
    tagActive: 'Active: 8 minutes ago',
    quickLinksTitle: 'Quick links',
    quickLinkHome: 'Mediacore Homepage',
    quickLinkPrivacy: 'Privacy Policy',
    quickLinkStatus: 'Status Page',
    quickLinkVuln: 'Report a vulnerability',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: 'Certifications',
  documentsFaqsTitle: 'Documents & Knowledge Base FAQs',
  reviewingLabel: "I'm reviewing:",
  documentsCardTitle: 'Documents',
  knowledgeFaqsCardTitle: 'Knowledge Base FAQs',
  answersSuffix: 'answers',
  philosophyTitle: 'Our Philosophy',
  philosophyBody:
    "Here's where their philosophy would go. I need this to be a long paragraph so I can see how the text looks. I don't really know what to put in here though. Datadog is pretty legit and has a lot of people thinking about security, I would trust them.",
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Chief Information Security Officer, Datadog',
  comingSoon: 'Coming Soon',
  quickSummaryTitle: 'Quick Summary',
  subprocessorsTitle: 'Subprocessors',
  spColName: 'Subprocessor',
  spColLocation: 'Location of Processing',
  spColUsage: 'Usage Details',
  spShowAll: 'Show All',
  spShowLess: 'Show Less',
  spLastUpdated: 'Last updated April 8, 2026.',
  spSubscribeUpdates: 'Subscribe to get notification updates.',
  spViewAs: 'View as:',
  trustedByTitle: 'Trusted By',
  featuredTitle: 'Featured Documents',
  featuredViewBy: 'View by product:',
  featuredViewAll: 'View all documents',
  announcementsTitle: 'Announcements',
  announcementsAddCard: 'Add an Announcement',
  whatWeOfferTitle: 'What we offer',
  typicalData: 'Typical data access:',
  certificationsInline: 'Certifications:',
  videoTitle: 'Video Resources',
  footerPowered: 'Powered by Conveyor, the first end-to-end customer trust platform.',
  footerLearnMore: 'Learn more',
};

const fr: TrustCenterCopy = {
  ...en,
  sticky: {
    allProducts: 'Tous les produits',
    searchPlaceholder: 'Rechercher dans le centre de confiance...',
    subscribe: "S'abonner",
    askAiAgent: "Demander à l'IA",
  },
  identity: {
    taglineLight: 'Experts des médias numériques',
    trustCenterDisplayName: 'Mediacore',
    body: "Tout ce dont vous avez besoin pour finaliser votre revue de sécurité est ici. Parcourez documents, certifications et détails de conformité en toute confiance. Notre centre de confiance est mis à jour régulièrement avec les derniers audits et les sous-traitants. Écrivez-nous à trust@mediacore.com.",
    tagDocuments: '28 documents',
    tagFaqs: '57 FAQ',
    tagCerts: '6 certifications',
    tagActive: 'Actif : il y a 8 minutes',
    quickLinksTitle: 'Liens rapides',
    quickLinkHome: 'Site Mediacore',
    quickLinkPrivacy: 'Politique de confidentialité',
    quickLinkStatus: 'Page de statut',
    quickLinkVuln: 'Signaler une vulnérabilité',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: 'Certifications',
  documentsFaqsTitle: 'Documents et FAQ de la base de connaissances',
  reviewingLabel: 'Je examine :',
  documentsCardTitle: 'Documents',
  knowledgeFaqsCardTitle: 'FAQ base de connaissances',
  answersSuffix: 'réponses',
  philosophyTitle: 'Notre philosophie',
  philosophyBody:
    "Voici où irait leur philosophie. Il me faut un long paragraphe pour voir le rendu du texte. Datadog est sérieux sur la sécurité ; je leur ferais confiance.",
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Directeur de la sécurité de l’information, Datadog',
  comingSoon: 'Bientôt disponible',
  quickSummaryTitle: 'Résumé rapide',
  subprocessorsTitle: 'Sous-traitants',
  spColName: 'Sous-traitant',
  spColLocation: 'Lieu de traitement',
  spColUsage: "Détails d'utilisation",
  spShowAll: 'Tout afficher',
  spShowLess: 'Afficher moins',
  spLastUpdated: 'Dernière mise à jour le 5 octobre 2022.',
  spSubscribeUpdates: 'Abonnez-vous pour recevoir des notifications.',
  spViewAs: 'Affichage :',
  trustedByTitle: 'Ils nous font confiance',
  featuredTitle: 'Documents à la une',
  featuredViewBy: 'Filtrer par produit :',
  featuredViewAll: 'Voir tous les documents',
  announcementsTitle: 'Annonces',
  announcementsAddCard: 'Ajouter une annonce',
  whatWeOfferTitle: 'Ce que nous proposons',
  typicalData: 'Accès aux données typique :',
  certificationsInline: 'Certifications :',
  videoTitle: 'Vidéos',
  footerPowered: 'Propulsé par Conveyor, la première plateforme de confiance client de bout en bout.',
  footerLearnMore: 'En savoir plus',
};

const de: TrustCenterCopy = {
  ...en,
  sticky: {
    allProducts: 'Alle Produkte',
    searchPlaceholder: 'Trust Center durchsuchen...',
    subscribe: 'Abonnieren',
    askAiAgent: 'KI fragen',
  },
  identity: {
    taglineLight: 'Experten für digitale Medien',
    trustCenterDisplayName: 'Mediacore',
    body: 'Alles, was Sie für Ihre Security-Prüfung brauchen, finden Sie hier. Dokumente, Zertifizierungen und Compliance-Details. Unser Trust Center wird regelmäßig aktualisiert. Kontakt: trust@mediacore.com.',
    tagDocuments: '28 Dokumente',
    tagFaqs: '57 FAQs',
    tagCerts: '6 Zertifizierungen',
    tagActive: 'Aktiv: vor 8 Minuten',
    quickLinksTitle: 'Schnellzugriff',
    quickLinkHome: 'Mediacore-Startseite',
    quickLinkPrivacy: 'Datenschutz',
    quickLinkStatus: 'Statusseite',
    quickLinkVuln: 'Schwachstelle melden',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: 'Zertifizierungen',
  documentsFaqsTitle: 'Dokumente & Wissensdatenbank-FAQs',
  reviewingLabel: 'Ich prüfe:',
  documentsCardTitle: 'Dokumente',
  knowledgeFaqsCardTitle: 'Wissensdatenbank-FAQs',
  answersSuffix: 'Antworten',
  philosophyTitle: 'Unsere Philosophie',
  philosophyBody:
    'Hier würde die Philosophie stehen. Ein längerer Absatz zeigt den Textfluss. Datadog legt großen Wert auf Security — vertrauenswürdig.',
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Chief Information Security Officer, Datadog',
  comingSoon: 'Demnächst',
  quickSummaryTitle: 'Kurzüberblick',
  subprocessorsTitle: 'Subprozessoren',
  spColName: 'Subprozessor',
  spColLocation: 'Verarbeitungsort',
  spColUsage: 'Nutzungsdetails',
  spShowAll: 'Alle anzeigen',
  spShowLess: 'Weniger anzeigen',
  spLastUpdated: 'Zuletzt aktualisiert am 5. Oktober 2022.',
  spSubscribeUpdates: 'Abonnieren Sie Benachrichtigungen.',
  spViewAs: 'Ansicht:',
  trustedByTitle: 'Vertrauen uns',
  featuredTitle: 'Ausgewählte Dokumente',
  featuredViewBy: 'Nach Produkt:',
  featuredViewAll: 'Alle Dokumente anzeigen',
  announcementsTitle: 'Ankündigungen',
  announcementsAddCard: 'Ankündigung hinzufügen',
  whatWeOfferTitle: 'Was wir anbieten',
  typicalData: 'Typischer Datenzugriff:',
  certificationsInline: 'Zertifizierungen:',
  videoTitle: 'Videos',
  footerPowered: 'Betrieben von Conveyor — die erste End-to-End-Trust-Plattform für Kunden.',
  footerLearnMore: 'Mehr erfahren',
};

const ja: TrustCenterCopy = {
  ...en,
  sticky: {
    allProducts: 'すべての製品',
    searchPlaceholder: 'トラストセンターを検索...',
    subscribe: '登録',
    askAiAgent: 'AIに質問',
  },
  identity: {
    taglineLight: 'デジタルメディアの専門家',
    trustCenterDisplayName: 'Mediacore',
    body: 'セキュリティレビューに必要な情報はここにあります。文書、認証、コンプライアンスの詳細をご確認ください。監査結果とサブプロセッサの開示は随時更新されます。ご連絡は trust@mediacore.com まで。',
    tagDocuments: '28 件の文書',
    tagFaqs: '57 件のFAQ',
    tagCerts: '6 件の認証',
    tagActive: 'アクティブ: 8分前',
    quickLinksTitle: 'クイックリンク',
    quickLinkHome: 'Mediacore ホーム',
    quickLinkPrivacy: 'プライバシーポリシー',
    quickLinkStatus: 'ステータスページ',
    quickLinkVuln: '脆弱性を報告',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: '認証',
  documentsFaqsTitle: 'ドキュメントとナレッジベース FAQ',
  reviewingLabel: 'レビュー対象:',
  documentsCardTitle: 'ドキュメント',
  knowledgeFaqsCardTitle: 'ナレッジベース FAQ',
  answersSuffix: '件の回答',
  philosophyTitle: '私たちの考え',
  philosophyBody:
    'ここに理念の本文が入ります。セキュリティへの取り組みが強い企業として、信頼できるパートナーであることを示します。',
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Chief Information Security Officer, Datadog',
  comingSoon: '近日公開',
  quickSummaryTitle: 'クイックサマリー',
  subprocessorsTitle: 'サブプロセッサ',
  spColName: 'サブプロセッサ',
  spColLocation: '処理の場所',
  spColUsage: '利用の詳細',
  spShowAll: 'すべて表示',
  spShowLess: '折りたたむ',
  spLastUpdated: '最終更新: 2022年10月5日',
  spSubscribeUpdates: '通知の更新を受け取るには登録してください。',
  spViewAs: '表示:',
  trustedByTitle: '導入企業',
  featuredTitle: '注目のドキュメント',
  featuredViewBy: '製品で絞り込み:',
  featuredViewAll: 'すべてのドキュメントを見る',
  announcementsTitle: 'お知らせ',
  announcementsAddCard: 'お知らせを追加',
  whatWeOfferTitle: '提供内容',
  typicalData: '典型的なデータアクセス:',
  certificationsInline: '認証:',
  videoTitle: '動画',
  footerPowered: 'Conveyor によって提供 — エンドツーエンドの顧客信頼プラットフォーム。',
  footerLearnMore: '詳しく見る',
};

const pt: TrustCenterCopy = {
  ...en,
  sticky: {
    allProducts: 'Todos os produtos',
    searchPlaceholder: 'Pesquisar no trust center...',
    subscribe: 'Assinar',
    askAiAgent: 'Perguntar à IA',
  },
  identity: {
    taglineLight: 'Especialistas em mídia digital',
    trustCenterDisplayName: 'Mediacore',
    body: 'Tudo o que você precisa para sua revisão de segurança está aqui. Documentos, certificações e conformidade. Nosso Trust Center é atualizado com auditorias e subprocessadores. Contato: trust@mediacore.com.',
    tagDocuments: '28 documentos',
    tagFaqs: '57 FAQs',
    tagCerts: '6 certificações',
    tagActive: 'Ativo: há 8 minutos',
    quickLinksTitle: 'Links rápidos',
    quickLinkHome: 'Site da Mediacore',
    quickLinkPrivacy: 'Política de privacidade',
    quickLinkStatus: 'Página de status',
    quickLinkVuln: 'Reportar vulnerabilidade',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: 'Certificações',
  documentsFaqsTitle: 'Documentos e FAQs da base de conhecimento',
  reviewingLabel: 'Estou revisando:',
  documentsCardTitle: 'Documentos',
  knowledgeFaqsCardTitle: 'FAQs da base de conhecimento',
  answersSuffix: 'respostas',
  philosophyTitle: 'Nossa filosofia',
  philosophyBody:
    'Aqui entraria a filosofia da empresa. Um parágrafo longo ajuda a visualizar o layout. A Datadog leva segurança a sério — confiável.',
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Chief Information Security Officer, Datadog',
  comingSoon: 'Em breve',
  quickSummaryTitle: 'Resumo rápido',
  subprocessorsTitle: 'Subprocessadores',
  spColName: 'Subprocessador',
  spColLocation: 'Local do processamento',
  spColUsage: 'Detalhes de uso',
  spShowAll: 'Mostrar tudo',
  spShowLess: 'Mostrar menos',
  spLastUpdated: 'Última atualização em 5 de outubro de 2022.',
  spSubscribeUpdates: 'Assine para receber notificações.',
  spViewAs: 'Ver como:',
  trustedByTitle: 'Confiam em nós',
  featuredTitle: 'Documentos em destaque',
  featuredViewBy: 'Ver por produto:',
  featuredViewAll: 'Ver todos os documentos',
  announcementsTitle: 'Anúncios',
  announcementsAddCard: 'Adicionar um anúncio',
  whatWeOfferTitle: 'O que oferecemos',
  typicalData: 'Acesso típico a dados:',
  certificationsInline: 'Certificações:',
  videoTitle: 'Vídeos',
  footerPowered: 'Desenvolvido pela Conveyor, a primeira plataforma de confiança do cliente ponta a ponta.',
  footerLearnMore: 'Saiba mais',
};

const es: TrustCenterCopy = {
  ...en,
  sticky: {
    allProducts: 'Todos los productos',
    searchPlaceholder: 'Buscar en el centro de confianza...',
    subscribe: 'Suscribirse',
    askAiAgent: 'Preguntar a la IA',
  },
  identity: {
    taglineLight: 'Expertos en medios digitales',
    trustCenterDisplayName: 'Mediacore',
    body: 'Todo lo que necesita para su revisión de seguridad está aquí. Explore documentos, certificaciones y cumplimiento. Actualizamos el centro con auditorías y subprocesadores. Escríbanos a trust@mediacore.com.',
    tagDocuments: '28 documentos',
    tagFaqs: '57 preguntas frecuentes',
    tagCerts: '6 certificaciones',
    tagActive: 'Activo: hace 8 minutos',
    quickLinksTitle: 'Enlaces rápidos',
    quickLinkHome: 'Inicio de Mediacore',
    quickLinkPrivacy: 'Política de privacidad',
    quickLinkStatus: 'Página de estado',
    quickLinkVuln: 'Informar una vulnerabilidad',
    quickLinkHomeUrl: 'https://www.trust.mediacore.com',
    quickLinkPrivacyUrl: 'https://www.privacy.mediacore.com',
    quickLinkStatusUrl: 'https://www.status.mediacore.com',
    quickLinkVulnUrl: 'https://www.bugbash.mediacore.com',
  },
  certificationsTitle: 'Certificaciones',
  documentsFaqsTitle: 'Documentos y FAQs de la base de conocimiento',
  reviewingLabel: 'Estoy revisando:',
  documentsCardTitle: 'Documentos',
  knowledgeFaqsCardTitle: 'FAQs de la base de conocimiento',
  answersSuffix: 'respuestas',
  philosophyTitle: 'Nuestra filosofía',
  philosophyBody:
    'Aquí iría la filosofía de la empresa. Un párrafo largo ayuda a ver el diseño. Datadog se toma la seguridad en serio; merece confianza.',
  philosophyAuthor: 'Emilio Escobar',
  philosophyAuthorTitle: 'Director de seguridad de la información, Datadog',
  comingSoon: 'Próximamente',
  quickSummaryTitle: 'Resumen rápido',
  subprocessorsTitle: 'Subprocesadores',
  spColName: 'Subprocesador',
  spColLocation: 'Ubicación del procesamiento',
  spColUsage: 'Detalles de uso',
  spShowAll: 'Mostrar todo',
  spShowLess: 'Mostrar menos',
  spLastUpdated: 'Última actualización: 5 de octubre de 2022.',
  spSubscribeUpdates: 'Suscríbase para recibir notificaciones.',
  spViewAs: 'Ver como:',
  trustedByTitle: 'Confían en nosotros',
  featuredTitle: 'Documentos destacados',
  featuredViewBy: 'Ver por producto:',
  featuredViewAll: 'Ver todos los documentos',
  announcementsTitle: 'Anuncios',
  announcementsAddCard: 'Añadir un anuncio',
  whatWeOfferTitle: 'Lo que ofrecemos',
  typicalData: 'Acceso típico a datos:',
  certificationsInline: 'Certificaciones:',
  videoTitle: 'Recursos en vídeo',
  footerPowered: 'Impulsado por Conveyor, la primera plataforma de confianza del cliente de extremo a extremo.',
  footerLearnMore: 'Más información',
};

const copies: Record<PreviewLocale, TrustCenterCopy> = {
  en,
  fr,
  de,
  ja,
  pt,
  es,
};

export function getTrustCenterCopy(locale: PreviewLocale): TrustCenterCopy {
  return copies[locale] ?? en;
}
