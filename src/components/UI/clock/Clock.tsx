import { useEffect, useState } from 'react'
import cl from './Clock.module.scss'

export const Clock = () => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const formatTime = (time: number) => (time < 10 ? `0${time}` : time)

	return (
		<div className={cl.clock}>
			<ul>
				<li>{formatTime(time.getHours())}</li>
				<li className={cl.separator}>:</li>
				<li>{formatTime(time.getMinutes())}</li>
				<li className={cl.separator}>:</li>
				<li>{formatTime(time.getSeconds())}</li>
			</ul>
		</div>
	)
}