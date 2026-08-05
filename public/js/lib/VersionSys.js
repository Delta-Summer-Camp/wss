//VersionSys v1.26.8b
//Credits: mMeneske

class libarySys {

    #version = "v1.26.8b";
    #versionId = 3;
    #libs;
    #debug;
    #reqSg;
    #firstLoad;
    #converter = ["none", "v0.26.2a", "v0.26.2b", "v0.26.2c", "v0.26.6a", "v0.26.6b", "v1.26.8a", "VersionSys is outdated!"];

    constructor() {
        this.#libs = {
            versionSys: {
                exists: true,
                version: "1.26.8b",
                versionId: 3,
                requiredSG: null
            },
            debugSys: {
                exists: false,
                version: 0,
                versionId: 0,
                requiredSG: 0
            },
            cloneSys: {
                exists: false,
                version: 0,
                versionId: 0,
                requiredSG: 0
            }
        };

        this.#firstLoad = "VersionSys"
        this.#reqSg = this.#libs.versionSys.requiredSG;

        this.#existsFile("lib/DebugSys.js", "debugSys");
        this.#existsFile("lib/CloneSys.js", "cloneSys");

    }

    #existsFile(url, lib) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();


        if(http.status!=404){
            url = "./" + url;

            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            head.appendChild(script);

            this.#libs[lib].exists = true;

            if(this.#firstLoad === "VersionSys"){
                this.#firstLoad = lib;
            }
        }
    }

    updateVersion(lib, vers, versId, reqSG) {
        if(lib == "debugSys"){
            this.#debug = initDebug();
        }

        if(reqSG != this.#reqSg){
            if(this.#libs.debugSys.exists){
                if(this.#reqSg == null || reqSG == null){
                    if(this.#reqSg == null) {
                        this.#reqSg = reqSG;
                    }
                } else {
                    this.#debug.lightError("The libary", this.#firstLoad, "reqires version", this.#converter[this.#reqSg] , "of ScratchGame but", lib, "reqires", vers, "this could cause problems");
                }
            }
        }
        this.#libs[lib].version = vers;
        this.#libs[lib].versionId = versId;
        this.#libs[lib].requiredSG = reqSG;
    }

    get version() {
        return this.#version;
    }
    get versionId() {
        return this.#versionId;
    }

    get debugSys() {
        if(this.#libs.debugSys.exists){
            this.#debug.log(this.#libs.debugSys);
        }
        return this.#libs.debugSys.exists;
    }

    get cloneSys() {
        if(this.#libs.debugSys.exists){
            this.#debug.log(this.#libs.cloneSys);
        }
        return this.#libs.cloneSys.exists;
    }

}

let versionSys = new libarySys();