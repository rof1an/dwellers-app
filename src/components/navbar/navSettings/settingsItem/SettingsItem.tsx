import cl from '../NavSettings.module.scss'

interface SettingProps {
	title: string,
	subtitle: string,
	switcherTitle?: {
		enabled: string,
		disabled: string
	},
	interactiveBtnTitle?: string
	imgSrc: string,
	setSetting: () => void,
	isDone?: boolean,
}

export const SettingsItem = ({ title, subtitle, interactiveBtnTitle, switcherTitle, imgSrc, setSetting, isDone }: SettingProps) => {
	return (
		<>
			<li className={cl.item}>
				<div className={cl.itemSeperator}>
					<img className={cl.itemImg} src={imgSrc} alt="" />
					<div>
						<span>{title}</span>
						<p>{subtitle}</p>
					</div>
				</div>
				<span
					onClick={setSetting}
					className={cl.itemSwitcher}>
					{isDone ? switcherTitle?.enabled : switcherTitle?.disabled}
					{!isDone && interactiveBtnTitle && <>{interactiveBtnTitle}</>}
				</span>
			</li>
			<hr />
		</>
	)
}
