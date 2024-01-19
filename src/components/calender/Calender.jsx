import moment from 'moment';
import 'moment/locale/it';
import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import CalenderItem from './CalenderItem';

export default function Calender({ handler, setCheckData, setConfig, config }) {
    useEffect(() => {
        // Set Italian as the default locale
        moment.locale('it');
    }, []);

    const [firstMon, setFirstMon] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });
    const [lasttMon, setLastMon] = useState({
        year: new Date().getFullYear(),
        month: firstMon.month + 1,
    });

    const [firstSelection, setFirstSelection] = useState(true);

    const [selectDate, setSelectDate] = useState([config.checkInDate, config.checkOutDate]);

    const selectHandler = (e) => {
        setSelectDate((prev) => {
            if (firstSelection) {
                setFirstSelection(false);
                return [e];
            }
            if (prev.length === 0) {
                return [e];
            } else if (prev.length === 1) {
                if (prev[0] !== e) {
                    if (prev[0] < e) {
                        return [...prev, e];
                    } else {
                        return [e, ...prev];
                    }
                } else {
                    return [...prev];
                }
            } else if (prev.length === 2) {
                if (prev[1] > e) {
                    return [e];
                } else {
                    prev.pop();
                    if (prev[0] < e) {
                        return [...prev, e];
                    } else {
                        return [e, ...prev];
                    }
                }
            }
        });
    };

    const firstArrow = () => {
        setFirstMon((prev) => {
            return { ...prev, month: prev.month - 1 };
        });
        setLastMon((prev) => {
            return { ...prev, month: prev.month - 1 };
        });
    };
    const lastArrow = () => {
        setFirstMon((prev) => {
            return { ...prev, month: prev.month + 1 };
        });
        setLastMon((prev) => {
            return { ...prev, month: prev.month + 1 };
        });
    };

    const submitHandler = () => {
        const data = {
            start: new Date(selectDate[0]),
            end: new Date(selectDate[1]),
        };
        if (selectDate.length === 2) {
            setCheckData(data);
            setConfig({
                ...config,
                checkInDate: data.start,
                checkOutDate: data.end,
                fascio: { name: 'Tutti', value: 0 },
                distance: { name: 'Tutti', value: 0 },
                comune: { name: "Tutta l'isola" },
                stelle: { name: 'Tutti' },
            });
            handler(false);
        }
    };

    const [night, setNight] = useState();
    useEffect(() => {
        setNight(
            Math.ceil((new Date(selectDate[1]).getTime() - new Date(selectDate[0]).getTime()) / (1000 * 60 * 60 * 24))
        );
    }, [selectDate]);

    const [screenW, setScreenW] = useState(window.innerWidth);
    useEffect(() => {
        setScreenW(window.innerWidth);
    }, [screenW]);

    return (
        <div className="calender-wrp">
            <div className="calender">
                <div className="calender-head">
                    <div className="btn">
                        {selectDate?.length === 2 && (
                            <a href="#">{(night && night === 1 && night + ' notte') || night + ' notti'}</a>
                        )}
                    </div>

                    <strong>
                        Date Selezionate:{' '}
                        {selectDate?.length === 2 &&
                            `${moment(selectDate[0]).format('DD MMMM')} to ${moment(selectDate[1]).format('DD MMMM')}`}
                    </strong>
                </div>
                <div className="calender-body">
                    <div className="arrow-btns">
                        <button onClick={firstArrow}>
                            <BsArrowLeft />
                        </button>
                        <button onClick={lastArrow}>
                            <BsArrowRight />
                        </button>
                    </div>
                    <CalenderItem data={firstMon} select={{ selectDate, handler: selectHandler }} />
                    {screenW > 600 && <CalenderItem data={lasttMon} select={{ selectDate, handler: selectHandler }} />}
                </div>
                <div className="calender-footer">
                    <div className="calender-footer-color">
                        <div>
                            <span className="cheap"></span> <p>€</p>
                        </div>
                        <div>
                            <span className="medium"></span> <p>€€</p>
                        </div>
                        <div>
                            <span className="expensive"></span> <p>€€€</p>
                        </div>
                    </div>
                    <div className="calender-footer-btns">
                        <button
                            className="cancel"
                            onClick={() => {
                                handler(false);
                            }}
                        >
                            Annulla
                        </button>
                        <button onClick={submitHandler} className="success">
                            Cerca le offerte!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
