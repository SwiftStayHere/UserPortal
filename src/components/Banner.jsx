import React, { useEffect, useRef } from 'react';
import mask_bg from '../assets/img/banner-bg.png';
import hero_bg from '../assets/img/hero-bg.png';
import DropdownGroup from './DropdownGroup';
import { Dollar, FiveStar, Location, Stelle } from './Icon';

import icon_1 from '../assets/img/icon-1.png';
import icon_2 from '../assets/img/icon-2.png';

const Banner = ({ config, handleConfigChange, comunes, stelles, distances, fascias }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <>
            <section className="banner-section">
                <div className="container">
                    <div className="banner-wrapper">
                        <DropdownGroup
                            handleChange={(value) => {
                                handleConfigChange('comune', value);
                            }}
                            value={config?.comune || comunes[0]}
                            label="City"
                            icon={<Location />}
                            data={comunes}
                            zIndex={1000}
                        />
                        <DropdownGroup
                            handleChange={(value) => {
                                handleConfigChange('fascio', value);
                            }}
                            value={config?.fascio || fascias[0]}
                            label="Price Range"
                            icon={<Dollar />}
                            data={fascias}
                            zIndex={999}
                        />
                        <DropdownGroup
                            handleChange={(value) => {
                                handleConfigChange('stelle', value);
                            }}
                            value={config?.stelle || stelles[0]}
                            label="Rating"
                            icon={<FiveStar />}
                            data={stelles}
                            zIndex={998}
                        />
                        <DropdownGroup
                            handleChange={(value) => {
                                handleConfigChange('distance', value);
                            }}
                            value={config?.distance || distances[0]}
                            label="Distance from the sea"
                            icon={<Stelle />}
                            data={distances}
                            zIndex={997}
                        />
                    </div>
                    <img src={icon_1} alt="" className="icon-1" />
                    <img src={icon_2} alt="" className="icon-2" />
                </div>
                <div
                    className="hero_bg_2"
                    style={{
                        mask: `url(${mask_bg}) no-repeat center bottom / cover`,
                        WebkitMask: `url(${mask_bg}) no-repeat center bottom / cover`,
                    }}
                />
                <div
                    className="hero_bg"
                    style={{
                        background: `url(${hero_bg}) no-repeat center center / cover`,
                    }}
                />
            </section>
            <div ref={scrollRef}></div>
        </>
    );
};

export default Banner;
