(function() {

  const imgIcon="MDCDAf//////////////////////////////////////////////////////////////////////////5JP////////////////////5JJJP///////////////////5JJJP///////////////////JJJJJ///////////////////JJJJJ///////////////////JJJJJ///////////////////JJJJJ///////////////////5JJJP///////////////////5JJJP////////////////////5JP////////wAAAAAAAP///////+AAB////wAAAAAAAB//////+AAAAB/////////////////+AB//+AB////////////////wB////+AP//////////////+AP/+B//wB//////////////+B//+B//+B//////////////wP//+B///wPwAAAAAAAP////wP//+B///wPwAAAAAAAB///+B///+B///+B////////////+B///+B///+B////////////+B///+B///+B////////////+B///+AB//+B////////////+B////+AB/+B////////////+B/////+B/+BwAAAAAAAP////wP///////wPwAAAAAAAB////wP///////wP/////////////+B//////+B//////////////+AP/////wB///////////////wB////+AP///////////////+AB//+AB/////////////////4AAAAB///wAAAAAAAP///////+AAB////wAAAAAAAB/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////w==";
  const tasksTracked=[];
  let currentTask="";

  function clockInfoGet(taskName){
    return function(){
        console.log(__FILE__,"Get",taskName);
        if(taskName != currentTask){
          tasksTracked.push({
            "task":taskName,
            "time":Math.round(getTime())
          })
          currentTask=taskName;
        };
        return {
          text:taskName,
          img : atob(imgIcon),
        };
      };
  }

  function clockInfoShow(taskName){
    return function(){
        console.log(__FILE__,"Show",taskName);
        // start time counter
        let startTime = getTime();
      };
  }

  function clockInfoHide(taskName){
    return function(){
        console.log(__FILE__,"Hide",taskName);
        // save elapsed time
        let endTime = getTime();
      };
  }

  function clockInfoRun(taskName){
    return function(){
        console.log(__FILE__,"Run",taskName);
        if(tasksTracked.length >= 1){
          console.log(__FILE__,"Run",tasksTracked[tasksTracked.length].time - getTime());
        }
        // pause/resume
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

  function getMenuItems(){
    let menuItems = [];
    const taskList = require("Storage").readJSON("clkinfotimetrack.task.json",1)||[];
    taskList.forEach(task => {
      menuItems.push(formatMenuItem(task))
    });
    return menuItems;
  }


  return {
    name: "timeTracker",
    items: getMenuItems()
  };
})
