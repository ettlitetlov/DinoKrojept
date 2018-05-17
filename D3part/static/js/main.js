
d3.queue()
    .defer(d3.csv, '/Users/isabelle/Documents/AvanceradVisuell/DinoKrojept/D3part/static/data/comm-data-Fri.csv')
    .defer(d3.csv, '/Users/isabelle/Documents/AvanceradVisuell/DinoKrojept/D3part/static/data/comm-data-Sat.csv')
    .defer(d3.csv, '/Users/isabelle/Documents/AvanceradVisuell/DinoKrojept/D3part/static/data/comm-data-Sun.csv')
    .await(draw);


var flowmap1, linechart, bc, filteredData;
function draw(error, dFri, dSat, dSun){
  if (error) throw error;
  //filteredData = filterdata(dSun);
  linechart = createLinechart(dFri, dSat, dSun, "friday", "all");
}
