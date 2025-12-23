import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { AuthProvider } from '@/src/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import PWAInstallPrompt from '@/src/components/PWAInstallPrompt';

const inter = Inter({ subsets: ['latin'] });

// 👇 Base URL define करें
const BASE_URL = 'https://www.classdoor.in';

export const metadata: Metadata = {
  title: 'ClassDoor - India\'s No. 1 Job Portal with Company Reviews & Salaries',
  description: 'ClassDoor - Search 50,000+ jobs in India. Read company reviews, compare salaries, find career opportunities in Bengaluru, Mumbai, Delhi, Hyderabad, Pune. Get interview tips and career advice.',
  keywords: 'jobs in India, company reviews, salary, Bengaluru jobs, Mumbai jobs, Delhi jobs, job portal, career, employment, interview questions, job search, IT jobs, government jobs, fresher jobs',
  
  // Open Graph for social media
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'ClassDoor - India\'s No. 1 Job Portal with Company Reviews & Salaries',
    description: 'Search 50,000+ jobs, read company reviews, compare salaries. Find your dream job in India.',
    siteName: 'ClassDoor',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ClassDoor - India\'s Leading Job Portal',
      },
    ],
    locale: 'en_IN',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ClassDoor - India\'s No. 1 Job Portal',
    description: 'Search jobs, company reviews, salary information for Indian companies',
    images: [`${BASE_URL}/twitter-image.jpg`],
    creator: '@classdoor_in',
    site: '@classdoor_in',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional meta
  authors: [{ name: 'ClassDoor Team' }],
  creator: 'ClassDoor',
  publisher: 'ClassDoor Pvt Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  
  // For Google verification
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  },

  // Alternates for language/region
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-IN': BASE_URL,
      'hi-IN': `${BASE_URL}/hi`,
    },
  },

  // Category for job portal
  category: 'jobs, career, employment',
};

// 👇 Viewport settings
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 👇 JSON-LD Structured Data for Website
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ClassDoor - India Job Portal',
    url: BASE_URL,
    description: 'Find jobs in India with company reviews and salary information',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  };

  // 👇 Organization Schema
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ClassDoor',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'India\'s leading job portal with company reviews and salary insights',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi',
      postalCode: '110001',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9334461083',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://twitter.com/classdoor_in',
      'https://www.linkedin.com/company/classdoor',
      'https://www.facebook.com/classdoor.in',
      'https://www.instagram.com/classdoor.in',
    ],
  };

  // 👇 Job Portal Specific Schema
  const jobPortalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Job Search Portal',
    description: 'Search for jobs across India',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'ClassDoor',
      sameAs: BASE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'IN',
    },
  };

  // 👇 Web App Manifest Schema
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ClassDoor',
    url: BASE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'Job search and company review application',
    featureList: [
      'Job Search',
      'Company Reviews',
      'Salary Insights',
      'Career Advice',
    ],
  };

  return (
    <html lang="en-IN" prefix="og: https://ogp.me/ns#">
      <head>
        {/* 👇 Structured Data Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          key="website-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          key="organization-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPortalJsonLd) }}
          key="jobportal-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
          key="webapp-schema"
        />
        
        {/* 👇 PWA Meta Tags */}
        <meta name="application-name" content="ClassDoor" />
        <meta name="apple-mobile-web-app-title" content="ClassDoor" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* 👇 Geo meta tags for India */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        
        {/* 👇 Indian languages support */}
        <meta httpEquiv="content-language" content="en-IN, hi-IN" />
        <meta name="language" content="English, Hindi" />
        
        {/* 👇 PWA Manifest and Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* 👇 Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        
        {/* 👇 Windows Tiles */}
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* 👇 Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 👇 Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ClassDoor SW registered: ', registration.scope);
                    },
                    function(err) {
                      console.log('ClassDoor SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            
            {/* 👇 PWA Install Prompt Component */}
            <PWAInstallPrompt />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}