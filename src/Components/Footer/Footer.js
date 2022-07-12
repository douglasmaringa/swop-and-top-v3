import React from 'react';

import './Footer.css';

function Footer() {
  return (
    <div className="footerParentDiv">
      <div className="footer__banner">
        <img src="https://statics.olx.in/external/base/img/phone-app.webp" alt="" />
        <div className="footerBanner__content">
          <h3>TRY THE SWOP AND TOP APP</h3>
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
        <div className="footer__cards" >
          <span className="heading">TRENDING LOCATIONS</span>
          <span>Harare</span>
          <span>Gweru</span>
          <span>Bulawayo</span>
          <span>Victoria Falls</span>
        </div>
        <div className="footer__cards">
          <span className="heading">ABOUT US</span>
          <span>About Swop N Top</span>
          <span>Careers</span>
          <span>Contact Us</span>
          <span>Swop N Top People</span>
          <span>Waah Jobs</span>
        </div>
        <div className="footer__cards">
          <span className="heading">Swop N Top</span>
          <span>Help</span>
          <span>Sitemap</span>
          <span>Legal & Privacy information</span>
        </div>
        <div className="footer__cards footer__social">
          <div>
            <span className="heading">FOLLOW US</span>
            <div className="footerSocial__icons">
              <i className="bi bi-facebook"></i>
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
        <p>Swop N Top in Zimbabwe. © 2022 Swop N Top</p>
      </div>
    </div>
  );
}

export default Footer;
