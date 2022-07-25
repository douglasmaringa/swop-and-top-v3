import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import './View.css';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import ReactWhatsapp from 'react-whatsapp';
import Map from './Map';


function View() {
  const [data, setData] = useState({})
  const [images, setImages] = useState("")
  const { productId } = useParams();
  const location = useLocation();
  const [sellerDetails, setSellerDetails] = useState({});
  const [copy, setCopy] = useState('Copy');
  const copyRef = useRef(null);
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userChats, setUserChats] = useState([]);
  const [docId, setDocId] = useState([]);
  const [userDetails, setUserDetails] = useState([])
  const [date, setDate] = useState('');


  useEffect(() => {
    //fetching product Details
    db.collection('products').doc(`${productId}`).get()
      .then(snapshot => {
        setData(snapshot.data());
        setImages(snapshot.data().url);
        setDate(snapshot.data().date.toDate().toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, day: 'numeric', month: 'numeric', year: 'numeric' }))
      });
  }, [productId])
  useEffect(() => {
    //fetching seller details
    db.collection('users').where('id', '==', `${data.userId}`).get().then(res => {
      res.forEach(doc => {
        setSellerDetails(doc.data());
      })
    })
    //fetching user details
    db.collection('users').doc(`${user?.uid}`).get().then(res => {
      setUserDetails(res.data());
    })

    return () => {

    }
  }, [data, user]);
  useEffect(() => {
    let handler = (event) => {

      (!copyRef.current.contains(event.target)) &&
        setCopy('Copy')

    }
    document.addEventListener("mouseout", handler);
    return () => {
      document.removeEventListener("mouseout", handler)
    }
  })
  const handleCopy = () => {
    navigator.clipboard.writeText(location.pathname).then(
      setCopy('Copied!!!')
    )
  }


  useEffect(() => {
    if (user) {
      db.collection("chat").where("users", "array-contains", `${user.uid}`).onSnapshot(res => {
        setUserChats(res.docs.map(doc => doc.id))
      })
    }

    return () => {

    }
  }, [user])
  useEffect(() => {
    if (user) {
      db.collection("chat").where("users", "array-contains", `${sellerDetails.id}`).onSnapshot(res => {
        setDocId(userChats.filter(value => res.docs.map(doc => doc.id).includes(value)))
      })
    }

    return () => {

    }
  }, [user, sellerDetails, userChats])


  const handleChatClick = () => {
    if (user) {
      const chatId = uuidv4();
      if (docId.length === 0) {
        db.collection('chat').doc(`${chatId}`).set({
          users: [`${user.uid}`, `${sellerDetails.id}`],
          user1: `${userDetails.username}`,
          user2: `${sellerDetails.username}`,
          item:data.title
        }).then(history.push(`/chat/${chatId}`))
      } else {
        history.push(`/chat/${docId[0]}`)
      }
    } else {
      alert('please login')
    }
  }
 
  const next = (img)=>{
    if(data.images.length>1){
    setImages(img)
    }
  }
  console.log(images)

  return (

    <div className="item__container">
      <span>{data.category + ' / ' + data.subCategory}</span>
      <div className="item__parentDiv">
        <div className="item__img" style={{"display":"grid","gridTemplateColumns":"1fr 100px"}}>
          <div>
          <img
            src={images}
            alt="error loading"
            width="100%"
            height="75%"
          />
          </div>
          <div>
          {
            data?.images?.length > 0?(<>
            {data?.images.map((e)=>(
              <div onClick={()=>{setImages(e)}} className='img-selector' style={{marginLeft:"10px",cursor:"pointer"}}>
              <img
            src={e}
            width={100}
            height={100}
            alt="error loading"
          />
              </div>
            ))}
            </>):(<></>)
          }
          </div>
           </div>
       
        <div className="item__productDescription">
          <div>
            <p className="item__price">&#36; {data.price} </p>
            <span>{data.title}</span>
            <p>{data.subCategory}</p>
            <p>I want to my {data.title} trade for</p>
            <p>{data.exchange}</p>
            <span>{date}</span>
          </div>
          <div ref={copyRef} className="item__share">
            <i className="bi bi-share item__shareLink" onClick={handleCopy}></i>
            <div className="item__tooltipText">{copy}</div>
          </div>
        </div>
        
        <div className="item__moreInfo">
          <h5>Description</h5>
          <p>{data.description}</p>
          
        </div>
       
        <div className="item__sellerDescription">
          <p>Seller description</p>
          <div className="item__sellerImageName">
            <img src={sellerDetails.photourl} alt="img" />
            <p>
              {
                (user?.uid === sellerDetails.id) ?
                  <p onClick={() => history.push('/myProfile')} style={{ margin: 0 }} id="Link" >{sellerDetails.username}</p>
                  :
                  <p onClick={() => history.push(`/profile/${sellerDetails.id}`)} id="Link" style={{ margin: 0 }} >{sellerDetails.username}</p>
              }
              <span style={{ fontSize: 14, fontWeight: 400 }}>Member since {sellerDetails?.createdAt?.toDate().toLocaleString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </p>
            <i className="bi bi-chevron-right"></i>
          </div>
          
          {
            (user?.uid === sellerDetails.id) ?
              <button onClick={handleChatClick} disabled className="item__chatBtn">Ask questions your self</button>
              :
              <button onClick={handleChatClick} className="item__chatBtn">Chat to Buyer</button>
          }
         
          
        
        </div>
        <div className="item__location">
          <p>Posted in {data?.city}</p>
          
         
          {
            data?.lat?(<>
             <Map lat={JSON.parse(data?.lat)} long={JSON.parse(data?.long)}/>
             
            </>):(<></>)

        }
         
          </div>
      </div>
    </div>

  );
}
export default View;
