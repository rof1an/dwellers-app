export const getBothUid = {
	getUid: (first: string, second: string) => {
		return first > second ? first + second : second + first
	}
}