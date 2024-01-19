import React from 'react';
import loading from '../../assets/img/loading.gif';

function Loading() {
    return (
        <div className="flex w-screen h-[100vh] items-center justify-center">
            <img src={loading} alt="loading gif" />
        </div>
    );
}

export default Loading;
