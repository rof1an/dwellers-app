export enum NewsStatusEnums {
	LOADING = 'loading',
	FULFILLED = 'fulfilled',
	ERROR = 'error'
}

export interface NewsState {
	news: any,
	status: NewsStatusEnums
}


export interface Article {
	title: string;
	description: string;
	content: string;
	url: string;
	image: string;
	publishedAt: string;
	source: {
		name: string;
		url: string;
	};
}

export interface ArticlesResponse {
	totalArticles: number;
	articles: Article[];
}