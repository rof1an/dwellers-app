import { useState } from 'react'

export const useInput = (initialValue: string | number) => {
	const [value, setValue] = useState(initialValue)

	const onChange = <T extends React.ChangeEvent<HTMLInputElement>>(e: T) => {
		setValue(e.target.value)
	}

	return {
		value, onChange
	}
}
