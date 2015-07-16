/* globals hopscotch: false */

// cookie functions
var createCookie = function(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}
var readCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
var eraseCookie = function(name) {
  createCookie(name,"",-1);
}

/* ======================= */
/* SEA ATLAS EXPLORER TOUR */
/* ======================= */
var activate_sidebar_tab = function(tabName) {
  $(".sidebar-tabs li").removeClass("active");
  $(".sidebar-pane").removeClass("active");
  $("#"+tabName).addClass("active");
  $("#"+tabName+"Tab").addClass("active");
}
main_tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'sidebar',
      title: 'Sea Atlas Explorer',
      content: 'Welcome to the Sea Atlas Explorer! This tour will take you through the interface, but you can stop it at any time with the x in the corner.',
      placement: 'right',
      arrowOffset: 'center',
      yOffset: 'center',
      onNext: function() {
        activate_sidebar_tab("bigList");
      },
    },
    {
      target: 'bigListTab',
      title: '<i class="fa fa-list"></i> Comprehensive List',
      content: "This is a list of every sea chart that we have, grouped by atlas. You can think of this tab as a way to browse the atlases in their original order.",
      placement: 'bottom',
      xOffset: '-14px',
      onNext: function() {
        $("#bigList .collapseL1 div")[0].click();
      }
    },
    {
      target: $("#bigList .collapseL1")[0],
      title: 'Atlases',
      content: '<p>Each atlas title is clickable, expanding into a list of charts like this one.</p><p>You can hover over them to see their extent on the map, or click on them to zoom to their location.</p><p>You can also click the checkboxes to the right to view georeferenced images on the map.</p>',
      placement: 'right',
      onNext: function() {
        $("#bigList .collapseL1 div")[0].click();
        activate_sidebar_tab("currentView");
      },
    },
    {
      target: 'currentViewTab',
      title: '<i class="fa fa-compass"></i> Current View',
      content: 'This list of atlases and the charts that they contain updates as you zoom and pan on the map. You can use this list to find charts in a particular area, just by going to that area on the map.',
      placement: 'bottom',
      xOffset: '-14px',
      onNext: function() {
        activate_sidebar_tab("selections");
      },
      onPrev: function() {
        activate_sidebar_tab("bigList");
      },
    },
    {
      target: 'selectionsTab',
      title: '<i class="fa fa-check-square-o"></i> Charts Displayed',
      content: 'This tab is where you can see a list of charts that you\'ve added to the map. From here, you can adjust their transparency and deselect some or all of them. If you can\'t see a chart you\'ve included, just click on its name and the map will zoom to its location.',
      placement: 'bottom',
      xOffset: '-14px',
      onNext: function() {
        activate_sidebar_tab("help");
      },
      onPrev: function() {
        activate_sidebar_tab("currentView");
      },
    },
    {
      target: 'helpTab',
      title: '<i class="fa fa-question"></i> Help',
      content: 'From this tab, you can re-play this tour, or see some tips on how to look through this exhibition.',
      placement: 'bottom',
      xOffset: '-14px',
      onPrev: function() {
        activate_sidebar_tab("selections");
      },
    },
    {
      target: 'marker_switch',
      title: '<i class="fa fa-map-marker"></i> Marker Toggle',
      content: 'This is a simple toggle to turn markers on and off on the map. It just hides them, so you can look at charts on the map without obstruction.',
      placement: 'right',
      yOffset: '-16px',
    },
    {
      target: 'bookmark_link',
      title: '<i class="fa fa-link"></i> Link to this view',
      content: 'Clicking this button will generate a link to the current map view. Specifically, it saves the charts you have included in the display, and the area currently displayed on the map.',
      placement: 'right', 
      yOffset: '-16px',
    },
    {
      target: $(".leaflet-control-layers-toggle")[0],
      title: 'Layer Controls',
      content: 'From this menu, you can switch base layers on the main map. There are several to choose from, so feel free to play around.',
      placement: 'left',
      yOffset: '-10px'
    }
  ],
  showPrevButton: true,
  scrollTopMargin: 100,
};

$("#start-tour").on("click",function() {hopscotch.startTour(main_tour)})

if (readCookie('tourCompleted')) {
  // Initial site tour complete, nothing to do.
} else {
  createCookie('tourCompleted',true,30)
  hopscotch.startTour(main_tour)
}
