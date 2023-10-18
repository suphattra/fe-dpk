import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useEffect } from "react";
import InputGroup from "../InputGroup";
import { _resObjConfig, renderOptions } from "../../helpers/utils";
import InputSelectGroup from "../InputSelectGroup";
import { MasterService } from "../../pages/api/master.service";
import InputGroupMask from "../InputGroupMask";
import { EmployeeService } from "../../pages/api/employee.service";
import { isEmpty } from "lodash";

export default function CardBranch({ index, branch, onChange, deleteAddOnService, mode, dateSelect, onErrors, fieldRegister = () => { } }) {
    const [querySucess, setQuerySucess] = useState(false)
    const [errors, setErrors] = useState({})
    const [branchType, setBranchType] = useState([])
    const [productType, setProductType] = useState([])
    const [supervisorList, setSupervisorList] = useState([])
    useEffect(() => {
        async function fetchData() {
            await getConfigList('TYPE');
            await getConfigList('PRODUCTIVITY');
            await getEmployeeList()
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
    const getEmployeeList = async () => {
        let search = {
            employeeFullName: '',
            limit: 10000,
            offset: 0,
            status: 'Active'
        }
        await EmployeeService.getEmployeeList(search).then(res => {
            if (res.data.resultCode === 200) {
                setSupervisorList(res.data.resultData)
            } else {
                setSupervisorList([])
            }
        }).catch(err => {
        })
    }
    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'branchType' || name === 'supervisor') {
            let _option = []
            switch (name) {
                case "branchType":
                    _option = branchType
                    break;
                // case "product":
                //     _option = productType
                //     break;
                case "supervisor":
                    _option = supervisorList
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)
        }
        if (name === 'supervisor') {
            obj = supervisorList.find((ele => { return ele.employeeCode === e.target.value }))
            if (!isEmpty(obj)) {
                let emp = {
                    _id: obj._id,
                    employeeCode: obj.employeeCode,
                    title: obj.title,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    nickName: obj.nickName,
                    gender: obj.gender,
                }
                onChange({ target: { name: name, value: emp } }, index, name)
            }

        }
        if (name === 'product') {
            let product = []
            product = e.target.value
            product.forEach((ele) => {
                ele.code = ele.value
                ele.value1 = ele.name
                // ele.value2 = ele.value2
            })
            onChange({ target: { name: name, value: product } }, index, name)
        }
    }
    const _convertValue = (value) => {
        if (!isEmpty(value)) {
            value.map((ele) => {
                ele.value = ele.code
                ele.name = ele.name
            })
            return value
        }
        return value
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
                        onChange={(e) => onChange(e, index, "branchName")}
                        value={branch.branchName}
                        required
                        invalid={errors?.branchName ? errors?.branchName[branch.index] : false}
                    />
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="branchType" label="ประเภท"
                        onChange={(e) => handleChange(e, index, "branchType")}
                        isSearchable
                        options={renderOptions(branchType, "value1", "code")}
                        value={branch.branchType.code}
                        invalid={errors?.branchType ? errors?.branchType[branch.index] : false}
                        required />
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="product" label="ผลผลิต"
                        onChange={(e) => handleChange(e, index, "product")}
                        isSearchable
                        isMulti
                        options={renderOptions(productType, "value1", "code")}
                        // value={branch.product.code}
                        value={_convertValue(branch.product)}
                        invalid={errors?.product ? errors?.product[branch.index] : false}
                        required />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 mr-6 mt-4">
                    <InputSelectGroup type="text" id={"branch" + branch.index} name="supervisor" label="ผู้ดูแล"
                        onChange={(e) => handleChange(e, index, "supervisor")}
                        isSearchable
                        options={renderOptions(supervisorList, "firstName", "employeeCode", "lastName")}
                        value={branch.supervisor.employeeCode}
                        required
                        invalid={errors?.supervisor ? errors?.supervisor[branch.index] : false}
                    />
                    <InputGroupMask type="text" id="areaSize" name="areaSize" label="ขนาดพื้นที่"
                        mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                        onChange={(e) => onChange(e, index, "areaSize")}
                        required
                        value={branch.areaSize}
                        unit={"ไร่"}
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