import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { fetchNewsById } from '../../../../redux/slices/news-slice/newsSlice'

export const NewsId = () => {
	const params = useParams()
	const dispatch = useAppDispatch()
	const { news } = useAppSelector((state) => state.news)

	React.useEffect(() => {
		params.id && dispatch(fetchNewsById({ id: params.id }))
	}, [params.id])

	return (
		<div>
			<h1>{news.title}</h1>
			<p>{news.description}</p>
		</div>
	)
}
