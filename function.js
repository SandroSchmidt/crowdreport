parking_list ={geo:[],tooltip:[],usage:[]}
newarea =[];
allowed_users=["sandro","marc","test1","test2","test3"]
existing_markers=[]
isZooming = false
set_area=0
set_name ="wrong reporter"
farbskala = ["lightblue","#00B0F0","#00B0F0","#92D050","#92D050","#FFFF00","#FFFF00","#FF9201","#FF9201","#FF0000",'red',"#ee00ff","#ee00ff","#ee00ff","#ee00ff","#ee00ff"]
  eventloc = [0,0]
list_of_reporters = ["demo","sandro","marcel","medical","mark",
"marc","dave","sasha","anto","olly","sjors","conor","jasja","dessie","neil","claire","colm","ger","ian","martin","eric","peter"]
list_of_credentials= ["none","p","m","none","m", "m","d","s","a","o","s","c","j","d","n","c","c","g","i","m","e","p"]
set_pos=[9,9]
da1 = new Date("2023-12-14T10:00")
da2 = new Date("2023-12-15T10:00")
da3 = new Date("2023-12-16T10:00")
da4 = new Date("2023-12-17T10:00")
eventmarkertoggle = false
locked = true

function select_area(set_area){
  ausgew_area = stages_list[set_area].name

       d3.select('#densInput').attr('value',current[ausgew_area].density)
        d3.select('#dens_p').text(current[ausgew_area].density)
        d3.select('#usageInput').attr('value',current[ausgew_area].usage)
        d3.select('#usage_p').text(current[ausgew_area].usage+" %")
        d3.select('#tensInput').attr('value',current[ausgew_area].tension)
        d3.select('#tens_p').text(current[ausgew_area].tension+" %")



        set_dens = current[ausgew_area].density
        set_usage = current[ausgew_area].usage
        set_tens = current[ausgew_area].tension
        //dens_slider.node().dispatchEvent(new Event('input'));

}


function read_a_day(jahr,tager){
  database = firebase.database();
  ref = database.ref('/soundstorm/SS'+jahr+'/day'+tager);
  ref.on('value', (snapshot) => {
  daydata = snapshot.val()
         

})//.then(() => {                console.table(daydata) }         )
}

function draw_arrow(von,nach,farbe,dicke,ttl){
 farbe = "green"
  if (dicke>5){farbe = "lime"}
  if (dicke>10){farbe = "red"}
  var polyline = L.polyline([von,nach],{weight:dicke,color:farbe}).addTo(movement_layer);
  var arrowHead = L.polylineDecorator(polyline, {    patterns: [   
       { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ 
        pixelSize: dicke, polygon: false, 
        pathOptions: { fillOpacity: 1, weight:dicke,color:farbe } }) }    ]}).addTo(movement_layer);
setTimeout(function(){
  polyline.remove()
  arrowHead.remove()
},ttl*1000)
}
function initialise_firebase(){
  const firebaseConfig = {
          apiKey: "AIzaSyBOOdW1SHCwBZSchUJ7DfJZ1a7-dEYTvuQ",
          authDomain: "crowdcount-678c8.firebaseapp.com",
          databaseURL: "https://crowdcount-678c8-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "crowdcount-678c8",
          storageBucket: "crowdcount-678c8.appspot.com",
          messagingSenderId: "1020533758948",
          appId: "1:1020533758948:web:23ec6e175dff3b5eedc5f1",
          measurementId: "G-00674BETEZ"
          };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  
        }  

    
           
function read_current (){

  database = firebase.database();

ref = database.ref('/soundstorm/aktuell');

ref.on('value', (snapshot) => {

current = snapshot.val()



for(i=0;i<stages_list.length;i++){
 if(current[stages_list[i].name] != undefined){
  temp = current[stages_list[i].name]


 let  fcol = farbskala[Math.round(temp.usage/15)]
 let col = farbskala[Math.round(temp.density)]
  stages_list[i].geo.setStyle({
  //   opacity:1,
      fillOpacity:0.6,
      fillColor: fcol,
      color: col,
      "weight": 4
})}
}
for (i=0;i<7;i++){
 temp = current["parking lot "+ (i+1)].usage
parking_list.geo[i].setStyle({fillOpacity:temp/100})
parking_list.tooltip[i].setContent("parking lot "+ (i+1)+ " - " + temp + " %" )

}

for(i=0;i<medstations.length;i++){

   medstations[i].geo.setTooltipContent(medstations[i].name +"<br>"+current["aid station "+(1+i)].usage + " / " +medstations[i].capacity+" patients")
   temp = (current["aid station "+(1+i)].usage/medstations[i].capacity)
   if(temp > 0.8)
   {medstations[i].geo.setIcon(mediconring)
}else {medstations[i].geo.setIcon(medicon)

}
  }
//select_area(set_area)
});

ref = database.ref('/soundstorm/locations');

ref.on('value', (snapshot) => {

locations = snapshot.val()


markercounter =0 
Object.keys(locations).forEach((key) => {
  a = new Date()
    a =a.getTime()
    if(key.startsWith("marker")){markercounter++;L.marker(locations[key].ort,{icon:eventicon}).addTo(eigensymbole_layer)
  //  .bindPopup(locations[key].text)
//  .bindTooltip("marker "+markercounter)
.bindTooltip(locations[key].text)
}else
    {if(existing_markers.includes(key)) {
eval(key+"_marker.setLatLng(locations[key].ort)")
}else{
eval(key+"_marker = L.marker(locations[key].ort).bindPopup(key).addTo(eigensymbole_layer)")
  // hier die marker einmalen
existing_markers.push(key)
}}
  

})
})


ref = database.ref('/soundstorm/swipes');

ref.on('value', (snapshot) => {

movement_layer.clearLayers();
swipes_arr = snapshot.val()
a = new Date()
    a =a.getTime()
    
    console.log(swipes_arr)
    if(swipes_arr != undefined)
{Object.keys(swipes_arr).forEach((key) => {
  x = (a -swipes_arr[key].zeit )/1000
 
if(x<8){
    draw_arrow (swipes_arr[key].von,swipes_arr[key].nach,"green",swipes_arr[key].dicke,10-x)
}
  
})}

})


}


        a = new Date("2022-12-03 14:00:00")
b = new Date("2022-12-04 04:00:00")


// icons
medicon = L.icon({  iconUrl: './icons/medicon.png', iconSize:     [20, 20], });
mediconring = L.icon({  iconUrl: './icons/mediconring.png', iconSize:     [20, 20], });
eventicon = L.icon({  iconUrl: './icons/red.png',  iconSize:     [40, 40],  iconAnchor:   [20, 40]})


/* reste von der map aus 22
var mymap = L.map('lio_div',{zoomSnap: 0.001}).setView(setviewmap,setviewzoom )
mymap.on('zoomend', function() {setviewzoom = mymap.getZoom()});
mymap.on('moveend', function() { mapaa = (mymap.getCenter(),mymap.getCenter());setviewmap=[mapaa.lat,mapaa.lng]});
*/

function initialise_map(){

  // Karte und Hintergründe
  mymap = L.map('map_div',{zoomSnap: 0.1, dragging: false,minZoom:14,maxZoom:18}).setView([24.99646971811259, 46.50594438628725],15 )
   // mymap.on('zoomend', function() {setviewzoom = mymap.getZoom()});
   // mymap.on('moveend', function() { mapaa = (mymap.getCenter(),mymap.getCenter());setviewmap=[mapaa.lat,mapaa.lng]});

tl1= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{      
      opacity: 0.5,      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })

var Jawg_Matrix =  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});



//const imageUrl = './map1.png';
//const imageBounds = [ [25.013,46.4805],[24.988092848232725, 46.53216767460525]];
imageUrl ="./himapcut.jpg"
imageBounds = [[ 25.01322659611521, 46.4798932072461],[24.984476969706886,46.52926520707613]];


const imageOverlay = L.imageOverlay(imageUrl, imageBounds);

stages_layer = L.layerGroup().addTo(mymap)
green_layer = L.layerGroup().addTo(mymap)
eigensymbole_layer = L.layerGroup().addTo(mymap)
movement_layer = L.layerGroup().addTo(mymap)
parkinglot_layer = L.layerGroup().addTo(mymap)
zones_layer = L.layerGroup()
back_layer = L.layerGroup().addTo(mymap)
aidstations_layer = L.layerGroup()
// alles einmalen das keine Bühnen sind
for (f=0;f<parking_arr.length;f++)  {
  let l = eval(parking_arr[f].layer)
  let fx = f
  let polygon = L.polygon(parking_arr[f].coords, {color: parking_arr[f].color})
 
 parking_list.geo.push(polygon)
/*
  polygon.on('click',function(){
    current[parking_arr[fx].name].usage += 10
    if (current[parking_arr[fx].name].usage > 100){current[parking_arr[fx].name].usage =0}
  //  current[parking_arr[fx].name].usage = Math.min(current[parking_arr[fx].name].usage,100)
 a = new Date()
    databaseRef = database.ref('soundstorm').child('aktuell').child(parking_arr[fx].name);
        databaseRef.set({usage: current[parking_arr[fx].name].usage,zeit:a.getTime()})
          })

          */
  polygon.addTo(l)

var tooltip = L.tooltip({permanent: true, direction: 'center'})
    .setContent(parking_arr[f].name)
    .setLatLng(polygon.getBounds().getCenter())
    .addTo(l);
    parking_list.tooltip.push(tooltip)

}

/*
var fullscreenButton = L.easyButton('fa-arrows-alt', function(btn, mymap){
  mymap.toggleFullscreen();
}, 'Toggle Fullscreen');
fullscreenButton.addTo(mymap);
*/
mymap.addControl(new L.Control.Fullscreen());



for (f=0;f<inert_arr.length;f++)  {
  let l = eval(inert_arr[f].layer)
  let polygon = L.polygon(inert_arr[f].coords, {color: inert_arr[f].color}).bindTooltip(inert_arr[f].name).addTo(l)



}
for (f=0;f<medstations.length;f++) {medstations[f].geo = L.marker(medstations[f].coords,{icon:medicon}).bindTooltip(medstations[f].name)
//medstations[f].geo .on("mouserover",function(e){this.openPopup()})
medstations[f].geo.addTo(aidstations_layer)}
for (f=0;f<greening_arr.length;f++) {L.polygon(greening_arr[f], {color: 'green', "weight": 1,"opacity": 0.65 }).addTo(green_layer)}
for (f=0;f<blocking_arr.length;f++) {let fu = f; L.polygon(blocking_arr[f], {fillColor: 'grey',color:"black", "weight": 1,"opacity": 0.8}).on('mouseover',function(){infotag.text("you hover on block "+fu)}).addTo(green_layer)}

for (f=0;f<hinter.length;f++)       {L.polygon(hinter[f], {color: 'grey' ,"weight": 2,"fillOpacity": 0.65}).addTo(back_layer)}
for (f=0;f<vib_arr.length;f++)      {L.polygon(vib_arr[f], {color: 'gold'}).addTo(mymap)}
//for (f=0;f<walking_arr.length;f++)  {L.polygon(walking_arr[f], {color: 'red'}).addTo(green_layer)}
for (f=0;f<walkway_arr.length;f++)      {L.polygon(walkway_arr[f], {fillColor: 'gold',color:"black",weight:1,fillOpacity:1}).addTo(mymap)}

// Layercontroll
L.control.layers(
  {"OSM": tl1,"img": imageOverlay,"dark":Jawg_Matrix ,"sat":Esri_WorldImagery},
  {"stages":stages_layer,"blocks":green_layer,"spotter+marker":eigensymbole_layer,"crowdflow" :movement_layer,
  "parking lots":parkinglot_layer,"op-zones":zones_layer,"medical":aidstations_layer}).addTo(mymap);

//ownmarker = L.marker(  [24.996,46.508]).addTo(mymap);

// Swipefunktion
    let touchStartX, touchEndX;

    mymap.on('click',function(e){
      if(eventmarkertoggle == true){
 
        let eventloc = 
     //   L.marker([e.latlng.lat,e.latlng.lng],{icon:eventicon}).addTo(mymap)
         userInput = prompt('describe marker:', '')
         if (userInput !== null) {
          databaseRef = database.ref('soundstorm').child('locations').child("marker"+markercounter);
        
          jetzt = new Date ()
                databaseRef.set({ort: [e.latlng.lat,e.latlng.lng],
                  text:userInput,
                  meldender:set_name,zeige : true,
                  zeit:jetzt.getTime()})
 
     
          
     
         eventmarkertoggle = false


         
      
        
         
      }
    }}
    )
mymap.getContainer().addEventListener("touchstart", function (e) {

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    start_time = new Date()
})

mymap.on('zoomlevelschange', function () {
    // This event is triggered when the zoom level changes (e.g., button press)
    // You can handle button press logic here
    isZooming = true;
    setTimeout(function () {
isZooming = false
  }, 500);
});

mymap.on('zoomstart', function() {
    isZooming = true;
});

mymap.on('zoomend', function() {
    isZooming = false;
});


// hier werden die swipes aufgenommen und gespeichert in der firebase  
mymap.getContainer().addEventListener("touchend", function (e) {



  if(!isZooming ){
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    ort1 = mymap.containerPointToLatLng([touchStartX,touchStartY]);
    ort2 = mymap.containerPointToLatLng([touchEndX,touchEndY]);

    minmove = 0.001
    maxmove = 0.01
    move = Math.abs(ort1.lat - ort2.lat) + Math.abs(ort1.lng - ort2.lng)
    
    end_date = new Date()   
    diff = Math.ceil((end_date.getTime()-start_time.getTime())/500)
    www = 5*diff
   if(move> minmove && move <maxmove && diff < 4)
   { 
      
  //malen des Swipes und des Pfeilkopfes
    
      draw_arrow (ort1,ort2,"grey",www,3)
     
      infotag.text("swipe reported. category:   "+ www/5)

  // timeer der eingegebene Swipes vernichtet
  

    ntemp = new Date()
    ntemp = ntemp.getTime()

    // !!!! hier sit das speichern des swipes deaktiviert !!!!!!!!!!!!
    if (locked) {
      infotag.text('can not send swipes when -LOCKED-')
      return;
    }
     const database = firebase.database()
     databaseRef = database.ref('soundstorm').child('swipes').child(ntemp);
    databaseRef.set({meldender:set_name,von:ort1, nach:ort2,zeit:ntemp,dicke:www})
    }
  }})

// Bühnen einmalen
stages_geo=[]
for(i=0;i<stages_list.length;i++)
{if(stages_list[i].coords != "donotdraw"){
  let zi =i 
  f = L.polygon(stages_list[i].coords, {color: '#99ff66'}).bindTooltip(stages_list[i].name)
      //.on('mouseover',function(){this.setStyle({color:"red"})})
      .on('click',function(){
      // this.setStyle({color:"green"})
      set_area=zi;d3.select('#dropdown').property('value',zi)
      select_area(zi)
      
  }).addTo(stages_layer)
  stages_list[i].geo = f
}}}







function make_graphdata(indata){
//die indaten sind ein array mit jeweils den obj zeit und usage
outdata ={zeit:[],usage:[]}
temp = new Date(indata[0].zeit)

temp = temp.setHours(15)
for (i=0;i<indata.length;i++){

  entfernungzu15uhr = (indata[i].zeit-temp)/(15*60*1000)
  console.log(entfernungzu15uhr)
}


}




/*
ww =[]
for (f=0;f< zones_arr.length;f++){
  console.log(zones_arr[f][2])
  ww.push({name:zones_arr[f][0],color:zones_arr[f][1],coords:polystrtoco(zones_arr[f][2]) })

}
console.log(ww)


function polystrtoco (d){
  ///                                       --------------- mit dieser funktion werden die polygon strings in coordinaten umgewandelt
  d = d.slice(8)
  d = d.slice(0,-1)
  d = d.split(", ")
  for (i=0;i<d.length;i++){d[i] = d[i].split(" ")}
  for (i=0;i<d.length;i++){d[i]=[  d[i][1]*yauslpp +25.0074,  d[i][0]*xauslpp +46.49160088116361 ]}
  return d
  }

xauslpp =   (46.513899054271185-46.49160088116361  )/508.48//574
yauslpp = -   (24.99899094193483- 24.995559147406844)/86.33//113
// events


*/
