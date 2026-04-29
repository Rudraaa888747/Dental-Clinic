import { Quote, Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules'
import { motion } from 'framer-motion'
import { fallbackContent } from '../data/fallbackContent'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

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
          1024: { slidesPerView: 2.2 },
          1280: { slidesPerView: 2.8 },
        }}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 250,
          modifier: 2,
          slideShadows: false,
        }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className="pb-14 pt-6"
      >
        {displayTestimonials.map((item) => (
          <SwiperSlide key={item.id} className="!flex justify-center">

            {({ isActive }) => (
              <motion.article
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{
                  scale: isActive ? 1.05 : 0.9,
                  opacity: isActive ? 1 : 0.5,
                  y: isActive ? -10 : 0,
                }}
                transition={{ duration: 0.4 }}
                className={`
                  relative w-[260px] sm:w-[300px] h-[330px]
                  rounded-[26px] p-6 flex flex-col
                  backdrop-blur-xl bg-white/90
                  border border-skybrand-100
                  shadow-xl transition-all
                `}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-skybrand-100">
                  <Quote size={34} fill="currentColor" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-[14px] leading-relaxed text-slate-600 flex-grow font-medium">
                  “{item.quote}”
                </p>

                {/* User */}
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-skybrand-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-skybrand-100 flex items-center justify-center font-bold text-skybrand-700">
                      {item.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-[15px] text-ink">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-skybrand-600">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}

export default TestimonialSlider