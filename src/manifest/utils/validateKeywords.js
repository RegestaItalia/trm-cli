module.exports = (arg) => {
    const regex = /\w*/gmi;
    var aKeywords;
    var validated = [];
    if(!Array.isArray(arg)){
        aKeywords = arg.split(',');
    }else{
        aKeywords = arg;
    }
    aKeywords.forEach(keyword => {
        keyword = keyword.trim();
        if(regex.test(keyword)){
            validated.push(keyword);
        }
    });
    return validated;
}