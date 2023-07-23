import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import InputGroup from './InputGroup'
import { MasterService } from '../pages/api/master.service'
import InputRadioGroup from './InputRadioGroup'
import InputGroupDate from './InputGroupDate'
import moment from 'moment'
export default function Lookup({ label, type, classes, id, name, onChange, value, invalid, required, disabled, readOnly }) {
    const [open, setOpen] = useState(false)
    const [packages, setPackages] = useState([])
    const [selectPackCode, setSelectPackCode] = useState({})
    const [searchObj, setSearchObj] = useState({
        effectiveDate: moment(new Date).format('YYYY-MM-DD'),
        searchValue: "",
        packageCode: "",
        customerName: "",
        status: "new,consumed"
    });
    useEffect(() => {
        if (open) {
            getPackages()
        } else {
            setSearchObj({
                effectiveDate: moment(new Date).format('YYYY-MM-DD'),
                searchValue: "",
                packageCode: "",
                customerName: "",
                status: "new,consumed"
            })
        }
    }, [open])
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const getPackages = async () => {
        setPackages([])
        setSelectPackCode({})
        let param = {
            ...searchObj,
            limit: 10,
            offset: 1
        }
        await MasterService.getPackageList(param).then(res => {
            if (res.data.resultCode === "20000") {
                setPackages(res.data.resultData.packages)
            } else {
                setPackages([])
            }
        }).catch(err => {
            console.log(err)
        })

    }
    const handleChange = (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchObj(data => ({ ...data, [name]: value }))
    }
    const onSelectRow = () => {
        onChange(selectPackCode)
        setOpen(false)
    }
    return (
        <>
            <div className="block w-full">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required ? <span className="text-red-800">*</span> : <></>}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        id={id}
                        name={name}
                        autoComplete={name}
                        onChange={onChange}
                        // disabled={disabled}
                        readOnly={readOnly}
                        value={value}
                        defaultValue={value}
                        className={classNames(invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500 ' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ', "block w-full flex-1 rounded-none rounded-l-md  sm:text-sm disabled:text-gray-800 disabled:bg-gray-50")}
                        placeholder=""
                        disabled={true}
                    />

                    <button type="button" onClick={() => { setOpen(true) }} disabled={disabled} >
                        <span className={classNames(invalid ? 'border-red-800 focus:border-red-300 focus:ring-red-300' : 'focus:border-indigo-500 focus:ring-indigo-500', "inline-flex items-center cursor-pointer rounded-r-md border border-l-0 border-gray-300 bg-indigo-800 py-1.5 px-3 text-sm text-white")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                            </svg>
                        </span>
                    </button>

                </div>
                {invalid && <span className="text-sm font-medium tracking-tight text-red-800">This field is required</span>}
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto p-6">
                        <div className="flex max-h-fit min-h-max h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            // leaveFrom="translate-x-0"
                            // leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="h-full relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full md:w-9/12  sm:p-6">
                                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="w-full">
                                        <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 px-2 py-3 border-b">
                                                Select Package
                                            </Dialog.Title>
                                            <div className="mt-2 md:container md:mx-auto">
                                                {/* <CardBasic title="Search Criteria"> */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                                    <InputGroupDate type="" id="effectiveDate" name="effectiveDate" label="Effective Date:"
                                                        onChange={handleChange} value={searchObj.effectiveDate} format="YYYY-MM-DD" />
                                                    <InputGroup type="text" id="packageCode" name="packageCode" label="Package Code:"
                                                        onChange={handleChange}
                                                        value={searchObj.packageCode} />
                                                    <InputGroup type="text" id="customerName" name="customerName" label="Customer Name:"
                                                        onChange={handleChange}
                                                        value={searchObj.customerName} />
                                                    <div className="flex justify-center items-center overflow-y-auto pt-6 pb-2" >
                                                        <button type="button"
                                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                                                            onClick={() => getPackages()}
                                                        >
                                                            Search
                                                        </button>
                                                        <button type="button"
                                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 "
                                                        // onClick={handleReset}
                                                        >
                                                            Reset
                                                        </button>

                                                    </div>
                                                    {/* <InputSelectGroup type="select" id="status" name="status" label="Status" value={searchParam.status} onChange={handleChange}
                                                            options={[{ name: 'Active', value: 'A' }, { name: 'Inactive', value: 'I' }]} /> */}
                                                </div>

                                                <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-0 h-full" style={{ overflowY: 'auto' , height:'450px'}}>
                                                    <table className="min-w-full divide-y divide-gray-300 overflow-y-auto">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    Select
                                                                </th>
                                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                                    Package Code
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Day Left
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Type
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                                    Customer Name
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                                    Trip per Day
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                                    Trip used today
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                                    Point Left
                                                                </th>
                                                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                                                    Point used today
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
                                                            {packages.map((person) => (
                                                                <tr key={person.packageCode}>
                                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        <InputRadioGroup key={person} classes="h-4 w-4" type={"radio"}
                                                                            id={person.packageCode}
                                                                            name="jobPackageType"
                                                                            // label={item.configValue}
                                                                            onChange={() => setSelectPackCode(person)}
                                                                            value={person}
                                                                            checked={person.packageCode === selectPackCode.packageCode ? true : false} />
                                                                    </td>
                                                                    <td className="whitespace-nowrap py-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                        {person.packageCode}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                                        {person.dayleft}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{person.packageType}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.customerFullName}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.tripLimit}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.tripUseToday}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.pointLeft}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.pointUseToday}</td>
                                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{person.status}</td>
                                                                    <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                        {/* <EyeIcon className="text-indigo-600 hover:text-indigo-900 h-6 w-6 cursor-pointer" onClick={() => { }} /><span className="sr-only">, {person.name}</span> */}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* </CardBasic> */}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="mt-2 sm:mt-4 sm:ml-4 sm:flex sm:flex-row-reverse px-6 mx-2">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() => onSelectRow()}
                                        >
                                            Select
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                            onClick={() => setOpen(false)}
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
        </>
    )
}