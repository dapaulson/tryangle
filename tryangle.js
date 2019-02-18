/*
Copyright 2017, 2019 Duane Paulson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var cell;
window.onload = function() {
  // td.id: {valid td.id to move to: td.id inbetween the two [, ...]}
    cell = {
        a1: {c1: "b1", c3: "b2"},
        b1: {d1: "c1", d3: "c2"},
        b2: {d2: "c2", d4: "c3"},
        c1: {a1: "b1", c3: "c2", e1: "d1", e3: "d2"},
        c2: {e2: "d2", e4: "d3"},
        c3: {a1: "b2", c1: "c2", e3: "d3", e5: "d4"},
        d1: {b1: "c1", d3: "d2"},
        d2: {b2: "c2", d4: "d3"},
        d3: {b1: "c2", d1: "d2"},
        d4: {b2: "c3", d2: "d3"},
        e1: {c1: "d1", e3: "e2"},
        e2: {c2: "d2", e4: "e3"},
        e3: {c1: "d2", c3: "d3", e1: "e2", e5: "e4"},
        e4: {c2: "d3", e2: "e3"},
        e5: {c3: "d4", e3: "e4"},

        is_move_possible: function(from, to) {
            var inbetween = this[from][to];
            if (
              (
                document.getElementById(from).className == "occupied"
                || document.getElementById(from).className == "inmove"
              )
              && document.getElementById(to).className == "available"
              && document.getElementById(inbetween).className == "occupied"
            ) {
                return true;
            }
            return false;
        },

        total_moves_possible: function() {
            var all_occupied_elements = document.getElementsByClassName("occupied");
            var possible = 0;

            for (var i=0; i < all_occupied_elements.length; i++) { 
                var keys = Object.keys(this[all_occupied_elements[i].id]);
                for (var j=0; j < keys.length; j++)
                    if (this.is_move_possible(all_occupied_elements[i].id, keys[j]))
                        possible++;
            }
            return possible;
        },
        move: function(from, to) {
            if (this.is_move_possible(from, to)) {
                var inbetween = this[from][to];
                document.getElementById(from).className = "available";
                document.getElementById(inbetween).className = "available";
                document.getElementById(to).className = "occupied";
                return true;
            }
            return false;
        }
    } // cell {}
} // onload()

var in_move = false;
var from_cell;
var to_cell;

var start_clicked = function(td) {
    td.className = "available"; // Create first empty space at start of game
    document.getElementById("pieces_left").innerHTML = document.getElementsByClassName("occupied").length.toString();
    document.getElementById("possible_moves").innerHTML = cell.total_moves_possible().toString() + " moves possible";
    document.getElementById("log").innerHTML += "x " + td.id.toString() + "<br />\n";
    clicked = gameclicked;   // Hand off to the click handler for the rest of the game
};
var clicked = start_clicked;

var gameclicked = function(td) {
    if (!in_move) {                       // if not currently in move ...
        if (td.className == "occupied") { // and cell is occupied . . .
            in_move = true;               // move has started
            from_cell = td.id;            // register 'from' position
            td.className = "inmove";
        }
    }
    else {  // currently in move
        to_cell = td.id;
        // if same cell clicked again, cancel move
        if (to_cell == from_cell) {
            in_move = false;
            td.className = "occupied";
            return;
        }
        if (cell.move(from_cell, to_cell)) {
            var remaining = document.getElementsByClassName("occupied").length;
            document.getElementById("pieces_left").innerHTML = remaining.toString();
            var possible_moves = cell.total_moves_possible();
            if (possible_moves === 0)
                if (remaining == 1)
                    document.getElementById("possible_moves").innerHTML = "<strong>Congratulations!</strong>";
                else
                    document.getElementById("possible_moves").innerHTML = "Game Over";
            else if (possible_moves == 1)
                document.getElementById("possible_moves").innerHTML = "1 move possible";
            else
                document.getElementById("possible_moves").innerHTML = possible_moves.toString()  + " moves possible";
            document.getElementById("log").innerHTML += from_cell.toString() + " -> " + to_cell.toString() + "<br />\n";
            in_move = false;
        }
    }
};

var new_game = function() {
    var cells = document.getElementsByName("game");
    for (var i=0; i < cells.length; i++)
        cells[i].className = "occupied";
    in_move = false;
    document.getElementById("pieces_left").innerHTML = "";
    document.getElementById("possible_moves").innerHTML = "Click or tap a game piece to start game";
    document.getElementById("log").innerHTML = "";
    document.getElementById("show_names").innerHTML = "Show Names";
    clicked = start_clicked;
};

var show_log = function(button) {
    var log = document.getElementById('log');
    if (log.style.display == "none" || log.style.display === "") {
        log.style.display = "block";
        button.innerHTML = "Hide Log";
    }
    else {
        log.style.display = "none";
        button.innerHTML = "Show Log";
    }
};

var show_ids = function(button) {
    var cells = document.getElementsByName("game");
    if (cells[0].innerHTML.length === 0) {
        for (var i=0; i < cells.length; i++) {
            cells[i].innerHTML = cells[i].id;
            button.innerHTML = "Hide Names";
        }
    }
    else {
        for (var i=0; i < cells.length; i++) {
            cells[i].innerHTML = "";
            button.innerHTML = "Show Names";
        }
    }
};