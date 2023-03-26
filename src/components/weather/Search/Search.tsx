import axios from 'axios'
import React, { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { GEO_API_URL } from '../../../API/WeatherService'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { SearchData } from '../../../pages/weather/Weather'
import { setCityLat, setCityLon, setCurrentCity } from '../../../redux/slices/weather-slice/weatherSlice'


type OptionsCity = {
	city: string
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

interface ISearch {
	onSearchChange: (arg: SearchData) => void,
}

export const Search = ({ onSearchChange }: ISearch) => {
	const dispatch = useAppDispatch()
	const [search, setSearch] = useState<SearchData>({ value: '', label: '' })
	const { currentCity } = useAppSelector(state => state.weather)

	React.useEffect(() => {
		currentCity && setSearch({ ...search, label: currentCity })
	}, [])

	const handleOnChange = (searchData: SearchData) => {
		const splittedCoord = searchData.value.split(' ')

		if (searchData.label) {
			dispatch(setCurrentCity(searchData.label))
		}
		dispatch(setCityLat(splittedCoord[0]))
		dispatch(setCityLon(splittedCoord[1]))
		setSearch(searchData)
		onSearchChange(searchData)
	}

	const loadOptions = async (value: string) => {
		const res = await axios.get(`${GEO_API_URL}/cities?`, {
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
			options: res.data.data.map((city: OptionsCity) => {
				return {
					value: `${city.latitude} ${city.longitude}`,
					label: `${city.name} ${city.countryCode}`
				}
			})
		}
	}

	return (
		<div style={{ color: '#000' }}>
			<AsyncPaginate
				placeholder='Search for city'
				debounceTimeout={600}
				value={search}
				onChange={(searchData) => searchData && handleOnChange(searchData)}
				loadOptions={(value) => loadOptions(value)}
			/>
		</div>
	)
}
