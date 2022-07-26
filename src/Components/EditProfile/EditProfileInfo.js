import { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import db from '../../firebase';
import { AuthContext } from '../../store/Context';
import './EditProfileInfo.css'

const EditProfileInfo = () => {
    const { user } = useContext(AuthContext);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('hari');
    const [phone, setPhone] = useState('');
    const [about, setAbout] = useState()
    const [work, setWork] = useState('');
    const [study, setStudy] = useState('')

    useEffect(() => {
        db.collection("users").doc(`${user?.uid}`).onSnapshot(snapshot => {
            setUserName(snapshot?.data()?.username)
            setPhone(snapshot?.data()?.phone)
            setAbout(snapshot?.data()?.about)
            setWork(snapshot?.data()?.work)
            setStudy(snapshot?.data()?.study)
        })
        return () => {

        }
    }, [user])



    const handleSubmitEdit = () => {
        db.collection('users').doc(`${user.uid}`).update({
            username:userName,
            phone:phone,
            about:about,
            work:work,
            study:study
        }).then(
            openModal()
        )
    }
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div className="edit__profileInfo">
            <h5>Edit profile</h5>
            <div className="editProfile__basicInfo">
                <h6>Basic Information</h6>
                <input onChange={(e) => setUserName(e.target.value)} type="text" value={userName} />
                <textarea onChange={(e) => setAbout(e.target.value)} placeholder="About me (optional)" value={about} cols="0" rows="3"></textarea>
            </div>
            <div className="editProfile__contactInfo">
                <h6>History Information</h6>
                <input onChange={(e) => setWork(e.target.value)} type="text" value={work} placeholder="Work do you Work" />
                <input onChange={(e) => setStudy(e.target.value)} type="text" value={study} placeholder="Where did you go to School"/>
                
            </div>
            <div className="editProfile__contactInfo">
                <h6>Phone Number</h6>
                <input onChange={(e) => setPhone(e.target.value)} type="number" value={phone} />
                <span>{user?.email}</span>
            </div>
            <div className="editProfile__btn">
                <button onClick={handleSubmitEdit}>Save changes</button>
            </div>
            <ReactModal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            className="editProfile__successModel"
            overlayClassName="Overlay"
            contentLabel="Example Modal"
            ariaHideApp={false}
            >
                <div className="editProfile__success">
                    <h3>Profile updated!!!</h3>
                    <p onClick={closeModal}>OK</p>   
                </div>
            </ReactModal>
        </div>
    );
}

export default EditProfileInfo;