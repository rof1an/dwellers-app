interface PagesProps {
	totalCount: number,
	limit: number
}

export const getPagesCount = ({ totalCount, limit }: PagesProps) => {
	return Math.ceil(totalCount / limit)
}


export const getPagesArray = (totalCount: number) => {

	let result = []
	for (let i = 0; i < totalCount; i++) {
		result.push(i + 1)
	}
	return result
}

