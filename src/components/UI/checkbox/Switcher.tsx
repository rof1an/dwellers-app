import cl from './Switcher.module.scss'

interface SwitcherProps {
	isChecked: boolean,
	setIsChecked: (arg: boolean) => void
}

export const Switcher = ({ isChecked, setIsChecked }: SwitcherProps) => {
	return (
		<div className={cl.onoffswitch}>
			<input onChange={() => setIsChecked(!isChecked)} type="checkbox" name="onoffswitch" className={cl.onoffswitchCheckbox} id="unit-switch" />
			<label className={cl.onoffswitchLabel} htmlFor="unit-switch">
				<span className={cl.onoffswitchInner}></span>
				<span className={cl.onoffswitchSwitch}></span>
			</label>
		</div>
	)
}
