import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Briefcase,
  Users,
  Building,
  Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">JobPortal</span>
            </Link>
            <p className="text-gray-400">
              Connecting institutes with talented professionals. 
              Find your dream job or the perfect candidate.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/jobs" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link 
                  href="/institutes" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Building className="h-4 w-4 mr-2" />
                  For Institutes
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/jobs/teaching" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Teaching Jobs
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs/administration" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Administration
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs/counseling" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Counseling
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs/internship" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Internships
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs/remote" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Remote Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Education Street, Knowledge City, 
                  <br />New Delhi, India - 110001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href="tel:+911234567890" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a 
                  href="mailto:support@jobportal.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  support@jobportal.com
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} JobPortal. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/cookies" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </Link>
            <div className="flex items-center text-gray-400 text-sm">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in India
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M20.52 3.449C18.24 1.245 15.24 0 12 0 5.373 0 0 5.373 0 12c0 2.126.56 4.14 1.547 5.88L0 24l6.335-1.652C8.02 23.44 9.984 24 12 24c6.627 0 12-5.373 12-12 0-3.24-1.245-6.24-3.48-8.551zM12 22c-1.736 0-3.43-.46-4.934-1.33l-.354-.212-3.746.975 1.005-3.645-.236-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>
    </footer>
  );
};

export default Footer;