import axios from 'axios'

export const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo'
const WTH_API_URL = 'https://api.openweathermap.org/data/2.5'
const WTH_API_KEY = '49f0d124abe7b4dfc375f263901e0e7f'

type Coord = {
	lat: string,
	lon: string
}

export const WeatherService = {
	getWeather: async ({ lat, lon }: Coord) => {
		const { data } = await axios.get(`${WTH_API_URL}/weather?lat=${lat}&lon=${lon}`, {
			params: {
				appid: `${WTH_API_KEY}`,
				units: 'metric'
			}
		})
		return data
	},
	getForecast: async ({ lat, lon }: Coord) => {
		const { data } = await axios.get(`${WTH_API_URL}/forecast?lat=${lat}&lon=${lon}`, {
			params: {
				appid: `${WTH_API_KEY}`,
				units: 'metric'
			}
		})
		return data
	}
}