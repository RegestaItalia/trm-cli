module.exports = (dats) => {
    return new Date(
        0 | dats.substring(0, 4),
        (0 | dats.substring(4, 6)) - 1,
        (0 | dats.substring(6, 8)) + 1
    );
}