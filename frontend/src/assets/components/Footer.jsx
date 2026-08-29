import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const links = [
    { label: t('footer.roomsSuites'), href: '#accommodations' },
    { label: t('footer.offersPackages'), href: '#' },
    { label: t('footer.weddingsEvents'), href: '#' },
    { label: t('footer.careers'), href: '#' },
    { label: t('footer.giftVouchers'), href: '#' },
  ];

  return (
    <footer className="bg-navy-deep text-white pt-24 pb-12">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-24">

          <div className="space-y-8">
            <h5 className="font-serif text-2xl tracking-widest font-bold">LA MAISON DTN</h5>
            <p className="text-sm text-white/50 font-light leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="flex space-x-5">
              {['facebook', 'photo_camera', 'play_circle_outline'].map((icon) => (
                <a
                  key={icon}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                  href="#"
                >
                  <span className="material-icons-outlined text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h6 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-10">{t('footer.contact')}</h6>
            <ul className="space-y-6 text-sm text-white/60 font-light">
              <li className="flex items-start space-x-3">
                <span className="material-icons-outlined text-sm pt-1">location_on</span>
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="material-icons-outlined text-sm">phone</span>
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="material-icons-outlined text-sm">mail_outline</span>
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-10">{t('footer.links')}</h6>
            <ul className="space-y-5 text-sm text-white/60 font-light">
              {links.map((item, idx) => (
                <li key={idx}>
                  <a className="hover:text-primary transition-colors flex items-center group" href={item.href}>
                    <span className="w-0 group-hover:w-4 h-[1px] bg-primary mr-0 group-hover:mr-2 transition-all"></span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-sm">
            <h6 className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary mb-6">
              {t('footer.guestVoicesTitle')}
            </h6>

            <p className="text-sm text-white/60 mb-10 font-light leading-relaxed">
              {t('footer.guestVoicesDesc')}
            </p>

            <button onClick={()=> navigate('/reviews')} className="group relative text-primary font-semibold text-[11px] uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer">
              {t('footer.shareExperience')}
              <span className="block h-[1px] w-0 bg-primary mt-1 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] text-white/30 font-semibold">
          <p>{t('footer.copyright')}</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <a className="hover:text-white transition-colors" href="#">{t('footer.privacyPolicy')}</a>
            <a className="hover:text-white transition-colors" href="#">{t('footer.termsOfUse')}</a>
            <a className="hover:text-white transition-colors" href="#">{t('footer.sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;