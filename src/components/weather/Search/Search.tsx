import React, { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { CitiesService } from '../../../API/CitiesService'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { SearchData } from '../../../pages/weather/Weather'
import { setCityLat, setCityLon, setCurrentCity } from '../../../redux/slices/weather-slice/weatherSlice'


export type OptionsCity = {
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
		return await CitiesService.loadOptions(value)
	}

	return (
		<div style={{ color: '#000' }}>
			<AsyncPaginate
				placeholder='Search for city'
				debounceTimeout={600}
				value={search}
				onChange={(searchData) => searchData && handleOnChange(searchData)}
				loadOptions={(value) => loadOptions(value)}
				styles={{
					singleValue: (base) => ({
						...base,
						color: '#000 !important'
					}),
				}}
			/>
		</div>
	)
}
