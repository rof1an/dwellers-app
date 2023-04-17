import { toast } from 'react-toastify'

export const ToastNofify = {
	successNotify: (title: string) => {
		toast.success(`${title}`, {
			position: "top-right",
			autoClose: 1500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		})
	},
	errorNotify: (title: string) => {
		toast.error(`${title}`, {
			position: "top-right",
			autoClose: 1500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		})
	}
}