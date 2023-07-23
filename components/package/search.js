import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import { CardBasic, InputGroup, InputRadioGroup, InputGroupDate } from "../../components";
const status = [
    {
        value: "new", label: "New"
    },
    {
        value: "consumed", label: "Consumed"
    },
    {
        value: "Depleted", label: "Depleted"
    },
    {
        value: "cancel", label: "Cancel"
    }
]
export default function Search({ handleChange, searchParam, handleSearch, handleReset }) {
    const router = useRouter();
    const [selectStatus, setSelectStatus] = useState(["new", "consumed"])
    const data = {}
    const handleChangeStatus = async (checked, value, name, other) => {
        const found = selectStatus.find(e => e === value)
        if (!found) {
            let valueStr = [...selectStatus, value]
            setSelectStatus(data => [...data, value])
            handleChange({ target: { name: 'status', value: valueStr.toString() } })
        } else {
            let temp = selectStatus.filter((e, i) => e !== value)
            let arr = [...temp]
            setSelectStatus(arr);
            handleChange({ target: { name: 'status', value: arr.toString() } })
        }
    }
    const handleResetCriteria = async () => {
        setSelectStatus(["new", "consumed"])
        handleReset()
    }
    return (
        <>
            <div className="md:container md:mx-auto">

                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <button type="button"
                        onClick={() => { router.push('package/detail/detail-package?mode=create'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <PlusCircleIcon className="h-4 w-4 mr-2" />NEW
                    </button>
                </div>
                <CardBasic title="Search Criteria">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                        <InputGroupDate type="date" id="effectiveDate" name="effectiveDate" label="Effective Date:"
                            format="YYYY-MM-DD"
                            onChange={handleChange}
                            value={searchParam.effectiveDate} />
                        <InputGroup type="text" id="packageCode" name="packageCode"
                            label="Package Code:"
                            onChange={handleChange}
                            value={searchParam.packageCode} />
                        <InputGroup type="text" id="customerName" name="customerName" label="Customer Name:"
                            onChange={handleChange}
                            value={searchParam.customerName} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-10 gap-4 mb-4">
                        <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
                            Status:
                        </label>
                        {status.map((item) => (
                            <InputRadioGroup classes="h-4 w-4" key={item.value}
                                checked={selectStatus && ((selectStatus.find(e => (e === item.value)))) ? true : false}
                                type={"checkbox"} id={item.value}
                                name="status" value={item.value} label={item.label}
                                onChange={e => { handleChangeStatus(e.target.checked, e.target.value, item.label, undefined) }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center items-center overflow-y-auto py-2" >
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                            onClick={handleResetCriteria}>
                            Reset
                        </button>
                        <button type="button"
                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </CardBasic>
            </div>
        </>
    )
}