// Put your INITIAL_DEVICE_CATEGORIES and LAN_HEADERS here

export const INITIAL_DEVICE_CATEGORIES = [
        {
        category: 'Mockup Room',
        items: [
          { title: 'Curtain-1', location: 'Mockup Room', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755b_91_5',
            ability_id: 'cover.0c110500755b_91_5',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd02b8a93297a748deb2c4ea56ab0e31d9',
            ability_id: 'e6d42554a84ad481c8ae0836d33fafbbb',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          { title: 'Curtain-2', location: 'Mockup Room', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755b_91_5',
            ability_id: 'cover.0c110500755b_91_5',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd02b8a93297a748deb2c4ea56ab0e31d9',
            ability_id: 'e6d42554a84ad481c8ae0836d33fafbbb',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          { title: 'SpotLight Entrance', location: 'Mockup Room', status: 'off', color: '#ffd700', isOn: false, iconName: 'pipe-valve' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_61_1',
            ability_id: 'switch.0c110500755c_61_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dd559f7bd23884afdaf30e9fc4160fd53',
            ability_id: 'e4108c3f6bfb649afa26646bacf4db2a0',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Entrance', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_62_1',
            ability_id: 'switch.0c110500755c_62_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dd559f7bd23884afdaf30e9fc4160fd53',
            ability_id: 'e4108c3f6bfb649afa26646bacf4db2a0',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 2', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_72_2',
            ability_id: 'light.0c110500755b_72_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfe6929b1ee624c28ae19444137a3a4cb',
            ability_id: 'eac855de64b4541a89d6d09e7cafb97a6',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 3', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_73_2',
            ability_id: 'light.0c110500755b_73_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dbe5ffd931a7d488198f9d8f9d0e0be90',
            ability_id: 'ecce2e00331204792bf86564c9379363f',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 4', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_74_2',
            ability_id: 'light.0c110500755b_74_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfbb9f018882a430c8767ca339522c38c',
            ability_id: 'ef99fe4dbb2144ae48139a9aef6491630',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'AC - Thermostat', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755b_130_11',
            ability_id: 'climate.0c110500755b_130_11',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd4065d1e8e8fe48bba748b4ebb54c4b93',
            ability_id: 'e174c7b73e2924f889307e2c9cfd9e38e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'AC - Fancoil', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: '14631787d21b54d80cc05abcc8089802',
            ability_id: 'climate.059a99bb5d21983d9cc2d41aeeab3c61',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'ddeb893627de44fad8f41f76a82c6def9',
            ability_id: 'ef43f29dc162c457bbcddde14af78e92f',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Super General AC', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: 'b34351503596ea52be6f8104230b1e28',
            ability_id: 'climate.b34351503596ea52be6f8104230b1e28',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de40ea739d12a404e8131b5c9c88afd1c',
            ability_id: 'e34500e7fc9cc49d2a4a47ef86d467a31',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '2 Gang Switch 1', location: 'Mockup Room', status: 'On', color: '#ff4500', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            ability_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dc753f65f43d94bd9baee70517f438378',
            ability_id: 'e36bcc6c266cc473d9eec5c5d06b69ec1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '2 Gang Switch 2', location: 'Mockup Room', status: 'On', color: '#ff4500', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            ability_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dc753f65f43d94bd9baee70517f438378',
            ability_id: 'e728c130866d44433abef2a8c6a8ec495',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 1', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e2871a263ade34cb1bccb99161e218851',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 2', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'ea17afa6af48046b1911e25e8af63a797',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 3', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e3234060e8082472aa480cd06d32afd9b',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 4', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e5517e0b7eb01452cb01aa3a4f67442b4',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SL50 Smart Lock', location: 'Mockup Room', status: 'On', color: '#32d2d6', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'db2e1e1facd954e5b8877dbe2f20c1be9',
            ability_id: 'e199f9672cfd5439994c79965566266eb',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Flood Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'home-flood' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '035c8f5d77c1570bf90c05061dab2720',
            ability_id: 'binary_sensor.7f5fe909f5ee6c5267f45ca8a333be72',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'dadf63b94876444eea78c7493c37c8fdf',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Smoke Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'smoke' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '52a322972b4582665f9f3da34363fb24',
            ability_id: 'binary_sensor.b9d42a3aaef5618de410b9d8854a92bc',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd3e1a9eeb93564914ad76cae2a03a3076',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Motion Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk' ,library: 'Ionicons',
          lan: {
            device_id: '2776f483204110b57f81ca398287c9e7',
            ability_id: 'binary_sensor.e316bd9d92a0edb0af8185baeddb9919',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'decbc855cd65847eda575eb136627bba3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Temperature&Humidity Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
          lan: {
            device_id: 'df4615fb17a1d849281d50c7a3e4b8d7',
            ability_id: 'sensor.1d3e208225048087f323bbf1b5121409',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd1266dfb7fc8e4e7d95af15caf2dc0604',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Occupancy Sensor', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'human-greeting-variant' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '6ca074935afc0fc863573dc989fb6d54',
            ability_id: 'sensor.d05f3c275e79ae8ffce130d6c0dacba7',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd908f976b0ae4434b9b7af14233ecf551',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Door/Window Sensor', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'a4441cc618293abb8d29adbf2387e18c',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd9b1ff02c5e244a40a41e5d29f41126d3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},

        ],
      },
        {
        category: 'Exhibition Room',
        items: [
          { title: 'Curtain', location: 'Mockup Room', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755b_91_5',
            ability_id: 'cover.0c110500755b_91_5',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd02b8a93297a748deb2c4ea56ab0e31d9',
            ability_id: 'e6d42554a84ad481c8ae0836d33fafbbb',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          { title: 'Smart Valve', location: 'Mockup Room', status: 'off', color: '#ffd700', isOn: false, iconName: 'pipe-valve' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '1ee057b714250532daf237e6a5db338e',
            ability_id: 'switch.3cadbd37b9da10a57edf70c087b11de1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df61b80958ad64cbeb829f67438813fe4',
            ability_id: 'e02ef75fa89e04b529477f5b98b8d79c1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 1', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_61_1',
            ability_id: 'switch.0c110500755c_61_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfbc4db620ddf4e79b1a667aa862c0a4a',
            ability_id: 'e2ef9a546df6d4ee6b8f305c8a8ebeb34',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 2', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_72_2',
            ability_id: 'light.0c110500755b_72_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfe6929b1ee624c28ae19444137a3a4cb',
            ability_id: 'eac855de64b4541a89d6d09e7cafb97a6',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 3', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_73_2',
            ability_id: 'light.0c110500755b_73_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dbe5ffd931a7d488198f9d8f9d0e0be90',
            ability_id: 'ecce2e00331204792bf86564c9379363f',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Dimmer 4', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755b_74_2',
            ability_id: 'light.0c110500755b_74_2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfbb9f018882a430c8767ca339522c38c',
            ability_id: 'ef99fe4dbb2144ae48139a9aef6491630',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'AC - Thermostat', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755b_130_11',
            ability_id: 'climate.0c110500755b_130_11',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd4065d1e8e8fe48bba748b4ebb54c4b93',
            ability_id: 'e174c7b73e2924f889307e2c9cfd9e38e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'AC - Fancoil', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: '14631787d21b54d80cc05abcc8089802',
            ability_id: 'climate.059a99bb5d21983d9cc2d41aeeab3c61',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'ddeb893627de44fad8f41f76a82c6def9',
            ability_id: 'ef43f29dc162c457bbcddde14af78e92f',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Super General AC', location: 'Mockup Room', status: 'On', color: '#1e90ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: 'b34351503596ea52be6f8104230b1e28',
            ability_id: 'climate.b34351503596ea52be6f8104230b1e28',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de40ea739d12a404e8131b5c9c88afd1c',
            ability_id: 'e34500e7fc9cc49d2a4a47ef86d467a31',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '2 Gang Switch 1', location: 'Mockup Room', status: 'On', color: '#ff4500', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            ability_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dc753f65f43d94bd9baee70517f438378',
            ability_id: 'e36bcc6c266cc473d9eec5c5d06b69ec1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '2 Gang Switch 2', location: 'Mockup Room', status: 'On', color: '#ff4500', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            ability_id: 'switch.55a2bee1cd3670ca5cc9d4902b812bb9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dc753f65f43d94bd9baee70517f438378',
            ability_id: 'e728c130866d44433abef2a8c6a8ec495',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 1', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e2871a263ade34cb1bccb99161e218851',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 2', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'ea17afa6af48046b1911e25e8af63a797',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 3', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e3234060e8082472aa480cd06d32afd9b',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: '4 Gang Switch 4', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'df1bb3641d84d4261a087bcb028ac92bc',
            ability_id: 'e5517e0b7eb01452cb01aa3a4f67442b4',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SL50 Smart Lock', location: 'Mockup Room', status: 'On', color: '#32d2d6', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'db2e1e1facd954e5b8877dbe2f20c1be9',
            ability_id: 'e199f9672cfd5439994c79965566266eb',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'C6 Lock', location: 'Mockup Room', status: 'On', color: '#32d2d6', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd27ca74cbb69f4fe4a8ffe8c1d425d711',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Flood Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'home-flood' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '035c8f5d77c1570bf90c05061dab2720',
            ability_id: 'binary_sensor.7f5fe909f5ee6c5267f45ca8a333be72',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'dadf63b94876444eea78c7493c37c8fdf',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Smoke Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'smoke' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '52a322972b4582665f9f3da34363fb24',
            ability_id: 'binary_sensor.b9d42a3aaef5618de410b9d8854a92bc',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd3e1a9eeb93564914ad76cae2a03a3076',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Motion Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk' ,library: 'Ionicons',
          lan: {
            device_id: '2776f483204110b57f81ca398287c9e7',
            ability_id: 'binary_sensor.e316bd9d92a0edb0af8185baeddb9919',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'decbc855cd65847eda575eb136627bba3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Temperature&Humidity Sensor', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
          lan: {
            device_id: 'df4615fb17a1d849281d50c7a3e4b8d7',
            ability_id: 'sensor.1d3e208225048087f323bbf1b5121409',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd1266dfb7fc8e4e7d95af15caf2dc0604',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Occupancy Sensor', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'human-greeting-variant' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '6ca074935afc0fc863573dc989fb6d54',
            ability_id: 'sensor.d05f3c275e79ae8ffce130d6c0dacba7',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd908f976b0ae4434b9b7af14233ecf551',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Door/Window Sensor', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'a4441cc618293abb8d29adbf2387e18c',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd9b1ff02c5e244a40a41e5d29f41126d3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'CO Sensor', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'sensors' ,library: 'MaterialIcons',
          lan: {
            device_id: '08dfb2740b8af4a98228cd5dd644e6b1',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd7b9721dd5cb748bfb0fc9d624595d6ae',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Air Detector', location: 'Mockup Room', status: 'off', color: '#ffbf42', isOn: false, iconName: 'air' ,library: 'MaterialIcons',
          lan: {
            device_id: '5b54a9e50d835770c3fb1274a8181230',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'da0e611ec034744e48ddfa455d272a019',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
        ],
      },
      {
        category: 'Living Room',
        items: [
          { title: 'Smart TV', location: 'Living Room', status: 'On', color: '#32a852', isOn: true, iconName: 'tv' , library: 'Ionicons',lan: {
            device_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            ability_id: 'switch.e996fd06123a3608d96b5ee1edc12d2e',
            commandPair: { on: 'lock', off: 'unlock' }
          },
          wan: {
            device_id: 'd9b1ff02c5e244a40a41e5d29f41126d3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'Air Conditioner', location: 'Living Room', status: 'On', color: '#4ac0ff', isOn: true, iconName: 'snow' ,library: 'Ionicons' },
          { title: 'Smart Speaker', location: 'Living Room', status: 'Off', color: '#1e90ff', isOn: false, iconName: 'volume-high',library: 'Ionicons'},
          { title: 'Ceiling Light', location: 'Living Room', status: 'On', color: '#ffd700', isOn: true, iconName: 'bulb' ,library: 'Ionicons'},
        ],
      },
      {
        category: 'Bedroom',
        items: [
          { title: 'Smart Lighting', location: 'Bedroom', status: 'Off', color: '#32d2d6', isOn: false, iconName: 'bulb', library: 'Ionicons' },
          { title: 'Desk Lamp', location: 'Bedroom', status: 'On', color: '#8e44ad', isOn: true, iconName: 'bulb',library: 'Ionicons' },
          { title: 'Smart Blinds', location: 'Bedroom', status: 'Closed', color: '#ff7f50', isOn: true , iconName: 'blinds', library: 'MaterialCommunityIcons',},
          { title: 'Air Purifier', location: 'Bedroom', status: 'On', color: '#00ced1', isOn: true, iconName: 'leaf', library: 'Ionicons' },
          { title: 'Ceiling Fan', location: 'Bedroom', status: 'Off', color: '#7f8c8d', isOn: false,  },
          { title: 'Curtain', location: 'Bedroom', status: 'Off', color: '#4ac0ff', isOn: true, iconName: 'curtains' , library: 'MaterialCommunityIcons',},
        ],
      },
      {
        category: 'Kitchen',
        items: [
          { title: 'Refrigerator', location: 'Kitchen', status: 'On', color: '#ff4500', isOn: true,  },
          { title: 'Microwave Oven', location: 'Kitchen', status: 'Off', color: '#ffa500', isOn: false,  },
          { title: 'Motion Sensor', location: 'Kitchen', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk', library: 'Ionicons' },
          { title: 'Smart Plug', location: 'Kitchen', status: 'On', color: '#32a852', isOn: true, iconName: 'power' },
        ],
      },
      {
        category: 'Bathroom',
        items: [
          { title: 'Water Heater', location: 'Bathroom', status: 'On', color: '#1e90ff', isOn: true, iconName: 'thermometer' , library: 'Ionicons' },
          { title: 'Smart Mirror', location: 'Bathroom', status: 'Off', color: '#2e8b57', isOn: false,  },
          { title: 'Exhaust Fan', location: 'Bathroom', status: 'Off', color: '#7f8c8d', isOn: false,  },
        ],
      },
      {
        category: 'Hallway',
        items: [
          { title: 'Smart Door Lock', location: 'Hallway', status: 'Locked', color: '#ff6347', isOn: true, iconName: 'lock-closed', library: 'Ionicons' },
          { title: 'Motion Sensor', location: 'Hallway', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk', library: 'Ionicons' },
          { title: 'Ceiling Light', location: 'Hallway', status: 'On', color: '#ffd700', isOn: true, iconName: 'bulb', library: 'Ionicons' },
        ],
      },  
];

export const LAN_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1OGVjMDFlZDQ5ZjE0OGUwOTVlYWIwOTViMTJhMjJlNSIsImlhdCI6MTc1NjI5Mzg3OCwiZXhwIjoxNzg3ODI5ODc4fQ.lhA8X9jb-53BhrMzwizwurTKj7IGEB6wX6HijVZGx5M"
};