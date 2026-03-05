import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import Experiences from '../components/Experiences';
import Wellness from '../components/Wellness';
import Dining from '../components/Dining';

import Footer from '../components/Footer';

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