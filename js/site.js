function generateringComponent(vardata, vargeodata){

  var lookup = genLookup(vargeodata) ;

  var chPhase = dc.rowChart('#phase') ;
  var chTrend = dc.rowChart('#trend') ;
  var chCarte = dc.leafletChoroplethChart('#carte') ;

  var cf = crossfilter(vardata);
  var all = cf.groupAll();

  // graphe des phases
    var chPhaseDim = cf.dimension(function(d){ return d.country}) ;
    var chPhaseGroupe = chPhaseDim.group().reduceSum( function (d) { return d.phase1}) ;

  //graphe trend

    var chTrendDim = cf.dimension(function (d) { return d.rowcacode2}) ;
    var chTrendGroupe = chTrendDim.group().reduceSum( function (d) { return d.phase2}) ;

  // carte

    var chCarteDim = cf.dimension(function (d) { return d.rowcacode2}) ;
    var chCarteGroupe = chCarteDim.group().reduceSum( function (d) { return d.phase35}) ;


    chPhase.width(450)
              .height(330)
              .dimension(chPhaseDim)
              .group(chPhaseGroupe) ;

    chTrend.width(450)
           .height(330)
           .dimension(chTrendDim)
           .group(chTrendGroupe);
          //  .data(function (d) {
          //    return d.value ;
          //  });

  dc.dataCount('count-info')
    .dimension(cf)
    .group(all);


      chCarte.width(450)
             .dimension(chCarteDim)
             .group(chCarteGroupe)
             .center([0,0])
             .zoom(0)
             .geojson(vargeodata)
             .colors(['#CCCCCC','#03a9f4'])
             .colorDomain([0,1])
             .colorAccessor(function (d){
               if (d>0) {
                 return 1;
               } else {
                 return 0;
               }
             })
             .featureKeyAccessor(function (feature){
               return feature.properties['rowcacode2'];
             }).popup(function (d){
               return lookup[d.key];
             })
             .renderPopup(true);

      dc.renderAll();

      var map = chCarte.map();

      zoomToGeom(vargeodata);

      function zoomToGeom(geodata){
        var bounds = d3.geo.bounds(geodata) ;
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
      }

      function genLookup(geojson) {
        var lookup = {} ;
        geojson.features.forEach(function (e) {
          lookup[e.properties['rowcacode2']] = String(e.properties['adm2']);
        });
        return lookup ;
      }
}

var dataCall = $.ajax({
    type: 'GET',
    url: 'data/ch.json',
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
    url: 'data/sahel.geojson',
    dataType: 'json',
});


$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties['rowcacode2'] = String(e.properties['rowcacode2']);
    });
    generateringComponent(dataArgs[0],geom);
});
