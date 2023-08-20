import moment from "moment";
import CardBasic from "../CardBasic";
import InputGroupDate from "../InputGroupDate";
import InputRadioGroup from "../InputRadioGroup";
import InputSelectGroup from "../InputSelectGroup";
import { _resObjConfig, convertFilter, isEmpty, renderOptions } from "../../helpers/utils";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ItemInventory from "./ItemInventory";
import InputGroupMask from "../InputGroupMask";
import { EmployeeService } from "../../pages/api/employee.service";
import { MasterService } from "../../pages/api/master.service";
import { InventoryService } from "../../pages/api/inventory.service";
import { BranchService } from "../../pages/api/branch.service";

export default function CardTimesheet({ index, timeSheet, onChange, deleteAddOnService }) {
    const [openAddInventory, setAddInventory] = useState(false)
    const [otAmount, setOtAmount] = useState(timeSheet.otAmount ? timeSheet.otAmount : null)
    const [otRate, setOtRate] = useState(timeSheet.otRate ? timeSheet.otRate : null)
    const [wageType, setWageType] = useState([])
    const [operationStatus, setOperationStatus] = useState([])
    const [employeesOption, setEmployeesOption] = useState([])
    const [taskOption, setTaskption] = useState([])
    const [inventoryOption, setInventoryOption] = useState([])
    const [mainBranchOption, setMainBranchOption] = useState([])
    const [subBranchOption, setSubBranchOption] = useState([])
    const [productOption, setProductOption] = useState([])
    useEffect(() => {
        async function fetchData() {
            await getEmployeeList();
            await getConfigList('WAGE_TYPE');
            await getConfigList('OPERATION_STATUS');
            await getConfigList('TASK');
            await getInventoryList();
            await getMainBranchList();
            await getSubBranchList();
        }
        fetchData()
    }, [])
    useEffect(() => {
        calculatorOT()
    }, [otAmount, otRate])

    const getEmployeeList = async () => {
        let param = {
            status: 'Active'
        }
        setEmployeesOption([])
        await EmployeeService.getEmployeeList(param).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesOption(res.data.resultData)
            } else {
                setEmployeesOption([])
            }
        }).catch(err => {
        })
    }
    const getInventoryList = async () => {
        setInventoryOption([])
        await InventoryService.getInventoryList().then(res => {
            if (res.data.resultCode === 200) {
                setInventoryOption(res.data.resultData)
            } else {
                setInventoryOption([])
            }
        }).catch(err => {
        })
    }
    const getMainBranchList = async () => {
        let param = {
            branchType: 'MD0014'
        }
        await BranchService.getBranchList(param).then(res => {
            if (res.data.resultCode === 200) {
                setMainBranchOption(res.data.resultData)
            } else {
                setMainBranchOption([])
            }
        }).catch(err => {
        })
    }
    const getSubBranchList = async () => {
        let param = {
            branchType: 'MD0015'
        }
        await BranchService.getBranchList(param).then(res => {
            if (res.data.resultCode === 200) {
                setSubBranchOption(res.data.resultData)
            } else {
                setSubBranchOption([])
            }
        }).catch(err => {
        })
    }
    const getConfigList = async (code) => {
        let param = {
            subType: code
        }
        await MasterService.getConfig(param).then(res => {
            if (res.data.resultCode === 200) {
                if (code === 'WAGE_TYPE') setWageType(res.data.resultData)
                if (code === 'OPERATION_STATUS') setOperationStatus(res.data.resultData)
                if (code === 'TASK') setTaskption(res.data.resultData)
            } else {
                if (code === 'WAGE_TYPE') setWageType([])
                if (code === 'OPERATION_STATUS') setOperationStatus([])
                if (code === 'TASK') setTaskption([])
            }
        }).catch(err => {
        })
    }
    const checkInventory = (e) => {
        setAddInventory(e.target.checked)
        if (!e.target.checked) {
            onChange({ target: { name: 'inventory', value: [] } }, index, 'inventory')
        }
    }
    const callbackInventory = (e) => {
        onChange({ target: { name: 'inventory', value: e } }, index, 'inventory')
    }

    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'wageType' || name === 'operationStatus' || name === 'task') {
            let _option = []
            switch (name) {
                case "wageType":
                    _option = wageType
                    break;
                case "operationStatus":
                    _option = operationStatus
                    break;
                case "task":
                    _option = taskOption
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)
        }
        if (name === 'employee') {
            obj = employeesOption.find((ele => { return ele.employeeCode === e.target.value }))
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
        if (name === 'mainBranch' || name === 'subBranch') {
            if (name === 'mainBranch') {
                obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
            } else {
                obj = subBranchOption.find((ele => { return ele.branchCode === e.target.value }))
            }

            if (!isEmpty(obj)) {
                let emp = {
                    _id: obj._id,
                    branchCode: obj.branchCode,
                    branchName: obj.branchName,
                    branchType: obj.branchType
                }
                onChange({ target: { name: name, value: emp } }, index, name)
            }
        }
        if (name === 'product') {
            onChange({ target: { name: name, value: e.target.value } }, index, name)
        }

    }
    const calculatorOT = () => {
        if (!isEmpty(otAmount) && !isEmpty(otRate)) {
            const otTotal = parseInt(otAmount) * parseInt(otRate)
            onChange({ target: { name: 'otTotal', value: otTotal } }, index, 'otTotal')
        } else {
            onChange({ target: { name: 'otTotal', value: null } }, index, 'otTotal')

        }
    }
    const onChangeMainBranch = (e) => {
        let obj = []
        obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
        console.log(obj)
        if (!isEmpty(obj)) {
            setProductOption(obj.product)
        }
    }

    return (
        <div className="mt-4 flex flex-col">
            <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(timeSheet.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>
            <div className="rounded-md p-4 shadow-md">
                {/* items-stretch overflow-hidden */}
                <div className="flex flex-1 items-stretch">
                    <div className='relative w-0 flex-1 mr-6 border-r'>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mr-6">
                            <InputGroupDate
                                type="date" id={"startDate" + timeSheet.index} name="startDate" label="วัน/เดือน/ปี"
                                format="YYYY-MM-DD"
                                onChange={(e) => onChange(e, index, "startDate")}
                                value={timeSheet.startDate ? moment(new Date(timeSheet.startDate)).format('YYYY-MM-DD') : ""}
                                required />

                            <InputSelectGroup type="text" id={"employee" + timeSheet.index} name="employee" label="พนักงาน"
                                onChange={(e) => handleChange(e, index, "employee")}
                                isSearchable
                                options={renderOptions(employeesOption, "firstName", "employeeCode", "lastName")}
                                value={timeSheet.employee}
                                required />
                            <InputSelectGroup type="text" id={"mainBranch" + timeSheet.index} name="mainBranch" label="แปลงใหญ่"
                                options={renderOptions(mainBranchOption, "branchName", "branchCode")}
                                onChange={(e) => { onChangeMainBranch(e); handleChange(e, index, "mainBranch") }}
                                isSearchable
                                value={timeSheet.mainBranch}
                                required />
                            <InputSelectGroup type="text" id={"subBranch" + timeSheet.index} name="subBranch" label="แปลงย่อย"
                                options={renderOptions(subBranchOption, "branchName", "branchCode")}
                                onChange={(e) => handleChange(e, index, "subBranch")}
                                value={timeSheet.subBranch}
                                isSearchable
                            />
                            <InputSelectGroup type="text" id={"task" + timeSheet.index} name="task" label="งาน"
                                options={renderOptions(taskOption, "value1", "code")}
                                onChange={(e) => handleChange(e, index, "task")}
                                isSearchable
                                value={timeSheet.task}
                                required />
                            <InputSelectGroup type="text" id={"product" + timeSheet.index} name="product" label="ผลผลิต"
                                options={renderOptions(productOption, "value1", "code")}
                                onChange={(e) => handleChange(e, index, "product")}
                                value={timeSheet.product}
                                isMulti
                                isSearchable />
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
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 ml-2 py-4 mr-6">
                            <InputRadioGroup
                                type={"checkbox"}
                                name="status"
                                id={"addInventory" + timeSheet.index}
                                label={"เบิกสินค้าคงคลัง"}
                                onChange={checkInventory}
                            />
                        </div>
                        {openAddInventory &&
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mr-6">
                                    <ItemInventory extraInventory={timeSheet.inventory}
                                        inventoryOption={inventoryOption}
                                        callbackInventory={(e) => callbackInventory(e)} />

                                </div>
                            </>}
                    </div>
                    <div className="relative w-0 flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <div class="col-span-2">

                                <label className="block text-sm font-medium text-gray-700">
                                    ประเภทค่าเเรง:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-2 mt-4">
                                    {wageType && wageType.map(function (item, inx) {
                                        return (
                                            <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                id={"wageType_" + inx + timeSheet.index} name={"wageType" + timeSheet.index} label={item.value1}
                                                onChange={(e) => handleChange(e, index, "wageType")}
                                                value={item.code}
                                                checked={item.code === timeSheet.wageType.code ? true : false} />
                                        )
                                    })}

                                </div>
                            </div>
                            <InputGroupMask type="text" id="taskAmount" name="taskAmount" label="จำนวนงาน"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index, "taskAmount")}
                                value={timeSheet.taskAmount} />
                            <InputGroupMask type="text" id="taskPaymentRate" name="taskPaymentRate" label="ค่าแรง"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => onChange(e, index, "taskPaymentRate")}
                                value={timeSheet.taskPaymentRate} />
                            <InputGroupMask type="text" id="otAmount" name="otAmount" label="จำนวน OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => { setOtAmount(e.target.value), onChange(e, index, "otAmount") }}
                                value={otAmount}
                            />
                            <InputGroupMask type="text" id="otRate" name="otRate" label="อัตรา OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => { setOtRate(e.target.value), onChange(e, index, "otRate") }}
                                value={otRate}
                            />
                            <InputGroupMask type="text" id="otTotal" name="otTotal" label="รวมเงิน OT"
                                mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                onChange={(e) => handleChange(e, index, "otTotal")}
                                value={timeSheet.otTotal}
                                disabled
                            />
                            <div class="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    สถานะงาน:
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                    {operationStatus.map(function (item, inx) {
                                        return (
                                            <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                id={"operationStatus_" + inx + timeSheet.index} name={"operationStatus" + timeSheet.index} label={item.value1}
                                                onChange={(e) => handleChange(e, index, "operationStatus")}
                                                value={item.code}
                                                checked={item.code === timeSheet.operationStatus.code ? true : false} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}