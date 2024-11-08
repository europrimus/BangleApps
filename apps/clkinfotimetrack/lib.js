exports = {
    logFile: function(){
        // the maximum length for filenames is 28 characters
        // clkinfotimetrack_YYYY-WW.csv : 28 chars
        const baseName="clkinfotimetrack_";
        const ext=".csv";
        year = (new Date()).getFullYear();
        week = this.calcWeek();
        let name = baseName + year + '-' + week + ext;
        return name;
    },
    confFile:function(){return "clkinfotimetrack.conf.json"},
    debug:false,

    calcWeek: function(date) {
        if(date === undefined){
            date = new Date();
        }
        // new Date(year, monthIndex, day); fist month is 0
        var firstJanuary = new Date(date.getFullYear(),0,1);
        var today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        // one day : 86400 : 24h x 60m x 60s
        var dayOfYear = ((today - firstJanuary + 86400000)/86400000);
        return Math.ceil(dayOfYear/7);
    },

    defaultConf: function(){
        return {"taskName":[],"debug":false}
    },

    readLog: function(){
        // open StorageFile
        const dataCSV = require("Storage").read(this.logFile());
        let tasksTracked = [];
        if(dataCSV){
            tasksTracked = this.csvJSON(dataCSV);
            if(this.debug) console.log("timeTracker","readLog",dataCSV,"<==",this.logFile());
        }
        return tasksTracked;
    },

    writeLog: function(taskJson){
        const dataCSV = this.jsonCSV(taskJson);
        require("Storage").write(this.logFile(), dataCSV);
        if(this.debug) console.log("timeTracker","writeLog",dataCSV,"==>",this.logFile());
    },

    csvJSON: function (csv){
        //var csv is the CSV file without header
        var lines=csv.split("\n");
        var result = [];
        lines.forEach(line => {
            var data=line.split(",");
            // check if data and if string and digit
            const startTime = parseInt(data[1]);
            if(
                data[0] &&
                ! isNaN(startTime)
            ){
                result.push({
                    "task":data[0],
                    "time":startTime
                });
            }
        });
        return result;
    },

    jsonCSV: function (json){
        var result = "taskName,startTime";
        json.forEach(line => {
            result = result.concat('\n', line.task+","+line.time);
        });
        return result;
    },

    readTaskNames: function(){
        return require("Storage").readJSON(this.confFile(),1).taskName || [];
    },

    writeTaskNames: function(taskNames){
        let conf = require("Storage").readJSON(this.confFile(),1) || self.defaultConf();
        conf.taskName = taskNames;
        require("Storage").writeJSON(this.confFile(),conf);
    },

    isDebug: function(){
        this.debug=require("Storage").readJSON(this.confFile(),1).debug || false;
        return this.debug;
    }
};