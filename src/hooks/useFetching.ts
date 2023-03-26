import { useState } from 'react'

type Fetch = () => void

export const useFetching = (callback: Fetch) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')

	const fetching = () => {
		try {
			setLoading(true)
			callback()
		} catch (err) {
			setError(String(err))
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	return [fetching, loading, error] as const
}
