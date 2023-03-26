import { useState } from 'react'
import { Switcher } from '../../../components/UI/checkbox/Switcher'
import { IWeather } from '../../../pages/weather/Weather'
import cl from './CurrentWeather.module.scss'

interface currWeather {
	data: IWeather
}

export const CurrentWeather = ({ data }: currWeather) => {
	const [isCelsius, setIsCelsius] = useState<boolean>(true)

	const tempF = (data.main.temp * 9 / 5) + 32
	const feelsLikeF = (data.main.feels_like * 9 / 5) + 32

	return (
		<div className={cl.weather}>
			<div className={cl.top}>
				<div>
					<p className={cl.city}>{data.city}</p>
					<p className={cl.weatherDescr}>{data.weather[0].description}</p>
				</div>
				<img src={`icons/${data.weather[0].icon}.png`} className={cl.weatherIcon} alt="weather" />
			</div>
			<Switcher isChecked={isCelsius} setIsChecked={setIsCelsius} />
			<div className={cl.bottom}>
				{isCelsius ? (
					<p className={cl.temp}>{Math.round(data.main.temp)}°C</p>
				) : (
					<p className={cl.temp}>{Math.round(tempF)}°F</p>
				)}
				<div className={cl.details}>
					<div className={cl.paramRow}>
						<span className={`${cl.paramLabel} ${cl.top}`}>Details</span>
					</div>
					<div className={cl.paramRow}>
						<span className={cl.paramLabel}>Feels like</span>
						{isCelsius ? (
							<span className={cl.paramValue}>{Math.round(data.main.feels_like)}°C</span>
						) : (
							<span className={cl.paramValue}>{Math.round(feelsLikeF)}°F</span>
						)}

					</div>
					<div className={cl.paramRow}>
						<span className={cl.paramLabel}>Wind</span>
						<span className={cl.paramValue}>{data.wind.speed} m/s</span>
					</div>
					<div className={cl.paramRow}>
						<span className={cl.paramLabel}>Humidity</span>
						<span className={cl.paramValue}>{data.main.humidity} %</span>
					</div>
					<div className={cl.paramRow}>
						<span className={cl.paramLabel}>Pressure</span>
						<span className={cl.paramValue}>15 hPa</span>
					</div>
				</div>
			</div>
		</div>
	)
}