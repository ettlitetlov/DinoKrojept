
var map, pc, bc;
function draw(activeData, dFri, dSat, dSun){
  
  //map = new Map(data2014, data2010, data2006, data2002, pcYear, sweden_map_json);
  //pc = new pc(pcYear);
  //bc = new bc(pcYear);
}

d3.queue()
    .defer(d3.csv, 'static/data/comm-data-Fri.csv')
    .defer(d3.csv, 'static/data/comm-data-Sat.csv')
    .defer(d3.csv, 'static/data/comm-data-Sun.csv')
    .await(function(error, dFri, dSat, dSun) {
      if (error) throw error;  
     
      draw(dFri, dFri, dSat, dSun);
    });


function update(){
  map.updateData();
}
