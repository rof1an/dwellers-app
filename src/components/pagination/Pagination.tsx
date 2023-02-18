import { getPagesArray } from "../../utils/pages"
import cl from './Pagination.module.scss'

type PaginationProps = {
	page: number,
	totalCount: number,
	setPage: (arg: number) => void,
}
export const Pagination = ({ page, setPage, totalCount }: PaginationProps) => {

	let pagesArray = getPagesArray(totalCount)

	return (
		<div className={cl.root}>
			{pagesArray.map(item => {
				return (
					<span
						className={item === page ? cl.btn + ' ' + cl.btnActive : cl.btn}
						onClick={() => setPage(item)}
						key={item}>{item}</span>
				)
			})}
		</div >
	)
}
