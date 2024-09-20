exports = {
    logFile: "clkinfotimetrack.log.csv",
    confFile:"clkinfotimetrack.conf.json",

    readLog: function(){
        // open StorageFile
        const dataCSV = require("Storage").read(this.logFile);
        let tasksTracked = [];
        if(dataCSV){
            tasksTracked = this.csvJSON(dataCSV);
            if(debug) console.log("timeTracker","readLog",dataCSV,"<==",this.logFile);
        }
        return tasksTracked;
    },

    writeLog: function(taskJson){
        const dataCSV = this.jsonCSV(taskJson);
        require("Storage").write(this.logFile, dataCSV);
        if(debug) console.log("timeTracker","writeLog",dataCSV,"==>",this.logFile);
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
        return require("Storage").readJSON(confFile,1).taskName || [];
    },

    writeTaskNames: function(taskNames){
        let conf = require("Storage").readJSON(confFile,1) || {"taskName":[],"debug":false};
        conf.taskName = taskNames;
        require("Storage").writeJSON(confFile,conf);
    },

    isDebug: function(){
        return require("Storage").readJSON(confFile,1).debug || false;
    }
};