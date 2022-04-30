import React, { useContext, useState, useEffect } from 'react';
import './Header.css';
import OlxLogo from '../../assets/OlxLogo';
import Search from '../../assets/Search';
import Arrow from '../../assets/Arrow';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { useHistory, useLocation } from 'react-router';
import { AuthContext } from '../../store/Context';
import Menu from '../Menu/Menu';
import Login from '../Login/Login';




function Header() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [loginPopOn, setLoginPopOn] = useState(false);
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [locationSearch, setLocationSearch] = useState('');


  useEffect(() => {
    if (location?.state?.from === 'create') {
      setLoginPopOn(true)
    }
  }, [location?.state?.from])


  const handleSellClick = () => {
    (user ? history.push('/create') : setLoginPopOn(true))
  }

  const handleLogin = () => {
    setLoginPopOn(!loginPopOn);
  }
  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search/search?${searchInput} ${locationSearch}`)
  }


  return (
    <div className="header__main">
      <div onClick={() => history.push('/')} className="brandName">
      <svg xmlns="http://www.w3.org/2000/svg" style={{"height":"50px"}} className="  text-red-700" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
   
  </svg>
 
      </div>
      <form className="placeSearch" onSubmit={handleSearch} action="">
        <button type="submit">
          <Search></Search>
        </button>
        <input value={locationSearch} placeholder="Search for categories.." onChange={e => setLocationSearch(e.target.value)}
            type="text" />
      </form>
      <div className="product__SearchContainer">
        <form className="productSearch" onSubmit={handleSearch} action="">
          <input className="productSearch__input"
           value={locationSearch} placeholder="Search for items.." onChange={e => setLocationSearch(e.target.value)}
            type="text"
           
          />
          <button type="submit" className="searchAction">
            <Search color="#ffffff"></Search>
          </button>
        </form>
      </div>
      <div className="language">
        <span> ENGLISH </span>
        <Arrow></Arrow>
      </div>
      {
        user &&
        <>
          <i className="bi bi-bell header__notification"></i>
          <i onClick={() => history.push('/chat/chatid')} className="bi bi-chat"></i>
        </>
      }
      <div className="userSection">
        {user ?
          <Menu user={user} />
          :
          <div className="userLogin__btn" onClick={handleLogin}>Login</div>
        }
      </div>
      <div className={loginPopOn ? "login__popup" : "login__popupdisabled"}>
        <Login loginPopOn={loginPopOn} setLoginPopOn={setLoginPopOn} />
      </div>
      <div className="header__sellBtn" >
        <SellButton ></SellButton>
        <div className="sellMenuContent" onClick={handleSellClick}>
          <SellButtonPlus></SellButtonPlus>
          <span>SELL</span>
        </div>
      </div>
    </div>
  );
}

export default Header;