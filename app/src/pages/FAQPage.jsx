import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import SectionHeading from '../components/SectionHeading'

const faqs = [
  { category: 'Treatments', q: 'Is root canal treatment painful?', a: 'Modern root canal treatment is virtually painless. We use advanced local anesthesia and gentle techniques — most patients report less discomfort than a routine filling.' },
  { category: 'Treatments', q: 'How long do dental implants last?', a: 'With proper care, dental implants can last a lifetime. The crown portion typically lasts 15-20 years before replacement may be needed.' },
  { category: 'Treatments', q: 'What is the difference between ceramic braces and invisible aligners?', a: 'Ceramic braces are fixed and slightly visible but work for complex cases. Invisible aligners (like Invisalign) are removable, virtually invisible, and ideal for mild to moderate corrections.' },
  { category: 'Pricing', q: 'Do you offer EMI or payment plans?', a: 'Yes, we offer zero-cost EMI starting from ₹999/month through major banks and NBFCs. No credit card required for select plans.' },
  { category: 'Pricing', q: 'Is the first consultation free?', a: 'Yes, your initial consultation with Dr. Aanya Mehra is completely free. This includes a basic oral examination and treatment recommendation.' },
  { category: 'Pricing', q: 'Are the prices shown on the website final?', a: 'The prices shown are indicative ranges. Final treatment cost is determined after a clinical examination as complexity varies per patient.' },
  { category: 'Process', q: 'How do I book an appointment?', a: 'You can book through our website, WhatsApp us directly, or call our clinic. Online bookings are confirmed within 30 minutes during clinic hours.' },
  { category: 'Process', q: 'What should I bring to my first appointment?', a: 'Any previous dental X-rays or records (if available), a valid ID, and your insurance card if applicable. No other preparation needed.' },
  { category: 'Process', q: 'How long does a typical appointment take?', a: 'A routine cleaning takes 45-60 minutes. Complex procedures like implants or braces fitting may take 90-120 minutes. We\'ll inform you in advance.' },
  { category: 'Aftercare', q: 'What should I avoid after teeth whitening?', a: 'Avoid colored foods and beverages (coffee, tea, red wine, curries) for 48 hours post-treatment. Use the sensitivity toothpaste provided.' },
  { category: 'Aftercare', q: 'How do I care for dental implants?', a: 'Treat them like natural teeth — brush twice daily, floss regularly, and attend 6-monthly checkups. Avoid very hard foods in the first 3 months.' },
  { category: 'Aftercare', q: 'When can I eat normally after a root canal?', a: 'Wait until the anesthesia wears off (usually 2-3 hours). Avoid very hard or chewy foods for 2-3 days. Normal eating can resume after the final crown is placed.' },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)
  
  const categories = ['All', 'Treatments', 'Pricing', 'Process', 'Aftercare']
  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(f => f.category === activeCategory)

  return (
    <div className="bg-ivory min-h-screen pt-32 pb-24">
      <AnimatedSection className="page-shell">
        <SectionHeading
          eyebrow="Knowledge Base"
          title="Frequently Asked Questions"
          description="Find answers to common questions about our treatments, pricing, and processes."
          align="center"
        />

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar flex-nowrap pb-2 gap-3 mb-12 px-4 md:px-0">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => { setActiveCategory(c); setOpenIndex(null) }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === c ? 'bg-accent text-white shadow-teal' : 'bg-white text-charcoal-200 border border-border shadow-soft hover:border-accent/30 hover:text-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <div 
                  key={i} 
                  className={`bg-white border border-border rounded-2xl overflow-hidden transition-all duration-300 shadow-soft ${isOpen ? 'bg-surface-2 border-l-[3px] border-l-accent' : 'border-l-[3px] border-l-transparent'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left min-h-[56px]"
                  >
                    <span className={`font-semibold pr-4 text-[0.95rem] md:text-base ${isOpen ? 'text-charcoal' : 'text-charcoal/80'}`}>{faq.q}</span>
                    <Plus size={20} className={`text-accent shrink-0 transition-transform duration-350 ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                  <div 
                    className="overflow-hidden transition-all duration-350 ease-in-out"
                    style={{ maxHeight: isOpen ? '500px' : '0' }}
                  >
                    <p className="px-4 md:px-6 pb-4 md:pb-6 text-charcoal-200 leading-relaxed pt-2 text-[0.875rem] md:text-base">{faq.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
