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
            device_id: 'd4f54a92bea2a440c8a6a23d0b636dcf7',
            ability_id: 'e35705591294a47fa93b0a2886c825599',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight Reception', location: 'Reception', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
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
          { title: 'Door/Window Sensor Reception', location: 'Reception', status: 'Off', color: '#4ac0ff', isOn: false, iconName: 'curtains' , library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'a9d66620505f5b1bc027d929fd301662',
            ability_id: 'binary_sensor.8a1e85371236826c0614e3ad8a287dd7',
            commandPair: { on: 'turn_on', off: 'turn_off', stop: 'stop' }
          },
          wan: {
            device_id: 'd38ba7b76db344356ba9180bc735d8020',
            ability_id: 'ea70b8f716cca427aa18496b63f89217b',
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
            ability_id: 'e2da086b780454a42ba2cbba0b5fe47dc',
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
            ability_id: 'e1d07d9bd629642bcb4a1fab30c0f098a',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Thermostat-Bedroom', location: 'Bedroom', status: 'On', color: '#44ad57ff', isOn: false, iconName: 'air-conditioner' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_110_11',
            ability_id: 'climate.0c11052bf1cf_110_11',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd416715b413404da4a7e7e9574a20d9f9',
            ability_id: 'e818a297485a3483b8d9f8e88bd8cc74c',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'SpotLight MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'home-flood' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_61_1',
            ability_id: 'switch.0c11052bf1cf_61_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd48952ea7e63e4c869b072df6cb4a455e',
            ability_id: 'e76a555b39f8b4089b7dc2acf49f27ddc',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'smoke' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c11052bf1cf_62_1',
            ability_id: 'switch.0c11052bf1cf_62_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dc784871e979a44bd8d915fb77da9b492',
            ability_id: 'e888b4065a0d24f29b7300cc5a76491cc',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'CoveLight MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'walk' ,library: 'Ionicons',
          lan: {
            device_id: '0c11052bf1cf_63_1',
            ability_id: 'switch.0c11052bf1cf_63_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'de6a7f28750534aeb94dda098a5991857',
            ability_id: 'ea50b8ac58b3240f3bd2edf5f70b21c13',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'MagneticTrack MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
          lan: {
            device_id: '9ca500c71502a3b8939ce0e886dcf527',
            ability_id: 'switch.e24606d661839535225d672aebcae74b',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'da4896d0398fc4f33a9856b45285dd430',
            ability_id: 'e092f0415d239442891fdfae1eb401380',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Door/Window Sensor MasterBedroom', location: 'Bedroom', status: 'Off', color: '#ffbf42', isOn: false, iconName: 'temperature-low' ,library: 'FontAwesome6',
          lan: {
            device_id: 'f6458582925ab50d42ce075387eed019',
            ability_id: 'binary_sensor.86de5923d0953414a56d4ce6eea7a7be',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd7db00743bbb045ea9c23a3648b4a4d14',
            ability_id: 'e1dcf571d6136433da67f1112f7e93c82',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
        ],
      },
      {
        category: 'Bedroom Toilet',
        items: [
        { title: 'SpotLight MasterToilet', location: 'Bedroom Toilet', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'feec1e0f811aec3eb21e38fdd736643c',
            ability_id: 'switch.4d6c89ded335d3e2d47b86c987e64ef5',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'ddb3f5111bf274d44b4b2eb6f653d2d46',
            ability_id: 'e61724467cd2542a5a4f1d9a00338eca8',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Exhaust MasterToilet', location: 'Bedroom Toilet', status: 'off', color: '#5d8185ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'ffac083649758a3275de884e4969f1de',
            ability_id: 'switch.8267bce41a4be7d3fff077b95f54bdcf',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd5aa41a8ffb3c49aaa66749a8b996979f',
            ability_id: 'eac6624e4550748a2966a371d44400003',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
        ],
      },
      {
        category: 'Pouder Room',
        items: [
          { title: 'SpotLight Pouder Room', location: 'Pouder Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'human-greeting-variant' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: 'b3ee61e963fc08f3fce1a290ee4a503d',
            ability_id: 'switch.9a7d564af899531474785f0c04eb82f9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dfd1b3eb1c89944f6bc3c6b8c06ac765f',
            ability_id: 'e79384443dd3a43579bde62f291704b7e',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Pouder Room', location: 'Pouder Room', status: 'off', color: '#ff00e6ff', isOn: false, iconName: 'sensor-window' ,library: 'MaterialIcons',
          lan: {
            device_id: 'b9960f33e83342149f30d0bf8476fb90',
            ability_id: 'switch.c9951caa64284cb4a205d2d221848e02',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'dec5df209ae2e47b19bcb514e9f0dc922',
            ability_id: 'edd4398c68be9476d86cf886a59037e50',
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
            ability_id: 'e1195767cbe3046069545bbf4254e221d',
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
            device_id: 'd5aa41a8ffb3c49aaa66749a8b996979f',
            ability_id: 'eac6624e4550748a2966a371d44400003',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'Flood Sensor Kitchen', location: 'Kitchen', status: 'On', color: '#8e44ad', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: 'b2cde7130cd1c35cbc2156651d2757ae',
            ability_id: 'binary_sensor.b9a5b821238f095d4ee0dca7595f7857',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'da7ac9c74feaf4719a4e1efb073031768',
            ability_id: 'e8996edcfea8c46609714a6fd457699f8',
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
          { title: 'SpotLight Bedroom-Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'ProfileLED Bedroom-Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
          { title: 'SpotLight Reception-Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'door-sliding-lock' ,library: 'MaterialCommunityIcons',
          lan: {
            device_id: '0c110500755c_103_1',
            ability_id: 'switch.0c110500755c_103_1',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd8a7b66602b8c4043b6c8ba085ab03382',
            ability_id: 'e654b2d73661947db9e1a963a0d1ef398',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          }},
          { title: 'ProfileLED Reception-Balcony', location: 'Balcony', status: 'On', color: '#00eeffff', isOn: false, iconName: 'radio-button-on' ,library: 'Ionicons',
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
            device_id: '0c11052bf1cf_120_11',
            ability_id: 'climate.0c11052bf1cf_120_11',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd0bacccc6f97a44a9891770111e89d937',
            ability_id: 'ea1d6076ccc114990a615c04a04db8b53',
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
          { title: 'F2 SmartLock', location: 'Entrance', status: 'On', color: '#ff0000ff', isOn: false, iconName: 'bulb' ,library: 'Ionicons',
          lan: {
            device_id: '59f7a5f5329971d39a9e01301bf36456',
            ability_id: 'lock.86dba9bc8424738f9775182cd3c9bdb9',
            commandPair: { on: 'turn_on', off: 'turn_off' }
          },
          wan: {
            device_id: 'd84b7467ccfc24abdabe01ff7d0714e88',
            ability_id: 'e22a6f31e094a4f80b005aed248649471',
            commandPair: { on: 'unlock', off: 'lock' }
          }},
        ],
      },  
];
