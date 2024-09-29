const confFile= "clkinfotimetrack.conf.json";
const logFile= "clkinfotimetrack.log.csv";

function getData() {
    logToHtml("getData","start");
    const dataElement = document.getElementById("data");
    let csvData = "";
    // show loading window
    Util.showModal("Loading data...");
    // get the data
    dataElement.innerHTML = "";
    Util.readStorageFile( logFile, data => {
        logToHtml("getData", data);
        csvData = data.trim();
        // remove window
        Util.hideModal();
        // If no data, report it and exit
        if (data.length == 0) {
            dataElement.innerHTML = "<b>No data found</b>";
            return;
        }
        // Otherwise parse the data and output it as a table
        dataElement.innerHTML = '<pre>'+csvData+'</pre>';
    });
}

function getConf(){
    logToHtml("getConf","start");
    const ConfigElement = document.getElementById("config");
    // show loading window
    Util.showModal("Loading config...");
    // get the config
    ConfigElement.innerHTML = "";
    Util.readStorageJSON(confFile, config => {
        logToHtml("getConf", config);
        // remove window
        Util.hideModal();
        // If no config, report it and exit
        if (config == undefined) {
            config = { "taskName": [], "debug": false };
            logToHtml("getConf", "no config found");
        }
        // Otherwise parse the config and output it as a table
        ConfigElement.innerHTML = `
<dl>
<dt> Debug</dt>
<dd>`+ config.debug ? "true" : "false" +`</dd>
</dl>
`;
        ConfigElement.innerHTML += `Tasks : \n<ul>\n`;
        configJson.taskName.forEach(task =>{
            ConfigElement.innerHTML +=`\n<li>`+task+`</li>\n`;
        });
        ConfigElement.innerHTML += `</ul>\n`;
    });

}

function logToHtml(msg){
    let logContent = document.getElementById("log").innerText;
    document.getElementById("log").innerText=logContent.concat(msg+"\n");
}

// Called when app starts
function onInit() {
    getConf();
    getData();
}