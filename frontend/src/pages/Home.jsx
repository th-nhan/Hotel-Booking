import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Introduction from '../components/home/Introduction';
import Experiences from '../components/home/Experiences';
import Wellness from '../components/home/Wellness';
import Dining from '../components/home/Dining';
import Footer from '../components/layout/Footer';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar scrolled={scrolled} />
      <Hero />
      <Introduction />
      <Dining/>
      <Experiences />
      <Wellness/>
      <Footer />
    </div>
  );
};

export default Home;