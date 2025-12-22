// Put your INITIAL_DEVICE_CATEGORIES and LAN_HEADERS here

export const INITIAL_DEVICE_CATEGORIES = [
      {
        category: 'Reception',
        items: [
          
          { title: 'Hypanel Supreme', location: 'Reception', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'd4f54a92bea2a440c8a6a23d0b636dcf7',
            ability_id: 'switch.0c110500755c_81_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'daff692a4120b471b8afbecda4e326ba4',
            ability_id: 'e1d9936747c874f3592780b8886aad929',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Reception', location: 'Reception', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'd4f54a92bea2a440c8a6a23d0b636dcf7',
            ability_id: 'switch.0c110500755c_81_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'daff692a4120b471b8afbecda4e326ba4',
            ability_id: 'e1d9936747c874f3592780b8886aad929',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Reception', location: 'Reception', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
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
          { title: 'CoveLight Reception', location: 'Reception', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'snow' ,library: 'Ionicons',
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
          { title: 'Curtain-Reception', location: 'Reception', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_112_4',
            ability_id: 'cover.0c110500755c_112_4',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd8b19bfae3b2a4591bec7686214208067',
            ability_id: 'e421c0277d65a4dc6a1fcedd4cb138148',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
        ],
      },
      {
        category: 'Laundry Room',
        items: [
          { title: 'SpotLight Laundry', location: 'Laundry Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'ExhaustFan Laundry', location: 'Laundry Room', status: 'On', color: '#7f8c8d', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
        ],
      },
      {
        category: 'Bedroom',
        items: [
          { title: 'Curtain-Bedroom', location: 'Bedroom', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_111_4',
            ability_id: 'cover.0c110500755c_111_4',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'df230794fa8b74d72a763f580071a2241',
            ability_id: 'ee9b658e231ab423caee1b68536a58d93',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          
          { title: 'Hypanel Lux', location: 'Bedroom', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'd1b001e5ddcf24d65a9d1c6ad23df43ba',
            ability_id: 'cover.0c110500755b_91_5',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd1b001e5ddcf24d65a9d1c6ad23df43ba',
            ability_id: 'e6d42554a84ad481c8ae0836d33fafbbb',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          { title: 'Hypanel Keyplus', location: 'Bedroom', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'de3ba9ed68dd84e6ba245ee97e09ccf65',
            ability_id: 'switch.0c110500755c_81_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de3ba9ed68dd84e6ba245ee97e09ccf65',
            ability_id: 'e1d9936747c874f3592780b8886aad929',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Thermostat-Bedroom', location: 'Bedroom', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_110_11',
            ability_id: 'switch.0c110500755c_81_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: '0c110500755c_110_11',
            ability_id: 'e1d9936747c874f3592780b8886aad929',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'home-flood' ,library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'smoke' ,library: 'MaterialCommunityIcons',
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
          { title: 'CoveLight MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk' ,library: 'Ionicons',
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
          { title: 'MagneticTrack MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
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
        ],
      },
      {
        category: 'Bedroom Toilet',
        items: [
        { title: 'SpotLight MasterToilet', location: 'Bedroom Toilet', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
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
          { title: 'Exhaust MasterToilet', location: 'Bedroom Toilet', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
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
        category: 'Pouder Room',
        items: [
          { title: 'SpotLight LivingRoom', location: 'Pouder Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'human-greeting-variant' ,library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED LivingRoom', location: 'Pouder Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
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
        ],
      },
      {
        category: 'Kitchen',
        items: [
          { title: 'Hypanel Keyplus M1', location: 'Kitchen', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: 'daf64a922938248f1bdc723a12b94a6ea',
            ability_id: 'switch.0c110500755c_71_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'daf64a922938248f1bdc723a12b94a6ea',
            ability_id: 'e5190ec1a96574f699f0b8985bfba3ce0',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Kitchen', location: 'Kitchen', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
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
          { title: 'ProfileLED Kitchen', location: 'Kitchen', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
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
          { title: 'ExhaustFan Kitchen', location: 'Kitchen', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
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
        ],
      },
      {
        category: 'Shared Toilet',
        items: [
          { title: 'SpotLight Toilet', location: 'Shared Toilet', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED Toilet', location: 'Shared Toilet', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
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
          { title: 'ExhaustFan Toilet', location: 'Shared Toilet', status: 'On', color: '#eeff00ff', isOn: false, iconName: 'light-switch' ,library: 'MaterialCommunityIcons',
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
        ],
      },
              {
        category: 'Balcony',
        items: [
          { title: 'SpotLight Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'ProfileLED Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'SpotLight Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'Curtain-Bedroom', location: 'Balcony', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_111_4',
            ability_id: 'cover.0c110500755c_111_4',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'df230794fa8b74d72a763f580071a2241',
            ability_id: 'ee9b658e231ab423caee1b68536a58d93',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
          { title: 'Curtain-Reception', location: 'Balcony', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_112_4',
            ability_id: 'cover.0c110500755c_112_4',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd8b19bfae3b2a4591bec7686214208067',
            ability_id: 'e421c0277d65a4dc6a1fcedd4cb138148',
            commandPair: { on: 'open', off: 'close' , stop: 'stop' }
          }},
        ],
      },
      {
        category: 'Entrance',
        items: [
          { title: 'Thermostat-Entrance', location: 'Entrance', status: 'off', color: '#ff0000ff', isOn: false, iconName: 'pipe-valve' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_110_11',
            ability_id: 'switch.0c110500755c_61_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: '0c11052bf1cf_110_11',
            ability_id: 'e4108c3f6bfb649afa26646bacf4db2a0',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Entrance', location: 'Entrance', status: 'off', color: '#ff0000ff', isOn: false, iconName: 'pipe-valve' , library: 'MaterialCommunityIcons',
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
          { title: 'ProfileLED Entrance', location: 'Entrance', status: 'On', color: '#ff0000ff', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
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
        ],
      },  
];
