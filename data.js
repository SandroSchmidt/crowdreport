graphlinkegrenze = 17
graphbreiteinviertelstunden = 48//(28-graphlinkegrenze)*4
incident_toggle =true
overridedisplay9 = false
overridereport = false
overrideleadership = false
parking_list ={geo:[],tooltip:[],usage:[]}
fenster = {hoehe:window.innerHeight-30,breite:window.innerWidth-35};
existing_markers=[]
realtime = true // diese variabel zeig ob wir grade ein zeit ausgewählt haben oder in realzeit anzeigen
isZooming = false
swipes_arr =[]
eventmarkertoggle = false
locked = true
imageBounds = [[ 25.00124, 46.49093],[24.99111, 46.5245]];
currentTimestamp = new Date()
set_area=0
swipemode = false
set_name ="wrong reporter"
eigensymbole_arr =[]
set_pos=[9,9]
eventloc = [0,0]
farbskala = ["lightblue","#00B0F0","#00B0F0","#92D050","#92D050","#FFFF00","#FFFF00","#FF9201","#FF9201","#FF0000",'red',"#ee00ff","#ee00ff","#ee00ff","#ee00ff","#ee00ff"
]
camcountarr ={x:[],y:[]}
parking_arr =[]

// hier wird der integer heutag gefunden der als prefix für eintragungen in die Firebas genutzt wird
// X-1 ist der Tag vor dem Event

heutag = 1
start_graphdata = new Date("2025-03-29T18:00")
start_graphdata = start_graphdata.getTime()
count_data=[[0]]






