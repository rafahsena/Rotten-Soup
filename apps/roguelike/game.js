/* A game created to mimic some elements Dungeon Crawl Stone Soup in Rot.JS */

/* Create game object to hold the display and initialize game */
var Game = {
    display: null,
    player: null,
    engine: null,
    map: null,

    init: function () {
        // Load the map and link the game to the player
        console.log(this.map);
        this.player = this.map.player;
        // Set up the display
        var options = {
            width: this.map.width,
            height: this.map.height,
            fontSize: 25,
            fontFamily: "menlo",
            forceSquareRation: true
        }
        this.display = new ROT.Display(options);
        document.body.appendChild(this.display.getContainer());
        // Set the ROT engine and scheduler
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true); // Add the player to the scheduler
        this.engine = new ROT.Engine(scheduler); // Create new engine with the newly created scheduler
        this.engine.start(); // Start the engine
        this.drawMap();
    },

    loadMap: function (handle) {
        try {
            $.getJSON(handle, function(data) {
                return data;
            })
                .done(function(data) {
                    Game.map = new Map(data);
                    if (Game.map == null) throw "Failed to load map!";
                    Game.init();
                });

            return Game.map != null;
        }
        catch (error) {
            console.log("Map creation failed: " + error);
            return false;
        }
    },

    generateMap: function () {
        var digger = new ROT.Map.Cellular();
        var freeCells = [];

        /* cells with 1/2 probability */
        digger.randomize(0.5);

        /* generate and show four generations */
        digger.create(function(x,y, val) {
            if (val) return;

            var key = x+","+y;
            freeCells.push(key)
            Game.map[key] = ".";
        });
        this.createPlayer(freeCells);
    },

    drawMap: function () {
        for (var y = 0; y < this.map.height; y++)
            for (var x = 0; x < this.map.width; x++)
                Game.drawTile(x, y, this.map.data[y][x]);

        Game.drawActors();
    },

    drawTile: function (x, y, tile) {
        Game.display.draw(x, y, tile.symbol, tile.options.fg);
    },


    drawActors: function () {
        for (var i = 0; i < this.map.actors.length; i++) {
            Game.drawActor(this.map.actors[i]);
        }
    },

    drawActor: function (actor) {
        Game.display.draw(actor.x, actor.y, actor.options.symbol, actor.options.fg, actor.options.bg);
    }

}
