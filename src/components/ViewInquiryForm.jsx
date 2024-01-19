import React, { createRef, useEffect, useRef, useState } from "react";
import { Plus2, Send } from "./Icon";
import Input from "./Input";
import Room from "./Room";

import loading from "../assets/img/dualLoading.gif";
import CustomDatePicker from "./calender/CalenderEnquiry";
import { europeanCountries, getAllCities } from "./Cities";
import Input1 from "./Input1";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const formatDate = (ogDate) => {
  let date = new Date(ogDate);

  // Get the individual components of the date
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  let day = String(date.getDate()).padStart(2, "0");

  // Format the date as YYYY-MM-DD
  let formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

function calculateDaysAndNights(startDate, endDate) {
  // Convert the dates to milliseconds
  const startMillis = new Date(startDate).getTime();
  const endMillis = new Date(endDate).getTime();

  // Calculate the time difference in milliseconds
  const timeDiffMillis = endMillis - startMillis;

  var numberOfNights = Math.ceil(timeDiffMillis / (1000 * 3600 * 24));

  // Calculate the number of days
  const days = Math.floor(timeDiffMillis / (1000 * 60 * 60 * 24));

  return { days, nights: numberOfNights };
}

const checkDateValidity = (offer, checkInDate, checkOutDate) => {
  const minNights = parseInt(offer["minimo notti"]);
  const maxNights = parseInt(offer["massimo notti"]);

  const checkInDateFromRecord = new Date(offer["Valida dal"]);
  const checkOutDateFromRecord = new Date(offer["Valida al"]);

  const checkInDateFromQuery = new Date(checkInDate);
  const checkOutDateFromQuery = new Date(checkOutDate);

  const { nights } = calculateDaysAndNights(
    checkInDateFromQuery,
    checkOutDateFromQuery
  );
  const dateBeforeMinNights = new Date(checkOutDateFromQuery);
  dateBeforeMinNights.setDate(dateBeforeMinNights.getDate() - minNights);

  if (
    checkInDateFromQuery >= checkInDateFromRecord &&
    checkInDateFromQuery <= dateBeforeMinNights
  ) {
    if (nights === minNights || (nights >= minNights && nights <= maxNights)) {
      return true;
    }
  }

  return false;
};
// place changed function called when place is changed
const placeChanged = (place) => {
  console.log("Place : ", place);
  console.log("Lat : ", place.geometry.location.lat());
  console.log("Lon : ", place.geometry.location.lng());
}
const ViewInquiryForm = (
  {
    setSending,
    offer,
    Hotel,
    NomeModulo,
    totalPriceForUser,
    checkInDate,
    checkOutDate,
    setUserData,
    userData,
    sending,
    setvalue,
    value,
    handleSubmit,
    buttonDisabled,
    handleUpdateRooms,
    setDatePickerOpen,
    selectItems,
    selectedPackage,
    breakdownNames,
    setSelectedPackage,
    handleOfferClose,
    departure,
    setDeparture,
    persistDate,
    setPersistDate,
    idx,
    arrival,
    setArrival,
    persistArrival,
    setPersistArrival,
    readOnly,
    setReadOnly,
    persistReadOnly,
    setPersistReadOnly,
    readOnlyArrival,
    setReadOnlyArrival,
    persistReadOnlyArrival,
    setPersistReadOnlyArrival
  },
  ref
) => {

  const [autocomplete, setAutocomplete] = useState(null);

  const [dateValid, setDateValid] = useState(
    checkDateValidity(offer, checkInDate, checkOutDate)
  );
  const cityInput = useRef()

  const [maxDepartureDate, setMaxDepatureDate] = useState("");
  const [minDepartureDate, setMinDepartureDate] = useState("");
  const [minArrivalDate, setMinArrivalDate] = useState("");
  const [maxArrivalDate, setMaxArrivalDate] = useState("");

  // const [arrival, setArrival] = useState("");
  // const [departure, setDeparture] = useState("");

  const [prevDateValid, setPrevDateValid] = useState(false);

  const [clicked, setClicked] = useState(false);

  function calculateInitialMinAndMaxDates(offer) {
    const minNights = parseInt(offer["minimo notti"]);
    // const maxNights = parseInt(offer['massimo notti']);

    const checkInDateFromRecord = new Date(offer["Valida dal"]);
    const checkOutDateFromRecord = new Date(offer["Valida al"]);

    // for departure
    const minimumDeparture = checkInDateFromRecord;

    const maximumDeparture = checkOutDateFromRecord;
    maximumDeparture.setDate(maximumDeparture.getDate() - minNights);

    setMaxDepatureDate(maximumDeparture);

    setMinDepartureDate(new Date(offer["Valida dal"]));

    // for arrival

    const minimumArrival = checkInDateFromRecord;
    minimumArrival.setDate(minimumArrival.getDate() + minNights);

    const maximumArrival = new Date(offer["Valida al"]);

    setMaxArrivalDate(maximumArrival);

    setMinArrivalDate(minimumArrival);
  }

  useEffect(() => {
    window.actualOffer = offer
    localStorage.setItem("offer", offer?.id)
    localStorage.setItem("hotel", Hotel.id)
    localStorage.setItem("actualName", Hotel.name)
  }, [offer, Hotel])

  useEffect(() => {
    setDateValid(checkDateValidity(offer, checkInDate, checkOutDate));
  }, [
    offer["Nome Offerta"],
    offer["Valida dal"],
    checkInDate,
    checkOutDate,
    NomeModulo,
    Hotel,
  ]);


  const disabledDates = [];
  let x = 0;

  for (let i = new Date(offer.startDate) >= new Date() ? new Date(offer.startDate) : new Date(); i <= new Date(offer.endDate); i.setDate(i.getDate() + 1)) {
    const currentDate = new Date(i) + 1;
    if (offer.minStay == offer.maxStay) {
      if (x % offer.minStay !== 0) {
        disabledDates.push(new Date(currentDate));
      } else {
        x = 0;
      }
    }
    x++;
  }
  useEffect(() => {
    calculateInitialMinAndMaxDates(offer, checkInDate, checkOutDate);

    let { nights } = calculateDaysAndNights(
      offer["Valida dal"],
      offer["Valida al"]
    );
    const minNights = parseInt(offer["minimo notti"]);

    const equal = nights === minNights;

    setReadOnly(equal);

    setArrival(
      equal
        ? new Date(offer["Valida al"])
        : dateValid
          ? new Date(checkOutDate)
          : ""
    );
    setDeparture(
      equal
        ? new Date(offer["Valida dal"])
        : dateValid
          ? new Date(checkInDate)
          : ""
    );
  }, [
    offer["Nome Offerta"],
    offer["Valida dal"],
    checkInDate,
    checkOutDate,
    dateValid,
  ]);

  useEffect(() => {
    userData.Citta = null;
    userData.bags = null;
    userData.carSize = null;
    userData.trasporto = null;
    if (value == "ferry") {
      userData.carSize = "3.98";
    }
    else if (value == "viaggio") {
      userData.trasporto = "Bus";
    }
  }, [value])

  const handleDepartureChange = (value) => {
    const departureDateFromForm = new Date(value);
    const minNights = parseInt(offer["minimo notti"]);

    const minArrivalDateCalc = departureDateFromForm.setDate(
      departureDateFromForm.getDate() + minNights
    );

    setMinArrivalDate(minArrivalDateCalc);
  };

  const handleArrivalChange = (value) => {
    const arrivalDateFromForm = new Date(value);
    const minNights = parseInt(offer["minimo notti"]);

    const maxDepartureDateCalc = arrivalDateFromForm.setDate(
      arrivalDateFromForm.getDate() - minNights
    );

    setMaxDepatureDate(maxDepartureDateCalc);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleChangeInCity = (place) => {
    // console.log("Lat : ", place.geometry.location.lat());
    // console.log("Lon : ", place.geometry.location.lng());
    console.log(
      `${cityInput.current.value
      } (${place.geometry.location.lat()},${place.geometry.location.lng()})`
    );
    setUserData({
      ...userData,
      [cityInput.current.name]: `${cityInput.current.value
        } (${place.geometry.location.lat()},${place.geometry.location.lng()})`,
    });
  };
  const departureRef = createRef(null);

  const arrivalRef = createRef(null);

  useEffect(() => {
    const prevInDate = localStorage.getItem("prevInDate");
    const prevOutDate = localStorage.getItem("prevOutDate");
    var prevInBool = true;
    var prevOutBool = true;
    for (let j = 0; j <= disabledDates.length; j++) {
      if (new Date(disabledDates[j]).toDateString() == new Date(prevInDate).toDateString()) {
        prevInBool = false;
      }
      if (new Date(disabledDates[j]).toDateString() == new Date(prevOutDate).toDateString()) {
        prevOutBool = false;
      }
    }
    const calStart = new Date(offer.startDate) >= new Date() ? new Date(offer.startDate) : new Date(new Date() + 1);
    const calEnd = new Date(offer.endDate);
    calStart.setHours(0, 0, 0, 0);
    calEnd.setHours(0, 0, 0, 0);

    if (new Date(prevInDate) > new Date(calEnd) || new Date(prevInDate) < new Date(calStart)) {
      prevInBool = false;
    }
    if (new Date(prevOutDate) > new Date(calEnd) || new Date(prevOutDate) < new Date(calStart)) {
      prevOutBool = false;
    }
    if (offer.minStay == offer.maxStay && new Date(new Date(offer.startDate).getTime() + offer.minStay * 24 * 60 * 60 * 1000).toDateString() == new Date(offer.endDate).toDateString()) {
      let persistReadOnlyNew = { ...persistReadOnly }
      persistReadOnlyNew[idx] = true;
      setPersistReadOnly(persistReadOnlyNew)
      setReadOnly(persistReadOnlyNew[idx])

      let persistDateNew = { ...persistDate }
      persistDateNew[idx] = new Date(offer.startDate);
      setPersistDate(persistDateNew)
      setDeparture(persistDateNew[idx])

      let persistArrivalNew = { ...persistArrival }
      persistArrivalNew[idx] = new Date(offer.endDate);
      setPersistArrival(persistArrivalNew)
      setArrival(persistArrivalNew[idx])

      let persistReadOnlyNewArrival = { ...persistReadOnlyArrival }
      persistReadOnlyNewArrival[idx] = true;
      setPersistReadOnlyArrival(persistReadOnlyNewArrival)
      setReadOnlyArrival(persistReadOnlyNewArrival[idx])
    }
    else if (new Date(offer.startDate).toDateString() == new Date(checkInDate).toDateString() && new Date(offer.endDate).toDateString() == new Date(checkOutDate).toDateString()) {
      let persistReadOnlyNew = { ...persistReadOnly }
      persistReadOnlyNew[idx] = false;
      setPersistReadOnly(persistReadOnlyNew)
      setReadOnly(persistReadOnlyNew[idx])

      let persistDateNew = { ...persistDate }
      persistDateNew[idx] = new Date(offer.startDate);
      setPersistDate(persistDateNew)
      setDeparture(persistDateNew[idx])

      let persistArrivalNew = { ...persistArrival }
      persistArrivalNew[idx] = new Date(offer.endDate);
      setPersistArrival(persistArrivalNew)
      setArrival(persistArrivalNew[idx])

      let persistReadOnlyNewArrival = { ...persistReadOnlyArrival }
      persistReadOnlyNewArrival[idx] = true;
      setPersistReadOnlyArrival(persistReadOnlyNewArrival)
      setReadOnlyArrival(persistReadOnlyNewArrival[idx])
    }
    else if (new Date(offer.endDate).toDateString() == new Date(new Date() + 1 + offer.minStay).toDateString()) {
      let persistReadOnlyNew = { ...persistReadOnly }
      persistReadOnlyNew[idx] = true;
      setPersistReadOnly(persistReadOnlyNew)
      setReadOnly(persistReadOnlyNew[idx])

      let persistDateNew = { ...persistDate }
      persistDateNew[idx] = new Date(new Date(offer.endDate) - offer.minStay);
      setPersistDate(persistDateNew)
      setDeparture(persistDateNew[idx])

      let persistArrivalNew = { ...persistArrival }
      persistArrivalNew[idx] = new Date(offer.endDate);
      setPersistArrival(persistArrivalNew)
      setArrival(persistArrivalNew[idx])

      let persistReadOnlyNewArrival = { ...persistReadOnlyArrival }
      persistReadOnlyNewArrival[idx] = true;
      setPersistReadOnlyArrival(persistReadOnlyNewArrival)
      setReadOnlyArrival(persistReadOnlyNewArrival[idx])
    }
    else if (prevInBool && prevOutBool) {
      let persistReadOnlyNew = { ...persistReadOnly }
      persistReadOnlyNew[idx] = false;
      setPersistReadOnly(persistReadOnlyNew)
      setReadOnly(persistReadOnlyNew[idx])

      let persistDateNew = { ...persistDate }
      persistDateNew[idx] = new Date(prevInDate);
      setPersistDate(persistDateNew)
      setDeparture(persistDateNew[idx])

      let persistArrivalNew = { ...persistArrival }
      persistArrivalNew[idx] = new Date(prevOutDate);
      setPersistArrival(persistArrivalNew)
      setArrival(persistArrivalNew[idx])

      let persistReadOnlyNewArrival = { ...persistReadOnlyArrival }
      persistReadOnlyNewArrival[idx] = false;
      setPersistReadOnlyArrival(persistReadOnlyNewArrival)
      setReadOnlyArrival(persistReadOnlyNewArrival[idx])
    }
    else {
      let persistReadOnlyNewArrival = { ...persistReadOnlyArrival }
      persistReadOnlyNewArrival[idx] = true;
      setPersistReadOnlyArrival(persistReadOnlyNewArrival)
      setReadOnlyArrival(persistReadOnlyNewArrival[idx])
    }
    localStorage.setItem("selectedPackage", selectedPackage[0].name)
  }, [idx])
  const handleAddRoom = () => {
    setUserData({
      ...userData,
      rooms: [...userData.rooms, { adult: 2, child: 1, childAge: [1], totDisc: "€ 0", childDis: ["€ 0"], adultPrice: [0, 0], childInit: [], board: localStorage.getItem("selectedPackage") }],
    });
  };

  const removeRoom = (idx) => {
    const updatedRooms = userData.rooms.filter((room, i) => i !== idx);

    setUserData(() => ({ ...userData, rooms: updatedRooms }));
  };

  const optionRef = useRef(null);

  const handleScroll = () => {
    optionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBen1zTUuynCgRfIStX1NqhEp_eHat4n0k',
    libraries: ['places']
  })

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setCity(inputValue);
    const apiKey = 'AIzaSyBen1zTUuynCgRfIStX1NqhEp_eHat4n0k'; // Replace with your SwiftComplete API key
  };

  function calculateSelectableCheckInDates() {
    const selectableCheckInDates = [];
    let currentDateIterator = new Date(offer.startDate);

    while (currentDateIterator < new Date(new Date(offer.endDate).getTime() - (offer.maxStay * 24 * 60 * 60 * 1000))) {
      if (currentDateIterator > Date()) {
        selectableCheckInDates.push(new Date(currentDateIterator));
      }
      currentDateIterator.setDate(currentDateIterator.getDate() + offer.minStay);
    }

    return selectableCheckInDates;
  }
  const getHighlightDates = (dates) => {
    const highlight = {};
    dates.forEach(date => {
      highlight[date] = 'non-selectable'; // 'non-selectable' will add a class to disable these dates
    });
    return highlight;
  };
  const val = calculateSelectableCheckInDates();

  return (
    <>
      {userData ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true)
              if (!clicked) {
                setClicked(true);
                setTimeout(() => {
                  handleSubmit(
                    formatDate(arrival),
                    formatDate(departure),
                    NomeModulo,
                    Hotel,
                    totalPriceForUser,
                    selectedPackage.text,
                    handleScroll,
                    handleOfferClose
                  );
                  setClicked(false);
                }, 1000);
              }
            }}
            className="inquiry--form"
          >
            <div className="row g-3">
              <div className="col-sm-6 col-md-3">
                <Input
                  required={true}
                  type="text"
                  value={userData.Nome}
                  name="Nome"
                  handleChange={handleChange}
                  label="Name"
                  placeholder="Your name"
                />
              </div>
              <div className="col-sm-6 col-md-3 relative">
                <div>
                  <Input
                    required={true}
                    type="text"
                    name="Cognome"
                    value={userData.Cognome}
                    handleChange={handleChange}
                    label="Surname"
                    placeholder="Your surname"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <Input
                  required
                  type="email"
                  label="E-mail "
                  value={userData.Email}
                  handleChange={handleChange}
                  name="Email"
                  placeholder="Your email"
                />
              </div>
              <div className="col-sm-6 col-md-3">
                <Input
                  required
                  label="Telephone number"
                  type="tel"
                  value={userData.Phone}
                  handleChange={handleChange}
                  name="Phone"
                  placeholder="1234567890"
                />
              </div>
              <div className="col-sm-6 col-md-3 col-lg-2 relative">
                <div
                  className="right-sm-0 w-100"
                  style={{ opacity: `${readOnly ? "0.8" : "1"}` }}
                >
                  {offer.minStay != offer.maxStay ? (
                    <CustomDatePicker
                      setDatePickerOpen={setDatePickerOpen}
                      minDate={
                        new Date(offer.startDate) >= new Date()
                          ? new Date(offer.startDate)
                          : new Date() + 1
                      }
                      maxDate={
                        new Date(
                          new Date(offer.endDate).getTime() -
                          offer.minStay * 24 * 60 * 60 * 1000
                        )
                      }
                      selected={departure}
                      label="Check In Date"
                      placeholder="Select the date"
                      handleChange={(value) => {
                        let persistDateNew = { ...persistDate };
                        persistDateNew[idx] = value;
                        setDeparture(value);
                        handleDepartureChange(value);
                        setPersistDate(persistDateNew);

                        localStorage.setItem("prevInDate", value);

                        let persistReadOnlyNewArrival = {
                          ...persistReadOnlyArrival,
                        };
                        persistReadOnlyNewArrival[idx] = false;
                        setPersistReadOnlyArrival(persistReadOnlyNewArrival);
                        setReadOnlyArrival(persistReadOnlyNewArrival[idx]);
                      }}
                      setDeparture={setDeparture}
                      readOnly={readOnly}
                      persistDate={persistDate[idx]}
                      setArrival={setArrival}
                      persistArrival={persistArrival[idx]}
                    />
                  ) : (
                    <CustomDatePicker
                      setDatePickerOpen={setDatePickerOpen}
                      minDate={
                        new Date(offer.startDate) >= new Date()
                          ? new Date(offer.startDate)
                          : new Date() + 1
                      }
                      maxDate={
                        new Date(
                          new Date(offer.endDate).getTime() -
                          offer.minStay * 24 * 60 * 60 * 1000
                        )
                      }
                      selected={departure}
                      isDateDisabled={disabledDates}
                      label="Check In date"
                      placeholder="Select the date"
                      handleChange={(value) => {
                        let persistDateNew = { ...persistDate };
                        persistDateNew[idx] = value;
                        setDeparture(value);
                        handleDepartureChange(value);
                        setPersistDate(persistDateNew);

                        localStorage.setItem("prevInDate", value);

                        let persistReadOnlyNewArrival = {
                          ...persistReadOnlyArrival,
                        };
                        persistReadOnlyNewArrival[idx] = false;
                        setPersistReadOnlyArrival(persistReadOnlyNewArrival);
                        setReadOnlyArrival(persistReadOnlyNewArrival[idx]);
                      }}
                      setDeparture={setDeparture}
                      readOnly={readOnly}
                      persistDate={persistDate[idx]}
                      setArrival={setArrival}
                      persistArrival={persistArrival[idx]}
                    />
                  )}
                </div>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-2 relative">
                <div
                  className="right-sm-0 w-100"
                  style={{ opacity: `${readOnlyArrival ? "0.8" : "1"}` }}
                >
                  {offer.minStay != offer.maxStay ? (
                    <CustomDatePicker
                      minDate={
                        offer.minStay != offer.maxStay
                          ? new Date(
                            new Date(departure).getTime() +
                            offer.minStay * 24 * 60 * 60 * 1000
                          )
                          : new Date(departure)
                      }
                      maxDate={new Date(offer.endDate)}
                      setDatePickerOpen={setDatePickerOpen}
                      selected={arrival}
                      label="Check Out Date"
                      placeholder="Select arrival date"
                      handleChange={(value) => {
                        setArrival(value);
                        handleArrivalChange(value);
                        let persistArrivalNew = { ...persistArrival };
                        persistArrivalNew[idx] = value;
                        setPersistArrival(persistArrivalNew);
                        localStorage.setItem("prevOutDate", value);
                      }}
                      setDeparture={setDeparture}
                      readOnly={readOnlyArrival}
                      persistDate={persistDate[idx]}
                      setArrival={setArrival}
                      persistArrival={persistArrival[idx]}
                    />
                  ) : (
                    <CustomDatePicker
                      minDate={
                        offer.minStay != offer.maxStay
                          ? new Date(
                            new Date(departure).getTime() +
                            offer.minStay * 24 * 60 * 60 * 1000
                          )
                          : new Date(
                            new Date(departure).getTime() + 24 * 60 * 60 * 1000
                          )
                      }
                      maxDate={new Date(offer.endDate)}
                      setDatePickerOpen={setDatePickerOpen}
                      isDateDisabled={disabledDates}
                      selected={arrival}
                      label="Check Out Date"
                      placeholder="Select arrival Date"
                      handleChange={(value) => {
                        setArrival(value);
                        handleArrivalChange(value);
                        let persistArrivalNew = { ...persistArrival };
                        persistArrivalNew[idx] = value;
                        setPersistArrival(persistArrivalNew);
                        localStorage.setItem("prevOutDate", value);
                      }}
                      setDeparture={setDeparture}
                      readOnly={readOnlyArrival}
                      persistDate={persistDate[idx]}
                      setArrival={setArrival}
                      persistArrival={persistArrival[idx]}
                    />
                  )}
                </div>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-2">
                <Input
                  value={selectItems[selectedPackage]}
                  handleChange={(e) => {
                    selectItems.forEach((item, i) => {
                      if (item?.price != 0) setSelectedPackage(e.target.value);
                      localStorage.setItem("selectedPackage", e.target.value);
                    });
                  }}
                  name="packageBoard"
                  label="Package"
                  select
                  required
                  options={breakdownNames}
                />
              </div>
            </div>

            {/* <Room room={userData.rooms[0]} id={0} handleUpdateRoom={handleUpdateRooms} /> */}

            {userData.rooms.map((item, i) => (
              <Room
                roomData={item}
                id={i}
                removeRoom={removeRoom}
                handleUpdateRoom={handleUpdateRooms}
              />
            ))}

            <div className="row g-3">
              <div className="col-sm-6 col-md-3">
                <span
                  className="form-control __form-control"
                  onClick={() => {
                    handleAddRoom();
                  }}
                >
                  <span>Add Room</span>
                  <Plus2 />
                </span>
              </div>
            </div>
            <h5 ref={optionRef} className="mt-4 r-title">
              Offer with
            </h5>
            <div ref={optionRef} className="__form-radio-group pt-2">
              <label className="__form-radio">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offer-with"
                    checked={value === "none"}
                    onChange={(e) => setvalue("none")}
                  />
                  <div className="form-check-label">No Options</div>
                </div>
                <div className="text">No Transportation Included</div>
              </label>
              <label className="__form-radio">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offer-with"
                    checked={value === "aliscafo"}
                    onChange={(e) => setvalue("aliscafo")}
                  />
                  <div className="form-check-label">Hydrofoil + Transfer</div>
                </div>
                <div className="text">
                  Hydrofoil from Naples Beverello return €35 including port hotel transfers
                </div>
                {value == "aliscafo" && (
                  <>
                    <br />
                    <Input
                      handleChange={handleChange}
                      name="bags"
                      type="number"
                      value={userData.bags}
                      label="Number of Baggage *"
                    // select
                    // options={options}
                    />
                  </>
                )}
              </label>
              <label className="__form-radio">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offer-with"
                    checked={value === "ferry"}
                    onChange={(e) => setvalue("ferry")}
                  />
                  <div className="form-check-label">Cab + Transfer</div>
                </div>
                <div className="text">
                  Ferry from Naples Calata port of Massa or Pozzuoli return €25 including port hotel transfers
                </div>
                {value == "ferry" && (
                  <>
                    <br />
                    <Input
                      value={userData.carSize}
                      handleChange={handleChange}
                      name={"carSize"}
                      label="Cab size"
                      select
                      options={options2}
                    //
                    />
                  </>
                )}
              </label>
              <label className="__form-radio">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="offer-with"
                    checked={value === "viaggio"}
                    onChange={(e) => setvalue("viaggio")}
                  />
                  <div className="form-check-label">I travel from your city</div>
                </div>
                <div className="text">
                  Travel included from your city to hotel drop-off
                </div>
                {value == "viaggio" && (
                  <div className="row g-3 mt-2">
                    <div className="col-sm-6">
                      <Input
                        name="trasporto"
                        handleChange={handleChange}
                        value={userData.trasporto}
                        label="Preferred type of transport"
                        select
                        options={options3}
                      />
                    </div>
                    <div className="col-sm-6">
                      <Autocomplete
                        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                        onPlaceChanged={() => {
                          handleChangeInCity(autocomplete.getPlace());
                        }}
                        options={{
                          types: ["(cities)"],
                          language: "in",
                        }}

                      >
                        <Input
                          type="text"
                          label="City of departure"
                          placeholder="Enter the city of Departure"
                          value={userData.Citta}
                          name="Citta"
                          handleChange={handleChange}
                          style={{ fontFamily: "chillax", fontSize: "16px" }}
                          ref={cityInput}
                        />
                      </Autocomplete>

                      {/* <ul className="city-suggestion-list" ref={cityInput}>
                      {suggestions.map((suggestion, indx) => (
                        suggestion && <li key={indx} onClick={() => { cityInput.current.style.display = "none"; setCity(suggestion) }} className="city-suggestion">{suggestion}</li>
                      ))}
                    </ul> */}
                    </div>
                  </div>
                )}
              </label>
            </div>
            <br />
            <div className="msg-txt mb-4">
              To offer you the best service, please specify, in the field below, more information for transfers and any needs for your holiday

            </div>
            <textarea
              value={userData.note}
              name="note"
              onChange={handleChange}
              className="form-control __form-control p-3"
              placeholder="Extra Notes, Special Requests, Etc..."
            ></textarea>
            <div className="mt-3"></div>
            <label className="form-check form--check">
              <input
                required
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <span className="form-check-label">
                I have read and consent to the{" "}
                <a
                  href="#"
                  className="text-base"
                  rel="noreferrer"
                >
                  processing of my personal data in accordance with European Regulation 679/2016 *
                </a>
              </span>
            </label>
            <div className="mt-3"></div>
            <label className="form-check form--check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <span className="form-check-label">
                Dichiaro di volermi iscrivere al servizio newsletter per ricevere Ie migliori offerte
              </span>
            </label>
            {buttonDisabled ? (
              <div className="pt-4">
                <button
                  style={{ opacity: 0.7 }}
                  className="cmn-btn w-100"
                  type="button"
                >
                  Quote Sent
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <button className="cmn-btn w-100" type="submit">
                  {sending ? (
                    <img style={{ width: "25px" }} src={loading} alt="loading" />
                  ) : (
                    <>
                      Request Quote <Send />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </>
      ) : (
        <>
          <img src={loading} height={"30px"} alt="" />
        </>
      )}
    </>
  );
};
const options2 = [
  { options: "3.98", text: "traghetto con auto fino 4 mt. da Pozzuoli A/R € 75 - passeggeri € 22", }, { options: "4.48", text: "traghetto con auto tra i 4 mt. fino ai 4.5 mt. da Pozzuoli A/R € 90 - passeggeri € 22", }, { options: "5", text: "traghetto con auto su. ai 4 mt. da Pozzuoli A/R € 100 - passeggeri € 22", },
];
const options3 = [
  {
    options: "Bus",
    text: "Bus da 85 € A/R compreso trasferimenti e passaggi marittimi",
  },
  {
    options: "Treno",
    text: "Treno alta velocità da € 99 A/R, compreso trasferimenti e passaggi marittimi",
  },
  {
    options: "Aereo",
    text: "Volo da € 199 A/R, compreso trasferimenti e passaggi marittimi",
  },
];

export default React.forwardRef(ViewInquiryForm);
