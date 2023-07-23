import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardBasic, InputGroup, InputRadioGroup, InputSelectGroup } from "../../components";
import { renderConfigOptions } from "../../helpers/utils";
import { MasterService } from "../../pages/api/master.service";


export default function Search({ handleSearch, handleReset, handleChange, searchParam }) {
    const data = {}
    const router = useRouter();
    const [driverType, setDriverType] = useState([])
    const [jobType, setJobType] = useState([])
    const [selectjobType, setSelectJobType] = useState([])
    useEffect(() => {
        getConfig('DRIVER_TYPE')
        getConfig('JOB_TYPE')
    }, []);

    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'DRIVER_TYPE') setDriverType(res.data.resultData.configs)
                if (configCategory === 'JOB_TYPE') setJobType(res.data.resultData.configs)
            } else {
                if (configCategory === 'DRIVER_TYPE') setDriverType([])
                if (configCategory === 'JOB_TYPE') setJobType([])
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const handleChangeJobType = async (checked, value, name, other) => {
        const found = selectjobType.find(e => e === value)
        if (!found) {
            let valueStr = [...selectjobType, value]
            setSelectJobType(data => [...data, value])
            handleChange({ target: { name: 'jobType', value: valueStr.toString() } })
        } else {
            let temp = selectjobType.filter((e, i) => e !== value)
            let arr = [...temp]
            setSelectJobType(arr);
            handleChange({ target: { name: 'jobType', value: arr.toString() } })
        }


    }
    const handleResetCriteria = async () => {
        setSelectJobType([])
        handleReset()
    }
    return (
        <>
            <div className="md:container md:mx-auto">
                <div className="flex justify-end w-full max-w-screen pt-4" aria-label="Breadcrumb">
                    <button type="button"
                        onClick={() => { router.push('driver/detail/driver-detail?mode=create'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <PlusCircleIcon className="h-4 w-4 mr-2" />NEW
                    </button>
                </div>
                <CardBasic title="Search Criteria">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <InputGroup type="text" id="phone" name="phone" label="Phone:" onChange={handleChange} value={searchParam.phone} />
                        <InputSelectGroup type="select" id="driverType" name="driverType" label="Driver Type:"
                            value={searchParam.driverType}
                            onChange={handleChange}
                            options={renderConfigOptions(driverType)} />
                        <InputGroup type="text" id="name" name="name" label="Driver Name:" onChange={handleChange} value={searchParam.name} />
                        <InputSelectGroup type="select" id="status" name="status" label="Status" value={searchParam.status} onChange={handleChange}
                            options={[{ name: 'All', value: '' }, { name: 'Active', value: 'A' }, { name: 'Inactive', value: 'S' }]} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-10 gap-4 mb-4">
                        <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
                            Job Type:
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 mb-4">
                        {jobType.map((item) => (
                            <InputRadioGroup classes="h-4 w-4" key={item.configCode}
                                checked={selectjobType && ((selectjobType.find(e => (e === item.configCode)))) ? true : false}
                                type={"checkbox"} id={item.configCode}
                                name="jobType" value={item.configCode} label={item.configValue}
                                onChange={e => { handleChangeJobType(e.target.checked, e.target.value, item.configValue, undefined) }}
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