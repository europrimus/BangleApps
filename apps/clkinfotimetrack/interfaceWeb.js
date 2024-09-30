const TimeTrackerLib=exports;
delete exports;

async function getConf(){
    console.log("<ClockInfoTimeTracker>","getConf","start");
    const ConfigElement = document.getElementById("config");
    // show loading window
    Util.showModal("Loading config...");
    // get the config
    ConfigElement.innerHTML = "";
    return Util.readStorageJSON(TimeTrackerLib.confFile, config => {
        console.log("getConf", config);
        // remove window
        Util.hideModal();
        // If no config, report it and exit
        if (config == undefined) {
            config = { "taskName": [], "debug": false };
            console.log("getConf", "no config found");
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
        valNode.appendChild(genInputOnOff(val));
        break;
    case "object":
        if(Array.isArray(val)){
            let listNode = document.createElement("ul");
            val.forEach(value=>{
                genListInput(listNode,value);
            })
            genListInput(listNode);
            valNode.appendChild(listNode);
        }
        break;
    default:
        valNode.innerText=val;
    }
    confNode.appendChild(valNode);
    return confNode;
}

function genListInput(listNode,value=""){
    let ListElementNode = document.createElement("li");
    ListElementNode.classList.add("no-bullet");
    ListElementNode.appendChild(genInputText(value));
    listNode.appendChild(ListElementNode);
    return listNode;
}

function genInputText(val){
    const inputText = document.createElement('input');
    inputText.type = "text";
    inputText.classList.add('conf-input');
    inputText.classList.add('form-input');
    inputText.maxLength=10;
    inputText.value = (val?.substring(0, inputText.maxLength) || "");
    inputText.onchange = (e => {
      save();
    });
    return inputText;
}

function genInputOnOff(bool){
    const onOffCheck = document.createElement('input');
    onOffCheck.type = 'checkbox';
    onOffCheck.checked = bool;
    onOffCheck.onchange = e => {
      save();
    };
    const onOffIcon = document.createElement('i');
    onOffIcon.classList.add('form-icon');
    const onOff = document.createElement('label');
    onOff.classList.add('form-switch');
    onOff.appendChild(onOffCheck);
    onOff.appendChild(onOffIcon);
    return onOff;
}

function save(){
    // TODO: save data to config
    console.log("save");
}

// Called when app starts
function onInit() {
    getConf()
    .catch((reason) => {console.log("<ClockInfoTimeTracker>","getConf", reason)})
    .finally(()=>{
        console.log("<ClockInfoTimeTracker>","getConf","End")
    })
}
