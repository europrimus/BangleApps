(function() {

  const imgIcon="Hh6BAAAAAAAAAAAB4AAAD8AAAD8AAAD8AAAD8AAAB4AAAADwP/AOcAAAYGAAAxjAAAhhP/BhhgABBggABAwgABgJv/AgBP/AwDAAAYGAAAOcAAADwf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const TimeTrackerLib = require("clkinfotimetrack");
  let tasksTracked=[];

  function init(){
    console.log("timeTracker","init");
    tasksTracked=TimeTrackerLib.readLog();
  }

  function getCurrentTask(){
    if(tasksTracked.length >= 1){
      return tasksTracked[tasksTracked.length - 1];
    }else{
      return undefined;
    }
  }

  function switchTask(taskName){
    if(
      getCurrentTask() === undefined ||
      taskName != getCurrentTask().name
    ){
      tasksTracked.push({
        "task":taskName,
        "time":Math.round(getTime())
      });
      TimeTrackerLib.writeLog(tasksTracked);
    }
  }

  function clockInfoGet(taskName){
    return function(){
      console.log("timeTracker","Get",taskName);
      let elapsedText="";
      if(
        tasksTracked.length >= 1 &&
        getCurrentTask().task == taskName
      ){
        let elapsedTime=Math.round(getTime() - getCurrentTask().time);
        elapsedText=" "+formatElapsedSeconds(elapsedTime);
        console.log("timeTracker","Get",elapsedText);
      }
      return {
        text: taskName+elapsedText,
        img: atob(imgIcon),
      };
    };
  }

  function clockInfoShow(taskName){
    return function(){
      console.log("timeTracker","Show",taskName);
    };
  }

  function clockInfoHide(taskName){
    return function(){
      console.log("timeTracker","Hide",taskName);
    };
  }

  function clockInfoRun(taskName){
    return function(){
      console.log("timeTracker","Run",taskName);
      switchTask(taskName);
      console.log("timeTracker","Run",tasksTracked);
    };
  }

  function formatMenuItem(taskName){
    return{
      name: taskName,
      get:  clockInfoGet(taskName),
      show: clockInfoShow(taskName),
      hide: clockInfoHide(taskName),
      run:  clockInfoRun(taskName)
    };
  }

  function formatElapsedSeconds(seconds) {
    interval = seconds / 86400; // 1d = 60s * 60m * 24h
    if (interval > 1) {
      return Math.floor(interval) + " d";
    }
    interval = seconds / 3600; // 1h = 60s * 60m
    if (interval > 1) {
      return Math.floor(interval) + " h";
    }
    interval = seconds / 60; // 1m = 60s
    if (interval > 1) {
      return Math.floor(interval) + " m";
    }
    return Math.floor(seconds) + " s";
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
  return {
    name: "timeTracker",
    items: getMenuItems()
  };
})
