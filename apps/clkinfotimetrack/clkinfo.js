(function() {

  const imgIcon="Hh6BAAAAAAAAAAAB4AAAD8AAAD8AAAD8AAAD8AAAB4AAAADwP/AOcAAAYGAAAxjAAAhhP/BhhgABBggABAwgABgJv/AgBP/AwDAAAYGAAAOcAAADwf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const tasksTracked=[];
  const TimeTrackerLib = require("clkinfotimetrack");
  let currentTask="";

  function switchTask(taskName){
    if(taskName != currentTask){
      tasksTracked.push({
        "task":taskName,
        "time":Math.round(getTime())
      });
      currentTask=taskName;
      TimeTrackerLib.writeLog(tasksTracked);
    }
  }

  function clockInfoGet(taskName){
    return function(){
      console.log("timeTracker","Get",taskName);
      let elaspsedText="";
      if(
        tasksTracked.length >= 1 &&
        tasksTracked[tasksTracked.length - 1].task == taskName
      ){
        let elaspsedTime=Math.round(getTime() - tasksTracked[tasksTracked.length - 1].time);
        elaspsedText=" "+formatElapsedSeconds(elaspsedTime);
        console.log("timeTracker","Get",elaspsedText);
      }
      return {
        text: taskName+elaspsedText,
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


  return {
    name: "timeTracker",
    items: getMenuItems()
  };
})
