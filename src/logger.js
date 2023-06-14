const cli = require('loading-cli');
const Table = require('cli-table');

class PrivateLogger {
    constructor(type) {
        if(type !== 'cli'){
            throw new Error(`Unknown logger type ${type}`);
        }
        this.type = type;
        this.cliObj;
        this.loader;

        
        this.cliObj = cli({
            frames: ["⊶", "⊷"],
            interval: 1000
        });
    }
    loading(text) {
        if(this.cliObj){
            this.loader = this.cliObj.render().start(text);
        }
    }
    success(text) {
        if(this.cliObj){
            if(this.loader){
                this.loader.succeed(text);
                this.loader = null;
            }else{
                this.cliObj.succeed(text);
            }
        }
    }
    error(text) {
        if(this.cliObj){
            if(this.loader){
                this.loader.fail(text);
                this.loader = null;
            }else{
                this.cliObj.fail(text);
            }
        }
    }
    warning(text) {
        if(this.cliObj){
            if(this.loader){
                this.loader.warn(text);
                this.loader = null;
            }else{
                this.cliObj.warn(text);
            }
        }
    }
    info(text) {
        if(this.cliObj){
            if(this.loader){
                this.loader.info(text);
                this.loader = null;
            }else{
                this.cliObj.info(text);
            }
        }
    }
    table(header, data) {
        if(this.type === 'cli'){
            var table = new Table({
                head: header,
                //colWidths: [300, 50]
            });
            data.forEach(arr => {
                table.push(arr);
            });
            console.log(table.toString());
        }
    }
}
class Logger {
    constructor() {
        throw new Error('Logger called without singleton pattern');
    }
    static create(type) {
        Logger.instance = new PrivateLogger(type);
    }
    static getInstance() {
        return Logger.instance;
    }
}
module.exports = Logger;