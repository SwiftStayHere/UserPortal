import React, { useState, useEffect } from "react";
import img1 from "../assets/img/offers/1.png";

import { toast, Toaster } from "react-hot-toast";
import values from "../values";

import axios from "axios";
import { BASE_API_URL } from "../keys";
import OfferItem from "./OfferItem";
import Shapes from "./Shapes";
import { compileString } from "sass";
const MainSection = ({
  hotels,
  setHotels,
  checkInDate,
  checkOutDate,
  setDatePickerOpen,
  config,
}) => {
  const [userData, setUserData] = useState({
    Nome: "",
    Cognome: "",
    Email: "",
    Phone: "+39",
    postedDate: new Date().toDateString(),
    departure: null,
    bags: null,
    carSize: null,
    arrival: null,
    packageBoard: null,
    rooms: [
      {
        adult: 2,
        child: 1,
        childAge: [1],
        totDisc: "€ 0",
        childDis: ["€ 0"],
        adultPrice: [0, 0],
        childInit: [],
        board: localStorage.getItem("selectedPackage"),
      },
    ],
    Citta: null,
    note: "",
    Modulo: "infoischia",
    Hotel: null,
    numeroBagagliAlis: "1",
    ferry:
      "traghetto con auto fino 4 mt. da Pozzuoli A/R € 75 - passeggeri € 22",
    trasporto: "",
    numeroBagagliViaggio: "",
    pricePerPerson: "",
    selectedCitta: "",
  });

  const [sending, setSending] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [value, setValue] = useState("");

  const handleUpdateRooms = (room, i) => {
    const updatedRooms = userData.rooms.map((r, index) => {
      if (i === index) return room;
      return r;
    });
    setUserData({ ...userData, rooms: updatedRooms });
  };

  const handleChangeValue = (value) => { };

  const [bookings, setBooking] = useState(null);
  const breakDownTypeChecker = (currentOffer) => {
    if (currentOffer?.breakdown[1].price != 0) {
      return currentOffer?.breakdown[1].breakdownId;
    } else if (currentOffer?.breakdown[0].price != 0) {
      return currentOffer?.breakdown[0].breakdownId;
    } else if (currentOffer?.breakdown[2].price != 0) {
      return currentOffer?.breakdown[2].breakdownId;
    }
  };
  const offerPriceCal = (activeData) => {
    let temp = 0;
    const checkinDate = new Date(activeData.checkIn);
    const checkoutDate = new Date(activeData.checkOut);
    let calculatedNights = Math.ceil(
      (checkoutDate - checkinDate) / (24 * 60 * 60 * 1000)
    );
    return activeData?.minStay === activeData?.maxStay
      ? activeData.breakdown[breakDownTypeChecker(activeData) - 1]?.price
      : (!(activeData?.minStay === activeData?.maxStay) &&
        activeData?.id === activeData?.id
        ? temp !== 0
          ? temp
          : activeData.breakdown[breakDownTypeChecker(activeData) - 1].price
        : activeData.breakdown[breakDownTypeChecker(activeData) - 1].price) *
      calculatedNights;
  };
  function filterOffersByCriteria(offers, mainOffer) {

    const checkinDate = new Date(mainOffer.checkIn);
    const checkoutDate = new Date(mainOffer.checkOut);
    let MainofferNights = Math.ceil(
      (checkoutDate - checkinDate) / (24 * 60 * 60 * 1000)
    );

    // console.log(offers)
    let list = offers?.filter((offer) => {
      // if (
      //   Math.abs(new Date(offer.endDate) - new Date(mainOffer.checkOut)) <=
      //   3 * 24 * 60 * 60 * 1000
      // ) {
      //   console.log(
      //     Math.abs(new Date(offer.startDate) - new Date(mainOffer.checkIn)) <=
      //       3 * 24 * 60 * 60 * 1000,
      //     Math.abs(new Date(offer.endDate) - new Date(mainOffer.checkOut)) <=
      //       3 * 24 * 60 * 60 * 1000,
      //     Math.abs(offer.maxStay - MainofferNights) <= 3
      //   );
      // }

      return (
        Math.abs(new Date(offer.startDate) - new Date(mainOffer.checkIn)) <=
        3 * 24 * 60 * 60 * 1000 &&
        Math.abs(new Date(offer.endDate) - new Date(mainOffer.checkOut)) <=
        3 * 24 * 60 * 60 * 1000 &&
        Math.abs(offer.maxStay - MainofferNights) <= 3
      );
    });
    // console.log(list)
    return list;
  }

  // Function to calculate compatibility score based on total price
  function calculateCompatibilityScore(offer, mainOffer) {
    let offerPrice = offerPriceCal(offer);
    // console.log(offerPrice, mainOffer.price);
    const priceDifference = Math.abs(offerPrice - mainOffer.price);

    if (mainOffer.price <= 500) {
      return priceDifference <= 100;
    } else if (mainOffer.price <= 1000) {
      return priceDifference <= 150;
    } else if (mainOffer.price <= 2000) {
      return priceDifference <= 200;
    } else {
      return priceDifference <= 300;
    }
  }

  // Function to select one compatible offer from each hotel
  function selectCompatibleOffers(hotels, mainOffer) {
    const result = [];

    for (const hoteli of hotels) {
      // console.log(hoteli.id)
      const compatibleOffers = filterOffersByCriteria(hoteli.offers, mainOffer);

      if (compatibleOffers?.length > 0) {
        // console.log(compatibleOffers)
        const selectedOffer = compatibleOffers.find((offer) => {
          if (offer.id != mainOffer.offerName) {
            return calculateCompatibilityScore(offer, mainOffer);
          }
        });
        // console.log(selectedOffer.id, mainOffer.offerName);
        if (selectedOffer) {
          result.push({
            hotel: {
              id: hoteli.id,
              hotelName: hoteli.name,
              ofFerId: selectedOffer.id,
            },
            offer: selectedOffer,
          });
        }
      }
    }

    return result;
  }
  const handleSubmit = async (
    arrival,
    departure,
    NomeModulo,
    Hotel,
    totalPriceForUser,
    packageBoard,
    handleScroll,
    handleOfferClose
  ) => {
    const dataToBePosted = {
      ...userData,
      arrival,
      departure,
      NomeModulo: "infoischia",
      Hotel,
      pricePerPerson: totalPriceForUser,
      packageBoard,
    };
    for (let i = 0; i < userData.rooms.length; i++) {
      userData.rooms[i].board = localStorage.getItem("selectedPackage");
    }
    if (buttonDisabled) {
      toast.error("Wait for a while");
      setSending(false);
      return;
    }
    if (!userData.Nome) {
      toast.error("Devi inserire name");
      setSending(false);
      return;
    }
    if (!userData.Cognome) {
      toast.error("Devi inserire  cognome");
      setSending(false);
      return;
    }
    if (!userData.Email) {
      toast.error("Devi inserire  email");
      setSending(false);
      return;
    }
    if (!userData.Phone) {
      toast.error("Devi inserire Numero di Telefono");
      setSending(false);
      return;
    }
    if (!arrival || !arrival.length || arrival?.split("-")[0] === "NaN") {
      toast.error("Devi inserire Data Check In");
      setSending(false);
      return;
    }
    if (!departure || !departure.length || departure?.split("-")[0] === "NaN") {
      toast.error("Devi inserire  Data Check Out");
      setSending(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+\d{1,3}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

    if (!emailRegex.test(userData.Email)) {
      toast.error("si prega di inserire valido email.");
      setSending(false);
      return;
    }
    if (!phoneRegex.test(userData.Phone)) {
      toast.error("si prega di inserire valido Numero di Telefono.");
      setSending(false);
      return;
    }

    if (!value) {
      toast.error("Seleziona una opzione sopra");
      setSending(false);
      handleScroll();
      return;
    }
    switch (value) {
      case "aliscafo":
        if (!userData.numeroBagagliAlis) {
          toast.error("Devi inserire  Numero di Bagagli");
          setSending(false);
          return;
        } else
          dataToBePosted.Citta = `Aliscafo + Transfer | ${userData.numeroBagagliAlis}`;
        break;
      case "ferry":
        if (!userData.ferry) {
          toast.error("Devi inserire  Dimensione Auto");
          setSending(false);
          return;
        } else
          dataToBePosted.Citta = `Traghetto + Transfer | ${userData.ferry}`;
        break;

      case "viaggio":
        dataToBePosted.Citta = `${userData.numeroBagagliViaggio} con ${userData.trasporto}`;
        break;
      default:
        dataToBePosted.Citta = "";
    }
    try {
      const res1 = await axios.get(
        `${values.url}/booking/userByEmail/${userData.Phone}`
      );
      var userId = 0;
      if (res1.data == null) {
        try {
          const newUser = await axios.post(`${values.url}/booking/user`, {
            fName: userData.Nome,
            lName: userData.Cognome,
            email: userData.Email,
            phone: userData.Phone,
            lastQuoteSent: new Date(),
            quoteSent: 1,
            tag: [],
          });
          userId = newUser.data._id;
        } catch (newUserError) {
          const newUser = await axios.post(`${values.url}/booking/user`, {
            fName: userData.Nome,
            lName: userData.Cognome,
            email: userData.Email,
            phone: userData.Phone,
            lastQuoteSent: new Date(),
            quoteSent: 1,
            tag: [],
          });
          userId = newUser.data._id;
        }
      } else {
        try {
          const response = await axios.put(
            `${values.url}/booking/updating/${userData.Phone}`,
            {
              email: userData.Email,
              fName: userData.Nome,
              lName: userData.Cognome,
            }
          );
          console.log("User updated successfully:", response.data);
        } catch (error) {
          console.error("Error updating user:", error.response.data);
        }
        userId = res1.data._id;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error as needed, e.g., show an error message to the user
      // or perform any necessary cleanup.
    }
    // {
    //   userId: userId,
    //   msg: userData.note,
    //   tag: [],
    //   date: new Date(),
    //   dateLine: `${userData.arrival?.toDateString()} - ${userData.departure?.toDateString()}`,
    //   periodo: `${new Date(checkOutDate)-new Date(checkInDate)} notti €${localStorage.getItem("priceToBeSent")} per persona`,
    //   module: "customer support",
    //   guestDetails: [
    //     {
    //       adult: userData.rooms.noofAdults,
    //       child: userData.rooms.noofChildren,
    //       childAge: userData.rooms.ages,
    //     },
    //   ],
    //   trasporto: userData.trasporto,
    //   citta: userData.Citta,
    //   periodOfStay: "1 week",
    //   dates: [
    //     {
    //       start: userData.arrival,
    //       end: userData,departure,
    //       price: localStorage.getItem("priceToBeSent"),
    //       hotelName: "Riverfront Retreat",
    //       offerName: "Winter Wonderland Package",
    //     },
    //   ],
    //   boardType: "Mezza Pensione",
    // }

    function formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are zero-based
      const year = date.getFullYear();

      // Pad day and month with leading zeros if needed
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;

      return `${year}-${formattedMonth}-${formattedDay}`;
    }
    for (let i = 0; i < userData.rooms.length; i++) {
      userData.rooms[i].adultPrice = userData.rooms[i].adultPrice.map(
        () =>
          (
            window.actualOffer.breakdown.find(
              (item) => item.name === localStorage.getItem("selectedPackage")
            ) || {}
          ).price *
          (window.actualOffer.minStay === window.actualOffer.maxStay
            ? (new Date(localStorage.getItem("prevOutDate")) -
              new Date(localStorage.getItem("prevInDate"))) /
            86400000 /
            window.actualOffer.maxStay
            : (new Date(localStorage.getItem("prevOutDate")) -
              new Date(localStorage.getItem("prevInDate"))) /
            86400000)
      );
      for (let j = 0; j < userData.rooms[i].childAge.length; j++) {
        let disc = 0;
        for (let k = 0; k < window.actualOffer?.ageReduction.length; k++) {
          if (
            window.actualOffer?.ageReduction[k].agelimit >
            userData.rooms[i].childAge[j]
          ) {
            disc = window.actualOffer?.ageReduction[k].discount;
            break;
          }
        }
        userData.rooms[i].childDis[j] = `€ ${disc}`;
        userData.rooms[i].childInit = Array(
          userData.rooms[i].childAge.length
        ).fill(userData.rooms[0].adultPrice[0]);
      }
    }
    const getMonth = (month) => {
      if (month === 0) {
        return "gen";
      } else if (month === 1) {
        return "feb";
      } else if (month === 2) {
        return "mar";
      } else if (month === 3) {
        return "apr";
      } else if (month === 4) {
        return "mag";
      } else if (month === 5) {
        return "giu";
      } else if (month === 6) {
        return "lug";
      } else if (month === 7) {
        return "ago";
      } else if (month === 8) {
        return "set";
      } else if (month === 9) {
        return "ott";
      } else if (month === 10) {
        return "nov";
      } else if (month === 11) {
        return "dic";
      }
    };
    const Mainoffer = [
      {
        checkIn: formatDate(new Date(localStorage.getItem("prevInDate"))),
        checkOut: formatDate(new Date(localStorage.getItem("prevOutDate"))),
        start: `${new Date(
          localStorage.getItem("prevInDate")
        ).getDate()} ${getMonth(
          new Date(localStorage.getItem("prevInDate")).getMonth()
        )}`,
        end: `${new Date(
          localStorage.getItem("prevOutDate")
        ).getDate()} ${getMonth(
          new Date(localStorage.getItem("prevOutDate")).getMonth()
        )}`,
        price: localStorage.getItem("price"),
        hotelName: `${localStorage.getItem("hotel")}`,
        offerName: localStorage.getItem("offer"),
        actualName: localStorage.getItem("actualName"),
        actualOffer: window.actualOffer,
      }]
    await axios
      .get(`${values.url}/app/hotels`)
      .then(async (response) => {

        console.log(selectCompatibleOffers(response.data, Mainoffer[0]));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(`${values.url}/booking`, {
        id: bookings + 1,
        userId: userId,
        msg: userData.note,
        tag: [],
        date: new Date().toLocaleString("en-US", {
          timeZone: "Europe/Berlin",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        dateLine: `${new Date(
          localStorage.getItem("prevInDate")
        ).getDate()} ${getMonth(
          new Date(localStorage.getItem("prevInDate")).getMonth()
        )} - ${new Date(
          localStorage.getItem("prevOutDate")
        ).getDate()} ${getMonth(
          new Date(localStorage.getItem("prevOutDate")).getMonth()
        )}`,
        periodo: `${(new Date(localStorage.getItem("prevOutDate")) -
          new Date(localStorage.getItem("prevInDate"))) /
          86400000
          } notti, ${localStorage.getItem("price")}€ per persona`,
        module: userData.Modulo,
        guestDetails: userData.rooms,
        trasporto: userData.trasporto
          ? userData.trasporto
          : "Nessuna Trasporto",
        citta: `${userData.Citta ? userData.Citta : "Nessuna"}`,
        periodOfStay: "1 week",
        bags: `${userData.bags ? userData.bags : "Nessuna"}`,
        carSize: `${userData.carSize ? userData.carSize : "Nessuna"}`,
        dates: [
          {
            checkIn: formatDate(new Date(localStorage.getItem("prevInDate"))),
            checkOut: formatDate(new Date(localStorage.getItem("prevOutDate"))),
            start: `${new Date(
              localStorage.getItem("prevInDate")
            ).getDate()} ${getMonth(
              new Date(localStorage.getItem("prevInDate")).getMonth()
            )}`,
            end: `${new Date(
              localStorage.getItem("prevOutDate")
            ).getDate()} ${getMonth(
              new Date(localStorage.getItem("prevOutDate")).getMonth()
            )}`,
            price: localStorage.getItem("price"),
            hotelName: `${localStorage.getItem("hotel")}`,
            offerName: localStorage.getItem("offer"),
            actualName: localStorage.getItem("actualName"),
            actualOffer: window.actualOffer,
          },
        ],
        boardType: localStorage.getItem("selectedPackage"),
      })
      .then((res) => {
        console.log(res.data, "h");
        toast.success("Success");
        setSending(false);
        setButtonDisabled(true);
        setBooking(bookings + 1);
        setTimeout(() => {
          handleOfferClose();
        }, 8000);
        setTimeout(() => {
          setButtonDisabled(false);
        }, 10000);
        localStorage.removeItem("selectedPackage");
        setUserData({
          Nome: "",
          Cognome: "",
          Email: "",
          Phone: "+39",
          postedDate: new Date().toDateString(),
          departure: null,
          bags: null,
          carSize: null,
          arrival: null,
          packageBoard: null,
          rooms: [
            {
              adult: 2,
              child: 1,
              childAge: [1],
              totDisc: "€ 0",
              childDis: ["€ 0"],
              adultPrice: [0, 0],
              childInit: [],
              board: localStorage.getItem("selectedPackage"),
            },
          ],
          Citta: null,
          note: "",
          Modulo: "infoischia",
          Hotel: null,

          numeroBagagliAlis: "1",
          ferry:
            "traghetto con auto fino 4 mt. da Pozzuoli A/R € 75 - passeggeri € 22",
          trasporto: "",
          numeroBagagliViaggio: "",
          pricePerPerson: "",
          selectedCitta: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
        toast.error(err.response?.data.message || "Internal server error");
      });
  };
  const [filters, setFilters] = useState({
    fascio: { min: 0, max: 5000 },
    distance: { min: 0, max: 5000 },
    stelle: 0,
    comune: "Anywhere",
  });

  useEffect(() => {
    // Make changes to a newFilters object and update filters once at the end
    let newFilters = { ...filters }; // Make a copy of the current filters
    newFilters = {
      ...newFilters,
      comune: config.comune.name,
    };
    if (config.fascio.name === "fino a 40€") {
      newFilters = {
        ...newFilters,
        fascio: { min: 0, max: 40 },
      };
    } else if (config.fascio.name === "tra 40€ e 80€") {
      newFilters = {
        ...newFilters,
        fascio: { min: 40, max: 80 },
      };
    } else if (config.fascio.name === "più di 80€") {
      newFilters = {
        ...newFilters,
        fascio: { min: 80, max: 5000 },
      };
    } else if (config.fascio.name === "Tutti") {
      newFilters = {
        ...newFilters,
        fascio: { min: 0, max: 5000 },
      };
    }

    if (config.stelle.name === "Tutti") {
      newFilters = {
        ...newFilters,
        stelle: 0,
      };
    } else if (config.stelle.name === "2 Stelle") {
      newFilters = {
        ...newFilters,
        stelle: 2,
      };
    } else if (config.stelle.name === "3 Stelle") {
      newFilters = {
        ...newFilters,
        stelle: 3,
      };
    } else if (config.stelle.name === "4 Stelle") {
      newFilters = {
        ...newFilters,
        stelle: 4,
      };
    } else if (config.stelle.name === "5 Stelle") {
      newFilters = {
        ...newFilters,
        stelle: 5,
      };
    }

    if (config.distance.name === "0mt - 500mt") {
      newFilters = {
        ...newFilters,
        distance: { min: 0, max: 500 },
      };
    } else if (config.distance.name === "500mt - 1km") {
      newFilters = {
        ...newFilters,
        distance: { min: 500, max: 1000 },
      };
    } else if (config.distance.name === "1km+") {
      newFilters = {
        ...newFilters,
        distance: { min: 1000, max: 5000 },
      };
    }

    // Update filters only once at the end with all the changes
    setFilters(newFilters);
  }, [config]);

  // const [bestPossiblePrice, setBestPossiblePrice] = useState()
  // console.log(hotels)

  useEffect(() => {
    let tempHotels = hotels.filter((hotel) => {
      let dalMareDistance = hotel?.distance.find((obj) =>
        obj.label.includes("Mare")
      )?.distance;
      if (
        hotel?.distance.find((obj) => obj.label.includes("Mare"))?.scale == "Km"
      ) {
        dalMareDistance = dalMareDistance * 1000;
      }
      if (
        hotel?.bestPossiblePrice <= filters.fascio.max &&
        hotel?.bestPossiblePrice >= filters.fascio.min &&
        (filters.comune == "Anywhere"
          ? 1
          : hotel?.state == filters.comune) &&
        (filters.stelle == 0 ? 1 : filters.stelle == hotel?.rating) &&
        (dalMareDistance
          ? dalMareDistance >= filters.distance.min &&
          dalMareDistance <= filters.distance.max
          : 1)
      ) {
        return hotel;
      }
    });

    setHotels(tempHotels);
    // console.log("Filtered Hotels :: ", hotels);
  }, [filters]);

  useEffect(() => {
    axios
      .get(`${values.url}/booking`)
      .then((response) => {
        setBooking(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <section className="main-section">
        <Toaster />
        <div className="shapes">
          <Shapes />
        </div>
        <div className="container">
          <h3 className="text-base font-medium m-title">
          The best offers for you!
          </h3>
          <div className="d-flex flex-column gap-36">
            {hotels.slice(0, 2).map((hotel, i) => {
              // let bestPossiblePrice = 10000;
              // hotel.offers?.map((item, id) => {
              //   if (item?.minStay === item?.maxStay) {
              //     const myVar =
              //       item?.breakdown[0]?.price ||
              //       item?.breakdown[1]?.price ||
              //       item?.breakdown[2]?.price;
              //     if (bestPossiblePrice > myVar) {
              //       bestPossiblePrice = myVar;
              //     }
              //   } else {
              //     let calculatedNights = Math.abs(
              //       (new Date(checkInDate) - new Date(checkOutDate)) /
              //       (1000 * 60 * 60 * 24)
              //     );
              //     if (calculatedNights < item?.minStay) {
              //       calculatedNights = item.minStay;
              //     } else if (calculatedNights > item?.maxStay) {
              //       calculatedNights = item.maxStay;
              //     }
              //     const myVar2 =
              //       (item?.breakdown[0]?.price ||
              //         item?.breakdown[1]?.price ||
              //         item?.breakdown[2]?.price) * calculatedNights;

              //     if (bestPossiblePrice > myVar2) {
              //       bestPossiblePrice = myVar2;
              //     }
              //   }
              //   hotel.bestPossiblePrice = bestPossiblePrice;
              // });
              let dalMareDistance = hotel?.distance.find((obj) =>
                obj.label.includes("Mare")
              )?.distance;
              if (
                hotel?.distance.find((obj) => obj.label.includes("Mare"))
                  ?.scale == "Km"
              ) {
                dalMareDistance = dalMareDistance * 1000;
              }

              return (
                <>
                  <OfferItem
                    config={config}
                    // bestPossiblePrice={bestPossiblePrice}
                    // setBestPossiblePrice={setBestPossiblePrice}
                    setUserData={setUserData}
                    userData={userData}
                    sending={sending}
                    setvalue={setValue}
                    value={value}
                    handleSubmit={handleSubmit}
                    buttonDisabled={buttonDisabled}
                    handleUpdateRooms={handleUpdateRooms}
                    offer
                    key={i}
                    index={i + 1}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    setDatePickerOpen={setDatePickerOpen}
                    hotel={{ ...hotel, img: [img1, img1, img1] }}
                    setSending={setSending}
                  />
                </>
              );
            })}
          </div>
          <br />
          <br />
          {hotels.length > 2 ? (
            <h3 className="text-base font-medium m-title">
              Ecco altre offerte che ti potrebbero piacere.
            </h3>
          ) : (
            <></>
          )}
          {hotels.slice(2).map((hotel, i) => {
            // let bestPossiblePrice = 10000;
            // hotel.offers?.map((item, id) => {
            //   if (item?.minStay === item?.maxStay) {
            //     const myVar =
            //       item?.breakdown[0]?.price ||
            //       item?.breakdown[1]?.price ||
            //       item?.breakdown[2]?.price;
            //     if (bestPossiblePrice > myVar) {
            //       bestPossiblePrice = myVar;
            //     }
            //   } else {
            //     let calculatedNights = Math.abs(
            //       (new Date(checkInDate) - new Date(checkOutDate)) /
            //       (1000 * 60 * 60 * 24)
            //     );
            //     if (calculatedNights < item?.minStay) {
            //       calculatedNights = item.minStay;
            //     } else if (calculatedNights > item?.maxStay) {
            //       calculatedNights = item.maxStay;
            //     }
            //     const myVar2 =
            //       (item?.breakdown[0]?.price ||
            //         item?.breakdown[1]?.price ||
            //         item?.breakdown[2]?.price) * calculatedNights;

            //     if (bestPossiblePrice > myVar2) {
            //       bestPossiblePrice = myVar2;
            //     }
            //   }
            //   hotel.bestPossiblePrice = bestPossiblePrice;
            // });

            let dalMareDistance = hotel?.distance.find((obj) =>
              obj.label.includes("Mare")
            )?.distance;
            if (
              hotel?.distance.find((obj) => obj.label.includes("Mare"))
                ?.scale == "Km"
            ) {
              dalMareDistance = dalMareDistance * 1000;
            }
            return (
              <div style={{ marginTop: "2rem" }}>
                <OfferItem
                  setUserData={setUserData}
                  userData={userData}
                  sending={sending}
                  setvalue={setValue}
                  value={value}
                  // bestPossiblePrice={bestPossiblePrice}
                  // setBestPossiblePrice={setBestPossiblePrice}
                  handleSubmit={handleSubmit}
                  handleUpdateRooms={handleUpdateRooms}
                  buttonDisabled={buttonDisabled}
                  offer={false}
                  key={i}
                  index={i + "--" + 1}
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  setDatePickerOpen={setDatePickerOpen}
                  hotel={{ ...hotel, img: [img1, img1, img1] }}
                  setSending={setSending}
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MainSection;
