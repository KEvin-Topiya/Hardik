import React from 'react';
import { motion } from 'framer-motion';
import { Award, PenTool, Hammer, Search, CheckCircle } from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF9]">
      {/* Hero */}
      <section className="relative py-32 bg-[#3D3229] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D3229] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6">

            THE ART OF PRECISION
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="text-xl text-[#C9BDB0] max-w-2xl mx-auto font-light">

            We don't just design jewelry. We engineer it.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#3D3229] mb-6">
              FOUNDED ON GEOMETRY
            </h2>
            <div className="text-[#6B5D50]">
              <p className="mb-4 leading-relaxed">
                Meridian was established with a singular vision: to translate
                the principles of modern architecture into wearable forms. We
                believe that structure is beautiful, and that precision is the
                ultimate luxury.
              </p>
              <p className="leading-relaxed">
                Unlike traditional jewelry houses that focus on ornamentation,
                we focus on form, balance, and material integrity. Every curve
                is calculated, every angle is intentional, and every piece is a
                study in proportion.
              </p>
            </div>
          </div>
          <div className="relative aspect-square bg-[#EDE7E0] p-8">
            <div className="absolute inset-0 border border-[#DDD5CC] m-4" />
            <div className="absolute inset-0 border border-[#DDD5CC] m-8 rotate-3" />
            <div className="w-full h-full bg-[#DDD5CC] flex items-center justify-center">
              <span className="text-[#B8A99A] font-mono text-sm tracking-widest">
                ARCHITECTURAL_FORM_01
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-[#EDE7E0] border-y border-[#DDD5CC]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#3D3229] mb-4">
              OUR PROCESS
            </h2>
            <p className="text-[#8B7D6B]">From blueprint to brilliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
            {
              icon: PenTool,
              title: 'Design',
              desc: 'CAD modeling with micron-level precision.'
            },
            {
              icon: Hammer,
              title: 'Cast',
              desc: 'Lost-wax casting in premium alloys.'
            },
            {
              icon: Search,
              title: 'Inspect',
              desc: 'Rigorous structural integrity testing.'
            },
            {
              icon: CheckCircle,
              title: 'Finish',
              desc: 'Hand-polishing to a mirror finish.'
            }].
            map((step, idx) =>
            <div
              key={step.title}
              className="bg-[#FFFCF9] p-8 border border-[#DDD5CC] text-center group hover:shadow-lg transition-shadow duration-300">

                <div className="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#3D3229] group-hover:text-white transition-colors duration-300">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#3D3229] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#8B7D6B] text-sm">{step.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 max-w-7xl mx-auto border-b border-[#DDD5CC]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          <AnimatedCounter value={47} label="Years of Craft" />
          <AnimatedCounter value={12400} label="Pieces Created" suffix="+" />
          <AnimatedCounter value={23} label="Master Artisans" />
          <AnimatedCounter value={38} label="Countries Served" />
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#3D3229] mb-12">
          CERTIFIED EXCELLENCE
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
          'GIA Certified',
          'Responsible Jewellery Council',
          'Fairmined Gold',
          'ISO 9001'].
          map((cert) =>
          <div key={cert} className="flex flex-col items-center">
              <div className="w-20 h-20 border-2 border-[#C9BDB0] rounded-full flex items-center justify-center mb-4">
                <Award className="text-[#B8A99A]" size={32} />
              </div>
              <span className="text-sm font-medium text-[#6B5D50]">{cert}</span>
            </div>
          )}
        </div>
      </section>
    </div>);

}