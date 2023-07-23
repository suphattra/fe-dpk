import { CheckIcon, EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router";
import { SwitchGroup } from "../../components"
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Pagination from "../../components/Pagination";
import { DriverService } from "../../pages/api/driver.service";

export default function Result({ driverList, total, currentPage, paginate, callBack }) {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [driver, setDriver] = useState({})
    const arrayToCommaDelimeter = (data, key) => {
        let result = data.map(function (val) {
            return `${val[key] ? val[key] : ''}`;
        }).join(', ');
        return result;
    }
    async function onChangeStatus(event) {
        if (event === 'Ok') {
            driver.checked = driver.checked
            let body = {
                driverId: driver.driverId,
                status: driver.checked === true ? 'A' : 'S'
            }
            await DriverService.updateStatusDriver(body).then(res => {
                if (res.data.resultCode === "20000") {
                    setOpen(false)
                    callBack()
                } else {
                    // setCustomer({})
                }
            }).finally(() => {
            }).catch(err => {
                console.log(err)
                // setLoading(false)
            })
        } else {
            setOpen(false)
            driver.checked = !driver.checked
            callBack()
        }

    }
    return (
        <div className="md:container md:mx-auto">
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Driver Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Driver Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Job Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {driverList.map((driver) => (
                                        <tr key={driver.driverId}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {driver.fullName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.driverTypeTxt}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.phoneNo}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{arrayToCommaDelimeter(driver.jobType, 'jobTypeTxt')}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                                                <SwitchGroup
                                                    checkValue={driver.status === 'A' ? true : false}
                                                    onChange={(e) => { setOpen(true); setDriver({ driverId: driver.driverId, checked: e }) }}
                                                    value={driver.status === 'A' ? true : false}
                                                /></td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer"
                                                    onClick={() => { router.push('driver/detail/driver-detail?mode=view&id=' + driver.driverId); }}
                                                /><span className="sr-only">, {driver.name}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination totalPosts={total} currentPage={currentPage} postsPerPage={10} paginate={paginate} lengthList={driverList} />

                    </div>
                </div>
                <Transition.Root show={open} >
                    <Dialog as="div" className="relative z-10" onClose={setOpen}>
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                    Confirm
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Do you want to change status driver?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                                onClick={() => { onChangeStatus('Ok') }}
                                            >
                                                OK
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                onClick={() => { onChangeStatus('Cancel') }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

            </div>

        </div >
    )
}
