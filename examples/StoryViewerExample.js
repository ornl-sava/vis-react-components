import React from 'react'
import { format } from 'd3'
import StoryViewer from '../src/StoryViewer'
import Chart from '../src/Chart'
import storyData from './data/for-hci/stories.json'
import eTopics from './data/for-hci/enduring-topics-listed.json'
import hrTopics from './data/for-hci/hourly-topics-listed.json'
import eventNames from '../examples/data/for-hci/enduring-22-model.json'

// gets unique prefixes
const getPrefixes = (data) => {
  // GET THE PREFIXES
  let fData = data.map((arr, i) => {
    if (arr == null) {
      arr = 'EMPTY'
    }
    let arrPref = arr.split(/:|-/, 1)
    return arrPref[0]
  })
  // FILTER OUT REPEATS
  let noRepeats = fData.filter((arr, i) => {
    return fData.indexOf(arr) === i
  })
  // IF NO EMPTY PREFIX, ADD
  if (noRepeats.indexOf('EMPTY') < 0) {
    noRepeats.push('EMPTY')
  }
  return noRepeats
}
const prefixes = getPrefixes(eventNames.column)

const sVProps = {
  storyData: storyData,
  eTopics: eTopics,
  hrTopics: hrTopics,
  colorDomain: prefixes
}

// DISPLAYS INFO OF SVG OBJECT THAT MOUSE IS ON
const toolTipFunction = (tooltipData) => {
  let d = tooltipData
  var toolTip =
    '<span class="title">' + d.label + '</span>' +
    '</span>Number of Topics: ' + format(',')(d.counts) +
    '<br /><small>'
  return toolTip
}

class StoryViewerExample extends React.Component {
  render () {
    return (
      <Chart className='col-md-12' tipFunction={toolTipFunction} yAxis={false} xAxis={false} height={1000} margin={{top: 40, right: 10, bottom: 10, left: 80}} width={5000}>
        <StoryViewer {...sVProps} />
      </Chart>
    )
  }
}

export default StoryViewerExample
