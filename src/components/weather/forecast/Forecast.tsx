import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, } from "react-accessible-accordion"

import cl from "./Forecast.module.scss"
import { IForecast } from '../../../pages/weather/Weather'


const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const Forecast = ({ data }: { data: IForecast }) => {
	const dayInAWeek = new Date().getDay()
	const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek))

	return (
		<div className={cl.root}>
			<label className={cl.title}>Daily forecast</label>
			<Accordion allowZeroExpanded>
				{data.list.splice(0, 7).map((item, idx) => (
					<AccordionItem key={idx}>
						<AccordionItemHeading>
							<AccordionItemButton>
								<div className={cl.dailyItem}>
									<img src={`icons/${item.weather[0].icon}.png`} className={cl.iconSm} alt="weather" />
									<label className={cl.day}>{forecastDays[idx]}</label>
									<label className={cl.descr}>{item.weather[0].description}</label>
									<label className={cl.minMax}>{Math.round(item.main.temp_max)}°C /{Math.round(item.main.temp_min)}°C</label>
								</div>
							</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel>
							<div className={cl.dailyDetailsGrid}>
								<div className={cl.dailyDetailsGridItem}>
									<label>Pressure:</label>
									<label>{item.main.pressure}</label>
								</div>
								<div className={cl.dailyDetailsGridItem}>
									<label>Humidity:</label>
									<label>{item.main.humidity}</label>
								</div>
								<div className={cl.dailyDetailsGridItem}>
									<label>Clouds:</label>
									<label>{item.clouds.all}%</label>
								</div>
								<div className={cl.dailyDetailsGridItem}>
									<label>Wind speed:</label>
									<label>{item.wind.speed} m/s</label>
								</div>
								<div className={cl.dailyDetailsGridItem}>
									<label>Sea level:</label>
									<label>{item.main.sea_level}m</label>
								</div>
								<div className={cl.dailyDetailsGridItem}>
									<label>Feels like:</label>
									<label>{item.main.feels_like}°C</label>
								</div>
							</div>
						</AccordionItemPanel>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	)
}
