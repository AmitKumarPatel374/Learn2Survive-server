const {
  getDisasterSlugFromEvent,
} = require("./src/utils/disasterClassifier")

console.log(
  getDisasterSlugFromEvent("Moderate Rain")
)

console.log(
  getDisasterSlugFromEvent("Heavy Rain")
)

console.log(
  getDisasterSlugFromEvent("Lightning")
)

console.log(
  getDisasterSlugFromEvent("Earthquake")
)

console.log(
  getDisasterSlugFromEvent("Cyclone")
)