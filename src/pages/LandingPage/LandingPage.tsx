import React from "react";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen text-gray-800 font-raleway">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/images/logo/cm-logo.png" alt="CoachMax" className="h-8" />
                </div>
                <div className="hidden md:flex items-center gap-8 text-[12px] font-black uppercase tracking-widest text-gray-500">
                    <a href="#about" className="hover:text-brand-500 transition-colors">About Us</a>
                    <a href="#programs" className="hover:text-brand-500 transition-colors">Programs</a>
                    <a href="#impact" className="hover:text-brand-500 transition-colors">Impact</a>
                    <a href="#merchandise" className="hover:text-brand-500 transition-colors">Merchandise</a>
                    <a href="#testimonials" className="hover:text-brand-500 transition-colors">Testimonials</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/signin" className="text-[12px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600">Admin Login</Link>
                    <Button variant="primary" size="sm" className="rounded-full px-8 text-[10px] uppercase font-black tracking-widest italic h-10">Register Now</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-500/10 z-10" />
                <img src="/images/landing/hero-bg.jpg" alt="Training" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-20 text-center max-w-4xl px-6 bg-white/10 backdrop-blur-sm p-12 rounded-[40px] border border-white/20 shadow-2xl">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-6 leading-none">
                        Coach Max <span className="text-brand-500">Football Academy</span>
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                        Empowering the next generation of footballers with professional coaching and elite training environments.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button className="rounded-full px-12 py-4 h-auto text-sm uppercase font-black tracking-widest italic shadow-lg shadow-brand-500/20">Learn More</Button>
                        <Button variant="outline" className="rounded-full px-12 py-4 h-auto text-sm uppercase font-black tracking-widest italic bg-white/10 text-white border-white/40 hover:bg-white/20">Join Academy</Button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 md:px-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block py-1 px-4 bg-brand-50 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">About CoachMax</div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-800 mb-6 leading-tight">Professional Coaching for <span className="text-brand-500">Exceptional Results</span></h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Founded by professional coaches with international experience, Coach Max Football Academy (CMFA) is dedicated to developing regional football talent. Our philosophy centers on technical proficiency, tactical awareness, and physical conditioning.
                        </p>
                        <div className="space-y-4">
                            <FeatureItem text="Experienced International Coaches" />
                            <FeatureItem text="State-of-the-Art Training Facilities" />
                            <FeatureItem text="Individual Player Development Plans" />
                            <FeatureItem text="Pathways to Professional Leagues" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-brand-500/10 rounded-[40px] transform -rotate-3" />
                        <img src="/images/landing/about-us.jpg" alt="Coach Max" className="relative rounded-[40px] shadow-2xl object-cover h-[500px] w-full" />
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section id="programs" className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <div className="inline-block py-1 px-4 bg-brand-50 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Our Programs</div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-800 mb-6 leading-tight">Tailored Pathways for <span className="text-brand-500">Every Stage</span></h2>
                        <p className="text-gray-500">From grassroots beginnings to elite competition, we have the perfect program to accelerate your football journey.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ProgramCard 
                            title="U-12 Program" 
                            desc="Developing fundamentals and love for the game in a fun yet disciplined environment."
                            img="/images/landing/u12.jpg"
                            features={["Ball Control", "Basic Tactics", "Teamwork"]}
                        />
                        <ProgramCard 
                            title="Elite U-15 Program" 
                            desc="High-performance training for players seeking to compete at the highest regional levels."
                            img="/images/landing/u15.jpg"
                            features={["Tactical Intelligence", "Physical Excellence", "Competition"]}
                        />
                        <ProgramCard 
                            title="Goal Keeper Academy" 
                            desc="Specialized individual sessions focusing on reflexes, positioning, and shot-stopping."
                            img="/images/landing/gk.jpg"
                            features={["Reflex Training", "Positioning", "Distribution"]}
                        />
                    </div>
                </div>
            </section>

            {/* Merchandise Section */}
            <section id="merchandise" className="py-24 px-6 md:px-20 max-w-7xl mx-auto text-center font-bold">
                 <div className="inline-block py-1 px-4 bg-brand-50 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Official Gear</div>
                 <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-800 mb-6 leading-tight">CM Football <span className="text-brand-500">Merchandise</span></h2>
                 <p className="text-gray-500 mb-16 max-w-xl mx-auto font-normal">Train like a pro. Look like a pro. High-quality official academy gear available now.</p>
                 
                 <div className="flex justify-center flex-wrap gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl w-full max-w-sm group hover:border-brand-500/20 transition-all">
                        <div className="h-80 overflow-hidden rounded-[20px] mb-6 bg-gray-50">
                            <img src="/images/landing/jersey-black.png" alt="Black Jersey" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-800 mb-2">Home Pro Jersey</h3>
                        <p className="text-brand-500 text-lg mb-6">$45.00</p>
                        <Button className="w-full rounded-full uppercase italic font-black h-12">Shop Now</Button>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl w-full max-w-sm group hover:border-brand-500/20 transition-all">
                        <div className="h-80 overflow-hidden rounded-[20px] mb-6 bg-gray-50">
                            <img src="/images/landing/jersey-white.png" alt="White Jersey" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-800 mb-2">Away Pro Jersey</h3>
                        <p className="text-brand-500 text-lg mb-6">$40.00</p>
                        <Button className="w-full rounded-full uppercase italic font-black h-12">Shop Now</Button>
                    </div>
                 </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-brand-500 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block py-1 px-4 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Testimonials</div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-16 leading-tight">What Parents & <span className="text-brand-600">Players Say</span></h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard 
                            quote="The individual attention my son received here is unparalleled. He has grown not just as a player but as a person."
                            author="Sanjay V."
                            role="Parent of U-12 Player"
                        />
                        <TestimonialCard 
                            quote="The coaching staff are world-class. They know how to push you while making sure you're always improving."
                            author="Liam G."
                            role="Elite Academy Player"
                        />
                        <TestimonialCard 
                            quote="Joining Coach Max was the best decision for my daughter's goalkeeping career. Her reflexes have improved 100%!"
                            author="Karen M."
                            role="Parent of GK Scholar"
                        />
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-white py-20 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <img src="/images/logo/cm-logo.png" alt="CoachMax" className="h-10 mb-8" />
                        <p className="text-gray-500 text-lg max-w-sm mb-8">
                            Coach Max Football Academy is a premier institution dedicated to world-class player development.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon="fb" />
                            <SocialIcon icon="ig" />
                            <SocialIcon icon="tw" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-800">
                            <li><a href="#" className="hover:text-brand-500">About Us</a></li>
                            <li><a href="#" className="hover:text-brand-500">Programs</a></li>
                            <li><a href="#" className="hover:text-brand-500">Gallery</a></li>
                            <li><a href="#" className="hover:text-brand-500">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-800">
                            <li>info@coachmax.academy</li>
                            <li>+1 (234) 567-890</li>
                            <li>123 Football Ave, Soccer City</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <p>&copy; 2024 Coach Max Football Academy. All Rights Reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-brand-500">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-500">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-full bg-brand-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
        </div>
        <span className="font-bold text-gray-700 uppercase italic text-sm">{text}</span>
    </div>
);

const ProgramCard = ({ title, desc, img, features }: { title: string; desc: string; img: string; features: string[] }) => (
    <div className="bg-white p-4 rounded-[40px] border border-gray-100 shadow-xl group hover:border-brand-500/20 transition-all">
        <div className="h-64 overflow-hidden rounded-[30px] mb-8 relative">
            <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
        </div>
        <div className="px-4 pb-4">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-800 mb-4">{title}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{desc}</p>
            <div className="flex flex-wrap gap-2 mb-8">
                {features.map((f, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full text-gray-400">{f}</span>
                ))}
            </div>
            <Button variant="outline" className="w-full rounded-full uppercase italic font-black h-12 text-[10px] tracking-widest border-gray-200 group-hover:bg-brand-50 group-hover:border-brand-500/20 group-hover:text-brand-500">Program Details</Button>
        </div>
    </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
    <div className="bg-white/10 backdrop-blur-md p-10 rounded-[40px] border border-white/20 text-left">
        <svg className="w-10 h-10 text-brand-600 mb-8" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8H6v-8h4zm12 0v8h-4v-8h4zM10 18v8H6v-8h4zm12 0v8h-4v-8h4z"/></svg>
        <p className="text-xl font-medium mb-10 italic leading-relaxed">"{quote}"</p>
        <div>
            <span className="block font-black uppercase italic tracking-tighter text-lg">{author}</span>
            <span className="text-brand-600 font-bold uppercase tracking-widest text-[10px]">{role}</span>
        </div>
    </div>
);

const SocialIcon = ({ icon }: { icon: string }) => (
    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all cursor-pointer">
        <span className="uppercase font-black text-[10px]">{icon}</span>
    </div>
);

export default LandingPage;
