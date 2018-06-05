// common dependencies
var _c = console || {};

$(function(){ 
    
    _c.log("application start!!!");    

    OL.init();

});

/** olcreativa Global aplication handle 
* 
* init
* pymChild
* loader
* is_iframe
* window_width
* onResizedw
* btns_ajax_modal
* 
*/
var OL = {
    callback_ajax: function(messi_d, bati_d){
        "use strict";

        /** data players */
        var players = {
            messi: {
                key: "1F4SyCmiuElEGDDG60pXSKD5YL4SM5CLqJRBOWSy1WLY",
                debut: "Messi debutó el 17 de agosto de 2005, vs. Hungría 2-1.<br> El primer gol llegó en su sexto partido, el 1° de marzo de 2006, ante Croacia (2-3)."
            },
            batistuta: { 
                key: "1Npr78m7hPHHFyrlZb8yFfUhP6WYK7CIDQtu883a4JU0",
                debut: "Batistuta debutó el 27 de junio de 1991 vs. Brasil 1-1.<br> El primer gol llegó en su segundo partido, el 8 de julio, ante Venezuela, 3-0, e hizo dos." 
            },
            maradona: {
                key: "1_8Vo_S7j7ghJX2a-IOVDvmTbU6Iyz8cuKCi95mSTs3k",
                debut: "Maradona debutó el 27 de febrero de 1977, vs. Hungría (5-1).<br> El primer gol llegó en su noveno partido, el 2 de junio de 1979, ante Escocia (3-1)." 
            },
            crespo: {
                key: "1ZRxdHtk4DmZMofdwgsOF1e6qQh3oMz58LRoQ50X2hGU",
                debut: "Crespo debutó el 14 de febrero de 1995, vs. Bulgaria (4-1).<br> El primer gol llegó en su sexto partido, el 30 de abril de 1997, ante Ecuador (2-1)."
            },
            aguero: {
                key: "12TxtgVkm2dbtmvKIuHdO9IptQCZjpmKa3HYFw0gk0P8",
                debut: "Agüero debutó el 3 de septiembre de 2006, vs. Brasil (0-3).<br> El primer gol llegó en su sexto partido, el 17 de noviembre de 2007, ante Bolivia (3-0)."
            },
            higuain: {
                key: "1Il704jpaB9pho8YfsLJDOs9wSJQa5mj4OMiWntfeLU8",
                debut: "Higuaín debutó el 11 de octubre de 2009, vs Perú (2-1).<br> Esa misma noche marcó su primer gol con la casaca albiceleste."
            }
        };
        
        /** set data on cache */
        OL.model.set(players.messi.key, messi_d);
        OL.model.set(players.batistuta.key, bati_d);



        /** context application vars */
        var ctxt = {
            tipo:null,
            torneo:null,
            versus: "batistuta"
        };
        if(location.hash){
            var params = OL.paramToObj(location.hash);
            OL.pushVarsObjs(params, ctxt);
        }
        /** set data on model cache */

        var tooltip = tooltipd3();
        tooltip.tmpl = _.template(d3.select("#tmpl_tooltip").html());

        var wrapp1 = d3.select("div#jug1");
        var wrapp2 = d3.select("div#jug2");

        var tmpl_li = _.template("");
 
        var tmpl_url_gif = _.template("url(./img/gif/<%= name %>.gif?x=<%= rand %>)");

        var tasks =  d3_queue.queue()
            .defer(function(){
                draw_player(wrapp1, "messi");
                draw_player(wrapp2);
                // map_goal_type(messi_d, goal_type);
                // map_goal_type(bati_d, goal_type);

            })
            .defer(function(error){
                /** bind select2 events */
                var $tipo = $('#tipo');
                $tipo
                // .select2({
                //     //placeholder: 'Tipo de gol',
                   
                // })
                .on("change", function(){
                    if(this.value === "all"){
                        ctxt.tipo = null;
                    }else{
                        ctxt.tipo = this.value;
                    }
                    _gaq.push(['_trackEvent', 'mundial2018_maximos_goleadores', 'select_tipo', this.value]);
                    updateBreadcrumb();
                });



                var $torneo = $('#torneo');
                $torneo
                // .select2({
                //     //placeholder: 'Torneo',
                //     minimumResultsForSearch: Infinity
                // })
                .on("change", function(){
                    if(this.value === "all"){
                        ctxt.torneo = null;
                    }else{
                        ctxt.torneo = this.value;
                    }
                    _gaq.push(['_trackEvent', 'mundial2018_maximos_goleadores', 'select_torneo', this.value]);
                    updateBreadcrumb();
                });

                var $jugadores = $('#jugadores');
                $jugadores.select2({
                    //placeholder: 'Torneo',
                    minimumResultsForSearch: Infinity
                })
                .on("change", function(){
                    _gaq.push(['_trackEvent', 'mundial2018_maximos_goleadores', 'select_jugadores', this.value]);
                    ctxt.versus = this.value;
                    
                    /** reset filters*/
                    ctxt.torneo = null;
                    ctxt.tipo = null;
                    // updateSelect2();

                    draw_player(wrapp2);
                    // $tipo.val(ctxt.tipo).trigger("change");
                });


                /** set selects status from context */
                // if(ctxt.tipo){
                //     $tipo.val(ctxt.tipo).trigger('change.select2');
                // }
                
                // if(ctxt.torneo){
                //     $torneo.val(ctxt.torneo).trigger('change.select2');
                // }
           
                if(ctxt.versus){
                    $jugadores.val(ctxt.versus).trigger('change.select2');
                }

            })
            .defer(updateSelect2)
            ;
        

        function updateBreadcrumb(){
            var _filter_class = [];
            
            var rest = {
                p1:0,
                p2:0
            };

            if(ctxt.tipo){
                _filter_class.push("."+ctxt.tipo);
            }
            if(ctxt.torneo){
                _filter_class.push("."+ctxt.torneo);
            }


            /** filter is selected ?? */
            if(_filter_class.length){

                var timestamp = (new Date()).getTime();

                d3.selectAll("#comparador ul")
                .classed("filtrado", true);
                
                rest.p1 = wrapp1.selectAll("li")
                    .classed("activo", false)
                    .filter(_filter_class.join(""))
                    .classed("activo", true)
                    .classed("rojo", true)
                    .style("background-image", function(d){
                        return tmpl_url_gif({
                            name: meke_id(d.modo), 
                            rand: timestamp
                        });
                    })
                    .size();

                rest.p2 = wrapp2.selectAll("li")
                    .classed("activo", false)
                    .filter(_filter_class.join(""))
                    .classed("activo", true)
                    .classed("azul", true)
                    .style("background-image", function(d){
                        return tmpl_url_gif({
                            name: meke_id(d.modo), 
                            rand: timestamp
                        });
                    })
                    .size();


                wrapp1.select("span.resto").html("/"+rest.p1);
                wrapp2.select("span.resto").html("/"+rest.p2);
            
            }else{
                /** */
                d3.selectAll("#comparador ul")
                .classed("filtrado", false);
                
                rest.p1 = wrapp1.selectAll("li")
                    .classed("activo", false)
                    .size();
                
                rest.p2 = wrapp2.selectAll("li")
                    .classed("activo", false)
                    .size();
                
                wrapp1.select("span.resto").html("");
                wrapp2.select("span.resto").html("");
                
                updateSelect2();
            }


            /** update select status */
            if(!ctxt.tipo){
                $('#tipo').val("all").trigger('change.select2');
            }else{
                $('#tipo').val(ctxt.tipo).trigger('change.select2');
            }  
            
            if(!ctxt.torneo){
                $("#torneo").val("all").trigger('change.select2');
            }else{
                $("#torneo").val(ctxt.torneo).trigger('change.select2');
                
            }


            location.hash =  $.param(ctxt);
        }


        function updateSelect2(){
            /** Update data and html for each select */
            var goal_goups = updateDataForSelects();

            /** make select2 tipo */
            var _data = [{id:"all", text:"Todos"}];
            $('#tipo').select2({
                minimumResultsForSearch: Infinity,
                data: _data.concat(goal_goups.tipo)
            });   

            /** make select2 torneo */
            var _data_torneo = [{id:"all", text:"Todas"}];
            
            $('#torneo').select2({
                minimumResultsForSearch: Infinity,
                data: _data_torneo.concat(goal_goups.torneo)
            });
            
        }

        function updateDataForSelects(){
            // goal_type.tipo = {};
            // goal_type.torneo = {};

            var goal_type ={
                tipo: {},
                torneo: {}
            }; 

            d3.selectAll("ul.list_goal_type li").data().forEach(function(d){
                // debugger
                var key_modo = meke_id(d.modo);
                var key_torneo = meke_id(d.competencia);
                
                /** check if modo exists*/
                if(!goal_type.tipo[key_modo]){
                    goal_type.tipo[key_modo] = d.modo;
                }

                /** check if competencia exists*/
                if(!goal_type.torneo[key_torneo]){
                    goal_type.torneo[key_torneo] = d.competencia;
                }
            });
            var _tipo = [];
            for(var _k in goal_type.tipo){
                _tipo.push({id:_k, text:goal_type.tipo[_k]});
            }


            var _torneo = [];
            for(var k in goal_type.torneo){
                _torneo.push({id: k, text: goal_type.torneo[k]});
            }

            return {
                tipo: _.sortBy(_tipo, function(d){ return d.text; }),
                torneo: _.sortBy(_torneo, function(d){ return d.text; })
            };
        
        }


        function draw_player(wrapper, _player){
            /** delay for animation li */
            var max_delay = 1200;    

            /** if not _player take from context var */
            _player = _player ? _player : ctxt.versus;
            var p = players[_player];
                p.name = _player;


            OL.model.get(p.key, function(data){

                /** inner html goals count */
                wrapper.select("div.goles")
                    .html(data.length + "<span class='resto'>/15</span><br> <span class='gol'>GOLES</span>");

                /** append debut text */
                wrapper.select("p.debut")
                    .html(p.debut);

                /** update picture */
                wrapper.select("div.foto img")
                    .attr("src", "./img/caras/"+ p.name + ".jpg");



                /** li goal types*/
                var ul = wrapper.select("ul");
                var li = ul.selectAll("li")
                    .data(data, function(d){ return d.numero; });

                var li_enter = li.enter()
                    .append("li");
                    
                li
                    .attr("class", function(d, i){ 
                        var _class = [
                            "hidden",
                            meke_id(d.modo),
                            meke_id(d.competencia)
                            ];
                        return _class.join(" "); 
                    })
                    .style("background-image", function(d){
                        return tmpl_url_gif({
                            name: meke_id(d.modo), 
                            rand: ""
                        });
                    })
                    // .html(function(d, i){
                    //     return tmpl_li(d);
                    // })
                    ;

                li_enter.on("mouseover", function(d){

                    var html = tooltip.tmpl(d);
                    tooltip.mouseover(html); // pass html content
                    tooltip.mousemove();
                })
                .on("mousemove", tooltip.mousemove)
                .on("mouseout", tooltip.mouseout);

                li.each(function(d, i){
                    var el = d3.select(this),
                        delay = Math.random()*max_delay;

                    setTimeout(
                        function(){el.classed("hidden", false);},
                        delay
                        );
                    
                });

                li.exit().remove();

                OL.pymChild.sendHeight();
                updateBreadcrumb();
            


            });

        }

        
        function meke_id(s){ return s.toLowerCase().replace(/\s/g, ""); }

    },
    
    model: {
        get: function(key, cb){
            var m = this;
            var r = m.data[key];
            if (r){
                // _c.log("Load '%s' from app cache!", key);
                cb(r);
            }else{
                var url_data = _.template("http://olcreativa.lanacion.com.ar/dev/get_url/?key2=<%= key %>&output=json");
                d3.json(url_data({key: key}), function(err, _data){
                    m.set(key, _data);
                    r = m.data[key];
                    cb(r);
                });
            }
        },

        set: function(key, _data){
            var m = this;
            if(!m.data[key]){
                m.data[key] = _data;
                // _c.log("The '%s' KEY was set OK!", key);
            }else{
                // _c.log("The '%s' exists", key);
            }
        },
        
        data: {}
    },

    init: function () {
    
        "use strict";

        OL.loader.hide();



        /** if is not in iframe*/
        if(OL.is_iframe()){ 
            // _c.log("You are out an iframe ;-)");
        }
        

        var url_data = _.template("http://olcreativa.lanacion.com.ar/dev/get_url/?key2=<%= key %>&output=json"),
            key_messi = {key: "1F4SyCmiuElEGDDG60pXSKD5YL4SM5CLqJRBOWSy1WLY"},
            key_bati = {key: "1Npr78m7hPHHFyrlZb8yFfUhP6WYK7CIDQtu883a4JU0"};

        var q =  d3_queue.queue()
            .defer(d3.json, url_data(key_messi))
            .defer(d3.json, url_data(key_bati))
            .await(function(error, messi_d, bati_d){
                
                if (error) throw error;

                /** lunh calback ajax */
                OL.callback_ajax(messi_d, bati_d);

            });

        /** execute OL.onResizedw when size of page is changed*/
        var doit;
        window.onresize = function(d) {
          clearTimeout( doit );
          doit = setTimeout( OL.onResizedw, 200 );
        };

        /** init handle ctos modal btns */
        OL.btns_ajax_modal ();
    },

    /** ini PYM*/
    pymChild:  new pym.Child(),

    /** loder mothods */
    loader: {
        $loader: $("#loader"),
        show: function() { OL.loader.$loader.fadeIn(); },
        hide: function() { OL.loader.$loader.fadeOut("slow"); }
    },

    /** check if is an iframe */
    is_iframe: function(){
        return window === window.top;
    },

    /** actual window width*/
    window_width: $(window).width(),
    onResizedw: function () { // on resize stop event
        var w = $(window).width();
        if(OL.window_width != w){
            OL.window_width = w;
            // make changes here!!!
            // my_update()
            // _c.log("window resize!!");

            setTimeout(function(){
                OL.pymChild.sendHeight(); // pym !!
            }, 1000);
        
        }
    },

    /** load modal from ".ajax_modal" btn */
    btns_ajax_modal: function (){
            $(".ajax_modal").on("click", function(){
                var $append = $("#append");
                $append.hide();
                $append.load(this.href, function(){
                    $append.fadeIn();

                    // when modal is closed cleaner append div
                    $(".cerrar_creditos", $append).on("click", function(){
                        $append.fadeOut("fast", function(){ $append.html(""); });
                        return false;
                    });
                });
                return false;
            });
        },
        
    /** convert search/hash location url to json */
    paramToObj: function (u){
        var r = {};
        if(u){
            u = decodeURIComponent(u.replace(/\?|\#/g,"")).split(/\&/);
            u.forEach(function(c, i){
                c = c.split("=");

                var key = c[0].toLowerCase();
                var value = c[1];
                if(/^(null|false|true|[0-9]+)$/.test(value)){
                    value = JSON.parse(value);
                }

                if ( key.match(/\[\]/g)){
                    key = key.replace(/\[\]/g, "");

                    if(!r[key]){
                        r[key] = [];
                    }
                    r[key].push(value);
                }else{

                    r[key] = value;
                }

            });
        }
        return r;
    },

    pushVarsObjs: function(_push, _obj){
        for (var c in _push){
            if ( typeof(_push[c]) ==  "object" ){
                // check if is an Array
                _obj[c] = _push[c].indexOf ? [] : {};
                for (var k in _push[c] ){
                    _obj[c][k] = _push[c][k];
                }

            }else{
                _obj[c] = _push[c];
            }
        }
    }
};
