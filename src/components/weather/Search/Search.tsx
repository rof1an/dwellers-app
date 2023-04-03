import React, { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { ISearch, SearchData } from '../../../@types/weather-types'
import { CitiesService } from '../../../API/CitiesService'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { setWeatherCityLat, setWeatherCityLon, setCurrentCity } from '../../../redux/slices/weather-slice/weatherSlice'


export const Search = ({ onSearchChange }: ISearch) => {
	const dispatch = useAppDispatch()
	const [search, setSearch] = useState<SearchData>({ value: '', label: '' })

	const { currentCity } = useAppSelector(state => state.weather)
	const { accountCity } = useAppSelector(state => state.auth.accountData)

	React.useEffect(() => {
		currentCity && setSearch({ ...search, label: currentCity })
	}, [])

	const handleOnChange = (searchData: SearchData) => {
		const splittedCoord = searchData.value.split(' ')

		if (searchData.label) {
			dispatch(setCurrentCity(searchData.label))
		} else {
			dispatch(setCurrentCity(accountCity.label))
		}
		dispatch(setWeatherCityLat(splittedCoord[0]))
		dispatch(setWeatherCityLon(splittedCoord[1]))
		setSearch(searchData)
		onSearchChange(searchData)
	}

	const loadOptions = async (value: string) => {
		if (value) {
			return await CitiesService.loadOptions(value)
		} else {
			return await CitiesService.loadOptions(accountCity.label)
		}
	}

	return (
		<div style={{ color: '#000' }}>
			<AsyncPaginate
				placeholder='Search for city'
				debounceTimeout={600}
				value={search.label ? search : accountCity}
				onChange={(searchData) => searchData && handleOnChange(searchData as SearchData)}
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
