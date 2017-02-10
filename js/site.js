d3.csv("data/ch.csv", function(error, data) {

  var chPhase = dc.rowChart('#phase') ;
  var chTrend = dc.rowChart('#trend') ;
  var chCarte = dc.rowChart('#carte') ;

  var cf = crossfilter(data);
  var all = cf.groupAll();

// graphe des phases
  var chPhaseDim = cf.dimension(function(d){ return d.Country}) ;
  var chPhaseGroupe = chPhaseDim.group().reduceSum( function (d) { return d.Phase1}) ;

//graphe trend

  var chTrendDim = cf.dimension(function (d) { return d.Country}) ;
  var chTrendGroupe = chTrendDim.group().reduceSum( function (d) { return d.Phase2}) ;

// carte

  var chCarteDim = cf.dimension(function (d) { return d.Admin2}) ;
  var chCarteGroupe = chCarteDim.group().reduceSum( function (d) { return d.Phase35}) ;


  chPhase.width(450)
            .height(350)
            .dimension(chPhaseDim)
            .group(chPhaseGroupe) ;

chTrend.width(450)
       .height(350)
       .dimension(chTrendDim)
       .group(chTrendGroupe) ;

chCarte.width(450)
       .height(350)
       .dimension(chCarteDim)
       .group(chCarteGroupe);

dc.dataCount('count-info')
  .dimension(cf)
  .group(all);


dc.renderAll();
});
