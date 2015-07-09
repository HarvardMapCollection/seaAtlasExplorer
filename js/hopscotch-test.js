/* globals hopscotch: false */

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
      content: 'Welcome to the Sea Atlas Explorer! This sidebar contains a few different tabs, each of which do different things. Let\'s take a look at them.',
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
      content: 'This is a list of every georeferenced image we have, grouped by atlas. It won\'t change based on your manipulation of the map.',
      placement: 'bottom',
      xOffset: '-14px',
      onNext: function() {
        activate_sidebar_tab("currentView");
      },
    },
    {
      target: 'currentViewTab',
      title: '<i class="fa fa-compass"></i> Map Based List',
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
      content: 'This is a simple toggle to either display or not display markers for charts on the map. It just hides them, so you can look at charts on the map without obstruction.',
      placement: 'right',
      yOffset: '-16px',
    },
    {
      target: 'bookmark_link',
      title: '<i class="fa fa-link"></i> Link to this view',
      content: 'Clicking this button will generate a link to the current map view. Specifically, it preserves the charts you have included in the display, and the area currently displayed on the map.',
      placement: 'right', 
      yOffset: '-16px',
    },
    {
      target: $(".leaflet-control-layers-toggle")[0],
      title: 'Layer Controls',
      content: 'From this menu, you can switch base layers on the main map, or toggle the visibility of charts that you have included for display.',
      placement: 'left',
      yOffset: '-10px'
    }
  ],
  showPrevButton: true,
  scrollTopMargin: 100
};

$("#start-tour").on("click",function() {hopscotch.startTour(main_tour)})