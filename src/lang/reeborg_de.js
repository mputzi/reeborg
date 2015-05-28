/* Author: André Roberge
   Translation: Martin Putzlocher
   License: MIT
 */

/*jshint browser:true, devel:true, white:false, plusplus:false */
/*globals $, CodeMirror, editor, library, removeHints, parseUri */

var RUR = RUR || {};

// required for lint.js
var globals_ = "/*globals geh, dreh_links, GebrauchterBot, vorne_frei, rechts_frei, "+
                    " schaut_nach_norden, fertig, leg, nimm, objekt_hier, waehle_welt, waehle_herausforderung,"+
                    " marker_hier, hat_marker, schreibe, am_ziel, am_ziel_orientierung," +
                    " bau_wand, denke, pause, wiederhole, sound," +
                    "RUR, inspiziere, siehe_quelle, verifiziere, sag, bibliothek */\n";

var geh, dreh_links, inspiziere, vorne_frei, rechts_frei, waehle_herausforderung,
    schaut_nach_norden, fertig, leg, nimm, objekt_hier, waehle_welt, marker_hier,
    hat_marker, schreibe, am_ziel, am_ziel_orientierung, bau_wand, denke,
    pause, wiederhole, siehe_quelle, sound, GebrauchterBot,
    setze_max_schritte, sag, verifiziere, ReeborgError;

// do not translate the following instructions; they are included only
// so that most basic programs from rur-ple would run "as-is"
var put_beeper, pick_beeper, turn_off, on_beeper, carries_beepers, next_to_a_beeper, set_delay, facing_north;

RUR.verifiziere = function(test) {
    var reeborg, roboter, welt, marker, orientierung;
    var ost, Osten, west, Westen, nord, Norden, sued, Sueden;
    var js_test;
    ost = Osten = RUR.EAST;
    west = Westen = RUR.WEST;
    nord = Norden = RUR.NORTH;
    sued = Sueden = RUR.SOUTH;
    welt = RUR.current_world;
    roboter = world.robots;
    reeborg = robots[0];
    marker = reeborg.tokens;
    orientierung = reeborg.orientation;

    // if language is Python ... require spaces around logical operators to simplify
    js_test = test.replace(/ and /g, '&&');
    js_test = js_test.replace(/ or /g, '||');
    js_test = js_test.replace(/ not /g, '!');
    // True and False should not necessary to use ... but just in case
    js_test = js_test.replace(/False/g, 'false');
    js_test = js_test.replace(/True/g, 'true');

    if (eval(js_test)){ // jshint ignore:line
        return;
    }
    throw ReeborgError("Fehler: <br>"+test);
};


RUR.reset_definitions = function () {
	// defined above
	verifiziere = RUR.verifiziere;
    // RUR._x_ defined in commands.js
    am_ziel = RUR._at_goal_;
    am_ziel_orientierung = RUR._at_goal_orientation_;
    bau_wand = RUR._build_wall_;
    vorne_frei = RUR._front_is_clear_;
    hat_marker = RUR._has_token_;
    schaut_nach_norden = RUR._is_facing_north_;
    geh = RUR._move_;
    leg = RUR._put_;
    marker_hier = RUR._token_here_;
    rechts_frei = RUR._right_is_clear_;
    objekt_hier = RUR._object_here_;
    nimm = RUR._take_;
    dreh_links = RUR._turn_left_;
    wiederhole = RUR._repeat_;
    setze_max_schritte = RUR._set_max_steps_;
    // defined in rur_utils.js
    inspiziere = RUR.inspect;
    siehe_quelle = RUR.view_source;
    // defined in control.js
    schreibe = RUR.control.write;
    fertig = RUR.control.done;
    sound = RUR.control.sound;
    denke = RUR.control.think;
    sag = RUR.control.say;
    pause = RUR.control.pause;
    // defined in ui.js
    waehle_welt = RUR.ui.select_world;
    waehle_herausforderung = RUR.ui.select_challenge;


    UsedRobot = function (x, y, orientation, tokens)  {
        this.body = RUR.robot.create_robot(x, y, orientation, tokens);
        RUR.world.add_robot(this.body);
    };

    UsedRobot.prototype.at_goal = function () {
        RUR.control.at_goal(this.body);
    };

    UsedRobot.prototype.at_goal_orientation = function () {
        RUR.control.at_goal_orientation(this.body);
    };

    UsedRobot.prototype.build_wall = function () {
        RUR.control.build_wall(this.body);
    };

    UsedRobot.prototype.front_is_clear = function () {
        RUR.control.front_is_clear(this.body);
    };

    UsedRobot.prototype.has_token = function () {
        RUR.control.has_token(this.body);
    };

    UsedRobot.prototype.is_facing_north = function () {
        RUR.control.is_facing_north(this.body);
    };

    UsedRobot.prototype.move = function () {
        RUR.control.move(this.body);
    };

    UsedRobot.prototype.put = function () {
        RUR.control.put(this.body);
    };

    UsedRobot.prototype.token_here = function () {
        RUR.control.token_here(this.body);
    };

    UsedRobot.prototype.right_is_clear = function () {
        RUR.control.right_is_clear(this.body);
    };

    UsedRobot.prototype.object_here = function () {
        RUR.control.object_here(this.body);
    };

    UsedRobot.prototype.take = function () {
        RUR.control.take(this.body);
    };

    UsedRobot.prototype.turn_left = function () {
        RUR.control.turn_left(this.body);
    };

    verify = RUR.verify;

    // English speficic and only for compatibility with rur-ple
    // do not translate the following
    put_beeper = put;
    pick_beeper = take;
    turn_off = done;
    on_beeper = token_here;
    next_to_a_beeper = token_here;
    carries_beepers = has_token;
    set_delay = think;
    facing_north = is_facing_north;
};
RUR.reset_definitions();
