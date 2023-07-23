import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingOverlay from "react-loading-overlay";
import Header from "../components/Header";
import { authService } from "./api/auth/auth-service";

LoadingOverlay.propTypes = undefined
export default function Login() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const [msgError, setMsgError] = useState('')

    const onSubmit = async (e) => {
        setLoading(true)
        try {
            await authService.authentication(e).then(res => {
                console.log(res)
                if (res.data.resultCode === '20000') {
                    router.push('calendar-schedule');
                    setLoading(false)
                } else if (res.resultCode === '40100') {
                    setMsgError("Invalid username or password.")
                    setLoading(false)
                } else {
                    setMsgError("Invalid username or password.")
                    setLoading(false)
                }

            });
        } catch (err) {
            setMsgError("Invalid username or password.")
            setLoading(false)
        }

    };
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <>
            <Header></Header>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <div className="flex min-h-full">
                    <div className="h-[calc(100vh-64px)] flex flex-1 items-center justify-center py-12 px-4 sm:px-6 mg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div>
                                <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Please log in to NX Same Day</h2>
                            </div>
                            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="col-span-3 sm:col-span-2">
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className={classNames(errors.password ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500")}>
                                                <svg className="w-6 h-6" fill="fill-gray-500" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            </span>
                                            <input
                                                {...register("username", { required: "Please enter your username." })}
                                                type="text"
                                                name="username"
                                                id="username"
                                                className={classNames(errors.username ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "block w-full flex-1 rounded-none rounded-r-md border-gray-300 sm:text-sm")}
                                                placeholder="Username"
                                            />
                                        </div>
                                        {errors.username && <span className="pl-12 text-sm font-medium tracking-tight text-red-800">This field is required</span>}
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className={classNames(errors.password ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500")}>
                                                <svg className="w-6 h-6" fill="fill-gray-500" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </span>
                                            <input
                                                {...register("password", { required: "Please enter your password." })}
                                                type="password"
                                                name="password"
                                                id="password"
                                                className={classNames(errors.password ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "block w-full flex-1 rounded-none rounded-r-md border-gray-300 sm:text-sm")}
                                                placeholder="Password"
                                            />
                                        </div>
                                        {errors.password && <span className="pl-12 text-sm font-medium tracking-tight text-red-800">This field is required</span>}
                                    </div>
                                    <div className="flex w-full justify-center text-center px-2 py-0">
                                        {msgError && <span className="text-sm font-medium tracking-tight text-red-800">{msgError}</span>}
                                    </div>
                                    <div className="col-span-3 sm:col-span-2">
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            LOGIN
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden w-0 flex-1 lg:block">
                        <img
                            className="absolute h-[calc(100vh-64px)] object-cover"
                            src="/images/stock-photo-courier-stretching-out-cardboard-box.jpg"
                            alt=""
                        />
                    </div>
                </div>
            </LoadingOverlay>
        </>
    )
}