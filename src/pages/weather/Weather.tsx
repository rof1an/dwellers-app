import React, { useState } from 'react'
import { IForecast, IWeather, SearchData } from '../../@types/weather-types'
import { WeatherService } from '../../API/WeatherService'
import { Search } from '../../components/weather/Search/Search'
import { CurrentWeather } from '../../components/weather/currWeather/CurrentWeather'
import { Forecast } from '../../components/weather/forecast/Forecast'
import { useAppSelector } from '../../hooks/hooks'
import cl from './Weather.module.scss'


export const Weather = () => {
	const [currWeather, setCurrWeather] = useState<IWeather | null>(null)
	const [forecast, setForecast] = useState<IForecast | null>(null)

	const { currentCity, lat, lon } = useAppSelector(state => state.weather)
	const { accountCity } = useAppSelector(state => state.auth.accountData)
	const [accountCityLongitude, accountCityLatitude] = accountCity ? accountCity?.value.split(' ') : ['', '']

	React.useEffect(() => {
		const unsub = async () => {
			if (currentCity || accountCity) {
				const currWthFetch = await WeatherService.getWeather(
					currentCity ? { lat, lon } : { lat: accountCityLatitude, lon: accountCityLongitude }
				)
				const forecastFetch = await WeatherService.getForecast(
					lat && lon ? { lat, lon } : { lat: accountCityLatitude, lon: accountCityLongitude }
				)

				try {
					setCurrWeather({ accountCity: currentCity ? currentCity : accountCity.label, ...currWthFetch })
					setForecast({ accountCity: currentCity ? currentCity : accountCity.label, ...forecastFetch })
				} catch (err) {
					console.log(err)
				}
			}
		}

		unsub()
	}, [])

	const handleOnSearchChange = async (searchData: SearchData) => {
		const location = lat && lon ? { lat, lon } : { lat: accountCityLatitude, lon: accountCityLongitude }

		const currWthFetch = await WeatherService.getWeather(location)
		const forecastFetch = await WeatherService.getForecast(location)

		try {
			setCurrWeather(searchData && { accountCity: searchData.label, ...currWthFetch })
			setForecast(searchData && { accountCity: searchData.label, ...forecastFetch })
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div
			className={cl.root}>
			<Search onSearchChange={handleOnSearchChange} />
			{currWeather && (
				<CurrentWeather data={currWeather} />
			)}
			{forecast && (
				<Forecast data={forecast} />
			)}
		</div>
	)
}

