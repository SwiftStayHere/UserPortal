const formatDate = (dateString, type) => {
    let parts = dateString.split('/');
    let day = parseInt(parts[0]); // Convert to integer

    let month = parseInt(parts[1]); // Convert to integer
    let year = parseInt(parts[2]); // Convert to integer

    // Create the Date object with the specified month, day, and year
    let date = new Date(year, month - 1, day); // Adding 2000 to the year to convert it to 4-digit format (assumed range 2000-2099)

    const todaySDate = new Date();
    const dateAfterTwoDays = new Date(date);
    const dateBeforeThreeDays = new Date(date);
    const dateAfterThreeDays = new Date(date);
    const dateAfterOneWeekFromCurrentDate = new Date();
    dateAfterOneWeekFromCurrentDate.setDate(todaySDate.getDate() + 7);
    dateAfterTwoDays.setDate(dateAfterTwoDays.getDate() + 2);
    dateBeforeThreeDays.setDate(dateBeforeThreeDays.getDate() - 3);
    dateAfterThreeDays.setDate(dateAfterThreeDays.getDate() + 3);

    if (type === 'checkin') {
        if (date < todaySDate) {
            date = todaySDate;
        }
        // if (dateBeforeThreeDays > todaySDate) {
        //     date = dateBeforeThreeDays;
        // }
    } else if (type === 'checkout') {
        // if (dateAfterTwoDays < todaySDate) {
        //     date = dateAfterOneWeekFromCurrentDate;
        // }
    }

    return date;
};

export default formatDate;
