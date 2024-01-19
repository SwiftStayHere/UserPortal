import React, { useEffect } from 'react';
import Modal from '@mui/material/Modal';

function Popup({ children, handleClose, modalOpen }) {
    useEffect(() => {
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';
        return () => {
            body.style.overflow = 'initial';
        };
    }, []);
    return (
        <Modal open={modalOpen} onClose={handleClose}>
            <div className="w-[100vw] relative z-50">
                <div className="absolute top-[15rem] left-[35%]">{children}</div>
            </div>
        </Modal>
    );
}

export default Popup;
