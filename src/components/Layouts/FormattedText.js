import React from 'react';

const FormattedText = ({ text }) => {
    return (
        <div className='border-[0.05px] border-blue-950 border-l-8 rounded-lg p-4'>
            {text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
        </div>
    );
};

export default FormattedText;
