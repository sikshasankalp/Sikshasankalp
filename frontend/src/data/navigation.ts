export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Programs', href: '/programs' },
  { label: 'Impact', href: '/impact' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Media', href: '/media' },
  { label: 'Team', href: '/team' },
  { label: 'Get Involved', href: '/get-involved' },
];

export const moreNavigation: NavItem[] = [
  { label: 'Digital Library', href: '/digital-library' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Partner With Us', href: '/partner-with-us' },
  { label: 'Contact', href: '/contact' },
];

export const footerNavigation = {
  foundation: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Our Programs', href: '/programs' },
  ],
  getInvolved: [
    { label: 'Volunteer', href: '/get-involved#volunteer' },
    { label: 'Partner With Us', href: '/partner-with-us' },
    { label: 'Donate', href: '/donate' },
  ],
  explore: [
    { label: 'Impact', href: '/impact' },
    { label: 'Digital Library', href: '/digital-library' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Media Coverage', href: '/media' },
    { label: 'Transparency', href: '/transparency' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]
};
