import { AsyncPaginate } from 'react-select-async-paginate'
import cl from '../../home/profile/profileModal/ProfileModal.module.scss'

const customStyles = {
	control: (base) => ({
		...base,
		backgroundColor: 'transparent',
		borderColor: 'aqua',
		border: 'none',
		borderWidth: 0,
		color: '#fff',
		':hover': {
			borderColor: '#fff',
		},
	}),
	menuList: (base) => ({
		...base,
		color: '#000',
		backgroundColor: 'transparent',
	}),
	option: (base, { isSelected }) => ({
		...base,
		backgroundColor: isSelected ? 'rgb(120, 168, 204)' : 'transparent',
		color: isSelected ? '#fff' : '#000',
	}),
	singleValue: (base) => ({
		...base,
		color: '#fff',
	}),
	placeholder: (base) => ({
		...base,
		color: '#ccc',
	}),
	input: (base) => ({
		...base,
		color: '#fff',
	}),
}

export const PaginateSelect = ({ newValues, handleSelectChange, loadSelectOptions }) => {
	return (
		<AsyncPaginate
			styles={customStyles}
			className={`${cl.formInput} ${cl.paginate}`}
			value={newValues.city}
			onChange={(data) => data && handleSelectChange(data)}
			loadOptions={(value) => loadSelectOptions(value)}
			debounceTimeout={800}
		/>
	)
}
