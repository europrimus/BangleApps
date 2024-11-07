const TimeTrackerLib=exports;
delete exports;

function bluetoothCommunicationInProgress(message){
    // show loading window
    Util.showModal(message);
}

function bluetoothCommunicationEnded(){
    Util.hideModal();
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
            config[key].push(inputFields[i].value);
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
