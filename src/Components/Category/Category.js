import Arrow from "../../assets/Arrow";
import './Category.css'
import Modal from 'react-modal';
import { useEffect, useState } from "react";
import db from "../../firebase";
import { useHistory } from "react-router";

const Category = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState([]);
    const [categoryItem, setCategoryItem] = useState('');
    const [subCategoryItem, setSubCategoryItem] = useState('');
    const history = useHistory();
    useEffect(() => {
        db.collection('categories').onSnapshot(snapshot => {
            snapshot.docs.map(category => setCategory(category.data()))
           
        })
    }, [])
    console.log(category)
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

   // console.log(category)
    return (
        <div className="category__menu">
            <div className="category__title">
                <div className="category__titleContents" onClick={openModal}>
                    <span>ALL CATEGORIES</span>
                    <div className={modalIsOpen ? 'category__arrow' : 'category__arrowDown'}>
                        <Arrow></Arrow>
                    </div>
                </div>
                <div className="category__quickOptions">
                <span style={{cursor:"pointer"}} onClick={() => history.push(`/search/search?laptops`)}>Laptops</span>
                    <span style={{cursor:"pointer"}} onClick={() => history.push(`/search/search?phones`)}>Phones</span>
                    <span style={{cursor:"pointer"}} onClick={() => history.push(`/search/search?house`)}>Properties</span>
                    <span style={{cursor:"pointer"}} onClick={() => history.push(`/search/search?cars`)}>Cars</span>
                    <span style={{cursor:"pointer"}} >Customer Service</span>
                    <span style={{cursor:"pointer"}} > Todays deals
</span>
                
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                className="Modal"
                overlayClassName="Overlay"
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <i onClick={() => setIsOpen(false)} className="bi bi-x-circle"></i>
                <div className="category__list">
                    {
                        Object.keys(category).map((item, key) => {
                            return (
                                <div className={`category__listGroup ${item}`} key={key}>
                                    <h6 onClick={() => setCategoryItem(item)} className="category__listTitle">{item}</h6>
                                    {category.[`${item}`].map((res, k) => {
                                        return (
                                            <h6 className="category__listContent" onClick={() => history.push(`/search/search?${res}`)} key={k}>{res}</h6>
                                        )
                                    })}
                                </div>
                            )
                        })
                    }
                </div>
            </Modal>
        </div>
    );
}
export default Category;
