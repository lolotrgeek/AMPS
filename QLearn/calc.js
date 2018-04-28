// calc.js  

// Calculates various power, energy and market equations

// Definitions

    // power = Wh
    // energy = W
    // time_period = total simulation length
    // load = energy

    // power_factor = real_power(W) / apparent_power (VA)
    // load_factor = avg_load / max_load * time_period
    // demand_factor = max_load * time_period / max_rated_load

    // Reward: load_factor and demand_factor are 1
    // Failure: load_factor and demand_factor are greater than 1

    // State = load_factor
    // Action = store_power



// requirements
var
request = require('request-json'),
jsonic = require('jsonic'), 
moment = require('moment'),
fs = require('fs'),
math = require('mathjs'),
async = require('async')

// gld server
var
server = "http://localhost:6267/", 
client = request.createClient(server) 

// STATE
client.get("json/clock", function(err, res, body) {

    // Get Current Time
    var now = body.clock.replace('PST','')

    // Pause Simulation
    client.get("control/pauseat="+ now, function(err, res, body) {
        console.log("PAUSED: " + now)
        
        // Determine State
        client.get("json/house0/total_load", function(err, res, body) {

            var fix = jsonic(body)
            var load = parseFloat(fix.value.replace('kW', '').replace('+', ''))
            var loadObj = {
                load
            }

            fs.appendFile("loads.json", JSON.stringify(loadObj), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("Load "+ load +" was saved!");
                
                fs.readFile("loads", "utf-8", function(err, loads) {
                    
                    var jsonloads = JSON.parse(loads)

                    // Convert Json object to an array...

                    // Calculate Load Factor
                    var time_start = moment("2016-01-01 00:00:00", 'YYYY-MM-DD HH:mm:ss') 
                    var time_current = moment(now, 'YYYY-MM-DD HH:mm:ss')
                    var time_period = time_current.diff(time_start, 'hours')
                    var max_load = math.max(all_loads)
                    var sum_load = math.sum(all_loads)
                    var usage = sum_load / 1000 * time_period        
                    var avg_load = sum_load / all_loads.length
                    var load_factor = usage / max_load * time_period
                    console.log (sum_load)
                    console.log ("AVERAGE LOAD: " + avg_load + ' W')
                    console.log ("MAX LOAD:" + max_load + " W")
                    console.log ("TIME PERIOD: " + time_period + " hours")
                    console.log ("USAGE:" + usage + ' kWh')
                    console.log ("LOAD FACTOR: " + load_factor)

                    client.get("control/resume", function(err, res, body) {     
                        console.log("RESUMED: " + now)
                    }) // resume
                }) // loads
            }) // write 

        }) // state
    }) // pause
}) // time




// // Rated Loads
// var rated_loads = []
// rated_loads.push(rated_load)

// // Max Rated Load
// var max_rated_load = Math.max.apply(rated_loads, Array)

// // Demand Factor
// var demand_factor = max_load / time_period * max_rated_load

// // Power Factor
// var power_factor = apparent_power / real_power