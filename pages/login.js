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
    const [view, setView] = useState(true)
    const [msgError, setMsgError] = useState('')

    const onSubmit = async (e) => {
        setLoading(true)
        try {
            await authService.authentication(e).then(res => {
                console.log(res)
                if (res.data.resultCode === '200') {
                    router.push('operations');
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
                <div className="flex min-h-full ">
                    <div className="h-[calc(100vh-64px)] flex flex-1 items-center justify-center py-12 px-4 sm:px-6 mg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96 p-12 border rounded-md">
                            <div className="flex justify-center">
                                <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">เข้าใช้งานระบบ DPK</h2>
                            </div>
                            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="col-span-3 sm:col-span-2">
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className={classNames(errors.username ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500")}>
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
                                                type={view ? "password" : "text"}
                                                // type="show ? 'password' : 'text'"
                                                name="password"
                                                id="password"
                                                className={classNames(errors.password ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "block w-full flex-1 rounded-none  border-gray-300 sm:text-sm")}
                                                placeholder="Password"
                                            />
                                            <span className={classNames(errors.password ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500")}>
                                                {view === true ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onClick={() => { setView(false) }} >
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onClick={() => { setView(true) }}>
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                }
                                            </span>
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

                    {/* <div className="relative hidden w-0 flex-1 lg:block">
                        <img
                            className="absolute h-[calc(100vh-64px)] object-cover"
                            src="/images/stock-photo-courier-stretching-out-cardboard-box.jpg"
                            alt=""
                        />
                    </div> */}
                </div>
            </LoadingOverlay>
        </>
    )
}