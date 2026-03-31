import React, { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import {
  Trophy,
  Target,
  TrendingUp,
  // MapPin,
  Clock,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  ChevronRight,
  Users,
  // Activity,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MapPinIcon
} from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans selection:bg-brand-500/30 selection:text-brand-900 overflow-x-hidden">

      {/* 
        PREMIUM NAVIGATION
      */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3" : "bg-transparent py-5"
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20">
              <img src="/images/logo/cm-logo2.png" alt="CoachMax" className="h-6 w-auto" />
            </div>
            <span className={`text-lg font-black tracking-tighter transition-colors uppercase ${scrolled ? "text-gray-900" : "text-white"}`}>Coach Max</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {["HOME", "ABOUT", "PROGRAMS", "STORE", "FEATURES", "TESTIMONIALS", "CONTACT"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-[10px] font-bold tracking-[0.2em] transition-all hover:text-brand-500 ${scrolled ? "text-gray-500" : "text-white/80"}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/signin"
              className={`text-[10px] font-bold tracking-widest px-6 py-2 rounded-xl transition-all border ${scrolled ? "border-gray-100 text-gray-500 hover:text-brand-500" : "border-white/20 text-white hover:bg-white/10"
                }`}
            >
              ADMIN
            </Link>
            <Button className="rounded-xl px-10 h-11 text-[10px] font-bold tracking-widest shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
              REGISTER NOW
            </Button>
          </div>
        </div>
      </nav>

      {/* 
        HERO SECTION: THE IMPACT 
      */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0 scale-105 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=100&w=2600&auto=format&fit=crop"
            alt="Elite Football Training"
            className="w-full h-full object-cover animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/60 to-gray-900" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-150">
            <Zap size={10} className="text-brand-500 fill-brand-500" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Master the Fundamental Skills</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            COACH MAX <br /><span className="text-brand-500">FOOTBALL ACADEMY</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Training with Coach Max is the key to success on the field. Turn your weaknesses into strengths, improve your skills, and increase your confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <button className="bg-brand-500 text-white rounded-[2rem] px-16 py-5 h-auto text-[11px] font-black tracking-[0.2em] shadow-2xl shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all">
              EXPLORE PROGRAMS
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white rounded-[2rem] px-16 py-5 h-auto text-[11px] font-black tracking-[0.2em] shadow-xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 group">
              VIEW SCHEDULE <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 
        FOUNDER SECTION: ABOUT COACH MAX
      */}
      <section id="about" className="py-32 px-6 md:px-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-12 text-center mb-16">
              <span className="text-brand-500 font-bold text-[10px] uppercase tracking-[0.4em] block mb-4">Founder & Head Coach</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4">ABOUT COACH MAX</h2>
              <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full" />
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-6 bg-brand-500/5 rounded-[4rem] group-hover:scale-105 transition-all duration-700" />
              <div className="relative aspect-square overflow-hidden rounded-[3.5rem] shadow-2xl ring-1 ring-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1543326127-d6484e508892?q=80&w=1200&auto=format&fit=crop"
                  alt="Head Coach Max"
                  className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center">
                <span className="text-4xl font-black text-brand-500">12+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Years of Elite Coaching</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <p className="text-xl font-bold text-gray-800 leading-relaxed tracking-tight underline decoration-brand-500/30 underline-offset-8">
                  "I don't believe skill was, or ever will be, the result of coaches. It is a result of a love affair between the child and the ball." — Roy Keane
                </p>
                <p className="text-gray-500 leading-[1.8] font-medium text-lg">
                  Founder and Head Coach of Coach Max Football Academy, based in Brisbane, Queensland.
                  I am truly passionate about the game and always ready to help my trainees improve theirs.
                  I believe through hard work and commitment every player can achieve their true potential.
                  My intent is that players leave sessions with a greater understanding of football and confidence in their abilities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <AboutPillar icon={<ShieldCheck size={28} />} title="Premium Youth Focus" desc="Tailored development for players aged 4-16." />
                <AboutPillar icon={<Target size={28} />} title="Skill Mastery" desc="Dribbling, shooting, and spatial awareness." />
                <AboutPillar icon={<Award size={28} />} title="High Intensity" desc="Individually customized training scenarios." />
                <AboutPillar icon={<Users size={28} />} title="Global Standards" desc="Academy models adapted for local talent." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        PROGRAMS SECTION: THE CORE OFFERING
      */}
      <section id="programs" className="py-32 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] block mb-4">Integrative Development</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">PROGRAMS & REGISTRATION</h2>
            <p className="text-gray-500 mt-6 max-w-xl mx-auto font-medium">Competitive pathways reproducing youth system models of professional football academies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ELITE PROGRAM */}
            <ProgramItem
              badge="ELITE CLASS"
              title="ELITE PROGRAM"
              desc="Competitive program reproducing professional youth systems. Teams from U6 to U14 setting the bar regionally."
              details={[
                "Professional Academy Model",
                "Elite Games & Tournaments",
                "Technical & Tactical training",
                "Commitment: Terms based"
              ]}
              stats={{ age: "6-14", duration: "75 Min", entry: "TRIAL" }}
            />

            {/* DEVELOPMENT PROGRAM */}
            <ProgramItem
              badge="OPEN ACCESS"
              title="DEVELOPMENT PROGRAM"
              desc="Adapted training sessions focusing on individual growth and collective needs. Ideal for group learning."
              details={[
                "CM Milan (6-8yo) - Sunday",
                "CM Roma (9-11yo) - Sunday",
                "CM Napoli (11-13yo) - Sunday",
                "Mid-week sessions available"
              ]}
              stats={{ age: "6-14", duration: "75 Min", entry: "OPEN" }}
              featured
            />

            {/* 1 ON 1 PROGRAM */}
            <ProgramItem
              badge="INDIVIDUAL"
              title="1ON1 PRIVATE SESSION"
              desc="Tailored programmes delivered to help beginners and experienced players reach the next level."
              details={[
                "Ball Mastery Skills Focus",
                "Agility & Coordination",
                "Position Specific Training",
                "COST: $145 (GST incl.)"
              ]}
              stats={{ age: "ANY", duration: "60 Min", entry: "BOOKING" }}
            />
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
            <HorizontalProgram
              title="Before & After School Programs"
              desc="Bringing unique, fun programs to Bardon, Windsor, Gumdale, and more."
              linkText="VIEW SCHOOL LIST"
              icon={<Globe size={20} />}
            />
            <HorizontalProgram
              title="April 2026 Holiday Camp"
              desc="Join us for a fun-filled week at Somerset Hills State School."
              linkText="CAMP DETAILS"
              icon={<Calendar size={20} />}
              highlight
            />
          </div>
        </div>
      </section>

      {/* 
        FEATURES SECTION: THE CM ADVANTAGE
      */}
      <section id="features" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <FeatureCard
              icon={<Trophy size={40} />}
              title="High Level Coaching"
              desc="Meticulous planning and attention to detail at every phase of training."
            />
            <FeatureCard
              icon={<ShieldCheck size={40} />}
              title="Professional Trials"
              desc="Identify needs and develop structured plans from the first session."
            />
            <FeatureCard
              icon={<Clock size={40} />}
              title="Flexible Time"
              desc="Training schedules adapted to accommodate elite player/parent routines."
            />
          </div>
        </div>
      </section>

      {/* 
        TESTIMONIALS SECTION: SOCIAL PROOF
      */}
      <section id="testimonials" className="py-32 bg-gray-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-brand-500 font-bold text-[10px] uppercase tracking-[0.4em] block mb-4">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">TESTIMONIALS</h2>
            <div className="h-1.5 w-16 bg-white/20 mx-auto rounded-full" />
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              1024: { slidesPerView: 2, spaceBetween: 40 }
            }}
            className="pb-20 testimonials-slider"
          >
            <SwiperSlide>
              <QuoteCard
                text="Coach Max’s ability to connect with young players, instilling both fundamental skills and a love for the sport, has truly transformed my son’s experience. Highly recommend!"
                author="Clarence L."
                location="Academy Parent"
              />
            </SwiperSlide>
            <SwiperSlide>
              <QuoteCard
                text="Beyond the field, Coach Max teaches invaluable life lessons about teamwork, discipline, and perseverance. My son’s improvement in both technical skills is a testament to his methods."
                author="Jay M."
                location="Academy Parent"
              />
            </SwiperSlide>
            <SwiperSlide>
              <QuoteCard
                text="Coach Max’s innovative techniques keep my son eagerly looking forward to every practice. innovative coaching techniques and personalized attention have improved performance."
                author="John H."
                location="Academy Parent"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* 
        STORE & TOURNAMENTS PREVIEW
      */}
      <section id="store" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-gray-900 rounded-[3.5rem] text-white flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={120} />
              </div>
              <span className="text-brand-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">Expression of Interest</span>
              <h3 className="text-4xl font-black tracking-tighter mb-6 uppercase">2026 WORLDWIDE <br /> TOURNAMENTS</h3>
              <p className="text-white/60 mb-10 max-w-sm leading-relaxed">
                Academy Cup (Gold Coast), Diamond League (Melbourne), and Surf Cup International in Salou, Spain. Limited spots available.
              </p>
              <button className="bg-brand-500 text-white rounded-2xl px-12 py-4 text-[10px] font-bold tracking-[0.2em] self-start shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                SUBMIT INTEREST
              </button>
            </div>

            <div className="p-12 border border-gray-100 bg-gray-50/50 rounded-[3.5rem] flex flex-col justify-center relative group">
              <div className="absolute bottom-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Star size={150} />
              </div>
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">Premium Fangear</span>
              <h3 className="text-4xl font-black tracking-tighter mb-6 uppercase">CM OFFICIAL <br /> MERCHANDISE</h3>
              <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
                Game day kits, training kits, caps and bags. All sizes available for football trainees and supporters.
              </p>
              <button className="bg-gray-900 text-white rounded-2xl px-12 py-4 text-[10px] font-bold tracking-[0.2em] self-start shadow-xl shadow-gray-200 active:scale-95 transition-all">
                BROWSE STORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        IMMERSIVE FOOTER 
      */}
      <footer id="contact" className="bg-gray-50 border-t border-gray-100 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-32">
            <div className="md:col-span-12 lg:col-span-5 space-y-10 text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="p-3 bg-brand-500 rounded-2xl">
                  <img src="/images/logo/cm-logo2.png" alt="CM" className="h-8" />
                </div>
                <h4 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">COACH MAX FOOTBALL ACADEMY</h4>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Coach Max will turn your weaknesses into strengths, improve your skills, and increase your confidence. Subscribe for academy news and trial invitations.
              </p>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <SocialBtn icon={<Facebook size={18} />} />
                <SocialBtn icon={<Instagram size={18} />} />
                <SocialBtn icon={<Twitter size={18} />} />
                <SocialBtn icon={<Linkedin size={18} />} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-12 lg:col-span-7 gap-10">
              <div className="space-y-8">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Platform</h5>
                <ul className="space-y-4 text-[11px] font-bold text-gray-800">
                  <li><a href="#" className="hover:text-brand-500 transition-colors uppercase">Academy Home</a></li>
                  <li><a href="#" className="hover:text-brand-500 transition-colors uppercase">About Coaching</a></li>
                  <li><a href="#" className="hover:text-brand-500 transition-colors uppercase">Skill Features</a></li>
                  <li><a href="#" className="hover:text-brand-500 transition-colors uppercase">Success Stories</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact</h5>
                <ul className="space-y-4 text-[11px] font-bold text-gray-800">
                  <li className="flex items-center gap-2 group"><Mail size={14} className="text-brand-500" /> <span className="group-hover:text-brand-500 transition-colors">max@coachmax.com.au</span></li>
                  <li className="flex items-center gap-2 group"><Phone size={14} className="text-brand-500" /> <span className="group-hover:text-brand-500 transition-colors">+61 0408 207 049</span></li>
                  <li className="flex items-center gap-2 group"><MapPinIcon size={14} className="text-brand-500" /> <span className="group-hover:text-brand-500 transition-colors line-clamp-2">9 Hurdcotte Street, Enoggera, 4051</span></li>
                </ul>
              </div>
              <div className="space-y-8 col-span-2 md:col-span-1">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Newsletter</h5>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Email address"
                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-brand-500/30 transition-all shadow-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20 active:scale-90 transition-transform">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Copyright © 2018 - {new Date().getFullYear()} COACH MAX FOOTBALL ACADEMY. BRISBANE AUSTRALIA.
            </span>
            <div className="flex gap-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-gray-900">Terms & Conditions</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// COMPONENT HELPERS
const AboutPillar = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-brand-50 text-brand-500 rounded-2xl shadow-sm border border-brand-100 flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <h4 className="font-black text-gray-900 tracking-tight leading-none mb-2 text-sm uppercase">{title}</h4>
      <p className="text-[13px] font-medium text-gray-400 leading-tight">{desc}</p>
    </div>
  </div>
);

const ProgramItem = ({ featured, badge, title, desc, details, stats }: any) => (
  <div className={`p-10 rounded-[3.5rem] border transition-all relative overflow-hidden group ${featured ? "bg-white border-brand-100 shadow-2xl shadow-brand-500/5 ring-2 ring-brand-500" : "bg-white border-gray-50 shadow-xl"
    }`}>
    {featured && (
      <div className="absolute top-0 right-10 py-2 px-6 bg-brand-500 text-white rounded-b-2xl text-[9px] font-black tracking-widest">MOST POPULAR</div>
    )}
    <div className="space-y-8">
      <div>
        <span className="text-brand-500 font-bold text-[9px] uppercase tracking-[0.3em] block mb-2">{badge}</span>
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4 group-hover:text-brand-500 transition-colors">{title}</h3>
        <p className="text-gray-400 font-medium text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="space-y-4">
        {details.map((d: any, i: any) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle2 size={16} className="text-success-500 flex-shrink-0" />
            <span className="text-xs font-bold text-gray-600 truncate">{d}</span>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-gray-50">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-gray-50 rounded-2xl">
            <span className="text-[8px] font-bold text-gray-400 uppercase block mb-1">Ages</span>
            <span className="text-[10px] font-black text-gray-900">{stats.age}</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-2xl">
            <span className="text-[8px] font-bold text-gray-400 uppercase block mb-1">Session</span>
            <span className="text-[10px] font-black text-gray-900">{stats.duration}</span>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-2xl">
            <span className="text-[8px] font-bold text-gray-400 uppercase block mb-1">Mode</span>
            <span className="text-[10px] font-black text-gray-900">{stats.entry}</span>
          </div>
        </div>
      </div>
      <button className={`w-full py-5 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all uppercase ${featured ? "bg-brand-500 text-white shadow-xl shadow-brand-500/20" : "bg-gray-900 text-white shadow-lg"
        }`}>REGISTER NOW</button>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="text-center space-y-8 group">
    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-brand-500 mx-auto group-hover:bg-brand-500 group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:shadow-brand-500/20">
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{title}</h3>
      <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto italic">"{desc}"</p>
    </div>
  </div>
);

const QuoteCard = ({ text, author, location }: any) => (
  <div className="p-12 md:p-16 bg-white/5 backdrop-blur-md rounded-[4rem] border border-white/10 text-left h-full flex flex-col justify-between">
    <div>
      <div className="flex gap-1 mb-10">
        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#F97316" className="text-brand-500" />)}
      </div>
      <p className="text-2xl md:text-3xl font-medium text-white italic tracking-tight leading-snug mb-12">
        "{text}"
      </p>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-black">
        {author[0]}
      </div>
      <div>
        <span className="block font-black text-white text-lg tracking-tight uppercase leading-none">{author}</span>
        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">{location}</span>
      </div>
    </div>
  </div>
);

const HorizontalProgram = ({ title, desc, linkText, icon, highlight }: any) => (
  <div className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-10 group transition-all ${highlight ? "bg-gray-900 border-gray-800 text-white shadow-2xl" : "bg-white border-gray-50 shadow-xl"
    }`}>
    <div className="flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${highlight ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-500"
        }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-xl font-black tracking-tighter uppercase">{title}</h4>
        <p className={`text-sm font-medium ${highlight ? "text-gray-400" : "text-gray-400"}`}>{desc}</p>
      </div>
    </div>
    <button className={`whitespace-nowrap px-10 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase ${highlight ? "bg-white text-gray-900 hover:bg-brand-500 hover:text-white" : "bg-gray-900 text-white hover:bg-brand-500 shadow-lg"
      }`}>{linkText}</button>
  </div>
);

const SocialBtn = ({ icon }: any) => (
  <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white hover:border-brand-500 active:scale-90 transition-all shadow-sm">
    {icon}
  </button>
);

export default LandingPage;
