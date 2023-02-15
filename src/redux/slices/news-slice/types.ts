export enum NewsStatusEnums {
	LOADING = 'loading',
	FULFILLED = 'fulfilled',
	ERROR = 'error'
}

export interface NewsState {
	news: any,
	status: NewsStatusEnums
}



interface Source {
	id: string | null;
	name: string;
}

export interface NewsItems {
	source: Source;
	author: string;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: string | number;
	content: string;
}

export interface NewsData {
	status: string,
	totalResults: number,
	articles: NewsItems[]
}