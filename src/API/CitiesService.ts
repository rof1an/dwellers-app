import axios from 'axios'
import { OptionsCity } from '../components/weather/Search/Search'
import { GEO_API_URL } from './WeatherService'

export const CitiesService = {
	loadOptions: async (value: string) => {
		const { data } = await axios.get(`${GEO_API_URL}/cities?`, {
			params: {
				minPopulation: 100000,
				namePrefix: `${value}`,
			},
			headers: {
				'X-RapidAPI-Key': '3336e223a8mshc9173f5870301a9p144a1ajsn58af1431be0d',
				'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
			}
		})
		return {
			options: data.data.map((city: OptionsCity) => {
				return {
					value: `${city.latitude} ${city.longitude}`,
					label: `${city.name} ${city.countryCode}`
				}
			})
		}
	}
}