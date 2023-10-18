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
                        onClick={() => { router.push('branches/detail'); }}
                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                        สร้างสาขาและแปลงงาน
                    </button>
                </div>
                {/* <CardBasic title="">
                    <div className="flex justify-center grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center justify-end text-sm">
                            คำค้นหา
                        </div>
                        <div className="flex items-center">
                            <InputGroup type="text" id="employeeFullName" name="employeeFullName" onChange={handleChange} value={searchParam.employeeFullName} />
                        </div>
                        <div className="flex justify-flex-start items-center overflow-y-auto p-4" >

                            <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                                onClick={handleSearch}
                            >
                                ค้นหา
                            </button>
                            <button type="button"
                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                onClick={handleReset}
                            >
                                ล้าง
                            </button>

                        </div>
                    </div>
                </CardBasic> */}
            </div>
        </>
    )
}