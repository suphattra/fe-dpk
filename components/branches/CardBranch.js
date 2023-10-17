import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useEffect } from "react";
import InputGroup from "../InputGroup";
import { renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import { MasterService } from "../../pages/api/master.service";

export default function CardBranch({ index, branch, onChange, deleteAddOnService, mode, dateSelect, onErrors, fieldRegister = () => { } }) {
    const [querySucess, setQuerySucess] = useState(false)
    const [errors, setErrors] = useState({})
    const [branchType, setBranchType] = useState([])
    const [productType, setProductType] = useState([])
    useEffect(() => {
        async function fetchData() {
            await getConfigList('TYPE');
            await getConfigList('PRODUCTIVITY');
            setQuerySucess(true)
        }
        fetchData()
    }, [])
    useEffect(() => {
        setErrors(onErrors)
    }, [onErrors])
    const getConfigList = async (code) => {
        let param = {
            type: "BRANCH",
            subType: code
        }
        await MasterService.getConfig(param).then(res => {
            if (res.data.resultCode === 200) {
                if (code === 'TYPE') setBranchType(res.data.resultData)
                if (code === 'PRODUCTIVITY') setProductType(res.data.resultData)
            } else {
                if (code === 'TYPE') setBranchType([])
                if (code === 'PRODUCTIVITY') setProductType([])
            }
        }).catch(err => {
        })
    }
    return (
        <div className="mt-4 flex flex-col">
            {mode != 'edit' && <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(branch.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>}
            {querySucess && <div className="rounded-md p-4 shadow-md">
                <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6">
                    <InputGroup type="text" label="ชื่อสาขา/แปลง"
                        id="branchName"
                        name="branchName"
                        onChange={(e) => onChange(e, "firstName")}
                        value={branch.branchName}
                        required
                        invalid={errors?.branchName ? errors?.branchName[branch.index] : false}
                    />
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="branchType" label="ประเภท"
                        onChange={(e) => onChange(e, index, "branch")}
                        isSearchable
                        options={renderOptions(branchType, "value1", "code")}
                        value={branch.branchType.code}
                        invalid={errors?.branch ? errors?.branch[branch.index] : false}
                        required />
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="branch" label="ผลผลิต"
                        onChange={(e) => onChange(e, index, "branch")}
                        isSearchable
                        options={renderOptions(productType, "value1", "code")}
                        value={branch.product.code}
                        invalid={errors?.branch ? errors?.branch[branch.index] : false}
                        required />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6 mt-4">
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="branch" label="ผู้ดูแล"
                        onChange={(e) => onChange(e, index, "branch")}
                        isSearchable
                        options={renderOptions([], "firstName", "employeeCode", "lastName")}
                    // value={branch.branch.employeeCode}
                    />
                    <InputGroup type="text" label="ขนาดพื้นที่"
                        unit={"ไร่"}
                        id="lastName"
                        name="lastName"
                        onChange={(e) => onChange(e, "firstName")}
                        value={branch.lastName}
                        required
                        invalid={errors?.branch ? errors?.branch[branch.index] : false}
                    />

                    <div className="block w-full">
                        <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                            {"บริเวณที่ตั้ง"}
                        </label>
                        <textarea
                            value={branch.remark}
                            onChange={(e) => onChange(e, index, "remark")}
                            id="remark" name="บริเวณที่ตั้ง"
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                        />

                    </div>
                </div>
            </div>}
        </div >
    )
}