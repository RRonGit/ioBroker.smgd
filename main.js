'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const request = require('request');


function decrypt(key, value) {
    
	let result = "";
    for (let i = 0; i < value.length; ++i) {
    result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
    }
    adapter.log.debug("password decrypt ready");
    return result;
}

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

/**
 * Starts the adapter instance
 * @param {Partial<utils.AdapterOptions>} [options]
 */

function startAdapter(options) {

    return adapter = utils.adapter(Object.assign({}, options, {
    
	name: 'smgd',

    ready: onReady, // Main method defined below for readability

    unload: (callback) => {
            
	    try {
        // Here you must clear all timeouts or intervals that may still be active
        // clearTimeout(timeout1);
        // clearTimeout(timeout2);
        // ...
        // clearInterval(interval1);

        callback();
		
        } 
		
		catch (e) {
            
			callback();
        }
     },

    // is called if a subscribed state changes
    stateChange: (id, state) => {
            
	    if (state) {
        // The state was changed
        adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
        // The state was deleted
        adapter.log.info(`state ${id} deleted`);
            
	    }
    },

    }));
}

//*********************************************************************
//* onReady (Adapter Ready)
//*********************************************************************

// entschlüsselt das gespeicherte Secret und startet main()

function onReady() {

    adapter.log.debug("ready - Adapter: Passwort entschluesselt");
    adapter.log.silly("config.password verschlüsselt: " + adapter.config.password);

    adapter.getForeignObject("system.config", (err, obj) => {
    
	if (obj && obj.native && obj.native.secret) {
    //noinspection JSUnresolvedVariable
    adapter.config.password = decrypt(obj.native.secret, adapter.config.password);
    } else {
     //noinspection JSUnresolvedVariable
    adapter.config.password = decrypt("Zgfr56gFe87jJOM", adapter.config.password);
	
    }
  
 // Intervall der funciton main einstellen (States Update Intervall)
     
    let abfrage_intervall = 60000;  
     
    abfrage_intervall = adapter.config.abfrage_intervall;
    
    if (abfrage_intervall < 60000) {
    
    adapter.log.info("Der Abfrage Intervall ist auf: " + abfrage_intervall + "ms eingestellt und damit zu klein gewählt, der Intervall wird nun auf 60000ms eingestellt");
    abfrage_intervall = 60000;
    }

    adapter.log.info("smart-me Abfrage Intervall wird auf: " + abfrage_intervall + " ms eingestellt"); 
	
    setInterval(function() {
        main();
    }, abfrage_intervall);
	
// Adapter beenden wenn Eingabe fehlt

    if (adapter.config.username == "" || adapter.config.password == "" || adapter.config.abfrage_intervall == "") {

	adapter.log.info("smart-me: fehlende Angaben in den Adapter Settings : der smart-me Adapter wird beendet, bitte Eingaben ueberpruefen!");

	adapter.setForeignState("system.adapter." + adapter.namespace + ".alive", false);
    }
    else {
	
// Haupt Funktion main wird aufgerufen

    main();
	
    }
    });
 }


async function main() {
    
    let smartme;
    let username = adapter.config.username;
    let password = adapter.config.password;
    let base64auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    let url = "https://smart-me.com:443/api/Devices";
    let is_state_number = ["Serial", "DeviceEnergyType", "MeterSubType", "FamilyType", "ActivePower", "ActivePowerL1", "ActivePowerL2", "ActivePowerL3", "CounterReading", "CounterReadingT1", "CounterReadingT2", "CounterReadingT3", "CounterReadingT4", "CounterReadingImport", "CounterReadingExport", "Voltage", "VoltageL1", "VoltageL2", "VoltageL3", "Current", "CurrentL1", "CurrentL2", "CurrentL3", "ActiveTariff", "PowerFactor", "PowerFactorL1", "PowerFactorL2", "PowerFactorL3", "Temperature", "AnalogOutput1", "AnalogOutput2", "FlowRate"];
    let is_state_string = ["Id", "Name", "ActivePowerUnit", "CounterReadingUnit", "ValueDate", "AdditionalMeterSerialNumber", "ChargingStationState"];
    let is_state_boolean = ["SwitchOn", "SwitchPhaseL1On", "SwitchPhaseL2On", "SwitchPhaseL3On", "DigitalOutput1", "DigitalOutput2", "DigitalInput1", "DigitalInput2"];
    

    request({
        
        url : url,
        headers : {'Authorization' : base64auth}
    }, 

        async function (error, response, body) {

            if(error) {
            adapter.log.info("Error Request: " + error);
            return;
            }

            if(response.statusCode != 200){
                if(response.statusCode == 429)
                adapter.log.info("429 Too many requests");
                else
                adapter.log.info("Response Statuscode: " + response.statusCode+" "+ response.body);
            }


            try{
            smartme = JSON.parse(body);

            }catch(err){
            adapter.log.info("Error on parsing string: " + err);
            }

            for (let array in smartme) {
        
                for (let objekte in smartme[array]) {
        
                    if (is_state_number.includes ( objekte )) {
        
                        await adapter.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
                
                        type: 'state',
                        common: {
                            name: objekte,
                            type: 'number',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                        });
        
                        await adapter.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
                    }			    
                    
                    if (is_state_string.includes ( objekte )) {
                        
                        await adapter.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
                  
                        type: 'state',
                        common: {
                            name: objekte,
                            type: 'string',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                        });
        
                        await adapter.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
                    }	
                    
                    if (is_state_boolean.includes ( objekte )) {
                        
                        await adapter.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
                  
                        type: 'state',
                        common: {
                            name: objekte,
                            type: 'boolean',
                            role: 'value',
                            read: true,
                            write: false,
                        },
                        native: {},
                        });
        
                        await adapter.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
                    }
                }
            }
        }
    );
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export startAdapter in compact mode
    
	module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
	
}