module.exports = (date) => {
    if (!(date instanceof Date))
        return new TypeError(`Date object required: ${date}`);
    let mm = date.getMonth() + 1;
    let dd = date.getUTCDate();
    return [
        date.getFullYear(),
        mm > 9 ? mm : "0" + mm,
        dd > 9 ? dd : "0" + dd,
    ].join("");
}