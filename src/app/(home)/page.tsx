import FaqSection from './components/FAQSection';
import HeroSection from './components/HeroSection';
import { FAQ_ITEMS } from './constants';

export default function Index() {
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Choisur',
    url: 'https://choisur.jp',
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Choisur',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    description:
      'Choisur（チョイスル）は無料のオンライン多数決アプリです。食事会 / 交流会 / 旅行先の決定など、あらゆるシーンでご利用いただけます。',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <HeroSection />

      <div className="relative z-10 bg-[#0f1628]">
        <FaqSection />
      </div>
    </>
  );
}
