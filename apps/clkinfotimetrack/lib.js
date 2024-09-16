exports = {
    logFile: "clkinfotimetrack.log.csv",

    readLog: function(){
        // open StorageFile
        const dataCSV = require("Storage").read(this.logFile);
        let tasksTracked = [];
        if(dataCSV){
            tasksTracked = this.csvJSON(dataCSV);
            console.log("timeTracker","readLog",dataCSV,"<==",this.logFile);
        }
        return tasksTracked;
    },

    writeLog: function(taskJson){
        const dataCSV = this.jsonCSV(taskJson);
        require("Storage").write(this.logFile, dataCSV);
        console.log("timeTracker","writeLog",dataCSV,"==>",this.logFile);
    },

    csvJSON: function (csv){
        //var csv is the CSV file without header
        var lines=csv.split("\n");
        var result = [];
        lines.forEach(line => {
            var data=line.split(",");
            // TODO: check if data and if string and digit
            result.push({
                "task":data[0],
                "time":data[1]
            });
        });
        return JSON.stringify(result);
    },

    jsonCSV: function (json){
        var result = "";
        json.forEach(line => {
            result = result.concat('\n', line.task+","+line.time);
        });
        return result;
    }
};