import cl from './Loader.module.scss'

export const Loader = () => {
	return (
		<div className={cl.loader}>
			<div className={`${cl.inner} + ${cl.one}`}></div>
			<div className={`${cl.inner} + ${cl.two}`}></div>
			<div className={`${cl.inner} + ${cl.three}`}></div>
		</div>
	)
}
