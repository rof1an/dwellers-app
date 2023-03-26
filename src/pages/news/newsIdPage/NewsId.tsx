import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchNewsById } from '../../../redux/slices/news-slice/newsSlice'

export const NewsId = () => {
	const params = useParams()
	const dispatch = useAppDispatch()
	const { oneNews } = useAppSelector((state) => state.news)

	React.useEffect(() => {
		params.id && dispatch(fetchNewsById({ id: params.id }))
	}, [params.id])

	return (
		<div>
			<h1>{oneNews?.title}</h1>
			<p>{oneNews?.description}</p>
		</div>
	)
}
