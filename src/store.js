import { applyMiddleware, compose, createStore } from 'redux'
import { reduxReactRouter } from 'redux-router'
import rootReducer from './reducers'
// import { createHistory } from 'history'
import { createHistory, useQueries } from 'history'
import { routes } from './routes'

// Tip / Trick from fluent 2016
const debugLogger = (store) => (next) => (action) => {
  console.groupCollapsed('Action \'' + action.type + '\' detected')
  console.info('action:', action)

  const result = next(action)

  console.debug('state:', store.getState())
  console.groupEnd(action.type)

  return result
}
// Function over-rides the URLEncoding that everything seems to want to do
const simpleStringify = (queryObj) => {
  let qString = ''
  if (Object.keys(queryObj).length > 0) {
    Object.keys(queryObj).forEach((key) => {
      qString += key + '=' + queryObj[key]
    })
  }
  console.log(qString)
  return qString
}
const history = () => useQueries(createHistory)({stringifyQuery: simpleStringify})

export default (initialState) => {
  const createStoreWithMiddleWare = compose(
    applyMiddleware(debugLogger),
    reduxReactRouter({
      routes,
      createHistory: history}),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )(createStore)
  let retVal = createStoreWithMiddleWare(rootReducer, initialState)
  return retVal
}
