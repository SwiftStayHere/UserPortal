import React, { useEffect, useState } from "react";
// import EventListener from "react-event-listener";
import { Calendar } from "./Icon";

import Calender from "./calender/Calender";

const Footer = ({
  initialConfigData,
  config,
  setConfig,
  comunes,
  datePickerOpen,
  setStartEndDate,
}) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const handleKeyboardEvent = (event) => {
    setIsKeyboardOpen(event.detail.isKeyboardOpen);
  };

  const [footerConfig, setFooterConfig] = useState({
    ...config,
    comune: config?.comune || comunes[0],
  });
  const handleFooterConfig = (name, value) => {
    setFooterConfig({ ...footerConfig, [name]: value });
  };

  // calender
  const [isCalender, setIsCalender] = useState(false);
  const [checkData, setCheckData] = useState({
    start: footerConfig.checkInDate,
    end: footerConfig.checkOutDate,
  });

  const handleSubmit = () => {
    setConfig({
      ...footerConfig,
      checkInDate: checkData.start,
      checkOutDate: checkData.end,
    });
  };

  const [isMobile, setIsMobile] = useState(false);
  const checkHandler = (e, source) => {
    e.target.blur();
    setIsCalender(true);
  };

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(window.navigator.userAgent));
  }, []);

  const options = (isMobile && {
    month: "long",
    day: "numeric",
  }) || {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const { stelles, distances, fascio } = initialConfigData;

  useEffect(() => {
    setStartEndDate(checkData);
  }, [checkData]);

  return (
    <footer
      style={{
        position: isKeyboardOpen || datePickerOpen ? "relative" : "sticky",
      }}
    >
      {/* <EventListener
        target="window"
        onResize={handleKeyboardEvent}
        onScreenResize={handleKeyboardEvent}
      /> */}
      <div className="container-fluid">
        <div
          style={{ zIndex: -1 }}
          className="footer-wrapper d-none d-sm-flex align-items-center justify-center"
        >
          <div className="custom-dropdown">
            <label htmlFor="checkin">Check In</label>
            <input
              type="text"
              value={
                (checkData.start &&
                  new Date(checkData.start).toLocaleDateString(
                    "it-IT",
                    options
                  )) ||
                new Date().toLocaleDateString("it-IT", options)
              }
              onClick={(e) => checkHandler(e)}
            />
            <span className="icon">
              <Calendar />
            </span>
          </div>
          <div className="custom-dropdown" style={{ marginLeft: "5rem" }}>
            <label htmlFor="checkin">Check Out</label>
            <input
              type="text"
              value={
                (checkData.end &&
                  new Date(checkData.end).toLocaleDateString(
                    "it-IT",
                    options
                  )) ||
                new Date().toLocaleDateString("it-IT", options)
              }
              onClick={(e) => checkHandler(e)}
            />
            <span className="icon">
              <Calendar />
            </span>
          </div>
        </div>
        <div className="footer-wrapper d-sm-none custom-dropdown-wrp">
          <div className="custom-dropdown">
            <label htmlFor="checkin">Check In</label>
            <input
              type="text"
              value={
                (checkData.start &&
                  new Date(checkData.start).toLocaleDateString(
                    "it-IT",
                    options
                  )) ||
                new Date().toLocaleDateString("it-IT", options)
              }
              onClick={(e) => checkHandler(e)}
            />
            <span className="icon">
              <Calendar />
            </span>
          </div>
          <div className="custom-dropdown">
            <label htmlFor="checkin">Check Out</label>
            <input
              type="text"
              value={
                (checkData.end &&
                  new Date(checkData.end).toLocaleDateString(
                    "it-IT",
                    options
                  )) ||
                new Date().toLocaleDateString("it-IT", options)
              }
              onClick={(e) => checkHandler(e)}
            />
            <span className="icon">
              <Calendar />
            </span>
          </div>
        </div>
      </div>

      {isCalender && (
        <Calender
          config={footerConfig}
          setConfig={setConfig}
          handler={setIsCalender}
          setCheckData={setCheckData}
        />
      )}
    </footer>
  );
};

export default Footer;
