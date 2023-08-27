import InputGroupDate from "../InputGroupDate";
import InputSelectGroup from "../InputSelectGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import InputGroupMask from "../InputGroupMask";
import ListFile from "../ListFile";
import { MasterService } from "../../pages/api/master.service";
import InputGroup from "../InputGroup";
import { isEmpty } from "lodash";

export default function CardEmployee({ index, employee, onChange, deleteAddOnService, mode }) {
    const [listFile, setListFile] = useState([])
    const [titleOption, setTitleOption] = useState([])
    useEffect(() => {
        async function fetchData() {
            await getConfigList('TITLE');
        }
        fetchData()
    }, [])

    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'title') {
            let _option = []
            switch (name) {
                case "title":
                    _option = titleOption
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)

        }
    }
    const getConfigList = async (code) => {
        let param = {
            subType: code
        }
        await MasterService.getConfig(param).then(res => {
            if (res.data.resultCode === 200) {
                if (code === 'TITLE') setTitleOption(res.data.resultData)
            } else {
                if (code === 'TITLE') setTitleOption([])
            }
        }).catch(err => {
        })
    }
    return (
        <div className="mt-4 flex flex-col">
            {mode != 'edit' && <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(employee.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>}
            <div className="rounded-md p-4 shadow-md">
                {/* items-stretch overflow-hidden */}
                {/* {querySucess && */}
                <div className="flex flex-1 items-stretch">
                    <div className='relative w-0 flex-1 mr-6 border-r'>
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mr-6">
                            <InputSelectGroup type="text" label="คำนำหน้า"
                                id={"title" + employee.index}
                                name="title"
                                onChange={(e) => handleChange(e, index, "title")}
                                options={renderOptions(titleOption, "value1", "code")}
                                isSearchable
                                value={employee.title.code}
                                required />
                            <InputGroup type="text" label="ชื่อจริง"
                                id="firstName"
                                name="firstName"
                                onChange={(e) => onChange(e, index, "firstName")}
                                value={employee.firstName}
                                required
                            />
                            <InputGroupMask type="text" label="นามสกุล"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                required
                                onChange={(e) => onChange(e, index)}
                            />
                            <InputGroupMask type="text" label="ชื่อเล่น"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index)}
                            />
                            <InputSelectGroup type="text" n label="เพศ"
                                onChange={(e) => handleChange(e, index)}
                                isSearchable
                                required />
                            <InputGroupDate
                                type="date" label="วันเกิด"
                                format="YYYY-MM-DD"
                            />

                            <InputSelectGroup type="text" label="สัญชาติ"
                                onChange={(e) => handleChange(e, index)}
                                isSearchable

                                required />
                            <InputGroupMask type="text" label="เบอร์โทรติดต่อ 1"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index)}
                            />
                            <InputGroupMask type="text" label="เบอร์โทรติดต่อ 2"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index, "taskAmount")}
                            />
                        </div>
                        <hr className="mt-5 mb-2"></hr>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mr-6">
                            <InputSelectGroup type="text" label="ประเภทพนักงาน"
                                onChange={(e) => handleChange(e, index)}
                                isSearchable
                                required />
                            <div className="grid grid-cols-12 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4 mt-6">
                                <ListFile
                                    data={listFile}
                                />
                            </div>
                            <InputSelectGroup type="text" label="ตำแหน่งงาน"
                                onChange={(e) => handleChange(e, index)}
                                isSearchable
                                required />

                            <div className="block w-full">
                                <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                                    {"หมายเหตุ:"}
                                </label>
                                <textarea
                                    onChange={(e) => onChange(e, index, "remark")}
                                    id="remark" name="หมายเหตุ"
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4  mr-6">
                            <InputGroupDate
                                type="date" name="startDate" label="วันเริ่มงาน"
                                format="YYYY-MM-DD"
                                required />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4  mr-6 my-4">
                            <InputGroupDate
                                type="date" label="วันสิ้นสุด"
                                format="YYYY-MM-DD"

                                required />
                        </div>
                    </div>
                </div>
                {/* } */}
            </div>
        </div >

    )
}