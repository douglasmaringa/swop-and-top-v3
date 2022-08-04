import React, { Component } from 'react';
import Header from '../Components/Header/Header';
import Banner from '../Components/Banner/Banner';
import './Home.css';
import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import Category from '../Components/Category/Category';
import GoogleAd from '../Google';

class Home extends Component {
  render() {
    return (
    <div className="homeParentDiv">
      <Header />
      <div className="homePage__category">
        <Category />
      </div>
      <Banner />
      <GoogleAd slot="989038934" classNames="page-top" />
      <Posts />
      
      <GoogleAd slot="394738798" timeout={1000} classNames="page-bottom" />
      <Footer />
    </div>
  );
    }
  }

export default Home;
