import { Quote, Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules'
import { motion } from 'framer-motion'
import { fallbackContent } from '../data/fallbackContent'

import 'swiper/css'
import 'swiper/css/pagination'

function TestimonialSlider({ testimonials }) {
  const displayTestimonials = testimonials && testimonials.length > 0
    ? testimonials
    : fallbackContent.testimonials

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full relative px-4 sm:px-10"
    >
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2 },
          1280: { slidesPerView: 2.5 },
        }}
        loop={true}
        speed={600}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 80,
          modifier: 1.5,
          slideShadows: false,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className="pb-20 pt-10"
      >
        {displayTestimonials.map((item) => (
          <SwiperSlide key={item.id} className="!flex justify-center">
            <article
              className="relative w-[300px] sm:w-[340px] h-[360px] rounded-[32px] p-8 flex flex-col glass-panel-dark border-white/5 shadow-2xl [&.swiper-slide-active]:ring-1 [&.swiper-slide-active]:ring-gold/20"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[32px] pointer-events-none z-0"></div>
              <div className="absolute top-6 right-6 text-gold/20 z-10">
                <Quote size={40} fill="currentColor" />
              </div>
              <div className="flex gap-1.5 text-gold mb-6 z-10 relative mt-2">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[15px] leading-loose text-support-200 flex-grow font-light z-10 relative italic">
                "{item.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-white/5 z-10 relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width="48"
                    height="48"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center font-display font-medium text-gold ring-1 ring-gold/20">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-display font-medium text-[16px] text-white">
                    {item.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-gold mt-1">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}

export default TestimonialSlider