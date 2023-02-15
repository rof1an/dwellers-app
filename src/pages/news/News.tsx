import React, { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchNews } from '../../redux/slices/news-slice/newsSlice';
import { NewsItems } from './../../redux/slices/news-slice/types';
import cl from './News.module.scss';

export const News: FC = () => {
    const dispatch = useAppDispatch()
    const { news } = useAppSelector(state => state.news)

    const getNews = () => {
        const pageSize = 20
        dispatch(fetchNews({ pageSize }))
    }

    React.useEffect(() => {
        getNews()
    }, [])

    const utcTime = "2023-02-14T15:48:00Z";
    const date = new Date(utcTime);
    const estTime = date.toLocaleString("en-US", { timeZone: "America/New_York" });

    return (
        <div>
            {news.articles && news.articles.map((n: NewsItems) => {
                return (
                    <div key={uuid()}
                        className={cl.news}>
                        <div className={cl.newsContent}>
                            <h1 className={cl.title}>
                                {n.title}
                            </h1>
                            <span className={cl.descr}>
                                {n.description}
                            </span>
                            <div className={cl.infoBlock}>
                                <p>{n.content}</p>
                                {n.urlToImage !== null && <img className={cl.img} src={n.urlToImage} alt="" />}
                            </div>
                        </div>
                        <span className={cl.author}>{n.author}  {estTime}</span>
                    </div>
                )
            })}
        </div>
    );
};

