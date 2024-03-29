import "./CreatePost.css";
import db, { firebasestorage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from '../../store/Context';
import LocationAutocomplete from "../LocationAutocomplete/LocationAutocomplete";
import { useEffect } from "react";
import ReactMapGL from "react-map-gl";
import React from "react"

const CreatePost = ({ category, subCategory, setSubCategory, }) => {
    //Context
    const { user } = useContext(AuthContext);
    //useState
    const [image, setImage] = useState();
    const [image2, setImage2] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACBCAMAAABq3aECAAAAPFBMVEX///+hoaH6+vrz8/OVlZXPz8+oqKjLy8ubm5vj4+O3t7eenp6xsbGYmJilpaXu7u7V1dW/v7/FxcXc3NwVeLpjAAABrElEQVR4nO3Z23KDIBRA0YCRgIiY5P//td5qjTItZjI9POz11Kals4c5QWMvFwAAAAAAAAAAAAAA/omu3qCFYs31DSHKxCplTlPeycR24fyaxorFnh9AYnPMsfp5f+S/aWRjdRusDY/cNbKxN6sGITdBNLYyfoz198w1srGdmmKbzDWisbqddtbmDq3szD79UOt94hDru8R2Cx9dvQmhSZxdvVX2WCt9UdDJW6lqPCVsvX9ZOjZpmeXDPVaRsQ87nxKmen29xFh3VbP92BYYG436ZvuXnxQYOw/szL+MbSGx0a3f1UFtYs12TRmxLlzb5c3k1Au7vW8oIjZ2Xvl2/lr5Xe1mbIuInaY0TNeAZtc6TMLP+VVC7G05VoeS2u5bhy1ff7GAWLdspleXGA6t25sy+Vi9Tqlv2sMQTLXPYmI3U+qTrUp1VSGxiSlNjG0ZsTGjdb1bFI6t0lN63FtXQOw9a2PHk0KLx/aZrcvHddHYuL+2/mIcW9HYtjvxcLaLkrHD9eAcwVh/O81IPfn2Npz/l0L2I7wPc/Ub+r//LgAAAAAAAAAAAAAAn/EF+jsXk2r5g4wAAAAASUVORK5CYII=");
    const [image3, setImage3] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACBCAMAAABq3aECAAAAPFBMVEX///+hoaH6+vrz8/OVlZXPz8+oqKjLy8ubm5vj4+O3t7eenp6xsbGYmJilpaXu7u7V1dW/v7/FxcXc3NwVeLpjAAABrElEQVR4nO3Z23KDIBRA0YCRgIiY5P//td5qjTItZjI9POz11Kals4c5QWMvFwAAAAAAAAAAAAAA/omu3qCFYs31DSHKxCplTlPeycR24fyaxorFnh9AYnPMsfp5f+S/aWRjdRusDY/cNbKxN6sGITdBNLYyfoz198w1srGdmmKbzDWisbqddtbmDq3szD79UOt94hDru8R2Cx9dvQmhSZxdvVX2WCt9UdDJW6lqPCVsvX9ZOjZpmeXDPVaRsQ87nxKmen29xFh3VbP92BYYG436ZvuXnxQYOw/szL+MbSGx0a3f1UFtYs12TRmxLlzb5c3k1Au7vW8oIjZ2Xvl2/lr5Xe1mbIuInaY0TNeAZtc6TMLP+VVC7G05VoeS2u5bhy1ff7GAWLdspleXGA6t25sy+Vi9Tqlv2sMQTLXPYmI3U+qTrUp1VSGxiSlNjG0ZsTGjdb1bFI6t0lN63FtXQOw9a2PHk0KLx/aZrcvHddHYuL+2/mIcW9HYtjvxcLaLkrHD9eAcwVh/O81IPfn2Npz/l0L2I7wPc/Ub+r//LgAAAAAAAAAAAAAAn/EF+jsXk2r5g4wAAAAASUVORK5CYII=");
    const [userDetails, setUserDetails] = useState([]);
    const [exchange, setExchange] = useState("");

    const[lat,setLat]=useState("")
  const[long,setLong]=useState("")
  const[city,setCity]=useState("")
  
  const[milage,setMilage]=useState("")
  const[make,setMake]=useState("")
  const[model,setModel]=useState("")
  const[year,setYear]=useState("")
  const[size,setSize]=useState("")

  const[load,setLoad]=useState(false)

    //useRefs
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const exchangeRef = useRef(null)

    //useHistory
    const history = useHistory();
    useEffect(() => {
        db.collection('users').doc(`${user.uid}`).get().then(res => {
            setUserDetails(res.data())
        })
    }, [user])          

//map state 
 const [viewport, setViewport] = React.useState({
  latitude:  -17.824858,
  longitude: 31.053028,
  zoom: 12,
  width:400,
  height:250
});


const map=(evt)=>{
 alert("location saved")
  setLat(evt.lngLat[1]);
  setLong(evt.lngLat[0]);
}

const upload = (e)=>{
     setLoad(true)
    firebasestorage.ref(`/image/${uuidv4()}-${e.target.files[0]?.name}`).put(e.target.files[0]).then(({ ref }) => {
        ref.getDownloadURL().then((url) => {
            setImage2(url)
            setLoad(false)
        })
    })
    
}

const upload2 = (e)=>{
    setLoad(true)
    firebasestorage.ref(`/image/${uuidv4()}-${e.target.files[0]?.name}`).put(e.target.files[0]).then(({ ref }) => {
        ref.getDownloadURL().then((url) => {
            setImage3(url)
            setLoad(false)
        })
    })
   
}

    //functions
    const handleSubmit = () => {
        if(category == "Cars"){
            firebasestorage.ref(`/image/${uuidv4()}-${image?.name}`).put(image).then(({ ref }) => {
                ref.getDownloadURL().then((url) => {
                    db.collection('products').add({
                        title: titleRef?.current.value,
                        description: descriptionRef?.current.value,
                        exchange:exchange,
                        price: priceRef?.current.value,
                        lat: lat,
                        long: long,
                        city: city,
                        category,
                        subCategory,
                        url,
                        userId: user.uid,
                        date: new Date(),
                        phone:userDetails.phone,
                        username: userDetails.username,
                        images:[url,image2,image3],
                        milage,
                        make,
                        model,
                        year
                       
                    });
                    alert('Ad Posted Successfully')
                    history.push('/')
                })
            })
        }else if(category == "House"){
            firebasestorage.ref(`/image/${uuidv4()}-${image?.name}`).put(image).then(({ ref }) => {
                ref.getDownloadURL().then((url) => {
                    db.collection('products').add({
                        title: titleRef?.current.value,
                        description: descriptionRef?.current.value,
                        exchange:exchange,
                        price: priceRef?.current.value,
                        lat: lat,
                        long: long,
                        city: city,
                        category,
                        subCategory,
                        url,
                        userId: user.uid,
                        date: new Date(),
                        phone:userDetails.phone,
                        username: userDetails.username,
                        images:[url,image2,image3],
                        size:size
                       
                    });
                    alert('Ad Posted Successfully')
                    history.push('/')
                })
            })

        }else{
        firebasestorage.ref(`/image/${uuidv4()}-${image?.name}`).put(image).then(({ ref }) => {
            ref.getDownloadURL().then((url) => {
                db.collection('products').add({
                    title: titleRef?.current.value,
                    description: descriptionRef?.current.value,
                    exchange:exchange,
                    price: priceRef?.current.value,
                    lat: lat,
                    long: long,
                    city: city,
                    category,
                    subCategory,
                    url,
                    userId: user.uid,
                    date: new Date(),
                    phone:userDetails.phone,
                    username: userDetails.username,
                    images:[url,image2,image3],
                    
                   
                });
                alert('Ad Posted Successfully')
                history.push('/')
            })
        })
    }
    }
    console.log(category)
    
    return (
        <div className="post__container">
            <h6>SELECTED CATEGORY</h6>
            <div className="post__changeCategory">
                <span>{category + ' / ' + subCategory}</span>
                <span onClick={() => setSubCategory(null)}>Change</span>
            </div>
            <div className="post__details">
                <h5>INCLUDE SOME DETAILS</h5>
                <label htmlFor="">Ad Title*</label>
                <input ref={titleRef} type="text" name="" id="" />
                <br/>
                <label htmlFor="">What do you want to trade in exchange for your item*</label>
                <select onChange={(e)=>{setExchange(e.target.value)}} id="cars">
                <option value="---">----------</option>
                <option value="swap">Straight Swap</option>
                <option value="cash">Cash Only</option>
                <option value="swapntop">Swap And Top</option>
                <option value="offer">Make Me An Offer</option>
                </select>
                <br/>
                <label >Description*</label>
                <textarea ref={descriptionRef} name="" id="" cols="20" rows="3"></textarea>
            </div>
            <div className="post__price">
                <h5>SET A PRICE</h5>
                <label>Price*</label>
                <input ref={priceRef} type="number" name="" id="" />
            </div>
            <div className="post__price">
            {(() => {
        switch (category) {
          case "Cars":   return (<>
           <h5>Car Properties</h5>
          <label htmlFor="">Milage*</label>
          <input value={milage} onChange={(e)=>{setMilage(e.target.value)}} type="text" name="" id="" />
           
                <br/>  
                <label htmlFor="">Make*</label>
          <input value={make} onChange={(e)=>{setMake(e.target.value)}} type="text" name="" id="" />
           <br/>
           <label htmlFor="">Model*</label>
          <input value={model} onChange={(e)=>{setModel(e.target.value)}} type="text" name="" id="" />
          <br/>
           <label htmlFor="">Year*</label>
          <input value={year} onChange={(e)=>{setYear(e.target.value)}} type="text" name="" id="" />
           
                           </>);
        case "House":   return (<>
        <h5>House Properties</h5>
           <label htmlFor="">Size in m²*</label>
          <input value={size} onChange={(e)=>{setSize(e.target.value)}} type="text" name="" id="" />
           
                <br/>               </>);
         
          default:      return (<>
          
             
            </>);
        }
      })()}                
       </div>
            <div className="post__photo">
                <h5>UPLOAD PHOTO</h5>
                <img width="200px" max-height="400px" src={image && URL.createObjectURL(image)} alt="" />
                <div class="custom-file">
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} class="custom-file-input" id="inputGroupFile02" />
                    <label className="custom-file-label" htmlfor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">Choose file</label>
                </div>
                <br/>            
                <img width="200px" max-height="400px" src={image2} alt="" />
               
                <div class="custom-file">
                    <input type="file" onChange={(e) => upload(e)} class="custom-file-input" id="inputGroupFile02" />
                    <label className="custom-file-label" htmlfor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">Choose file</label>
                    {load?(<>loading...</>):(<></>)}

                </div>
               <br/>
                <img width="200px" max-height="400px" src={image3} alt="" />
               
                <div class="custom-file">
                    <input type="file" onChange={(e) => upload2(e)} class="custom-file-input" id="inputGroupFile02" />
                    <label className="custom-file-label" htmlfor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">Choose file</label>
                </div>
            </div>
         <div className="post__location">
             
                <h5>CONFIRM YOUR LOCATION</h5>
                 
                <div>
                     {/* 
                <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={"pk.eyJ1IjoiZG91Z2xhc21hcmluZ2EiLCJhIjoiY2twYzZid2kzMWF1eDJ1cDc1dmo0NmswdCJ9.AWID9iqWzNnDlKJI-vH90Q"}
     
      onViewportChange={(viewport) => setViewport(viewport)}
      onClick={map}
      
      >
      </ReactMapGL>
      */} 
      <div className="post__price">
               
                <label>City</label>
                <input value={city} onChange={(e)=>{setCity(e.target.value)}} type="text" name="" id="" />
           
               
                </div>
                </div>
            </div>
            <div className="post__userDetails">
                <h5>REVIEW YOUR DETAILS</h5>
                <div>
                    <img className="post__userPhoto" src="data:image/png;base64,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" alt="img" />
                    <div>
                        <div>
                            <span>Name : </span>
                            <span>{userDetails.username}</span>
                        </div>
                        <div>
                            <span>Phone No:{userDetails?.phone}</span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="post__button">
                <button onClick={handleSubmit}>Post now</button>
            </div>
        </div>
    );
}

export default CreatePost;
