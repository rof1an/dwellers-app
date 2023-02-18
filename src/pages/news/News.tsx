import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchNews } from '../../redux/slices/news-slice/newsSlice';
import { Pagination } from './../../components/pagination/Pagination';
import { getConvertTime } from './../../utils/convertTime';
import cl from './News.module.scss';

export const News: FC = () => {
    const dispatch = useAppDispatch()
    const { news } = useAppSelector(state => state.news)
    const [page, setPage] = useState<number>(1)
    const [totalCount, setTotalCount] = useState<number>(25)

    React.useEffect(() => {
        dispatch(fetchNews({ page }))
        window.scrollTo(0, 0)
    }, [page])

    return (
        <div>
            {news.data && news.data.map((n: any) => {
                const estTime = getConvertTime(n.published_at)

                return (
                    <div key={n.uuid} className={cl.news}>
                        <div className={cl.newsContent}>
                            <h1 className={cl.title}>{n.title}</h1>
                            <div className={cl.infoBlock}>
                                <p>{n.description}</p>
                                {n.image !== null && <img className={cl.img} src={n.image_url} alt="" />}
                            </div>
                        </div>
                        <div className={cl.bottomInfo}>
                            <p className={cl.descr}>
                                <b>
                                    <Link to={`https://${n.source}`}>{n.source}</Link>
                                </b>
                            </p>
                            <span className={cl.author}>{estTime}</span>
                        </div>
                    </div>
                );
            })}
            <Pagination page={page} setPage={setPage} totalCount={totalCount} />
        </div>
    );
};

