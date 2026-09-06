const DisasterModel = require("../model/disaster/disaster.model")

const getDisasterBySlug = async (slug) => {
  const disaster = await DisasterModel.findOne({
    slug,
    isPublished: true,
  }).lean()

  return disaster
}

module.exports = {
  getDisasterBySlug,
}