var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// my personal API Key and url string for Aggie Football through import.io
var myUrl = '';

// create main loading window
var splashWindow = new UI.Window({
  backgroundColor: 'white' 
});

// create A&M Logo
var image = new UI.Image({
  position: new Vector2(19, 34),
  size: new Vector2(106, 100),
  image: 'images/TAMU_LOGO.PNG',
});
image.compositing('set');

// add image to window
splashWindow.add(image);

var text = new UI.Text({
  position: new Vector2(0, 150),
  size: new Vector2(144, 18),
  text: 'Fetching schedule...',
  font: 'GOTHIC_14',
  color: 'black',
  textOverflow: 'fill',
  textAlign: 'center',
  backgroundColor: 'clear',
});

// add text to window
splashWindow.add(text);

// load window
splashWindow.show();

// get data from API
getData();

// parse data and return
var parseFeed = function(data) {
  var quantity = data.extractorData.data[0].group.length;
  console.log('Number of games = ' + quantity);

  var items = [];
  var startDate = '';
  var startTime = '';
  var teamName = '';
  var stadium = '';
  var loc = '';
  
  for(var i=0; i<quantity; i++) {
    if(data.extractorData.data[0].group[i].start_date[0].text) {
      startDate = data.extractorData.data[0].group[i].start_date[0].text;
      startDate = shortenDate(startDate);
      console.log('startDate = ' + startDate);
    }
    if(data.extractorData.data[0].group[i].start_time[0].text) {
      startTime = data.extractorData.data[0].group[i].start_time[0].text;
      console.log('startTime = ' + startTime);
    }    
    if(data.extractorData.data[0].group[i].team_name[0].text) {
      teamName = data.extractorData.data[0].group[i].team_name[0].text;
      console.log('teamName = ' + teamName);
    }
    if(data.extractorData.data[0].group[i].stadium[0].text) {
      stadium = data.extractorData.data[0].group[i].stadium[0].text;
      console.log('stadium = ' + stadium);
    }
    if(stadium=='Kyle Field') {
      loc = '@Home';
    } else {
      loc = '';
    }
    items.push({
      title:teamName,
      subtitle:startDate + ' ' + startTime + ' ' + loc,
    });
  }
  return items;
};

function getData() {
  // make request to import.io
  ajax(
    {
      url: myUrl,
      type: 'json'
    },
    function(data) {
      var menuItems = parseFeed(data);
      
      var resultsMenu = new UI.Menu({
        sections: [{
          title: 'Texas A&M Football',
          items: menuItems,
        }]
      });
      
      resultsMenu.on('select', function(e) {
        console.log('Item number ' + e.itemIndex + ' was pressed');
        var startDate = '';
        var startTime = '';
        var teamName = '';
        var city = '';
        var stadium = '';
        var tvRadio1 = '';
        var tvRadio2 = '';

        if(data.extractorData.data[0].group[e.itemIndex].start_date) {
          if(data.extractorData.data[0].group[e.itemIndex].start_date[0]) {
            startDate = data.extractorData.data[0].group[e.itemIndex].start_date[0].text;
            startDate = shortenDate(startDate);
          }
        }
        if(data.extractorData.data[0].group[e.itemIndex].start_time) {
          if(data.extractorData.data[0].group[e.itemIndex].start_time[0]) {
            startTime = data.extractorData.data[0].group[e.itemIndex].start_time[0].text;
          }
        }    
        if(data.extractorData.data[0].group[e.itemIndex].team_name) {
          if(data.extractorData.data[0].group[e.itemIndex].team_name[0]) {
            teamName = data.extractorData.data[0].group[e.itemIndex].team_name[0].text;
          }
        }
        if(data.extractorData.data[0].group[e.itemIndex].city) {
          if(data.extractorData.data[0].group[e.itemIndex].city[0]) {
            city = data.extractorData.data[0].group[e.itemIndex].city[0].text;
          }
        }
        if(data.extractorData.data[0].group[e.itemIndex].stadium) {
          if(data.extractorData.data[0].group[e.itemIndex].stadium[0]) {
            stadium = data.extractorData.data[0].group[e.itemIndex].stadium[0].text;
          }
        }
        if(data.extractorData.data[0].group[e.itemIndex].TV_Radio) {
          if(data.extractorData.data[0].group[e.itemIndex].TV_Radio[0]) {
            tvRadio1 = data.extractorData.data[0].group[e.itemIndex].TV_Radio[0].text;
          }
          if(data.extractorData.data[0].group[e.itemIndex].TV_Radio[1]) {
            tvRadio2 = data.extractorData.data[0].group[e.itemIndex].TV_Radio[1].text;
          }        
        }
        var detailCard = new UI.Card({
          title:teamName,
          subtitle:startDate + ' ' + startTime,
          body:'@' + stadium + '\n' + city + '\n' + tvRadio1 + '\n' + tvRadio2,
          scrollable:true,
          style:'small'
        });
        detailCard.show();
      });
      
      resultsMenu.show();
      splashWindow.hide();
    },
    function(error) {
      console.log('Download failed: ' + error);
    }
  );
}

function shortenDate(date) {
  var month = date.split(" ")[1];
  var day = date.split(" ")[2];
  var temp;
  switch(month) {
    case "January":
      temp = 1;
      break;
    case "February":
      temp = 2;
      break;
    case "March":
      temp = 3;
      break;
    case "April":
      temp = 4;
      break;
    case "May":
      temp = 5;
      break;
    case "June":
      temp = 6;
      break;
    case "July":
      temp = 7;
      break;
    case "August":
      temp = 8;
      break;
    case "September":
      temp = 9;
      break;
    case "October":
      temp = 10;
      break;
    case "November":
      temp = 11;
      break;
    case "December":
      temp = 12;
      break;
  }
  return temp + '/' + day;
}
