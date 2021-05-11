import React from 'react';
import './Modal.scss';

function Modal(props) {
    console.log(props);
    const findByKey = (name)=>
        props.children.map(child=>{
            if(child.key === name) return child
            return null
        });
    const closeModal=(e)=>{
        e.stopPropagation();
        if (e.target.classList.contains('modal-close')){
            return props.click()
        }
    }
    
    console.log(findByKey('header'))
    return (
        <div className="modal-mask modal-close" onClick={closeModal}>
            <div className="modal-wrapper">
                <div className="modal-container">
                    <div className="modal-header">
                        {findByKey("header")}
                    </div>

                    <div className="modal-body">
                        {findByKey('body')}
                    </div>

                    <div className="modal-footer">
                        <button onClick={closeModal} className="modal-close">Close</button>
                        {findByKey('footer')}
                    </div>

                    
                </div>
            </div>
        </div>
    )
}

export default Modal
