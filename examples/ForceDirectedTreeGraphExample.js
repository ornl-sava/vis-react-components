import React from 'react'

import Chart from '../src/Chart'
import ForceDirectedGraphTree from '../src/ForceDirectedGraphTree.js'

// //////// BEGIN SAMPLE HIERARCHY //////////
// import { format } from 'd3'
// import {aList} from '../examples/data/for-hci/hciData'
// const toolTipFunction = (data) => {
//   let name = 'Node '
//   if (data.parent == null) {
//     name = 'Root '
//   } else if (data.children != null) {
//     name = 'Parent '
//   }
//   name = name + data.key
//   var toolTip =
//     '<span class="title">' + name + '</span>' +
//     '</span>Number of Topics: ' + format(',')(data.data.events.length) +
//     '<br /><small>'
//   return toolTip
// }
// const nData = 5
//
// let makeTreeData = () => {
//   let ind = 0
//   let treeList = {hour: -1, children: [], index: ind++, events: 'root-', id: ind}
//   for (let i = 0; i < nData; i++) {
//     treeList.children.push(Object.assign({}, {hour: i, children: [], index: ind++, events: 'parent-', id: ind}))
//   }
//   aList.map((d, i) => {
//     if (d.hour < nData) {
//       treeList.children[d.hour].children.push(Object.assign({}, {
//         hour: d.hour, events: d.events, index: ind++, id: ind
//       }))
//     }
//   })
//   return treeList
// }
// console.log('FDTGE-makeTreeData', makeTreeData())
// const treeChartProps = {
//   tipFunction: toolTipFunction,
//   data: makeTreeData()
// }
// //////// END SAMPLE HIERARCHY //////////

// //////// BEGIN CIRCUMSHAKER DATA //////////
const toolTipFunctionIP = (data) => {
  let name = 'Source '
  if (data.parent == null) {
    name = 'Source '
  } else if (data.children != null) {
    name = 'Destination '
  }
  name = name + data.key
  let key = data.data.key_as_string
  if (key == null) { key = '' }
  var toolTip =
    '<span class="title">' + name + '</span>' +
    '</span>Key: ' + (key) +
    '<br /><small>'
  return toolTip
}
// 'source_ip'
// 'dest_ip'
const data1 = {
  'source_ip': '124.83.248.123',
  'dest_ip': [
    {
      'key': 2751196930,
      'key_as_string': '163.251.239.2',
      'doc_count': 5,
      'source_ip': [
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 2
        },
        {
          'key': 1758454856,
          'key_as_string': '104.207.228.72',
          'doc_count': 2
        },
        {
          'key': 1753404735,
          'key_as_string': '104.130.213.63',
          'doc_count': 1
        },
        {
          'key': 1753429508,
          'key_as_string': '104.131.54.4',
          'doc_count': 1
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 3494830881,
          'key_as_string': '208.78.227.33',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751196932,
      'key_as_string': '163.251.239.4',
      'doc_count': 3,
      'source_ip': [
        {
          'key': 1747283813,
          'key_as_string': '104.37.111.101',
          'doc_count': 3
        },
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 1
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 1757415067,
          'key_as_string': '104.192.6.155',
          'doc_count': 1
        },
        {
          'key': 3107708684,
          'key_as_string': '185.59.223.12',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751196931,
      'key_as_string': '163.251.239.3',
      'doc_count': 2,
      'source_ip': [
        {
          'key': 1753361025,
          'key_as_string': '104.130.42.129',
          'doc_count': 5
        },
        {
          'key': 1755075020,
          'key_as_string': '104.156.81.204',
          'doc_count': 2
        },
        {
          'key': 1755076044,
          'key_as_string': '104.156.85.204',
          'doc_count': 1
        },
        {
          'key': 3494830881,
          'key_as_string': '208.78.227.33',
          'doc_count': 1
        }
      ]
    },
    {
      'key': 2751135764,
      'key_as_string': '163.251.0.20',
      'doc_count': 1,
      'source_ip': []
    },
    {
      'key': 3444397697,
      'key_as_string': '205.77.86.129',
      'doc_count': 1,
      'source_ip': []
    }
  ]
}
const treeChartProps = {
  tipFunction: toolTipFunctionIP,
  data: data1,
  childAccessors: ['source_ip', 'dest_ip']
}
// //////// END CIRCUMSHAKER DATA //////////

class TopicsContainer extends React.Component {
  render () {
    return (
      <div>
        {<Chart className='col-md-12' tipFunction={treeChartProps.tipFunction} yAxis={false} xAxis={false} height={1000} >
          <ForceDirectedGraphTree {...treeChartProps} />
        </Chart>}
      </div>
    )
  }
}

export default TopicsContainer
