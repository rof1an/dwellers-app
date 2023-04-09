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

	const { currentCity, lat, lon } = useAppSelector((state) => state.weather)
	const { accountCity } = useAppSelector((state) => state.auth.accountData)

	const fetchWeatherData = async (lat: string, lon: string) => {
		const currWthFetch = await WeatherService.getWeather({ lat, lon })
		const forecastFetch = await WeatherService.getForecast({ lat, lon })
		return { currWeather: currWthFetch, forecast: forecastFetch }
	}

	const updateWeatherData = async (searchData: SearchData) => {
		const latitide = searchData ? searchData.value.split(' ')[0] : lat
		const longitude = searchData ? searchData.value.split(' ')[1] : lon

		try {
			const { currWeather, forecast } = await fetchWeatherData(latitide, longitude)
			const accountCityLabel = searchData ? searchData.label : accountCity.label
			setCurrWeather({ accountCity: accountCityLabel, ...currWeather })
			setForecast({ accountCity: accountCityLabel, ...forecast })
		} catch (err) {
			console.log(err)
		}
	}

	React.useEffect(() => {
		if (lat && lon) {
			const data = {
				value: lat + ' ' + lon,
				label: currentCity!
			}
			updateWeatherData(data)
		} else {
			updateWeatherData(accountCity)
		}
	}, [])


	return (
		<div className={cl.root}>
			<Search onSearchChange={updateWeatherData} />
			{currWeather && <CurrentWeather data={currWeather} />}
			{forecast && <Forecast data={forecast} />}
		</div>
	)
}
