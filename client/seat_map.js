sitzplan = {
    center: [0, 0], // [lat,long]
    rotation: 180, // deg
    initial_zoom: 20, // meter in one dimension
    background: {
        url: 'hintergrund.svg',
        position: [-1.7, 0],
        size: [21.7727273, 41.9545454545],
        rotation: 180
    },
    tables: [
        {
            name: 'A',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [4, 12.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'B',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [4, 15.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'C',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [4, 18.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'D',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [9.7, 12.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'E',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [9.7, 15.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'F',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [9.7, 18.5],
            size: [3.6, 0.9],
            seats: 10
		},
        {
            name: 'OK',
            number: 1,
            shape: 'standard',
            rotation: 90,
            position: [12, 24],
            size: [1.8 * 3, 0.9],
            seats: 6
		},
	]
}

$(function () {
    var mainSeatMap = drawSeatMap("#svg");

    Tracker.autorun(function () {
        highlightSeats(Session.get("selectedSeats"));
    });

    Tracker.autorun(function () {
        var occupiedSeats = Players.find({}, {
            fields: {
                seat: 1
            }
        }).fetch();

        var occupiedSeatsArray = Array();

        _.each(occupiedSeats, function (item) {
            occupiedSeatsArray.push(item.seat);
        });
        colorSeats(occupiedSeatsArray);

        var searchedSeats = Players.find({
            score: {
                $gt: 0
            }
        }, {
            fields: {
                seat: 1
            }
        }).fetch();

        var searchedSeatsArray = [];

        _.each(searchedSeats, function (item) {
            searchedSeatsArray.push(item.seat);
        });
        highlightSearchedSeats(searchedSeatsArray);
    });
});




function drawSeatMap(target) {
    var s = Snap(target);
    var floorPlan = s.g();

    var backgroundColor = $("body").css("background-color");
    var backgroundFilterInvert = s.filter(Snap.filter.invert(1)).attr({
        filterUnits: "objectBoundingBox"
    });
    var backgroundFilterBlend = s.filter('<feFlood flood-color="' + backgroundColor + '" flood-opacity="1" result="flood"/><feBlend mode="screen" in2="SourceGraphic"/>').attr({
        filterUnits: "objectBoundingBox"
    });

    var background = s.image("/map_background.png", sitzplan.background.position[0], sitzplan.background.position[0], sitzplan.background.size[0], sitzplan.background.size[1]).attr({
        filter: backgroundFilterInvert
    });
    var backgroundGroup = s.g(background);
    backgroundGroup.attr({
        filter: backgroundFilterBlend,
        opacity: 0.5
    });



    floorPlan.add(backgroundGroup);

    for (var i = 0; i < sitzplan.tables.length; i++) {
        floorPlan.add(createTable(sitzplan.tables[i], s));
    }

    floorPlan.click(clickedOnBackground);

    var outerBoundingBox = floorPlan.getBBox();

    var svgPanZoom = $(target).svgPanZoom({
        animationTime: 0,
        initialViewBox: { // the initial viewBox, if null or undefined will try to use the viewBox set in the svg tag. Also accepts string in the format "X Y Width Height"
            x: outerBoundingBox.x - 2, // the top-left corner X coordinate
            y: outerBoundingBox.y - 2, // the top-left corner Y coordinate
            width: outerBoundingBox.width + 2, // the width of the viewBox
            height: outerBoundingBox.height + 2 // the height of the viewBox
        },
        zoomFactor: 1,
        maxZoom: 4
    });

    return s;
}


function createTable(table, s) {
    if (table.shape == "standard") {
        var tableGroup = s.g();
        var snapTable = s.rect(0, 0, table.size[0], table.size[1]).attr({
            fill: "rgba(0,0,0,0.2)",
            stroke: "#fff",
            strokeWidth: "0.02"
        });
        tableGroup.add(snapTable);

        // Draw seats
        var i;
        for (i = 0; i < table.seats; i++) {

            var seatGroup = s.g(s.circle(table.size[0] / (table.seats) * (i + 0.5), table.size[1] / 2, 0.35).attr({
                fill: "#333"
            }));
            seatGroup.add(s.text(table.size[0] / (table.seats) * (i + 0.5), table.size[1] / 2 + 0.02, table.name + (table.number + i)).attr({
                "font-family": "'Open Sans'",
                fill: "rgba(255,255,255,0.7)",
                fontSize: '0.3px',
                "text-anchor": "middle",
                "alignment-baseline": "middle"
            }));
            seatGroup.attr({
                class: "seat",
                id: table.name + (table.number + i)
            });

            seatGroup.click(clickedOnSeat);

            tableGroup.add(seatGroup);
        }
        tableGroup.transform("r" + table.rotation + ",0,0" + "T" + (table.position[0]) + "," + (table.position[1]));
        return tableGroup;
    } else if (table.shape == "double_row_standard") {
        var numTables = Math.round(table.seats / 4);
        var tablesGroup = s.g();

        for (var i = 0; i < numTables; i++) {
            var subTable = {
                name: table.name,
                number: table.number + 2 * i,
                shape: 'standard',
                rotation: 0,
                position: [table.size[0] * i, table.size[1]],
                size: [table.size[0], table.size[1]],
                seats: 2
            }

            tablesGroup.add(createTable(subTable, s));
        }

        for (var i = 0; i < numTables; i++) {
            subTable = {
                name: table.name,
                number: table.number + 4 * numTables - 2 * (i + 1),
                shape: 'standard',
                rotation: 180,
                position: [table.size[0] * (i + 1), table.size[1]],
                size: [table.size[0], table.size[1]],
                seats: 2
            }

            tablesGroup.add(createTable(subTable, s));
        }

        tablesGroup.transform("r" + table.rotation + ",0,0" + "T" + (table.position[0]) + "," + (table.position[1]));
        return tablesGroup
    } else if (table.shape == "double_row_half") {
        var numTables = Math.round(table.seats / 10);
        var tablesGroup = s.g();

        for (var i = 0; i < numTables; i++) {
            var subTable = {
                name: table.name,
                number: table.number + 2 * i,
                shape: 'standard',
                rotation: 0,
                position: [table.size[0] * i, table.size[1]],
                size: [table.size[0], table.size[1]],
                seats: 5
            }

            tablesGroup.add(createTable(subTable, s));
        }

        for (var i = 0; i < numTables; i++) {
            subTable = {
                name: table.name,
                number: table.number + 10 * numTables - 5 * (i + 1),
                shape: 'standard',
                rotation: 180,
                position: [table.size[0] * (i + 1), table.size[1]],
                size: [table.size[0], table.size[1]],
                seats: 5
            }

            tablesGroup.add(createTable(subTable, s));
        }

        tablesGroup.transform("r" + table.rotation + ",0,0" + "T" + (table.position[0]) + "," + (table.position[1]));
        return tablesGroup
    }
}

function clickedOnSeat(event) {
    event.stopPropagation();

    Session.set("selectedSeats", [this.attr("id")]);
    if (Session.get("mode") == "add") {
        $("form.new-player").find('input[name="seat"]').val(this.attr("id"));
    }
}

function clickedOnBackground(event) {
    Session.set("selectedSeats", Array());
}

function highlightSeats(list) {
    Snap.selectAll(".seat circle").attr({
        stroke: "",
        strokeWidth: ""
    });


    _.each(list, function (item) {
        Snap.selectAll("#" + item + " circle").attr({
            stroke: "#fff",
            strokeWidth: "0.05"
        });
    });

}


function colorSeats(list) {
    Snap.selectAll(".seat circle").attr({
        fill: "#088"
    });


    _.each(list, function (item) {
        Snap.selectAll("#" + item + " circle").attr({
            fill: "#707"
        });
    });
}

function highlightSearchedSeats(list) {

    _.each(list, function (item) {
        Snap.selectAll("#" + item + " circle").attr({
            fill: "#f0f"
        });
    });
}
