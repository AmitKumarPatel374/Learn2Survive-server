const getCoordinatesFromLocation = async ({ city, state, pincode, country = "India" }) => {
  try {
    const searchQuery = `${city}, ${state}, ${pincode}, ${country}`

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      searchQuery
    )}&count=1&language=en&format=json`

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Geocoding API request failed")
    }

    const data = await response.json()


    if (!data.results || data.results.length === 0) {
      throw new Error("Location coordinates not found")
    }

    const result = data.results[0]
    console.log(result);
    
 
    return {
      latitude: result.latitude,
      longitude: result.longitude,
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    throw error
  }
}


module.exports={
    getCoordinatesFromLocation
}