(function() {

  function clockInfoGet(item){
    return function(){
        console.log(__FILE__,"Get",item.name);
        return {
          text:item.text,
          img : atob(item.img),
        };
      };
  }

  function clockInfoShow(item){
    return function(){
        console.log(__FILE__,"Show",item.name);
        // start time counter
        let startTime = getTime();
      };
  }

  function clockInfoHide(item){
    return function(){
        console.log(__FILE__,"Hide",item.name);
        // save elapsed time
        let endTime = getTime();
      };
  }

  function clockInfoRun(item){
    return function(){
        console.log(__FILE__,"Run",item.name);
        // pause/resume
      };
  }

  function formatMenuItem(item){
    return{
      name: item.name,
      get:  clockInfoGet(item),
      show: clockInfoShow(item),
      hide: clockInfoHide(item),
      run:  clockInfoRun(item)
    };
  }

  function readMenuData(){
    menuData = [
      {
        name:"work",
        text:"working",
        img:"GBgB/////////4D//gD//n5//n5/wAADgAABnn55nn55nn55nn55nn55nn55nn55nn55nn55nn55nn55nn55gAADwAAD////////"
      },{
        name:"sleep",
        text:"sleeping",
        img:"GBgB/////H4/+Bgf84HP88PP88PPgAABgAABn+f5n+f5n+f5gAABgAAB5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4AAH4AAH////"
      }
    ];
    return menuData;
  }

  function getMenuItems(){
    let menuItems = [];
    const menuData = readMenuData();
    menuData.forEach(item => {
      menuItems.push(formatMenuItem(item))
    });
    return menuItems;
  }


  return {
    name: "timeTracker",
    items: getMenuItems()
  };
})
