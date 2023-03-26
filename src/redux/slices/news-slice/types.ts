export enum NewsStatusEnums {
	LOADING = 'loading',
	FULFILLED = 'fulfilled',
	ERROR = 'error'
}

export interface NewsState {
	news: News | null,
	oneNews: OneNews | null,
	status: NewsStatusEnums
}


export interface News {
	meta: {
		found: number
		limit: number
		page: number
		returned: number
	}
	data: {
		uuid: string
		title: string
		description: string
		entities: {

		}[]
		image_url: string
		keywords: string
		language: string
		published_at: string
		relevance_score: number | null
		similar: {

		}[]
		snippet: string
		source: string
		url: string
	}[]
}


export interface OneNews {
	image: null
	uuid: string
	title: string
	description: string
	entities: {

	}[]
	image_url: string
	keywords: string
	language: string
	published_at: string
	relevance_score: number | null
	similar: {

	}[]
	snippet: string
	source: string
	url: string
}


export interface Article {
	uuid: string
	title: string
	snippet: string
	published_at: string
	source: string
	url: string
	language: string
	keywords: string
	image_url: string
	relevance_score: number | null
	similar: {}[]
	entities: {}[]
	description?: string
	match_score?: number
	sentiment_score?: number
	highlights?: { title: string, content: string }[]
}