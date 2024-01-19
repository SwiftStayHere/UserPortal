import React, { useState } from 'react';
import { AngleDown } from './Icon';

const DropdownGroup = ({
    data,
    icon,
    position,
    label,
    iconRight,
    smText,
    labelSmHide,
    handleChange,
    name,

    value,
    zIndex,
}) => {
    const indexI = data.length
        ? data.findIndex(function (obj) {
            return obj.name === value.name;
        })
        : null;
    const [index, setIndex] = useState(indexI);
    const [open, setOpen] = useState(false);
    let activeIndex = data[index];

    if (!data.length || !activeIndex) activeIndex = { name: "All" };

    return (
        <>
            <div style={{ zIndex: zIndex || 0 }} className="__dropdown-item">
                {label && (
                    <label
                        className={`form-label ${smText ? 'no-wrap-sm' : ''} ${labelSmHide ? 'hide-none d-sm-show' : ''
                            }`}
                    >
                        {label} {smText && <small>{smText}</small>}
                    </label>
                )}
                <div className="__dropdown">
                    <button className="__dropdown-active" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
                        {!iconRight && icon && icon}
                        {activeIndex.name && <span className="me-auto">{activeIndex.name}</span>}
                        {!iconRight && (
                            <span className="pe-sm-2">
                                <AngleDown />
                            </span>
                        )}
                        {iconRight && icon && icon}
                    </button>
                    <ul
                        className={`__dropdown-menu ${open ? 'active' : ''} ${position ? `position-${position}` : ''}`}
                        style={{ padding: 0 }}
                    >
                        {data?.map(({ img, name, value }, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setIndex(i);
                                    handleChange(data[i]);

                                    setOpen(false);
                                }}
                                className={index === i ? 'active' : ''}
                            >
                                {img && <img src={img} alt="name" />}
                                {name && <span>{name}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DropdownGroup;
