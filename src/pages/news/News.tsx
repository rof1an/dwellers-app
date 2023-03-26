import React, { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { fetchNews } from '../../redux/slices/news-slice/newsSlice'
import { Loader } from '../../components/UI/loader/Loader'
import { Pagination } from '../../components/UI/pagination/Pagination'
import { getConvertTime } from './../../utils/convertTime'
import cl from './News.module.scss'
import { Article } from '../../redux/slices/news-slice/types'

export const News: FC = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const { news, status } = useAppSelector((state) => state.news)
	const [page, setPage] = useState<number>(1)
	const [totalCount, setTotalCount] = useState<number>(15)

	React.useEffect(() => {
		dispatch(fetchNews({ page }))
		window.scrollTo(0, 0)
	}, [page])

	return (
		<>
			{status === 'loading' && <Loader />}
			<div className={cl.newsRoot}>
				{news?.data && status === 'fulfilled' &&
					news.data.map((n: Article) => {
						const estTime = getConvertTime(n.published_at)

						return (
							<div key={n.uuid} className={cl.news}>
								<div className={cl.newsContent}>
									<h1 className={cl.title} onClick={() => navigate(`/news/${n.uuid}`)}>
										{n.title}
									</h1>
									<div className={cl.infoBlock}>
										<p>{n.description}</p>
										{n.image_url !== null && <img className={cl.img} src={n.image_url} alt='' />}
									</div>
								</div>
								<div className={cl.bottomInfo}>
									<p className={cl.descr}>
										<b>
											<Link target='_blank' to={`https://${n.source}`}>
												{n.source}
											</Link>
										</b>
									</p>
									<span className={cl.author}>{estTime}</span>
								</div>
							</div>
						)
					})}
				{news?.data && status === 'fulfilled' && <Pagination page={page} setPage={setPage} totalCount={totalCount} />}
			</div>
		</>
	)
}
