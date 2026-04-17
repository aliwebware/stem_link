'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'up' | 'left' | 'right';
  delay?: number;
}

function AnimatedSection({ 
  children, 
  className = '', 
  animationType = 'up',
  delay = 0 
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On small screens (mobile) avoid hiding content behind animations
    // — show immediately to prevent IntersectionObserver from keeping
    // content at opacity-0 when observers don't fire reliably.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClass = {
    up: 'animate-fade-in-up',
    left: 'animate-fade-in-left',
    right: 'animate-fade-in-right',
  }[animationType];

  return (
    <div 
      ref={ref}
      className={`${isVisible ? `${animationClass} opacity-100` : 'opacity-0'} ${className}`}
      style={{ 
        animationDelay: isVisible ? `${delay}ms` : '0ms',
        transition: 'all 0.8s ease-out'
      }}
    >
      {children}
    </div>
  );
}

function AnimatedImage({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string; 
  alt: string; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On small screens, reveal images immediately to avoid them staying hidden
    // due to IntersectionObserver not firing reliably in some mobile browsers.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`relative ${isVisible ? 'animate-slide-in-image' : 'opacity-0'} ${className}`}
      style={{ 
        transition: 'all 0.8s ease-out'
      }}
    >
      <Image 
        src={src} 
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 100vw"
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        priority={false}
      />
    </div>
  );
}

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);
  return (
    <div className="min-h-screen relative">
      {/* Background image layer (fundo.webp) fixed, reduced opacity */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: "url('/fundo.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 0.25,
        }}
      />
      {/* Decorative Circles */}
      {/* Top Left Blue Circle */}
      <div
        className="fixed top-0 left-0 -translate-x-1/4 -translate-y-1/4 z-20 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: mounted && typeof window !== 'undefined' && window.innerWidth < 768 && scrollPosition < 50 ? 0 : 1,
        }}
      >
        <div className="w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-[#0083cb] opacity-100 shadow-lg flex items-center justify-center">
          <Image
            src="/ASA Logo.webp"
            alt="American Schools of Angola"
            width={96}
            height={96}
            className="h-24 sm:h-48 w-auto"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Top Centre Logo (Mobile) - Appears at top */}
      <div
        className="md:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: mounted && scrollPosition < 50 ? 1 : 0,
        }}
      >
        <div className="bg-white bg-opacity-95 rounded-full p-3 sm:p-4 shadow-md">
          <Image
            src="/ASA Logo.webp"
            alt="American Schools of Angola"
            width={100}
            height={100}
            className="h-20 w-auto"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Top Right Logos - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-50">
        <div className="bg-white bg-opacity-95 rounded-full p-2 sm:p-3 shadow-md">
          <Image
            src="/thinkyoung_boeing.webp"
            alt="ThinkYoung and Boeing Logos"
            width={280}
            height={90}
            className="h-10 sm:h-12 w-auto"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Yellow Circle - Right Side */}
      <div className="fixed top-1/4 right-0 translate-x-1/3 z-0 pointer-events-none">
        <div className="w-56 h-56 rounded-full bg-[#fdaf17] opacity-100 shadow-lg"></div>
      </div>

      {/* Green Circle - Left Bottom */}
      <div className="fixed bottom-1/3 left-0 -translate-x-1/2 z-0 pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-[#01944d] opacity-100 shadow-lg"></div>
      </div>

      {/* Red Circle - Right Bottom */}
      <div className="fixed bottom-1/4 right-0 translate-x-1/4 z-0 pointer-events-none">
        <div className="w-40 h-40 rounded-full bg-[#ed1b24] opacity-100 shadow-lg"></div>
      </div>

      {/* ASA Logo Header Decoration (reduced height) */}
      <div className="relative bg-white overflow-hidden h-0 sm:h-6 md:h-0 z-10">
      </div>

      {/* Header / Title Bubble */}
      <header className="relative mt-0">
        <div className="w-full bg-[#0083cb] rounded-b-full overflow-hidden z-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            <AnimatedSection animationType="up" delay={200}>
              <div className="pb-1 sm:pb-16 pt-32 sm:pt-0">
                <p className="text-white text-sm font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                  April 9th - 12th, 2026
                </p>
                <h1 className="text-4xl sm:text-7xl font-bold leading-tight mb-1 sm:mb-6 text-white animate-text-glow">
                  American Schools of Angola Hosted First ThinkYoung STEM Robotics Bootcamp in Angola
                </h1>
                <div className="h-1 w-24 bg-yellow-400 rounded animate-float opacity-90"></div>
                <p className="mt-4 text-white text-sm sm:text-base">
                  <a href="https://www.asangola.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 underline transition-colors">
                    www.asangola.com
                  </a>
                </p>
              </div>
            </AnimatedSection>

            {/* Mobile Logo - Below Title */}
            <div className="md:hidden flex justify-end mt-4 mb-0">
              <div className="bg-white bg-opacity-95 rounded-full p-1 sm:p-2 shadow-sm">
                <Image
                  src="/thinkyoung_boeing.webp"
                  alt="ThinkYoung and Boeing Logos"
                  width={180}
                  height={60}
                  className="h-10 w-auto"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            <AnimatedImage 
              src="/homesectionImg.webp" 
              alt="STEM Robotics Bootcamp" 
              className="w-full h-96 sm:min-h-screen object-contain mb-2 sm:mb-12"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-50 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        
        {/* Intro Paragraph */}
        <AnimatedSection animationType="up">
          <section className="mb-10 sm:mb-20 bg-white p-6 sm:p-8 rounded-lg">
            <p className="text-lg text-gray-700 leading-relaxed">
              As part of an initiative by <strong>ThinkYoung</strong>, in partnership with <strong>Boeing</strong> and the <strong>American Schools of Angola</strong>, the STEM Robotics Bootcamp was held from April 9 to 12, bringing together more than 45 adolescents aged between 12 and 18 from various educational institutions.
            </p>
          </section>
        </AnimatedSection>

        {/* Main Body */}
        <AnimatedSection animationType="left">
          <section className="mb-10 sm:mb-20 bg-gray-50 p-6 sm:p-12 rounded-lg border-l-4 border-blue-600">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Four Days of Innovation & Learning
            </h2>
            
            <div className="space-y-3 sm:space-y-6 text-gray-700">
              <p className="leading-relaxed text-lg">
                Throughout the four days, participants had the opportunity to explore key areas such as <strong>Artificial Intelligence</strong>, <strong>Robotics</strong>, <strong>Programming</strong>, and emerging technologies, combining theoretical learning with hands-on experience.
              </p>
              
              <p className="leading-relaxed">
                The program included practical workshops and engineering activities designed to foster innovation, collaboration, and problem-solving skills among the participants.
              </p>

              {/* Images Grid */}
              <div className="flex flex-col gap-0 mt-2 sm:mt-12">
                <div>
                  <AnimatedImage 
                    src="/img1.webp" 
                    alt="STEM Workshop 1" 
                    className="w-full h-96 sm:h-screen object-contain"
                  />
                  <div className="-mt-20">
                    <p className="text-sm text-blue-600">
                      <a href="https://youtube.com/shorts/CYV6zpxhKwM" target="_blank" rel="noopener noreferrer" className="underline">Vídeo no YouTube</a>
                    </p>
                  </div>
                </div>
                <AnimatedImage 
                  src="/img2.webp" 
                  alt="STEM Workshop 2" 
                  className="w-full h-96 sm:h-screen object-contain"
                />
                <AnimatedImage 
                  src="/img3.webp" 
                  alt="STEM Workshop 3" 
                  className="w-full h-96 sm:h-screen object-contain"
                />
              </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-600">
                    Photos: <a href="https://www.flickr.com/photos/200905206@N07/albums/72177720332994451/with/55196788581" target="_blank" rel="noopener noreferrer" className="underline">Album 1 no Flickr</a> • <a href="https://www.flickr.com/photos/200905206@N07/albums/72177720333006152/" target="_blank" rel="noopener noreferrer" className="underline">Album 2 no Flickr</a>
                  </p>
                </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Field Experience */}
        <AnimatedSection animationType="right">
          <section className="mb-10 sm:mb-20 bg-white p-6 sm:p-12 rounded-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 sm:mb-6">
              Field Experience – Mussulo Peninsula
            </h2>
            <h3 className="text-3xl font-semibold text-blue-600 mb-4 sm:mb-8">
              Hands-on Learning at Mussulo Peninsula
            </h3>
            
            <div className="space-y-3 sm:space-y-6 text-gray-700">
              <p className="leading-relaxed">
                On the Mussulo Peninsula, participants engaged in project management exercises and gained practical knowledge in operating unmanned aerial and aquatic vehicles.
              </p>
              
              <p className="leading-relaxed">
                They also conducted environmental analysis, including water, air, and soil quality assessments, reinforcing the importance of environmental preservation and geoconservation.
              </p>

              {/* Mussulo Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-12 p-3 sm:p-6">
                <AnimatedImage 
                  src="/mussuloImg1.webp" 
                  alt="Mussulo Peninsula Activity 1" 
                  className="w-full h-96 object-contain"
                />
                <AnimatedImage 
                  src="/mussuloImg2.webp" 
                  alt="Mussulo Peninsula Activity 2" 
                  className="w-full h-96 -mt-10 sm:mt-0 object-contain"
                />
                <AnimatedImage 
                  src="/mussuloImg3.webp" 
                  alt="Mussulo Peninsula Activity 3" 
                  className="w-full h-96 -mt-42 sm:mt-0 object-contain"
                />
                <AnimatedImage 
                  src="/mussuloImg4.webp" 
                  alt="Mussulo Peninsula Activity 4" 
                  className="w-full h-96 -mt-10 sm:mt-0 object-contain"
                />
              </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-600">
                    Mussulo photos: <a href="https://www.flickr.com/photos/200905206@N07/albums/72177720333046788/" target="_blank" rel="noopener noreferrer" className="underline">Álbum Mussulo no Flickr</a>
                  </p>
                </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Inspiring Mentorship */}
        <AnimatedSection animationType="left">
          <section className="mb-8 sm:mb-12 bg-blue-50 px-4 py-6 sm:px-6 sm:py-8 rounded-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              Inspiring Mentorship
            </h2>

            <div className="w-full -mt-14 pointer-events-none">
              <AnimatedImage
                src="/MarcosbrothersImg.webp"
                alt="Marcos Brothers - Instructors"
                className="w-full h-96 sm:h-screen object-contain"
              />
            </div>
<div className="max-w-3xl mx-auto text-gray-700 space-y-2 -mt-14 pointer-events-auto">
  <p className="leading-relaxed text-base text-center">
    A highlight of the program was the contribution of the brothers <strong>Marco Filipe Menezes Romero</strong>, <strong>Marco Paulo N. S. Carlos</strong> and <strong>Fernando Romeiro</strong>, who served as instructors, representing the <a href="https://ggm-foundation.org/inicio/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GGMF</a> and the <a href="https://www.instagram.com/p/DWGb38ZEU9R/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Academia GEOSTRATOS</a>.
  </p>

  <p className="leading-relaxed text-base text-center">
    Their energy, dedication, and engaging teaching style brought enthusiasm and motivation to the students, significantly enriching the overall experience.
  </p>
</div>
          </section>
        </AnimatedSection>

        {/* Distinguished Visit */}
        <AnimatedSection animationType="right">
          <section className="mb-8 sm:mb-12 bg-white px-4 py-6 sm:px-6 sm:py-8 rounded-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
              Distinguished Visit
            </h2>

            <div className="w-full -mb-14 -mt-14">
              <AnimatedImage
                src="/embassyImg.webp"
                alt="Embassy of the United States of America"
                className="w-full h-96 sm:h-screen object-contain"
              />
            </div>

            <div className="max-w-3xl mx-auto text-gray-700">
              <p className="leading-relaxed text-base text-center">
                The initiative also received a visit from the <strong>Embassy of the United States of America</strong>, which closely followed the activities and engaged with participants during the program.
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* Closing Paragraph */}
        <AnimatedSection animationType="up">
          <section className="mb-10 sm:mb-20 bg-gray-50 p-6 sm:p-12 rounded-lg border-t-4 border-blue-600">
            <div className="text-gray-700 leading-relaxed text-xl">
              <p>
                The STEM Robotics Bootcamp represents a significant step in promoting STEM education in Angola, empowering young people with critical skills for the future while encouraging innovation, sustainability, and global collaboration.
              </p>
            </div>
          </section>
        </AnimatedSection>
      </main>

      {/* Final Image - Full Width */}
      <AnimatedSection animationType="up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-20 bg-white p-6 sm:p-8 rounded-lg">
          <div className="w-full mb-4">
            <AnimatedImage 
              src="/finalPicImg.webp" 
              alt="STEM Robotics Bootcamp Closing" 
              className="w-full h-96 sm:h-screen object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-600">
              Final photos: <a href="https://www.flickr.com/photos/200905206@N07/albums/72177720333050981/" target="_blank" rel="noopener noreferrer" className="underline">Álbum Final no Flickr</a>
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* About Section */}
      <main className="relative z-50 max-w-4xl mx-auto px-4 mb-10 sm:mb-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-10 sm:mb-20 text-center">
            About Our Partners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
            {/* About ThinkYoung */}
            <AnimatedSection animationType="left">
              <div className="flex flex-col items-center md:items-start bg-white p-6 sm:p-8 rounded-lg w-full">
                <div className="mb-4 sm:mb-8 flex justify-center md:justify-start w-full">
                  <Image
                    src="/thinkyoung.webp"
                    alt="ThinkYoung Logo"
                    width={160}
                    height={160}
                    className="h-40 w-auto animate-float -mb-14 -mt-14"
                    style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
                  About ThinkYoung
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-center md:text-left">
                  Founded in 2009 in Brussels, ThinkYoung is an independent, non-partisan, non-political, and non-profit think-tank dedicated to elevating youth voices. With a presence in Europe, Africa, Asia and now the United States, ThinkYoung works with partners across cultural, corporate, and government sectors to conduct research and design impact programs with and for young people.
                </p>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  For more information: <strong>Chichak Mammadova</strong> | Visit <a href="https://www.thinkyoung.eu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.thinkyoung.eu</a>
                </p>
            
              </div>
            </AnimatedSection>

            {/* About Boeing Africa */}
            <AnimatedSection animationType="right">
              <div className="flex flex-col items-center md:items-start bg-white p-6 sm:p-8 rounded-lg w-full">
                <div className="mb-4 sm:mb-8 flex justify-center md:justify-start w-full">
                  <Image
                    src="/boeing.webp"
                    alt="Boeing Logo"
                    width={160}
                    height={160}
                    className="h-40 w-auto animate-float"
                    style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
                  About Boeing Africa
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-center md:text-left">
                  A leading global aerospace company and top U.S. exporter, Boeing develops, manufactures and services commercial airplanes, defense products and space systems for customers in more than 150 countries. The company has been driving Africa's aviation growth for over seven decades, with Boeing's market share in African commercial aviation reaching 70%.
                </p>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Learn more: <a href="https://www.boeing.africa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.boeing.africa</a>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-6">
            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UChc8jAd3BTgHLmZA-4mlEOw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/asangola/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.695.278.278 2.579.07 7.052C.012 8.333 0 8.756 0 12s.012 3.667.07 4.948c.207 4.467 2.578 6.885 7.052 7.093 1.277.058 1.704.07 4.948.07 3.244 0 3.671-.012 4.948-.07 4.47-.208 6.84-2.627 7.052-7.093.058-1.281.07-1.708.07-4.948 0-3.244-.012-3.667-.072-4.948-.207-4.467-2.627-6.885-7.052-7.093C15.667.012 15.24 0 12 0z" />
                <circle cx="12" cy="12" r="3.6" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/ASAngola"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/american-schools-of-angola/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.79 0-9.714h3.554v1.375c.427-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.572zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.914.762 1.939 1.715 0 .953-.752 1.715-1.982 1.715zm1.946 11.597H3.392V9.738h3.891v10.714zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-300 text-sm mb-4">
              <a href="https://www.asangola.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
                www.asangola.com
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              © 2026 STEM Robotics Bootcamp. Empowering the next generation of innovators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
