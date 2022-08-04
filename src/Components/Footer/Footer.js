import React from 'react';

import './Footer.css';

function Footer() {
  return (
    <div className="footerParentDiv">
      <div className="footer__banner">
        <img src="https://www.letsnurture.com/wp-content/themes/letsnutrure/landing-asset/img/kijiji_ln.png" alt="" height={200} />
        <div className="footerBanner__content">
          <h3>TRY THE SWAP AND Sell APP</h3>
          <span>
            Buy, sell and find just about anything using the app on your mobile.
          </span>
        </div>
        <div className="footerBanner__links">
          <span>GET YOUR APP TODAY</span>
          <div className="footerBanner__apps">
            <img src="https://statics.olx.in/external/base/img/appstore_2x.webp" alt="img" />
            <img src="https://statics.olx.in/external/base/img/playstore_2x.webp" alt="img" />
          </div>
        </div>
      </div>
      <div className="content">
        <div className="footer__cards">
          <span className="heading">POPULAR LOCATIONS</span>
          <span>Harare</span>
          <span>Gweru</span>
          <span>Bulawayo</span>
          <span>Victoria Falls</span>
        </div>
       
        <div className="footer__cards">
          <span className="heading">ABOUT US</span>
          <span>About Swap & Sell</span>
          <span>Careers</span>
          <span>Contact Us</span>
          <span>Swap & Sell People</span>
          
        </div>
        <div className="footer__cards">
          <span className="heading">Swap N Sell</span>
          <span>Help</span>
          <span>Sitemap</span>
          <span>Legal & Privacy information</span>
        </div>
        <div className="footer__cards footer__social">
          <div>
            <span className="heading">FOLLOW US</span>
            <div className="footerSocial__icons">
              <a style={{marginRight:'10px'}} href="https://www.facebook.com/swapandtops/"><i className="bi bi-facebook"></i></a>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-twitter"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
          <div className="footer__apps">
            <img src="https://statics.olx.in/external/base/img/appstore_2x.webp" alt="img" />
            <img src="https://statics.olx.in/external/base/img/playstore_2x.webp" alt="img" />
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Other Countries Namibia - South Africa - Nigeria</p>
        <p>Swap N Sell in Zimbabwe. © 2022 Swap N Sell</p>
      </div>
    </div>
  );
}

export default Footer;
