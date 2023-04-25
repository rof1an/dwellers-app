import { toast } from 'react-toastify'

export const ToastNofify = {
	successNotify: (title: string) => {
		toast.success(`${title}`, {
			position: "top-center",
			autoClose: 1000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		})
	},
	errorNotify: (title: string) => {
		toast.error(`${title}`, {
			position: "top-center",
			autoClose: 1000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		})
	}
}