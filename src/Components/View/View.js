import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import './View.css';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import {FacebookShareButton,WhatsappShareButton,WhatsappIcon,FacebookIcon} from "react-share";
import Map from './Map';
import { StarOutlineSharp } from '@mui/icons-material';


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
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])


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
    //fetching product Details
    db.collection("comments").where("product", "==", `${productId}`).onSnapshot(res => {
      setComments(res.docs.map(doc => doc.data()))
    })
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
          item:data.title,
          itemId:productId
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

  const favClick = () => {
    if (location.pathname === '/myfavorites') {
      db.collection('users').doc(`${user.uid}`).collection('favorites').doc(`${productId}`).delete()
    } else {

      db.collection('users').doc(`${user.uid}`).collection('favorites').doc(`${productId}`).set({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        subCategory: data.subCategory,
        url: data.url,
        userId: user.uid,
        date: data.date,
      });
    }
    alert("saved")
  }
  console.log(comments)
 const post = ()=>{
  db.collection('comments').add({
    product:productId,
    stars:stars,
    comment:comment,
    user:userDetails.username
})
  setStars(0)
  setComment("")
 }

  return (
     <>
     <div className='product-new'>

      <div style={{display:"flex",flexDirection:"column"}}>
      <span>{data.category + ' / ' + data.subCategory}</span>
        <div style={{maxHeight:"450px",margin:"auto"}}>
        <img style={{borderRadius:"10px",maxWidth:"100%",maxHeight:"100%",objectFit: "contain"}} src={images} alt=""/>

        </div>
       
        <div style={{borderRadius:"10px",margin:"auto",border:"solid",borderColor:"gray",borderWidth:"1px",marginTop:"5px",padding:"5px"}}>
        {
            data?.images?.length > 0?(<>
            {data?.images.map((e)=>(
              <div onClick={()=>{setImages(e)}} className='' style={{display:"flex",cursor:"pointer"}}>
               <div style={{display:"flex",marginTop:"10px"}}>
              <img  style={{borderRadius:"10px"}} src={e} alt="" height={50} width={60} />
              </div>
              </div>
            ))}
            </>):(<></>)
          }
             
        </div>

        <div style={{marginTop:"10px"}} className="item__moreInfo">
          <h5>Description</h5>
          <p>{data.description}</p>
        </div>

      </div>


      <div style={{display:"flex",flexDirection:"column",marginLeft:"10px",marginTop:"23px"}}>
        <div style={{padding:"10px"}}>
          <div style={{backgroundColor:"#F47920",borderRadius:"10px",padding:"5px"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white"}}>Details</h5>
          </div>
          {(() => {
        switch (data?.category) {
          case "Cars":   return (<>
              <div style={{borderTop:"solid",borderTopColor:"white",borderTopWidth:"1px",marginTop:"1px",backgroundColor:"#27343F",padding:"5px",display:"flex"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",fontWeight:"lighter"}}>Make</h5>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",marginLeft:"auto",fontWeight:"lighter"}}>{data.make}</h5>
           </div>

           <div style={{backgroundColor:"#1C2935",padding:"5px",display:"flex"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",fontWeight:"lighter"}}>Mileage</h5>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",marginLeft:"auto",fontWeight:"lighter"}}>{data.milage}</h5>
           </div>

           <div style={{backgroundColor:"#27343F",padding:"5px",display:"flex"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",fontWeight:"lighter"}}>Model</h5>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",marginLeft:"auto",fontWeight:"lighter"}}>{data.model}</h5>
           </div>

           <div style={{backgroundColor:"#1C2935",padding:"5px",display:"flex"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",fontWeight:"lighter"}}>Year</h5>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",marginLeft:"auto",fontWeight:"lighter"}}>{data.year}</h5>
           </div>

                       </>);
        case "House":   return (<>
            <div style={{borderTop:"solid",borderTopColor:"white",borderTopWidth:"1px",marginTop:"1px",backgroundColor:"#27343F",padding:"5px",display:"flex"}}>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",fontWeight:"lighter"}}>Size</h5>
            <h5 style={{marginLeft:"5px",marginTop:"5px",fontWeight:"700",color:"white",marginLeft:"auto",fontWeight:"lighter"}}>{data.size}m²</h5>
           </div>          </>);
          
          default:      return (<>
          
             
            </>);
        }
      })()}                
          
        </div>

        <div className="item__productDescription" style={{marginTop:"10px"}}>
          <div>
            <div style={{display:"flex"}}>
            <p style={{marginTop:"10px"}} className="item__price">&#36; {data.price} </p>
           {
            user?.uid?(<>
             <div style={{marginLeft:"30px"}} className="card__favorite" onClick={favClick} >
            <i className={"bi bi-heart-fill card__heart"}></i>
    
            </div>
            </>):(<></>)
           }
           
            </div>
            {data?.traded?(<>
              <button style={{backgroundColor:"#F47920"}} className="item__chatBtn">Sold</button>
         
            </>):(<></>)}
            <span>{data.title}</span>
            <p>{data.subCategory}</p>
            <p>I want to my {data.title} for {data.exchange}</p>
          
            <span>{date}</span>
            <div style={{display:"flex",marginTop:"40px"}}>
              <h5>Share On</h5>
              <div style={{marginLeft:"10px"}}>
            <WhatsappShareButton url={`https://www.swapntop.com/item/${productId}`}>
            <WhatsappIcon size={32} round={true} /> 
            </WhatsappShareButton>
            </div>
            <div style={{marginLeft:"10px"}}>
            <FacebookShareButton url={`https://www.swapntop.com/item/${productId}`}>
            <FacebookIcon size={32} round={true} /> 
            </FacebookShareButton>
            </div>
            </div>
             </div>
          <div ref={copyRef} className="item__share">
            <i className="bi bi-share item__shareLink" onClick={handleCopy}></i>
            <div className="item__tooltipText">{copy}</div>
          </div>
        </div>

        <div className="item__sellerDescription" style={{marginTop:"10px"}}>
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
              <br/>
              <span style={{ fontSize: 14, fontWeight: 400 }}>Lives in {data.city}</span>
            
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
      </div>
     </div>

    <div className="item__container">
     
      <div className="item__parentDiv">
       
       
        
        
        <div style={{marginLeft:"10px",marginTop:"10px"}}>
          <h5>Reviews</h5>
          
            {
              comments.map((e)=>(
                <>
                {
              comments?(<div style={{border:"solid",borderColor:"gray",borderWidth:"1px",padding:"5px"}}>
               {(() => {
        switch (e.stars) {
          case "1":   return (<>
          <ul class="rating-stars list-unstyled">
                    <li>
                    <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <p>{e.user}  <b>{e.comment}</b> </p>
                       
                    </li>
                </ul>
          
          </>);
          case "2": return (<>
          <ul class="rating-stars list-unstyled">
          <li>
                    <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <p>{e.user}  <b>{e.comment}</b> </p>
                    </li>
                </ul>
          
            </>);
          case "3":  return (<>
          <ul class="rating-stars list-unstyled">
          <li>
                    <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <p>{e.user}  <b>{e.comment}</b> </p>
                    </li>
                </ul>
          
            </>);
            case "4":  return (<>
                <ul class="rating-stars list-unstyled">
                <li>
                    <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                         <svg style={{width:"20px"}} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                         <p>{e.user}  <b>{e.comment}</b> </p>
                    </li>
                      </ul>
                
                  </>);
          default:      return (<>
          
          <ul class="rating-stars list-unstyled">
          <li>
                    <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg style={{width:"25px",color:"#FFDF00"}} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p>{e.user}  <b>{e.comment}</b> </p>
                    </li>
                </ul>
            </>);
        }
      })()}
       
              </div>):(<></>)
            }

                </>
              ))
            }
            {
              userDetails?(<>
               <h5 style={{marginTop:"10px"}}>Leave a Review</h5>
           <label htmlFor="">Stars*</label>
           <br/>
          <input value={stars} onChange={(e)=>{setStars(e.target.value)}} type="number" name="" id="" />
          <br/>
          <label htmlFor="">Comment*</label>
          <br/>
          <input value={comment} onChange={(e)=>{setComment(e.target.value)}} type="text" name="" id="" />
          
                <br/> 
                <br/> 
                <button onClick={post} style={{backgroundColor:"#3B77FF",width:"170px"}} className="item__chatBtn">Comment</button>
            
              </>):(<></>)
            }
         
        </div>

       
        
          
      </div>
    </div>
    </>
  );
}
export default View;
