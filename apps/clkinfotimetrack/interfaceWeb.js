const TimeTrackerLib=exports;
delete exports;

function bluetoothCommunicationInProgress(message){
    disableLoadLogDataBtn();
    // show loading window
    Util.showModal(message);
}

function bluetoothCommunicationEnded(){
    Util.hideModal();
    enableLoadLogDataBtn();
}

async function getLogData() {
    console.log("<ClockInfoTimeTracker>","getLogData","start");
    const dataElement = document.getElementById("data");
    bluetoothCommunicationInProgress("Loading data...");
    // get the data
    dataElement.innerHTML = "";
    return Util.readStorage( TimeTrackerLib.logFile(), data => {
        console.log("<ClockInfoTimeTracker>","getLogData","data length", data.length);
        // remove window
        tasksTracked = TimeTrackerLib.csvJSON(data);
        console.log("<ClockInfoTimeTracker>","getLogData","tasksTracked length", tasksTracked.length);
        // If no data, report it and exit
        if (tasksTracked.length == 0) {
            dataElement.innerHTML = "<b>No data found</b>";
            bluetoothCommunicationEnded();
            return;
        }
        // Otherwise parse the data and output it as a table
        let logNode = document.createElement('dl');
        for (let i = 0; i < (tasksTracked.length - 1); i++) {
            let keyNode=document.createElement('dt');
            keyNode.innerText=tasksTracked[i].task;
            logNode.appendChild(keyNode);
            let valNode=document.createElement('dd');
            let start = new Date(tasksTracked[i].time * 1000);
            valNode.innerText="start at : " + start.toLocaleString()
            if( i +1 < tasksTracked.length){
                valNode.innerText += ", duration :" + formatElapsedSeconds(tasksTracked[i+1].time - tasksTracked[i].time);
            }
            logNode.appendChild(valNode);
        }
        dataElement.appendChild(logNode);
        bluetoothCommunicationEnded();
    });
}

function enableLoadLogDataBtn(){
    let btnLoadLogData = document.getElementById('btnLoadLogData')
    btnLoadLogData.removeAttribute('disabled')
    btnLoadLogData.addEventListener('click', getLogData)
}

function disableLoadLogDataBtn(){
    let btnLoadLogData = document.getElementById('btnLoadLogData')
    btnLoadLogData.setAttribute('disabled', 'disabled')
    btnLoadLogData.removeEventListener('click', getLogData)
}


function formatElapsedSeconds(elapsedSeconds){
    let hours   = Math.floor(elapsedSeconds / 3600);
    let minutes = Math.floor((elapsedSeconds - (hours * 3600)) / 60);
    let seconds = elapsedSeconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

async function getConf(){
    console.log("<ClockInfoTimeTracker>","getConf","start");
    const ConfigElement = document.getElementById("config");
    bluetoothCommunicationInProgress("Loading config...");
    ConfigElement.innerHTML = "";
    return Util.readStorageJSON(TimeTrackerLib.confFile(), config => {
        console.log("<ClockInfoTimeTracker>","getConf", config);
        bluetoothCommunicationEnded();
        // If no config, report it and exit
        if (config == undefined) {
            config = TimeTrackerLib.defaultConf();
            console.log("<ClockInfoTimeTracker>","getConf", "no config found");
        }
        // Otherwise parse the config and output it as a table
        let confNode = document.createElement('dl');
        for (let key in config){
            genConfNode(confNode,key,config[key]);
        }
        ConfigElement.appendChild(confNode);
        console.log("<ClockInfoTimeTracker>","getConf", "end display config");
    });
}

function genConfNode(confNode,key,val){
    let keyNode=document.createElement('dt');
    keyNode.innerText=key;
    confNode.appendChild(keyNode);
    let valNode=document.createElement('dd');
    switch (typeof val) {
    case "boolean":
        valNode.appendChild(genInputOnOff(key, val));
        break;
    case "object":
        if(Array.isArray(val)){
            let listNode = document.createElement("ul");
            val.forEach(value=>{
                if(value){genListInput(listNode,key,value);};
            })
            genListInput(listNode, key);
            valNode.appendChild(listNode);
        }
        break;
    default:
        valNode.innerText=val;
    }
    confNode.appendChild(valNode);
    return confNode;
}

function genListInput(listNode,name, value=""){
    let ListElementNode = document.createElement("li");
    ListElementNode.classList.add("no-bullet");
    ListElementNode.appendChild(genInputText(name, value));
    listNode.appendChild(ListElementNode);
    return listNode;
}

function genInputText(name, val){
    const inputText = document.createElement('input');
    inputText.type = "text";
    inputText.name = name;
    inputText.classList.add('conf-input');
    inputText.classList.add('form-input');
    inputText.maxLength=10;
    inputText.value = (val?.substring(0, inputText.maxLength) || "");
    inputText.onchange = save;
    return inputText;
}

function genInputOnOff(name, bool){
    const onOffCheck = document.createElement('input');
    onOffCheck.type = 'checkbox';
    onOffCheck.checked = bool;
    onOffCheck.name = name;
    onOffCheck.onchange = save;
    const onOffIcon = document.createElement('i');
    onOffIcon.classList.add('form-icon');
    const onOff = document.createElement('label');
    onOff.classList.add('form-switch');
    onOff.appendChild(onOffCheck);
    onOff.appendChild(onOffIcon);
    return onOff;
}

function save(){
    console.log("<ClockInfoTimeTracker>","save");
    let config = TimeTrackerLib.defaultConf();
    let inputFields=document.getElementsByTagName("input");
    for(let i = 0; i < inputFields.length; i++){
        const key = inputFields[i].name;
        const val = inputFields[i].value;
        switch (typeof config[key]) {
        case "boolean":
            config[key]=inputFields[i].checked;
            break;
        case "object":
            if(inputFields[i].value.length > 0){
                config[key].push(inputFields[i].value);
            }
            break;
        default:
            console.warn("<ClockInfoTimeTracker>","save","unknown type of key",key,"not saved");
        };
    };
    console.log("<ClockInfoTimeTracker>","save","end config",config);
    bluetoothCommunicationInProgress("Save config...");
    Util.writeStorage(TimeTrackerLib.confFile(),JSON.stringify(config),args => {
        bluetoothCommunicationEnded();
        getConf();
    })
}

// Called when app starts
function onInit() {
    getConf()
    .catch((reason) => {console.log("<ClockInfoTimeTracker>","getConf", reason)})
    .finally(()=>{
        console.log("<ClockInfoTimeTracker>","getConf","End")
    })
}
