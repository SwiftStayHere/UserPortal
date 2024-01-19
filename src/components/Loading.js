import React from 'react';
import Load from '../../src/assets/loading.gif';

function Loading() {
    return (
        <div
            style={{
                minWidth: '100%',
                minHeight: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img src={Load} style={{ width: '10rem' }} alt="Loading..." />
        </div>
    );
}

export default Loading;
