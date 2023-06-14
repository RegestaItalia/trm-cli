module.exports = (arg) => {
    const regex = /(?:\w|\s)*<(?:\w|\.|-)*@{1}(?:\w|\.)*>/gmi;
    var aAuthors;
    var validated = [];
    if(!Array.isArray(arg)){
        aAuthors = arg.split(',');
    }else{
        aAuthors = arg;
    }
    aAuthors.forEach(author => {
        author = author.trim();
        if(regex.test(author)){
            validated.push(author);
        }
    });
    return validated;
}