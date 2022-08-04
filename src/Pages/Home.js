import React,{useEffect} from 'react';
import Header from '../Components/Header/Header';
import Banner from '../Components/Banner/Banner';
import './Home.css';
import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import Category from '../Components/Category/Category';
import GoogleAd from '../Google';

function Home() {
  return (
    <div className="homeParentDiv">
      <Header />
      <div className="homePage__category">
        <Category />
      </div>
      <Banner />
     
      <Posts />
      
      <GoogleAd slot="394738798" timeout={1000} classNames="page-bottom" />
      <Footer />
    </div>
  );
}

export default Home;
