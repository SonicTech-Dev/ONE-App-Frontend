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
          { title: 'SpotLight Entrance', location: 'Mockup Room', status: 'off', color: '#ff0000ff', isOn: false, iconName: 'pipe-valve' , library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED Entrance', location: 'Mockup Room', status: 'On', color: '#ff0000ff', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_62_1',
            ability_id: 'switch.0c110500755c_62_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd9e951b49ea37493080d28d47eb7196d5',
            ability_id: 'e8a6e2b96d60e4cf694bf2975b08710fc',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Kitchen', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_71_1',
            ability_id: 'switch.0c110500755c_71_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dcd09f5b683d14ffc81dc141eb29153fe',
            ability_id: 'e5190ec1a96574f699f0b8985bfba3ce0',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Kitchen', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_72_1',
            ability_id: 'switch.0c110500755c_72_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'da24539f28477472f952ee8a1830c2348',
            ability_id: 'eb97568d3feb14e8882ec727587347d51',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ExhaustFan Kitchen', location: 'Mockup Room', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_73_1',
            ability_id: 'switch.0c110500755c_73_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfbb9f018882a430c8767ca339522c38c',
            ability_id: 'ef99fe4dbb2144ae48139a9aef6491630',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Reception', location: 'Mockup Room', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_81_1',
            ability_id: 'switch.0c110500755c_81_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'daff692a4120b471b8afbecda4e326ba4',
            ability_id: 'e1d9936747c874f3592780b8886aad929',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Reception', location: 'Mockup Room', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_82_1',
            ability_id: 'switch.0c110500755c_82_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd2a39f1771995416abdffa70f824fff91',
            ability_id: 'e6e4c364524d44f94978af01bb15df023',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'CoveLight Reception', location: 'Mockup Room', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_83_1',
            ability_id: 'switch.0c110500755c_83_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'da2c227862c94420e917cb35587c903fa',
            ability_id: 'ecaa8286bc5664f65ae256e661d4eb034',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Toilet', location: 'Mockup Room', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_91_1',
            ability_id: 'switch.0c110500755c_91_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd72f2703f8bc041828756297384186785',
            ability_id: 'e8c90454417fa49958bbaddb9730af5d9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Toilet', location: 'Mockup Room', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_92_1',
            ability_id: 'switch.0c110500755c_92_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'da02f25afed2f433588db446c731cc339',
            ability_id: 'ee8723cef9e8b4b97a35ef7f475e4622d',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ExhaustFan Toilet', location: 'Mockup Room', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_93_1',
            ability_id: 'switch.0c110500755c_93_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd09d8fd7910884df3ba90c0ff65749bab',
            ability_id: 'e67c9175f62344999b49cfa21ee11e4f2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Laundry', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_94_1',
            ability_id: 'switch.0c110500755c_94_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd0b32e3a28fbf4dfca04b187eff64ebc6',
            ability_id: 'e6d37284d7df44c4c93baf734b674308d',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ExhaustFan Laundry', location: 'Mockup Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_95_1',
            ability_id: 'switch.0c110500755c_95_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de30a44dbb94047dfbd8b6ce185bf33e2',
            ability_id: 'e937293a528614a30883eb5c21cc6e20e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Balcony', location: 'Mockup Room', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_101_1',
            ability_id: 'switch.0c110500755c_101_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd8aa34ba30a594219b2e047f3ee30349e',
            ability_id: 'eafa9ee6cebed410f801df0f2fd52df38',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Balcony', location: 'Mockup Room', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_102_1',
            ability_id: 'switch.0c110500755c_102_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de03b7c4fc31b44fcafaf578ab249cb3d',
            ability_id: 'ed2b29c985085412e839c7d5694db18e2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Balcony', location: 'Mockup Room', status: 'On', color: '#00eeffff', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_103_1',
            ability_id: 'switch.0c110500755c_103_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd8a7b66602b8c4043b6c8ba085ab03382',
            ability_id: 'e654b2d73661947db9e1a963a0d1ef398',
            commandPair: { on: 'lock', off: 'unlock' }
          }},
          { title: 'ProfileLED Balcony', location: 'Mockup Room', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
          lan: {
            device_id: '0c110500755c_104_1',
            ability_id: 'switch.0c110500755c_104_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dd2c8c003c6a14b85bdb561322bcae49c',
            ability_id: 'e537836951c5a4ce595ac085cff778334',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight MasterBedroom', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'home-flood' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_61_1',
            ability_id: 'switch.0c11052bf1cf_61_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd8aa34ba30a594219b2e047f3ee30349e',
            ability_id: 'eafa9ee6cebed410f801df0f2fd52df38',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED MasterBedroom', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'smoke' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_62_1',
            ability_id: 'switch.0c11052bf1cf_62_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de03b7c4fc31b44fcafaf578ab249cb3d',
            ability_id: 'ed2b29c985085412e839c7d5694db18e2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'CoveLight MasterBedroom', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk' ,library: 'Ionicons',
          lan: {
            device_id: '0c11052bf1cf_63_1',
            ability_id: 'switch.0c11052bf1cf_63_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'decbc855cd65847eda575eb136627bba3',
            ability_id: 'e5294f4c4224b457ab8981fc3d5c3d863',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'MagneticTrack MasterBedroom', location: 'Mockup Room', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
          lan: {
            device_id: '9ca500c71502a3b8939ce0e886dcf527',
            ability_id: 'switch.e24606d661839535225d672aebcae74b',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd668ecd0a7bf44daeb92c8c089bef5538',
            ability_id: 'eed4bf42777764b7faaa4be691eed2c0a',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight LivingRoom', location: 'Mockup Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'human-greeting-variant' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'b3ee61e963fc08f3fce1a290ee4a503d',
            ability_id: 'switch.9a7d564af899531474785f0c04eb82f9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd9c52afe868ae4b37bfb726bc37893e7c',
            ability_id: 'e8b000d0f2d474ecdb5b4cbe5070854da',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED LivingRoom', location: 'Mockup Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'b3ee61e963fc08f3fce1a290ee4a503d',
            ability_id: 'switch.9a7d564af899531474785f0c04eb82f9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd34a26148532f44119212af8a0be2d466',
            ability_id: 'e7f06a9b903384e9c8f7bece392242250',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight MasterToilet', location: 'Mockup Room', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'a4441cc618293abb8d29adbf2387e18c',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd72f2703f8bc041828756297384186785',
            ability_id: 'e8c90454417fa49958bbaddb9730af5d9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Exhaust MasterToilet', location: 'Mockup Room', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'a4441cc618293abb8d29adbf2387e18c',
            ability_id: 'binary_sensor.dfaee6764c3eece4e8994ba1a1be56bb',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd09d8fd7910884df3ba90c0ff65749bab',
            ability_id: 'e67c9175f62344999b49cfa21ee11e4f2',
            commandPair: { on: 'turn_on', off: 'turn_off' }
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
