import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import './AllChat.css'

const AllChat = () => {
  const [userChats, setUserChats] = useState([])
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    db.collection('users').doc(`${user?.uid}`).get().then(res => {
      setUserDetails(res.data())
    })
    return () => {

    }
  }, [user])

  useEffect(() => {
    if (user) {
      db.collection("chat").where("users", "array-contains", `${user.uid}`).onSnapshot(res => {
       
        const allChats = res.docs.map((usr) => {
          return {
            user1: usr.data().user1,
            user2: usr.data().user2,
            id: usr.id,
          }
        })
        setUserChats(allChats);
      })
    }

    return () => {

    }
  }, [user])

  
  return (
    <div className="allChat">
      {
        userChats.map(userChat => {
          return (
            <div className="allChat__container" onClick={() => history.push(`/chat/${userChat.id}`)} key={userChat.id}>
               {((userChat.user1 === userDetails.username) || (userChat.user1 === user.displayName)) ? <div style={{display:"flex"}}>
                <h5 style={{paddingLeft:"5px",paddingRight:"5px",color:"white",borderRadius:"100%",backgroundColor:"#3B77FF"}}>{userChat.user2.split("")[0]}</h5>
                <h5 style={{marginLeft:"5px"}} className="allChat__text">{userChat.user2}</h5>
               </div> :<div style={{display:"flex"}}>
               <h5 style={{paddingLeft:"5px",paddingRight:"5px",color:"white",borderRadius:"100%",backgroundColor:"#3B77FF"}}>{userChat.user2.split("")[0]}</h5>
                <h5 style={{marginLeft:"5px"}} className="allChat__text">{userChat.user1}</h5>
               </div> }
   
            </div>
          )
        })
      }
    </div>
  );
}

export default AllChat;