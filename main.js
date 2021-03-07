/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
'use strict';

const utils = require('@iobroker/adapter-core');
const adapterName = require('./package.json').name.split('.').pop();
const request = require('request');

class smgd extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: adapterName,
        });

        this.killTimeout = null;

        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));

    }


    async onReady() {
        
        let smartme;
        let username = this.config.username;
        let password =  this.config.password;
        let base64auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        let url = "https://smart-me.com:443/api/Devices";
        let is_state_number = ["Serial", "DeviceEnergyType", "MeterSubType", "FamilyType", "ActivePower", "ActivePowerL1", "ActivePowerL2", "ActivePowerL3", "CounterReading", "CounterReadingT1", "CounterReadingT2", "CounterReadingT3", "CounterReadingT4", "CounterReadingImport", "CounterReadingExport", "Voltage", "VoltageL1", "VoltageL2", "VoltageL3", "Current", "CurrentL1", "CurrentL2", "CurrentL3", "ActiveTariff", "PowerFactor", "PowerFactorL1", "PowerFactorL2", "PowerFactorL3", "Temperature", "AnalogOutput1", "AnalogOutput2", "FlowRate"];
        let is_state_string = ["Id", "Name", "ActivePowerUnit", "CounterReadingUnit", "ValueDate", "AdditionalMeterSerialNumber", "ChargingStationState"];
        let is_state_boolean = ["SwitchOn", "SwitchPhaseL1On", "SwitchPhaseL2On", "SwitchPhaseL3On", "DigitalOutput1", "DigitalOutput2", "DigitalInput1", "DigitalInput2"];

        request({
        
			url : url,
			headers : {'Authorization' : base64auth}
		}, 
	
			async  (error, response, body) => {
	
				if(error) {
				this.log.info("Error Request: " + error);
				return;
				}
	
				if(response.statusCode != 200){
					if(response.statusCode == 429)
					this.log.info("429 Too many requests");
					else
					this.log.info("Response Statuscode: " + response.statusCode+" "+ response.body);
				}
	
	
				try{
				smartme = JSON.parse(body);
	
				}catch(err){
				this.log.info("Error on parsing string: " + err);
				}

				for (let array in smartme) {

					for (let objekte in smartme[array]) {
        
						if (is_state_number.includes ( objekte )) {
			
							await this.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
					
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
			
							await this.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
						}

						if (is_state_string.includes ( objekte )) {
                        
							await this.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
					  
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
			
							await this.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
						}	
						
						if (is_state_boolean.includes ( objekte )) {
							
							await this.setObjectNotExistsAsync(smartme[array].Name + "." + objekte , {
					  
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
			
							await this.setStateAsync(smartme[array].Name + "."  + objekte, smartme[array][objekte]);
						}
				    }
			    }
			}
		);
         
        this.killTimeout = setTimeout(this.stop.bind(this), 5000);

    }

    onUnload(callback) {
        try {

            if (this.killTimeout) {
                this.log.debug('clearing kill timeout');
                clearTimeout(this.killTimeout);
            }

            this.log.debug('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new smgd(options);
} else {
    // otherwise start the instance directly
    new smgd();
}
