//DebugSys v1.26.8b
//Credits: mMeneske

class debugGroup {
    #enableLightWarnings;
    #enableHardWarnings;
    #enableLightErrors;
    #enableLog;

    constructor(toggleLog = false, lightWarn = toggleLog, hardWarn = toggleLog, lightError = true) {
            this.#enableLog = toggleLog;

            this.#enableLightWarnings = lightWarn;
            this.#enableHardWarnings = hardWarn;
            this.#enableLightErrors = lightError;

    }

    log(){
        if(this.#enableLog){
            let output = arguments[0];
            for(let i = 1; i < arguments.length; ++i){
                output += " " + arguments[i];
            }
        console.log(output);
        }
    }

    lightWarn(){
        if(this.#enableLightWarnings){
            let output = arguments[0];
            for(let i = 1; i < arguments.length; ++i){
                output += " " + arguments[i];
            }
        console.warn(output);
        }
    }

    hardWarn(){
        if(this.#enableHardWarnings){
            let output = arguments[0];
                for(let i = 1; i < arguments.length; ++i){
                    output += " " + arguments[i];
                }
            console.warn(output);
        }
    }

    lightError(){
        if(this.#enableLightErrors){
            let output = arguments[0];
            for(let i = 1; i < arguments.length; ++i){
                output += " " + arguments[i];
            }
        console.error(output);
        }
    }

    hardError(){
        let output = arguments[0];
            for(let i = 1; i < arguments.length; ++i){
                output += " " + arguments[i];
            }
        console.error("Fatal: " + output);

        console.error(Crashed);
    }

    get enableLog() {
        return this.#enableLog;
    }

    set enableLog(set){
        if(set == true || set == false){
            this.#enableLog = set;
        }
        if(set == 0 || set == 1){
            if(set == 1){
                this.#enableLog = true;
            } else {
                this.#enableLog = false;
            }
        }
    }

    get enableLightWarnings() {
        return this.#enableLightWarnings;
    }

    set enableLightWarnings(set){
        if(set == true || set == false){
            this.#enableLightWarnings = set;
        }
        if(set == 0 || set == 1){
            if(set == 1){
                this.#enableLightWarnings = true;
            } else {
                this.#enableLightWarnings = false;
            }
        }
    }

    get enableHardWarnings() {
        return this.#enableHardWarnings;
    }

    set enableHardWarnings(set){
        if(set == true || set == false){
            this.#enableHardWarnings = set;
        }
        if(set == 0 || set == 1){
            if(set == 1){
                this.#enableHardWarnings = true;
            } else {
                this.#enableHardWarnings = false;
            }
        }
    }

    get enablelightErrors() {
        return this.#enableLightErrors;
    }

    set enablelightErrors(set){
        if(set == true || set == false){
            this.#enableLightErrors = set;
        }
        if(set == 0 || set == 1){
            if(set == 1){
                this.#enableLightErrors = true;
            } else {
                this.#enableLightErrors = false;
            }
        }
    }
}

function initDebug(log, lightWarn, hardWarn, lightError){
    return new debugGroup(log, lightWarn, hardWarn, lightError);
}

let debugSys = {
    version: "1.26.8b",
    versionId: 2,
    SGid: null,
    connected: false,
    debug: 0
};

if(typeof versionSys !== "undefined"){
    debugSys.connected = true;
    versionSys.updateVersion("debugSys", debugSys.version, debugSys.versionId, debugSys.SGid);
}