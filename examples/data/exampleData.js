// Type is used for the class of the histogram Bar
// Styles for the bars are defined in the vis.css file
export const histogramData = [
  {
    name: 'One',
    type: 'one',
    bins: [
      {key: 'A', count: 600},
      {key: 'B', count: 450},
      {key: 'C', count: 130},
      {key: 'D', count: 900},
      {key: 'E', count: 220},
      {key: 'F', count: 690},
      {key: 'G', count: 415},
      {key: 'H', count: 105},
      {key: 'I', count: 760},
      {key: 'J', count: 300}
    ]
  },
  {
    name: 'Two',
    type: 'two',
    bins: [
      {key: 'A', count: 200},
      {key: 'B', count: 150},
      {key: 'C', count: 10},
      {key: 'D', count: 300},
      {key: 'E', count: 200},
      {key: 'F', count: 0},
      {key: 'G', count: 285},
      {key: 'H', count: 88},
      {key: 'I', count: 580},
      {key: 'J', count: 20}
    ]
  }
]
// Type is used for the class of the histogram Bar
// Styles for the bars are defined in the vis.css file
export const stackedHistogramData = [
  {
    name: 'A',
    type: 'A',
    bins: [
      {x: 'Bin 1', y: 1600},
      {x: 'Bin 2', y: 2450},
      {x: 'Bin 3', y: 7900},
      {x: 'Bin 4', y: 3130},
      {x: 'Bin 5', y: 4220},
      {x: 'Bin 6', y: 8690},
      {x: 'Bin 7', y: 5415},
      {x: 'Bin 8', y: 805},
      {x: 'Bin 9', y: 1760},
      {x: 'Bin 10', y: 3300}
    ]
  },
  {
    name: 'B',
    type: 'B',
    bins: [
      {x: 'Bin 1', y: 3200},
      {x: 'Bin 2', y: 5150},
      {x: 'Bin 3', y: 3110},
      {x: 'Bin 4', y: 18300},
      {x: 'Bin 5', y: 2200},
      {x: 'Bin 6', y: 6200},
      {x: 'Bin 7', y: 8285},
      {x: 'Bin 8', y: 2588},
      {x: 'Bin 9', y: 9580},
      {x: 'Bin 10', y: 3320}
    ]
  },
  {
    name: 'C',
    type: 'C',
    bins: [
      {x: 'Bin 1', y: 6760},
      {x: 'Bin 2', y: 3150},
      {x: 'Bin 3', y: 9110},
      {x: 'Bin 4', y: 7300},
      {x: 'Bin 5', y: 1200},
      {x: 'Bin 6', y: 6200},
      {x: 'Bin 7', y: 1285},
      {x: 'Bin 8', y: 10588},
      {x: 'Bin 9', y: 4580},
      {x: 'Bin 10', y: 7320}
    ]
  },
  {
    name: 'D',
    type: 'D',
    bins: [
      {x: 'Bin 1', y: 15800},
      {x: 'Bin 2', y: 3950},
      {x: 'Bin 3', y: 2110},
      {x: 'Bin 4', y: 2390},
      {x: 'Bin 5', y: 2700},
      {x: 'Bin 6', y: 3200},
      {x: 'Bin 7', y: 6285},
      {x: 'Bin 8', y: 4588},
      {x: 'Bin 9', y: 9580},
      {x: 'Bin 10', y: 4320}
    ]
  }
]

export const choroplethData = [
  {
    'x': 'USA',
    'y': 225769,
    'className': 'selected'
  },
  {
    'x': 'RUS',
    'y': 2113,
    'className': 'selected'
  },
  {
    'x': 'UKR',
    'y': 920,
    'className': 'selected'
  },
  {
    'x': 'ZZZ',
    'y': 727,
    'className': 'selected'
  },
  {
    'x': 'KOR',
    'y': 272,
    'className': 'selected'
  },
  {
    'x': 'ITA',
    'y': 224,
    'className': 'selected'
  },
  {
    'x': 'MDA',
    'y': 195,
    'className': 'selected'
  },
  {
    'x': 'BRA',
    'y': 168,
    'className': 'selected'
  },
  {
    'x': 'IND',
    'y': 165,
    'className': 'selected'
  },
  {
    'x': 'POL',
    'y': 134,
    'className': 'selected'
  },
  {
    'x': 'ROU',
    'y': 133,
    'className': 'selected'
  },
  {
    'x': 'ESP',
    'y': 130,
    'className': 'selected'
  },
  {
    'x': 'KAZ',
    'y': 121,
    'className': 'selected'
  },
  {
    'x': 'BGR',
    'y': 118,
    'className': 'selected'
  },
  {
    'x': 'BLR',
    'y': 116,
    'className': 'selected'
  },
  {
    'x': 'HUN',
    'y': 99,
    'className': 'selected'
  },
  {
    'x': 'SAU',
    'y': 96,
    'className': 'selected'
  },
  {
    'x': 'PHL',
    'y': 93,
    'className': 'selected'
  },
  {
    'x': 'JPN',
    'y': 75,
    'className': 'selected'
  },
  {
    'x': 'SRB',
    'y': 75,
    'className': 'selected'
  },
  {
    'x': 'CAN',
    'y': 70,
    'className': 'selected'
  },
  {
    'x': 'GBR',
    'y': 57,
    'className': 'selected'
  },
  {
    'x': 'AUS',
    'y': 48,
    'className': 'selected'
  },
  {
    'x': 'KEN',
    'y': 46,
    'className': 'selected'
  },
  {
    'x': 'PRT',
    'y': 42,
    'className': 'selected'
  },
  {
    'x': 'ARG',
    'y': 41,
    'className': 'selected'
  },
  {
    'x': 'ISR',
    'y': 41,
    'className': 'selected'
  },
  {
    'x': 'IRN',
    'y': 40,
    'className': 'selected'
  },
  {
    'x': 'GRC',
    'y': 39,
    'className': 'selected'
  },
  {
    'x': 'LTU',
    'y': 37,
    'className': 'selected'
  },
  {
    'x': 'LVA',
    'y': 36,
    'className': 'selected'
  },
  {
    'x': 'BGD',
    'y': 34,
    'className': 'selected'
  },
  {
    'x': 'THA',
    'y': 32,
    'className': 'selected'
  },
  {
    'x': 'TWN',
    'y': 31,
    'className': 'selected'
  },
  {
    'x': 'SVN',
    'y': 30,
    'className': 'selected'
  },
  {
    'x': 'EGY',
    'y': 28,
    'className': 'selected'
  },
  {
    'x': 'FRA',
    'y': 26,
    'className': 'selected'
  },
  {
    'x': 'DEU',
    'y': 25,
    'className': 'selected'
  },
  {
    'x': 'MYS',
    'y': 24,
    'className': 'selected'
  },
  {
    'x': 'CZE',
    'y': 21,
    'className': 'selected'
  },
  {
    'x': 'TUR',
    'y': 21,
    'className': 'selected'
  },
  {
    'x': 'AUT',
    'y': 20,
    'className': 'selected'
  },
  {
    'x': 'PAK',
    'y': 20,
    'className': 'selected'
  },
  {
    'x': 'ARE',
    'y': 19,
    'className': 'selected'
  },
  {
    'x': 'BRN',
    'y': 18,
    'className': 'selected'
  },
  {
    'x': 'SWE',
    'y': 16,
    'className': 'selected'
  },
  {
    'x': 'TZA',
    'y': 14,
    'className': 'selected'
  },
  {
    'x': 'AZE',
    'y': 13,
    'className': 'selected'
  },
  {
    'x': 'GUM',
    'y': 12,
    'className': 'selected'
  },
  {
    'x': 'IRQ',
    'y': 11,
    'className': 'selected'
  },
  {
    'x': 'KGZ',
    'y': 11,
    'className': 'selected'
  },
  {
    'x': 'BIH',
    'y': 10,
    'className': 'selected'
  },
  {
    'x': 'EST',
    'y': 10,
    'className': 'selected'
  },
  {
    'x': 'BEL',
    'y': 9,
    'className': 'selected'
  },
  {
    'x': 'BHR',
    'y': 8,
    'className': 'selected'
  },
  {
    'x': 'COL',
    'y': 8,
    'className': 'selected'
  },
  {
    'x': 'DZA',
    'y': 8,
    'className': 'selected'
  },
  {
    'x': 'CHL',
    'y': 6,
    'className': 'selected'
  },
  {
    'x': 'COG',
    'y': 6,
    'className': 'selected'
  },
  {
    'x': 'MEX',
    'y': 6,
    'className': 'selected'
  },
  {
    'x': 'NLD',
    'y': 6,
    'className': 'selected'
  },
  {
    'x': 'SDN',
    'y': 6,
    'className': 'selected'
  },
  {
    'x': 'IDN',
    'y': 5,
    'className': 'selected'
  },
  {
    'x': 'IRL',
    'y': 5,
    'className': 'selected'
  },
  {
    'x': 'NAM',
    'y': 5,
    'className': 'selected'
  },
  {
    'x': 'CYP',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'GEO',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'HRV',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'QAT',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'TUN',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'VNM',
    'y': 4,
    'className': 'selected'
  },
  {
    'x': 'ARM',
    'y': 3,
    'className': 'selected'
  },
  {
    'x': 'CHN',
    'y': 3,
    'className': 'selected'
  },
  {
    'x': 'OMN',
    'y': 3,
    'className': 'selected'
  },
  {
    'x': 'SVK',
    'y': 3,
    'className': 'selected'
  },
  {
    'x': 'ZAF',
    'y': 3,
    'className': 'selected'
  },
  {
    'x': 'BWA',
    'y': 2,
    'className': 'selected'
  },
  {
    'x': 'CHE',
    'y': 2,
    'className': 'selected'
  },
  {
    'x': 'KWT',
    'y': 2,
    'className': 'selected'
  },
  {
    'x': 'LBR',
    'y': 2,
    'className': 'selected'
  },
  {
    'x': 'TTO',
    'y': 2,
    'className': 'selected'
  },
  {
    'x': 'ALB',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'CMR',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'DNK',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'GUY',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'HKG',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'NOR',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'SGP',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'URY',
    'y': 1,
    'className': 'selected'
  },
  {
    'x': 'ABW',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'AFG',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'AGO',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BEN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BFA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BHS',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BLZ',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BMU',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BOL',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'BRB',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'COD',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'CRI',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'CYM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'DMA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'DOM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'ECU',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'ETH',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'FIN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'GHA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'GLP',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'GTM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'ISL',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'JAM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'JOR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'KHM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LAO',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LBN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LBY',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LCA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LKA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'LUX',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MAC',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MAR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MDG',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MDV',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MKD',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MLT',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MMR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MNE',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MNG',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MNP',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MOZ',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'MUS',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'NER',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'NGA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'NIC',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'NPL',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'NZL',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'PAN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'PER',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'PRI',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'PRY',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'PYF',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SEN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SLE',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SLV',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SMR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'STP',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SUR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SYC',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'SYR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'TGO',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'TJK',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'TKM',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'UGA',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'UZB',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'VEN',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'VIR',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'ZMB',
    'y': 0,
    'className': 'selected'
  },
  {
    'x': 'ZWE',
    'y': 0,
    'className': 'selected'
  }
]
