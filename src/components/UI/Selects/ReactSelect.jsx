import Select from 'react-select'

export const customStyles = {
	container: (base) => ({
		...base,
		position: 'relative',
	}),
	menu: (base) => ({
		...base,
		zIndex: 999,
	}),
	control: (base) => ({
		...base,
		backgroundColor: 'transparent',
		borderColor: 'aqua',
		color: '#fff',
		boxShadow: 'none',
		'&:hover': {
			borderColor: '#fff',
		},
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
	valueContainer: (base, { hasValue }) => ({
		...base,
		color: hasValue ? '#fff' : '#ccc',
		display: '-webkit-box',
		display: '-webkit-flex',
		display: '-ms-flexbox',
		display: 'flex',
		WebkitAlignItems: 'center',
		WebkitBoxAlign: 'center',
		MsFlexAlign: 'center',
		alignItems: 'center',
		WebkitFlex: 1,
		MsFlex: 1,
		flex: 1,
		WebkitBoxFlexWrap: 'nowrap',
		WebkitFlexWrap: 'nowrap',
		MsFlexWrap: 'nowrap',
		flexWrap: 'nowrap',
		WebkitOverflowScrolling: 'touch',
		position: 'relative',
		overflow: 'hidden',
		overflowX: 'auto',
		flexWrap: 'nowrap',
		maxWidth: '275px',
		padding: '2px 8px 5px 8px',
		boxSizing: 'border-box',
		'&::-webkit-scrollbar': {
			height: '4px',
			backgroundColor: 'aqua',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#000',
			border: '1px solid aqua',
		},
		'&::-moz-scrollbar': {
			height: '4px',
			backgroundColor: '#fff',
		},
		'&::-moz-scrollbar-thumb': {
			backgroundColor: '#ccc',
		},
	}),
	multiValueRemove: (base) => ({
		...base,
		backgroundColor: '#FFBDAD',
		color: '#DE350B',
	}),
	multiValue: (base) => ({
		...base,
		minWidth: '75px',
	}),
	multiValueLabel: (base) => ({
		...base,
		color: '#000',
		paddingLeft: '5px',
		paddingRight: '5px',
	}),
	placeholder: (base) => ({
		...base,
		color: '#ссс',
	}),
}

export const ReactSelect = ({ selectedOption, handleChange, options, placeholder, isMulti }) => {
	return (
		<Select
			styles={customStyles}
			value={selectedOption}
			onChange={handleChange}
			options={options}
			placeholder={placeholder}
			isMulti={isMulti}
		/>
	)
}
