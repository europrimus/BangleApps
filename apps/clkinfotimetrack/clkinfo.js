(function() {

  const imgIcon=require("heatshrink").decompress(atob("j0ewIif+E/+EOuAGBsFggEDjHAgEIsIOBsOGgEBg0IgEEhkggEYhO/+Eggn/4HAmASBwOAEIOcFAMD4IOBKLoA=="));
  const imgIconRecording=require("heatshrink").decompress(atob("j0ewYaXgmSBREJkmQBQ8CpMkCxGSpIKIkmSoAKHgMkwBFK//wgED/4ABAoMAh/4j4FCAAkfEIICCAAk/gF+gH8BQsOCgUHFgoIC8EB/AVEg5QBBAIaBLInAIgPAgY4FGoIUBg/jFggRDDQIKCI4QCCgZlGIIICDMo3gv47BBY4jBg4sFAH4AYA=="));
  const TimeTrackerLib = require("clkinfotimetrack");
  let tasksTracked=[];
  let clockInfo = {};
  const debug=false;

  function init(){
    if(debug) console.log("timeTracker","init");
    tasksTracked=TimeTrackerLib.readLog();
    clockInfo = {
      name: "timeTracker",
      items: getMenuItems()
    };
  }

  function getCurrentTask(){
    if(tasksTracked.length >= 1){
      return tasksTracked[tasksTracked.length - 1];
    }else{
      return undefined;
    }
  }

  function getCurrentItems(){
    for(let index=0; index<clockInfo.items.length; index++) {
      if(debug) console.debug("timeTracker","getCurrentItems",index,clockInfo.items[index].name);
      if(clockInfo.items[index].uses == 1){
        return index;
      }
    }
  }

  function switchTask(taskName){
    if(debug) console.log("timeTracker","switchTask",taskName,getCurrentTask());
    if(
      getCurrentTask() === undefined ||
      taskName != getCurrentTask().task
    ){
      tasksTracked.push({
        "task":taskName,
        "time":Math.round(getTime())
      });
      TimeTrackerLib.writeLog(tasksTracked);
      clockInfo.items[getCurrentItems()].emit('redraw');
    }
  }

  function clockInfoGet(taskName){
    return function(){
      if(debug) console.log("timeTracker","Get",taskName);
      let elapsedText="";
      let icon=imgIcon;
      if(
        tasksTracked.length >= 1 &&
        getCurrentTask().task == taskName
      ){
        let elapsedTime=Math.round(getTime() - getCurrentTask().time);
        elapsedText=" "+formatElapsedSeconds(elapsedTime);
        icon=imgIconRecording;
        if(debug) console.log("timeTracker","Get",elapsedText);
      }
      return {
        text: taskName+elapsedText,
        img: icon,
      };
    };
  }

  function clockInfoShow(taskName){
    return function(){
      if(debug)  console.log("timeTracker","Show",taskName,this);
    };
  }

  function clockInfoHide(taskName){
    return function(){
      if(debug)  console.log("timeTracker","Hide",taskName,this);
    };
  }

  function clockInfoBlur(taskName){
    return function(){
      if(debug)  console.log("timeTracker","blur",taskName,this);
    };
  }

  function clockInfoRun(taskName){
    return function(){
      if(debug)  console.log("timeTracker","Run",taskName,this);
      switchTask(taskName);
      if(debug) console.log("timeTracker","Run",tasksTracked.slice(-3));
    };
  }

  function formatMenuItem(taskName){
    return{
      name: taskName,
      get:  clockInfoGet(taskName),
      show: clockInfoShow(taskName),
      hide: clockInfoHide(taskName),
      run:  clockInfoRun(taskName),
      blur: clockInfoBlur(taskName)
    };
  }

  function formatElapsedSeconds(seconds) {
    interval = seconds / 86400; // 1d = 60s * 60m * 24h
    if (interval > 2) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600; // 1h = 60s * 60m
    if (interval > 1.5) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60; // 1m = 60s
    if (interval > 1.5) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  }

  function getMenuItems(){
    let menuItems = [];
    const taskList = require("Storage").readJSON("clkinfotimetrack.task.json",1)||[];
    taskList.forEach(task => {
      menuItems.push(formatMenuItem(task));
    });
    return menuItems;
  }

  init();
  return clockInfo;
})
