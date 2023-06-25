const { parseAbapError } = require('../../functions/utils');

module.exports = (e) => {
    if (e.name === 'ABAPError') {
        return parseAbapError(e);
    } else if (e.name === 'RfcLibError') {
        debugger
    } else if (e.name === 'AxiosError') {
        if(e.response.status === 401){
            return `TRM Registry error: Missing login data`;
        }else{
            try {
                const headers = e.response.headers;
                if (headers['x-trm-registry'] === 'public') {
                    var message;
                    try{
                        message = e.response.data.message;
                    }catch(e){
                        message = e.response.statusText;
                    }
                    return `TRM Registry error: ${message}`;
                }
            } catch (err) {
                return err.toString();
            }
        }
    } else {
        return e.toString();
    }
}