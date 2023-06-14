module.exports = (url) => {
    return newUrl = url.replace(/\/\/www\./i, "//").replace(/\/$/, "").replace(/\/\/([^/]+)/, function(match, p1) {
        return "//" + p1.toLowerCase();
    });
}