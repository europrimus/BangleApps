(function() {

  function formatMenuItem(name,text,img){
    return { name : name,
      get : function() { return { text : text+"(g)",
        img : atob(img) }},
      show : function() {
          return { text : text+"s"}
        },
        hide : function() {
          return { text : text+"h"}
        }
      }
  }

  function readMenuData(){
    menuData = [
      {
        name:"work",
        text:"working",
        img:"GBgB/////////4D//gD//n5//n5/wAADgAABnn55nn55nn55nn55nn55nn55nn55nn55nn55nn55nn55nn55gAADwAAD////////"
      },
      {
        name:"sleep",
        text:"sleeping",
        img:"GBgB/////H4/+Bgf84HP88PP88PPgAABgAABn+f5n+f5n+f5gAABgAAB5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn4AAH4AAH////"
      }


    ]
    return menuData
  }

  function getMenuItems(){
    let menuItems = []
    const menuData = readMenuData()
    menuData.forEach(element => {
      menuItems.push(formatMenuItem(element))
    });

    return menuItems
  }


  return {
    name: "timeTracker",
    items: getMenuItems()
  };
})
