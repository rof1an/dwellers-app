export interface currWeather {
	data: IWeather
}

export type OptionsCity = {
	accountCity: string
	country: string
	countryCode: string
	id: number
	latitude: number
	longitude: number
	name: string
	population: number
	region: string
	regionCode: string
	regionWdId: string
	type: string
	wikiDataId: string

}

export interface ISearch {
	onSearchChange: (arg: SearchData) => void,
}

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
	city: string,
	accountCity: string,
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