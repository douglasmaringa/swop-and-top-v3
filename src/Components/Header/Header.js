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
import db from "../../firebase";



function Header() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [loginPopOn, setLoginPopOn] = useState(false);
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const[notifications,setNotifications]=useState(false)
  const[showModal,setShowModal]=useState([])

  useEffect(() => {
    if (location?.state?.from === 'create') {
      setLoginPopOn(true)
    }

   
  }, [location?.state?.from])

  useEffect(() => {
    if(user){
    db.collection('notifications').where("newMsgFrom","==",user?.uid).onSnapshot(snapshot => {
      const allMessages = snapshot.docs.map((message) => {
          return {
              ...message.data(),
              id: message.id,
             }
      })
      allMessages.map((e)=>{
        if(e.newMsg == true){
          setNotifications(allMessages)
        }
      })
     
  })
    return () => {

    }
  }
}, [ user])

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

  const toggleModal = ()=>{
    setShowModal(!showModal)
  }
  const seen = (id)=>{
    
    db.collection('notifications').doc(`${id}`).delete()
    .then(
      alert("seen")
  )
  //history.push("/")
  }
  console.log(user?.uid)

  return (
    <div className="header__main">
      <div onClick={() => history.push('/')} className="brandName">
     <img src="https://scontent.fhre2-2.fna.fbcdn.net/v/t39.30808-6/291863878_101470922632947_2557934023201945639_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=rl0fNBfCIyUAX9pk5bb&_nc_ht=scontent.fhre2-2.fna&oh=00_AT9KgWt_nN7nleytSNNXnfJoAVcucEXgjeBAP8FEIXJfdw&oe=62D19108" width={40} alt="" />
 Home
      </div>
      <form className="placeSearch" onSubmit={handleSearch} action="">
       
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
        {
          user?(<>
          <div onClick={() => history.push('/myads')} className="menu__section">
                <i className="bi bi-files"></i>
                <h5>My Ads</h5>
              </div>
          </>):(<></>)
        }
      
       
      </div>
      {
        user &&
        <>

           
{
            notifications?(<>
              <i onClick={toggleModal} style={{color:"red"}} className="bi bi-bell header__notification"></i>
                                       
                                        {
                                           showModal?(<><div class="modal-footer-small">
                                           <div class="ui-modal-body">
                                           <button style={{width:"50px",marginLeft:"auto"}} onClick={()=>{toggleModal()}}>close</button>
                                              <h1>Notifications</h1>
                                               {
                                                notifications?.map((e)=>(
                                                  <>
                                                   <h5>New Message From {e.newMsgFrom}</h5><button onClick={()=>{seen(e.id)}} style={{borderRadius:"100%",padding:"10px"}}>Seen</button>
                                                  </>
                                                ))
                                               }
                                           </div>
                                         </div></>):(<></>)
                                        }
            </>):(<>
              <i className="bi bi-bell header__notification"></i>
        
            </>)
          }
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