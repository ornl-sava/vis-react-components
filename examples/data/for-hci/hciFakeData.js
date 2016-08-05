// import eTopics from './enduring-topics-listed.json'
// import storyData from './stories.json'
import topicData from './topics.json'

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
const fakeEventNames = Object.keys(topicData).map(key => { return topicData[key][0] })
export const fakePrefixes = getPrefixes(fakeEventNames)

// generates random data based on source
const getRandData = (topicData, amt) => {
  let dataArr = []
  let dataObj = {}
  for (let i = 0; i < amt; i++) {
    // gets random index of source data
    let rand = parseInt(Math.random() * Object.keys(topicData).length)
    if (dataArr.indexOf(rand) <= 0) {
      dataArr.push(rand)
    }
  }
  for (let i = 0; i < dataArr.length; i++) {
    dataObj[i] = topicData[dataArr[i]]
  }
  return dataObj
}

// combining the data into one obj
export let fakeData = (n) => {
  let numData = n
  let comData = []
  for (let i = 0; i < numData; i++) {
    if (i === 0) {
      comData[i] = Object.keys(topicData).map(key => { return topicData[key] })
    } else {
      // generates random number of topics between 15 and 45
      let amt = parseInt(Math.random() * 30 + 15)
      comData[i] = getRandData(topicData, amt)
      comData[i] = Object.keys(comData[i]).map(key => { return comData[i][key] })
    }
  }
  return comData
}
// const fakeData = allDataComb(nData)
