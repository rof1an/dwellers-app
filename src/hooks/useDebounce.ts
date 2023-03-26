import { useCallback, useRef } from 'react'

interface DebounceProps {
	delay: number
	callback: (...args: string[]) => void
}

export const useDebounce = ({ callback, delay }: DebounceProps) => {
	const timer = useRef<NodeJS.Timeout | null>(null)

	const debouncedCallback = useCallback((...args: string[]) => {
		if (timer.current) {
			clearTimeout(timer.current)
		}

		timer.current = setTimeout(() => {
			callback(...args)
		}, delay)
	}, [callback, delay])

	return debouncedCallback
}