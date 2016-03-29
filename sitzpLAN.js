Players = new Mongo.Collection("players");

if (Meteor.isClient) {
    Meteor.startup(function () {
        Session.set("mode", "search");
        Session.set("search", "");
        Session.set("selectedSeats", []);
    });

    Tracker.autorun(function () {
        if (Session.get("mode") == "search")
            Meteor.subscribe("players", Session.get("search"));
        else
            Meteor.subscribe("players", "");
    });


    Template.body.helpers({
        players: function () {
            // Otherwise, return all of the tasks
            if (Session.get("search")) {
                return Players.find({}, {
                    sort: [['score', 'desc'], ['seat', 'asc']]
                });
            } else {
                return Players.find({}, {
                    sort: {
                        seat: 1
                    }
                });
            }
        },
        playerCount: function () {
            // Otherwise, return all of the tasks

            return Players.find().count();
        },
        is_search: function () {
            return (Session.get("mode") == "search");
        },
        search: function () {
            return Session.get("search");
        }
    });

    UI.registerHelper('shortIt', function (stringToShorten, maxCharsAmount) {
        if (stringToShorten.length > maxCharsAmount) {
            return stringToShorten.substring(0, maxCharsAmount) + '...';
        }
        return stringToShorten;
    });


    Template.body.events({
        "click .menu .item": function (event) {
            var mode = $(event.target).data("mode");
            Session.set("mode", mode);

        },
        "change #search": function (event) {
            Session.set("search", event.target.value);
        },
        "keypress #search": function (event) {
            Session.set("search", event.target.value);
        },
        "keyup #search": function (event) {
            Session.set("search", event.target.value);
        }

    });

    Template.player_form.events({
        "submit .new-player": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var playerName = event.target.playerName.value;
            var steamID = event.target.steamID.value;
            var games = event.target.games.value;
            var seat = event.target.seat.value;
            // Insert a task into the collection

            var error = false;

            if (playerName) {
                $(event.target).find("#playerName").removeClass("error");
            } else {
                $(event.target).find("#playerName").addClass("error");
                error = true;
            }

            if (seat && $("#svg").find("#" + seat).length) {
                $(event.target).find("#seat").removeClass("error");
            } else {
                $(event.target).find("#seat").addClass("error");
                error = true;
            }

            if (!error) {
                Meteor.call("addPlayer", playerName, steamID, games, seat);
                $(event.target)[0].reset();
                $(event.target).find('input[name="playerName"]').focus();
            } else
                return;
        }
    });

    Template.player.helpers({
        isSelected: function () {
            if (_.contains(Session.get("selectedSeats"), this.seat))
                return true;
            else
                return false;
        }

    });


    Template.player_form.onRendered(function () {
        $("form.new-player").find('input[name="playerName"]').focus();

        if (Session.get("selectedSeats"))
            $("form.new-player").find('input[name="seat"]').val(Session.get("selectedSeats"));
    });

    Template.player.events({
        "click .delete": function (event) {
            event.stopPropagation();
            Meteor.call("deletePlayer", this._id);
        },
        "click .player": function (event) {
            var selectedSeats = Session.get("selectedSeats");

            if (event.ctrlKey)
                selectedSeats.push(this.seat);
            else
                selectedSeats = [this.seat];

            Session.set("selectedSeats", selectedSeats)


            if (Session.get("mode") == "add") {
                $("form.new-player").find('input[name="seat"]').val(selectedSeats[selectedSeats.length - 1]);
            }

        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.publish("players", function (query) {
            if (query) {
                return Players.find({
                    $text: {
                        $search: query
                    }
                }, {
                    fields: {
                        score: {
                            $meta: 'textScore'
                        }
                    },
                    sort: {
                        score: {
                            $meta: 'textScore'
                        }
                    }
                })
            } else {
                return Players.find();
            }
        });
    });

    Players._ensureIndex({
        'playerName': 'text',
        'steamID': 'text',
        'games': 'text',
        'seat': 'text',
        'clientIP': 'text'
    });
}


Meteor.methods({
    addPlayer: function (playerName, steamID, games, seat) {
        if (Meteor.isServer) {
            clientIP = this.connection.clientAddress;
        } else {
            clientIP = ""
        }
        if (seat && playerName) {
            Players.insert({
                playerName: playerName,
                steamID: steamID,
                games: games,
                seat: seat,
                clientIP: clientIP,
                createdAt: new Date()
            });
        }

    },
    deletePlayer: function (playerId) {
        var task = Players.findOne(playerId);
        Players.remove(playerId);
    }
});
