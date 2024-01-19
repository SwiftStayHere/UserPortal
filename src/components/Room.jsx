import React, { useEffect, useState } from 'react';
import Input from './Input';

function Room({ roomData, id, removeRoom, handleUpdateRoom }) {
    const [options, setOptions] = useState({});

    useEffect(() => {
        setOptions({
            adults: Array.from({ length: 4 - roomData.child }, (_, index) => ({
                val: index + 1,
                text: index + 1,
            })),
            chilren: Array.from({ length: 4 - roomData.adult + 1 }, (_, index) => ({ val: index, text: index })),
            childAge: Array.from({ length: 17 }, (_, index) => ({ val: index + 1, text: index + 1 })),
        });
    }, [roomData]);

    const handleAgeChange = (i, value) => {
        const changedAges = roomData.childAge.map((age, index) => {
            if (index === i) return value;
            else return age;
        });
        // setRoomData(() => ({ ...roomData, ages: changedAges }));
        handleUpdateRoom({ ...roomData, childAge: changedAges,childDis : Array.from({ length: changedAges.length }, () => "€ 0") }, id);
    };

    const handleChange = (e) => {
        // setRoomData({ ...roomData, [e.target.name]: e.target.value });
        console.log(e.target.value)
        handleUpdateRoom({ ...roomData, [e.target.name]: e.target.value ,adultPrice : Array.from({ length: e.target.value }, () => 0)}, id);
    };

    const handleNoofChildren = (value) => {
        const dataDiff = value - roomData.child;
        let childAge = roomData.childAge;
        if (dataDiff <= 0) childAge = childAge.slice(0, value);
        else {
            childAge = childAge.concat(Array(dataDiff).fill(12));
        }

        handleUpdateRoom({ ...roomData, childAge,childDis : Array.from({ length: value }, () => "€ 0")
        , child: value }, id);
    };
    return (
        <div>
            <h5 className="text-base mt-4 r-title" style={{display: "flex", justifyContent: "space-between", width: "48%"}}>
                <p>{`Number of persons (Room ${id + 1})`}{' '}</p>
                {id > 0 && (
                    <button
                        className="border-0 outline-0 bg-transparent text-danger d-none d-sm-inline-block"
                        onClick={() => removeRoom(id)}
                    >
                        Remove Room {id + 1}
                    </button>
                )}
            </h5>
            <div className="row g-3">
                <div className="col-sm-6 col-md-3 col-lg-2" style={{marginLeft : -10}}>
                    <Input
                        name="adult"
                        select
                        handleChange={handleChange}
                        value={roomData.adult}
                        label="Adults"
                        options={options.adults}
                    />
                </div>
                <div className="col-sm-6 col-md-3 col-lg-2">
                    <Input
                        name="child"
                        value={roomData.child}
                        label="Children"
                        handleChange={(e) => {
                            handleNoofChildren(e.target.value);
                        }}
                        select
                        options={options.chilren}
                    />
                </div>

                {Array.from({ length: roomData.child }, (_, index) => index).map((i) => (
                    <div className="col-sm-6 col-md-3 col-lg-2">
                        <Input
                            value={roomData.childAge[i]}
                            handleChange={(e) => {
                                handleAgeChange(i, e.target.value);
                            }}
                            select
                            options={options.childAge}
                            label={`Age ${i + 1}`}
                            placeholder="DD/MM/YY"
                        />
                    </div>
                ))}
            </div>
            <div className="text-center mt-2">
                {id > 0 ? (
                    <button
                        className="border-0 outline-0 bg-transparent text-danger d-sm-none"
                        onClick={() => removeRoom(id)}
                    >
                        Rimuovi stanza {id + 1}
                    </button>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default Room;
