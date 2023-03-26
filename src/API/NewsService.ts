import axios from 'axios'

const api_token = 'Waf2OVrntRDtjqLJOM04B8FxzT5bGqaDjteRT9qd'

export const NewsService = {
	getAll: async (page: number) => {
		const { data } = await axios.get('https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT&', {
			params: {
				api_token,
				page,
				filter_entities: true,
				language: 'en'
			}
		})
		return data
	},
	getById: async (id: string) => {
		const { data } = await axios.get(`https://api.marketaux.com/v1/news/uuid/${id}?`, {
			params: { api_token }
		})
		return data
	}
}