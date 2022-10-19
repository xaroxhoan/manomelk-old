import _ from "lodash"
function ParamsGenerator(srcObj, targetObj) {
  const params = {}

  const customizer = (srcVal, targetVal) => {
    if (_.isNumber(targetVal)) {
      return _.isEqual(targetVal, Number(srcVal))
    }
  }

  Object.entries(targetObj).forEach(([key, value]) => {
    if (!_.isEqualWith(srcObj[key], value, customizer)) {
      params[key] = value
    }
  })
  return params
}

export default ParamsGenerator
