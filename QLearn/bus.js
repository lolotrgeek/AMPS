// bus.js - GLD Simulation Interface

// Allows interaction with various busses in a gld simulation
// http://gridlab-d.shoutwiki.com/wiki/Running_Simulations

// How it works:
// Requests and parses data generated by a server running a gld simulation.
// Sends requests back to server which are sent to simulation.

// Usage: 
// 1. Define server variable below.
// 2. Import: 
//      bus = require ('./bus.js')
// 3. Commands: 
//      bus.Play() 
//      bus.Stop()
//      bus.Stop()
//      bus.Pause()
//      bus.Resume()
//      bus.State(object, property)     
//      bus.Action(object, property, value)

//

// * Variables *
var
server = "http://localhost:6267/", // GLD server address and port
request = require('request-json'), 
client = request.createClient(server) // request client that handles json
object = null;
property = null;
value = null;

console.log("bus.js")

// * Time *
module.exports.Time = function () {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock.replace('PST','')
            return now
        }
    })
}

// * Play Simulation * 
// UNUSED - TODO: start gld remotely 
module.exports.Play = function () {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock
            console.log("STARTED: " + now)
            return now
        }
    })
}

// * Stop Simulation *
module.exports.Stop = function () {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock // current time
            stop = "control/shutdown"// stop command

            client.get(stop, function(err, res, body) {
                if (!err) {
                    console.log("STOPPED: " + now)
                    return pause
                }
            })
        }
    })
}

// * Pause Simulation *
module.exports.Pause = function () {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock // current time
            pause = "control/pauseat="+ now // pause command

            client.get(pause, function(err, res, body) {
                if (!err) {
                    console.log("PAUSED: " + now)
                    return pause

                }
            })
        }
    })
}

// * Resume Simulation *
module.exports.Resume = function () {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock //current time
            resume = "control/resume" // resume command   

            client.get(resume, function(err, res, body) {     
                if (!err) {
                    console.log("RESUMED: " + now)
                    return resume

                }
            })
        }
    })
}

// * Simulation State *
// Get the state of any object in the simulation
module.exports.State = function (object, property) {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock //current time
            state = "json/" + object + "/" + property // state command   

            client.get(state, function(err, res, body) {     
                if (!err) { 
                    // property name and property value  
                    console.log( body)
                    return body.value
                }
            })
        }
    })
}

// * Simulation Action *
// Alter the state of any object in the simulation
module.exports.Action = function (object, property, value) {
    client.get("json/clock", function(err, res, body) {
        if (!err) {
            now = body.clock //current time
            action = "json/" + object + "/" + property + "=" + value // action command   

            client.get(action, function(err, res, body) {     
                if (!err && body.value == value) { 
                    // property name and property value  
                    console.log( "ACTION SUCCESS:" + body.object + "is" + body.value)
                    return success

                } else {
                    console.log( "ACTION FAILED:" + body.object + "is" + body.value + "not" + value)
                }
            })
        }
    })    
}