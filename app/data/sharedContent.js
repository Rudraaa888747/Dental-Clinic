export const defaultContent = {
  clinic: {
    name: 'Azure Smiles Dental Clinic',
    tagline: 'Luxury dental care with a gentle human touch.',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    email: 'care@azuresmilesclinic.com',
    address: '12 Lakeview Avenue, Indiranagar, Bengaluru 560038',
    hours: [
      'Mon - Sat: 9:00 AM - 8:00 PM',
      'Sunday: 10:00 AM - 2:00 PM',
    ],
    yearsExperience: 14,
    happyPatients: '12,500+',
    googleMapsEmbed:
      'https://www.google.com/maps?q=Indiranagar%20Bengaluru&output=embed',
  },
  doctor: {
    name: 'Dr. Aanya Mehta',
    title: 'Lead Cosmetic Dentist & Implant Specialist',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    qualifications: [
      'BDS, MDS Prosthodontics',
      'Certified Invisalign Provider',
      '14+ years in aesthetic smile design',
    ],
    bio: 'Dr. Aanya leads every treatment plan with precision, empathy, and a luxury hospitality mindset so each visit feels reassuring from consultation to final smile reveal.',
    story:
      'Azure Smiles was created to bring world-class dentistry and boutique hospitality together. We pair advanced diagnostics, minimally invasive techniques, and calm interiors so families and professionals feel fully cared for.',
  },
  services: [
    {
      id: 'cleaning',
      category: 'General Dentistry',
      name: 'Teeth Cleaning',
      description: 'Advanced ultrasonic scaling and precision polishing for optimal gum health and a radiant, stain-free smile.',
      price: '₹1,500 – ₹4,000',
      duration: '45 mins',
      painLevel: 'None',
      recovery: 'Immediate',
      technology: 'Airflow EMS System',
      icon: 'Sparkles',
    },
    {
      id: 'filling',
      category: 'General Dentistry',
      name: 'Dental Filling',
      description: 'Invisible composite resin restorations that seamlessly blend with your natural tooth color while restoring strength.',
      price: '₹2,000 – ₹6,000',
      duration: '30-45 mins',
      painLevel: 'Minimal',
      recovery: 'Immediate',
      technology: 'Nano-Hybrid Composites',
      icon: 'Stethoscope',
    },
    {
      id: 'root-canal',
      category: 'General Dentistry',
      name: 'Root Canal Treatment',
      description: 'Painless, microscope-assisted endodontic therapy designed to save and preserve your natural tooth structure.',
      price: '₹4,500 – ₹15,000',
      duration: '60-90 mins',
      painLevel: 'Minimal (Under LA)',
      recovery: '24 Hours',
      technology: 'Endodontic Microscope & 3D Imaging',
      icon: 'ShieldPlus',
    },
    {
      id: 'wisdom-tooth',
      category: 'General Dentistry',
      name: 'Wisdom Tooth Removal',
      description: 'Safe, surgical extraction of impacted wisdom teeth using minimally invasive techniques for faster healing.',
      price: '₹5,000 – ₹18,000',
      duration: '45-60 mins',
      painLevel: 'Mild (Post-Op)',
      recovery: '3-5 Days',
      technology: 'Piezoelectric Surgery',
      icon: 'Activity',
    },
    {
      id: 'whitening',
      category: 'Cosmetic Dentistry',
      name: 'Teeth Whitening',
      description: 'Professional in-clinic laser whitening sessions for visibly brighter teeth with zero enamel damage.',
      price: '₹7,500 – ₹25,000',
      duration: '60 mins',
      painLevel: 'None',
      recovery: 'Immediate',
      technology: 'Zoom! Laser System',
      icon: 'SunMedium',
    },
    {
      id: 'veneers',
      category: 'Cosmetic Dentistry',
      name: 'Porcelain Veneers',
      description: 'Ultra-thin, custom-crafted ceramic shells designed to perfect the shape, color, and alignment of your teeth.',
      price: '₹8,000 – ₹25,000 per tooth',
      duration: '2-3 Sessions',
      painLevel: 'Minimal',
      recovery: 'Immediate',
      technology: 'CAD/CAM Digital Milling',
      icon: 'Layers',
    },
    {
      id: 'smile-makeover',
      category: 'Cosmetic Dentistry',
      name: 'Smile Makeover',
      description: 'A comprehensive, fully customized transformation utilizing digital smile design to create your perfect, harmonious smile.',
      price: '₹50,000 – ₹5,00,000+',
      duration: 'Variable',
      painLevel: 'Variable',
      recovery: 'Variable',
      technology: 'Digital Smile Design (DSD)',
      icon: 'Camera',
    },
    {
      id: 'ceramic-braces',
      category: 'Orthodontics',
      name: 'Ceramic Braces',
      description: 'Tooth-colored aesthetic brackets that provide effective bite correction without the metallic appearance.',
      price: '₹45,000 – ₹90,000',
      duration: '12-24 Months',
      painLevel: 'Mild (Initial)',
      recovery: 'Ongoing',
      technology: 'Self-Ligating Brackets',
      icon: 'AlignCenterVertical',
    },
    {
      id: 'invisible-aligners',
      category: 'Orthodontics',
      name: 'Invisible Aligners',
      description: 'Clear, removable, and comfortable custom trays that straighten your teeth discreetly and predictably.',
      price: '₹80,000 – ₹3,50,000',
      duration: '6-18 Months',
      painLevel: 'None',
      recovery: 'Immediate',
      technology: 'Invisalign / 3D Scanning',
      icon: 'Smile',
    },
    {
      id: 'implants',
      category: 'Restorative Dentistry',
      name: 'Dental Implants',
      description: 'Permanent, titanium-based replacements for missing teeth that look, feel, and function exactly like natural teeth.',
      price: '₹25,000 – ₹60,000 per implant',
      duration: '2-3 Sessions over 3 months',
      painLevel: 'Mild (Post-Op)',
      recovery: '1 Week',
      technology: 'Guided Implant Surgery (CBCT)',
      icon: 'Anchor',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Ritika Nair',
      role: 'Smile Makeover Patient',
      rating: 5,
      quote:
        'The entire experience felt premium from the reception to the final polish. My whitening and veneer consult were beautifully handled.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 2,
      name: 'Karan Sethi',
      role: 'Root Canal Patient',
      rating: 5,
      quote:
        'I expected pain, but the treatment was calm, modern, and genuinely reassuring. The follow-up care was excellent.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 3,
      name: 'Shreya Rao',
      role: 'Clear Aligner Patient',
      rating: 5,
      quote:
        'The clinic team helped me understand each aligner stage clearly. It felt like concierge healthcare.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 4,
      name: 'Rohan Gupta',
      role: 'Dental Implant Patient',
      rating: 5,
      quote:
        'Losing a tooth was stressful, but the implant process here was seamless. The technology and care they use are truly next-level.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 5,
      name: 'Ananya Sharma',
      role: 'General Dentistry',
      rating: 5,
      quote:
        'From the moment you step in, you realize this isn\'t a regular clinic. The ambiance is calming, and the doctors are incredibly patient.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
  ],
  gallery: [
    {
      id: 1,
      title: 'Smile Brightening',
      before:
        '/before_treatment.webp',
      after:
        '/after_treatment.webp',
      image:
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 2,
      title: 'Orthodontic Care',
      before:
        'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=900&q=80',
      after:
        'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80',
      image:
        '/orthodontic_care.webp',
    },
    {
      id: 3,
      title: 'Family Dentistry',
      before:
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80',
      after:
        'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=900&q=80',
      image:
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80',
    },
  ],
  blogs: [
    {
      slug: 'how-often-should-you-get-teeth-cleaning',
      title: 'How Often Should You Get Teeth Cleaning?',
      excerpt:
        'A practical guide to maintaining gum health, fresh breath, and long-term oral hygiene with professional cleanings.',
      image:
        'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80',
      category: 'Preventive Care',
      content: [
        'Professional cleaning every six months is ideal for most adults, but your dentist may recommend more frequent visits if you have gum sensitivity, braces, or heavy tartar buildup.',
        'In-clinic scaling removes plaque and tartar that brushing and flossing cannot. This helps prevent bleeding gums, persistent bad breath, and early periodontal disease.',
        'Pair regular cleanings with a soft-bristle toothbrush, fluoride toothpaste, and nightly flossing for the best long-term results.',
      ],
    },
    {
      slug: 'the-future-of-digital-dentistry',
      title: 'The Future of Digital Dentistry: What to Expect',
      excerpt:
        'Discover how AI, 3D scanning, and digital smile design are revolutionizing modern dental treatments.',
      image:
        '/blog_digital.webp',
      category: 'Dental Technology',
      content: [
        'Gone are the days of messy dental impressions. Modern digital dentistry utilizes highly accurate 3D intraoral scanners that create a perfect digital replica of your teeth in minutes.',
        'With Digital Smile Design (DSD), we can digitally construct your ideal smile, allowing you to preview the final result before any treatment even begins. This ensures predictable, beautiful outcomes.',
        'Whether it is guided implant surgery or AI-assisted diagnostics, the future of dental care is safer, faster, and infinitely more precise.',
      ],
    },
    {
      slug: 'invisalign-vs-traditional-braces',
      title: 'Invisalign vs. Traditional Braces: Making the Right Choice',
      excerpt:
        'A comprehensive comparison to help you decide which orthodontic treatment best suits your lifestyle and goals.',
      image:
        '/blog_aligners.webp',
      category: 'Orthodontics',
      content: [
        'Choosing between clear aligners and traditional braces depends on several factors, including the complexity of your case, your lifestyle, and your aesthetic preferences.',
        'Clear aligners, such as Invisalign, offer a virtually invisible, removable option that makes brushing and eating significantly easier. They are ideal for mild to moderate misalignments.',
        'Traditional ceramic or metal braces provide constant, controlled force and remain the gold standard for correcting severe bite issues and complex tooth movements. Schedule a consultation to find out which is right for you.',
      ],
    },
  ],
}

export const fallbackAppointments = []
