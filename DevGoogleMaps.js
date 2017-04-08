(function(e, t, n, r) {
    e.fn.DevGoogleMaps = function() {
        if (e.fn.gmap3) {
            var n = e.now(),
                r;
            (function(i, s, o, u) {
                if (r) return r;
                var a = e.Deferred(),
                    f = function() {
                        a.resolve(t.google && t.google.maps ? t.google.maps : !1)
                    },
                    l = "loadGoogleMaps_" + n++;
                s = e.extend({
                    sensor: u || "false"
                }, s ? {
                    key: s
                } : {}, o ? {
                    language: o
                } : {});
                t.google && t.google.maps ? f() : t.google && t.google.load ? t.google.load("maps", i || 3, {
                    other_params: e.param(s),
                    callback: f
                }) : (s = e.extend(s, {
                    v: i || 3,
                    callback: l
                }), t[l] = function() {
                    f();
                    setTimeout(function() {
                        try {
                            delete t[l]
                        } catch (e) {}
                    }, 20)
                }, e.ajax({
                    dataType: "script",
                    data: s,
                    url: "//maps.googleapis.com/maps/api/js"
                }));
                return r = a.promise()
            })().done(e.proxy(function() {
                this.each(function() {
                    var n = {},
                        p, r = e(this).data(),
                        i, s, o, u = [];
                    for (o in r) switch (o) {
                        case "center":
                            n[o] = r[o].split(",");
                            break;
                        case "parallaxmap":
                            if (r[o] === true) {
                                p = true;
                            }
                            break;
                        case "mapTypeId":
                            n[o] = t.google.maps.MapTypeId[r[o]];
                            break;
                        case "markers":
                            u = e.map(r[o] || [], function(e) {
                                var bounced;
                                if (typeof e.bounced !== "undefined") {
                                    if (e.bounced == 'BOUNCE') {
                                        bounced = google.maps.Animation.BOUNCE
                                    } else if (e.bounced == 'DROP') {
                                        bounced = google.maps.Animation.DROP
                                    } else {
                                        bounced = false;
                                    }
                                } else {
                                    bounced = false;
                                }
                                return {
                                    latLng: [e.lat, e.lng],
                                    data: (e.data ? e.data : false),
                                    options: {
                                        animation: (bounced !== false ? bounced : false),
                                        icon: (e.icon ? new google.maps.MarkerImage(e.icon) : new google.maps.MarkerImage("https://www.google.com/mapfiles/marker_black.png"))
                                    }
                                }
                            });
                            break;
                        case "background":
                            i = r[o];
                            break;
                        case "monochrome":
                            r[o] && (n.styles = [{
                                stylers: [{
                                    saturation: r.saturation
                                }, {
                                    hue: r.background
                                }]
                            }]);;
                            break;
                        default:
                            n[o] = r[o]
                    }
                    e(this).gmap3({
                        map: {
                            options: n,
                            events: {
                                idle: function() {
                                    if (p == true) {
                                        var map = e(this).gmap3('get'),
                                            offset = $(map.getDiv()).offset();
                                        google.maps.event.clearListeners(map, 'idle');
                                        map.panBy((($(window).scrollLeft() - offset.left) / 4), (($(window).scrollTop() - offset.top) / 4));
                                        google.maps.event.addDomListener(window, 'scroll', function() {
                                            var scrollY = $(window).scrollTop(),
                                                scrollX = $(window).scrollLeft(),
                                                scroll = map.get('scroll');
                                            if (scroll) {
                                                map.panBy(-((scroll.x - scrollX) / 3), -((scroll.y - scrollY) / 3));
                                            }
                                            map.set('scroll', {
                                                x: scrollX,
                                                y: scrollY
                                            });
                                        });
                                    }
                                }
                            }
                        },
                        marker: {
                            values: u,
                            events: {
                                click: function(marker, event, context) {
                                    var map = e(this).gmap3("get"),
                                        infowindow = e(this).gmap3({
                                            get: {
                                                name: "infowindow"
                                            }
                                        });
                                    if (infowindow) {
                                        infowindow.open(map, marker);
                                        infowindow.setContent(context.data);
                                    } else {
                                        e(this).gmap3({
                                            infowindow: {
                                                anchor: marker,
                                                options: {
                                                    content: context.data,
                                                }
                                            }
                                        });
                                    }
                                }, 
                                // mouseover: function(marker, event, context) {
                                //     var map = e(this).gmap3("get"),
                                //         infowindow = e(this).gmap3({
                                //             get: {
                                //                 name: "infowindow"
                                //             }
                                //         });
                                //     if (infowindow) {
                                //         infowindow.open(map, marker);
                                //         infowindow.setContent(context.data);
                                //     } else {
                                //         e(this).gmap3({
                                //             infowindow: {
                                //                 anchor: marker,
                                //                 options: {
                                //                     content: context.data
                                //                 }
                                //             }
                                //         });
                                //     }
                                // },
                                // mouseout: function() {
                                //     var infowindow = e(this).gmap3({
                                //         get: {
                                //             name: "infowindow"
                                //         }
                                //     });
                                //     if (infowindow) {
                                //         infowindow.close();
                                //     }
                                // }
                            }
                        }
                    })
                })
            }, this));
            return this
        }
    }
})(jQuery, window, document);