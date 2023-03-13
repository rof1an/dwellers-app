export const getConvertTime = (utc: string) => {
	const utcTime = utc
	const date = new Date(utcTime)
	const estTime = date.toLocaleString("en-US", { timeZone: "America/New_York" })

	return estTime
}