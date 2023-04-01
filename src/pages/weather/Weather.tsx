import React, { useState } from 'react'
import { WeatherService } from '../../API/WeatherService'
import { Search } from '../../components/weather/Search/Search'
import { CurrentWeather } from '../../components/weather/currWeather/CurrentWeather'
import { Forecast } from '../../components/weather/forecast/Forecast'
import { useAppSelector } from '../../hooks/hooks'
import cl from './Weather.module.scss'
import { motion } from 'framer-motion'


type Main = {
	feels_like: number
	grnd_level: number
	humidity: number
	pressure: number
	sea_level: number
	temp: number
	temp_max: number
	temp_min: number
}

type Weather = {
	description: string
	icon: string
	id: number
	main: string
}

type Sys = {
	country: string
	id: number
	sunrise: number
	sunset: number
	type: number
}

export interface IWeather {
	clouds: {
		all: number
	}
	city: string
	cod: number
	coord: {
		lon: number
		lat: number
	}
	dt: number
	id: number
	main: Main
	name: string
	sys: Sys
	timezone: number
	visibility: number
	weather: Weather[]
	wind: {
		deg: number
		gust: number
		speed: number
	}
}

export type ForecastCity = {
	city: {
		coord: {
			lat: number,
			lon: number
		},
		country: string,
		id: number,
		name: string,
		population: number,
		sunrise: number,
		sunset: number,
		timezone: number
	},
}

export interface IForecast {
	cnt: number,
	cod: string,
	city: ForecastCity,
	list: {
		clouds: {
			all: number
		},
		dt: number,
		dt_txt: string,
		main: {
			feels_like: number,
			grnd_level: number,
			humidity: number,
			pressure: number,
			sea_level: number,
			temp: number,
			temp_kf: number,
			temp_max: number,
			temp_min: number
		},
		pop: number,
		sys: {
			pod: string
		},
		visibility: number,
		weather: [
			{
				description: string,
				icon: string,
				id: number,
				main: string
			}
		],
		wind: {
			deg: number,
			gust: number,
			speed: number
		},
	}[],
	message: number
}

export type SearchData = {
	value: string,
	label: string
}

export const Weather = () => {
	const [currWeather, setCurrWeather] = useState<IWeather | null>(null)
	const [forecast, setForecast] = useState<IForecast | null>(null)
	const { currentCity, lat, lon } = useAppSelector(state => state.weather)

	React.useEffect(() => {
		const unsub = async () => {
			const currWthFetch = await WeatherService.getWeather({ lat, lon })
			const forecastFetch = await WeatherService.getForecast({ lat, lon })

			try {
				setCurrWeather({ city: currentCity, ...currWthFetch })
				setForecast({ city: currentCity, ...forecastFetch })
			} catch (err) {
				console.log(err)
			}
		}

		unsub()
	}, [])

	const handleOnSearchChange = async (searchData: SearchData) => {
		const currWthFetch = await WeatherService.getWeather({ lat, lon })
		const forecastFetch = await WeatherService.getForecast({ lat, lon })

		try {
			setCurrWeather({ city: searchData.label, ...currWthFetch })
			setForecast({ city: searchData.label, ...forecastFetch })
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
