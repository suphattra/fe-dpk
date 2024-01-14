import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import moment from 'moment/moment';
import { OperationsService } from '../../pages/api/operations.service';
import { EmployeeService } from '../../pages/api/employee.service';
import InputSelectGroup from '../InputSelectGroup';
import { _resObjConfig, isEmpty, renderOptions } from '../../helpers/utils';
import InputGroupDate from '../InputGroupDate';
import { BranchService } from '../../pages/api/branch.service';
import { MasterService } from '../../pages/api/master.service';
import InputRadioGroup from '../InputRadioGroup';
import InputGroupMask from '../InputGroupMask';
import ItemInventory from './ItemInventory';
import { InventoryService } from '../../pages/api/inventory.service';
import { NotifyService } from '../../pages/api/notify.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingTemplate from "../LoadingTemplate";
export default function ModalUpdateTimesheet(props) {

    const { open, setOpen, mode, operationCode, jobEntry, timesheet, callbackLoad } = props;
    const [timesheetDetail, setTimesheetDetail] = useState({})
    const [querySuccess, setQuerySuccess] = useState(false)
    const [employeesOption, setEmployeesOption] = useState([])
    const [mainBranchOption, setMainBranchOption] = useState([])
    const [productOption, setProductOption] = useState([])
    const [subBranchOption, setSubBranchOption] = useState([])
    const [taskOption, setTaskption] = useState([])
    const [inventoryOption, setInventoryOption] = useState([])
    const [wageType, setWageType] = useState([])
    const [operationStatus, setOperationStatus] = useState([])
    const [openAddInventory, setAddInventory] = useState(false)
    const [otAmount, setOtAmount] = useState(null)
    const [otRate, setOtRate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [operationStatusCode, setOperationStatusCode] = useState("")
        const [inventoryBackUp, setInventoryBackUp] = useState([])
    const createValidationSchema = () => {
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, getValues, setError, clearErrors, formState: { errors } } = useForm(formOptions);
    useEffect(() => {
        async function fetchData() {
            await getEmployeeUnassignList();
            await getConfigList('WAGE_TYPE');
            await getConfigList('OPERATION_STATUS');
            await getConfigList('TASK');
            await getInventoryList(timesheetDetail.mainBranch?.branchCode);
            await getMainBranchList();
            await getSubBranchList();
            await getOperationDetail(operationCode)
            setQuerySuccess(true)
        }
        fetchData()

    }, []);
    useEffect(() => {
        setOperationStatusCode(timesheetDetail.operationStatus?.code)
        onChangeMainBranch({ target: { name: 'mainBranch', value: timesheetDetail.mainBranch?.branchCode } });
    }, [timesheetDetail.mainBranch])

    useEffect(() => {
        setInventoryBackUp(timesheetDetail.inventory)
    }, [timesheetDetail.inventory])

    const getOperationDetail = async (operationCode) => {
        await OperationsService.getOperationsDetail(operationCode).then(res => {
            if (res.data.resultCode === 200) {
                //default data
                console.log('gdueduie', res.data.resultData[0].mainBranch.branchCode)
                if (res.data.resultData[0].inventory.length > 0) {
                    res.data.resultData[0].inventory.forEach((inventory, index) => {
                        inventory.index = index + 1;
                    })

                    setAddInventory(true)
                }
                setTimesheetDetail(res.data.resultData[0])
                setQuerySuccess(true)
            } else {
                setTimesheetDetail({})
                setQuerySuccess(false)
            }
        }).catch(err => {
            console.log("==> list job3")
        })
    }

    const getEmployeeUnassignList = async (date) => {
        let _date = moment(new Date(date)).format('YYYY-MM-DD')
        let param = {
            status: 'Active',
            operationAssignDate: _date
        }
        // onChange({ target: { name: 'employee', value: '' } }, index, 'employee')
        setEmployeesOption([])
        await EmployeeService.getEmployeeUnassignList(param).then(res => {
            if (res.data.resultCode === 200) {
                setEmployeesOption(res.data.resultData)
            } else {
                setEmployeesOption([])
            }
        }).catch(err => {
        })
    }
    const getInventoryList = async (branchCode) => {
        setInventoryOption([])
        await InventoryService.getInventoryList({branchCode:branchCode}).then(res => {
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
            branchType: 'MD0014',
            status: 'Active',
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
            branchType: 'MD0015',
            status: 'Active',
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
            subType: code,
            status: 'Active',
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
    const onChange = (e, name,) => {
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
            setTimesheetDetail(data => ({ ...data, [name]: obj }));
        } else
            if (name === 'employee') {
                obj = employeesOption.find((ele => { return ele.employeeCode == e.target.value }))
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
                    setTimesheetDetail(data => ({ ...data, [name]: emp }));
                }
            } else
                if (name === 'mainBranch' || name === 'subBranch') {
                    if (name === 'mainBranch') {
                        obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
                    } else {
                        obj = subBranchOption.find((ele => { return ele.branchCode === e.target.value }))
                    }

                    if (!isEmpty(obj)) {
                        let branch = {
                            _id: obj._id,
                            branchCode: obj.branchCode,
                            branchName: obj.branchName,
                            branchType: obj.branchType
                        }
                        setTimesheetDetail(data => ({ ...data, [name]: branch }));
                    } else {
                        setTimesheetDetail(data => ({ ...data, [name]: {} }));
                    }
                } else
                    if (name === 'product') {
                        let product = []
                        product = e.target.value
                        product.forEach((ele) => {
                            ele.code = ele.value,
                                ele.value1 = ele.name,
                                ele.value2 = ele.value2
                        })
                        setTimesheetDetail(data => ({ ...data, [name]: product }));
                        // onChange({ target: { name: name, value: product } }, index, name)
                    } else {
                        setTimesheetDetail(data => ({ ...data, [name]: e.target.value }));
                    }

    }
    const onChangeMainBranch = async (e) => {
        let obj = []
        console.log(e)
        obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
        console.log('obj', obj)
        if (!isEmpty(obj)) {
            setProductOption(obj.product)
        }
        await getInventoryList(e.target.value)

    }
    const _convertValue = (value) => {
        if (!isEmpty(value)) {
            value.map((ele) => {
                ele.value = ele.code,
                    ele.name = ele.value1
            })
            return value
        }
        return value
    }
    const checkInventory = (e) => {
        setAddInventory(e.target.checked)
        if (!e.target.checked) {
            if(inventoryBackUp){
                for (let inventory of inventoryBackUp) {
                    if(!inventory.action){
                        inventory.action = "DELETE"
                    }
                  }
            }
            setTimesheetDetail(data => ({ ...data, ['inventory']: inventoryBackUp }));
        }
    }
    const callbackInventory = (e, name) => {
        console.log(e)
        setTimesheetDetail(data => ({ ...data, ['inventory']: e }));
        // onChange({ target: { name: 'inventory', value: e } }, index, 'inventory')
        if (errors) {
            if (e) {
                if ((name === "inventory" || name === "pickupAmount") && e.length > 0) {
                    for (let inventory of e) {
                        console.log(inventory)
                        if (inventory?.inventoryCode) {
                            clearErrors(`inventory[1].inventoryCode[${inventory.index}]`)
                        }
                        if (inventory?.pickupAmount) {
                            clearErrors(`inventory[1].pickupAmount[${inventory.index}]`)
                        }
                    }
                } else {
                    clearErrors(`${name}[1]`);
                }
            }
        }
    }

    const handleSave = async () => {
        const errorList = [];
        if (!timesheetDetail.startDate) {
            errorList.push({ field: `startDate[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.employee) {
            errorList.push({ field: `employee[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.mainBranch.branchCode) {
            errorList.push({ field: `mainBranch[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.task.code) {
            errorList.push({ field: `task[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.wageType) {
            errorList.push({ field: `wageType[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.operationStatus) {
            errorList.push({ field: `operationStatus[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.taskAmount) {
            errorList.push({ field: `taskAmount[1]`, type: "custom", message: "custom message" });
        }
        if (!timesheetDetail.taskPaymentRate) {
            errorList.push({ field: `taskPaymentRate[1]`, type: "custom", message: "custom message" });
        }
        if (timesheetDetail.inventory?.length > 0) {
            for (let inventory of timesheetDetail.inventory) {
                if (isEmpty(inventory.inventoryCode)) {
                    errorList.push({ field: `inventory[1].inventoryCode[${inventory.index}]`, type: "custom", message: "custom message" });
                }
                if (isEmpty(inventory.pickupAmount)) {
                    errorList.push({ field: `inventory[1].pickupAmount[${inventory.index}]`, type: "custom", message: "custom message" });
                }
            }
        }
        if (errorList.length === 0) {
            setLoading(true)
            let dataList = {
                dataList: timesheetDetail
            }
            await OperationsService.updateOperations(operationCode, timesheetDetail).then(res => {
                if (res.data.resultCode === 200) {
                    NotifyService.success('แก้ไขข้อมูลเรียบร้อยเเล้ว')
                    // window.location.reload()
                    setOpen(false)
                    callbackLoad()
                } else {
                    NotifyService.error(res.data.message)
                }
            })
            setLoading(false)
        } else {
            console.log(errorList)
            errorList.forEach(({ field, type, message }) => {
                setError(field, { type, message });
            });
        }
    }
    return (
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
                <div className="fixed inset-0 z-10 overflow-y-auto p-14">
                <div className="flex max-h-fit min-h-max h-full items-endjustify-center p-4 text-center sm:items-center sm:p-0 ">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                            <Dialog.Panel className="h-full relative transform  rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full">
                                {/* <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-5/6 h-3/6 md:h-auto p-6"> */}
                                <div className="h-5/6 overflow-y-auto shadow-inner border rounded-md p-4">
                                    {/* <div className="rounded-md p-4 shadow-md m-4"> */}
                                        {querySuccess &&
                                            <div className="flex flex-1 items-stretch">
                                                <div className='relative w-0 flex-1 mr-6 border-r'>
                                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mr-6">
                                                        <InputGroupDate
                                                            type="date" id={"startDate"} name="startDate" label="วัน/เดือน/ปี"
                                                            format="YYYY-MM-DD"
                                                            disabled={mode == 'view' ? true : false}
                                                            onChange={(e) => { getEmployeeUnassignList(e.target.value); onChange(e, 1, "startDate") }}
                                                            value={timesheetDetail.startDate ? moment(new Date(timesheetDetail.startDate)).format('YYYY-MM-DD') : ""}
                                                            invalid={errors?.startDate ? errors?.startDate[1] : false}
                                                            required />
                                                        <InputSelectGroup type="text" id={"employee"} name="employee" label="พนักงาน"
                                                            options={renderOptions(employeesOption, "firstName", "employeeCode", "lastName")}
                                                            onChange={(e) => {
                                                                onChange(e, "employee")
                                                            }}
                                                            disabled={mode == 'view' ? true : false}
                                                            isSearchable
                                                            value={timesheetDetail.employee?.employeeCode}
                                                            required />
                                                        <InputSelectGroup type="text" id={"mainBranch"} name="mainBranch" label="แปลงใหญ่"
                                                            options={renderOptions(mainBranchOption, "branchName", "branchCode")}
                                                            onChange={(e) => {
                                                                onChangeMainBranch(e);
                                                                onChange(e, "mainBranch")
                                                            }}
                                                            disabled={mode == 'view' ? true : false}
                                                            isSearchable
                                                            value={timesheetDetail.mainBranch?.branchCode}
                                                            required />
                                                        <InputSelectGroup type="text" id={"subBranch"} name="subBranch" label="แปลงย่อย"
                                                            options={renderOptions(subBranchOption, "branchName", "branchCode")}
                                                            onChange={(e) => onChange(e, "subBranch")}
                                                            value={timesheetDetail.subBranch?.branchCode}
                                                            isSearchable
                                                            disabled={mode == 'view' ? true : false}
                                                        />
                                                        <InputSelectGroup type="text" id={"task"} name="task" label="งาน"
                                                            options={renderOptions(taskOption, "value1", "code")}
                                                            onChange={(e) => {
                                                                onChange(e, "task")
                                                            }}
                                                            disabled={mode == 'view' ? true : false}
                                                            isSearchable
                                                            value={timesheetDetail.task?.code}
                                                            required />
                                                        <InputSelectGroup type="text" id={"product"} name="product" label="ผลผลิต"
                                                            options={renderOptions(productOption, "value1", "code")}
                                                            onChange={(e) => onChange(e, "product")}
                                                            value={_convertValue(timesheetDetail.product)}
                                                            disabled={mode == 'view' ? true : false}
                                                            isMulti
                                                            isSearchable />
                                                        <div className="block w-full">
                                                            <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                                                                {"หมายเหตุ:"}
                                                            </label>
                                                            <textarea
                                                                disabled={mode == 'view' ? true : false}
                                                                value={timesheetDetail.remark}
                                                                onChange={(e) => onChange(e, "remark")}
                                                                id="remark" name="หมายเหตุ"
                                                                rows={2}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                                            />

                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 ml-2 py-4 mr-6">
                                                        <InputRadioGroup
                                                            value={openAddInventory}
                                                            checked={openAddInventory}
                                                            type={"checkbox"}
                                                            name="status"
                                                            id={"addInventory"}
                                                            label={"เบิกสินค้าคงคลัง"}
                                                            onChange={checkInventory}
                                                            disabled={mode == 'view' ? true : false}
                                                        />
                                                    </div>
                                                    {openAddInventory &&
                                                        <>
                                                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mr-6">
                                                                <ItemInventory extraInventory={timesheetDetail.inventory}
                                                                    inventoryOption={inventoryOption}
                                                                    statusOperation={operationStatusCode}
                                                                    callbackInventory={(e, name) => callbackInventory(e, name)}
                                                                    errors={errors?.inventory ? errors?.inventory[1] : false}
                                                                    disabled={mode == 'view' ? true : false}
                                                                    mode={mode} />

                                                            </div>
                                                        </>}
                                                </div>
                                                <div className="relative w-0 flex-1">
                                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                                        <div class="col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                ประเภทค่าเเรง
                                                                <span style={{ color: "#991B1E" }}> *</span>
                                                            </label>
                                                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-2 mt-4">
                                                                {wageType && wageType.map(function (item, inx) {
                                                                    return (
                                                                        <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                                            id={"wageType_" + inx} name={"wageType"} label={item.value1}
                                                                            onChange={(e) => onChange(e, "wageType")}
                                                                            value={item.code}
                                                                            disabled={mode == 'view' ? true : false}
                                                                            checked={item.code === timesheetDetail.wageType.code ? true : false} />
                                                                    )
                                                                })}

                                                            </div>
                                                        </div>

                                                        <InputGroupMask type="text" id="taskAmount" name="taskAmount" label="จำนวนงาน"
                                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            required
                                                            invalid={errors?.taskAmount ? errors?.taskAmount[1] : false}
                                                            disabled={mode == 'view' ? true : false}
                                                            onChange={(e) => onChange(e, "taskAmount")}
                                                            value={timesheetDetail.taskAmount} />
                                                        <InputGroupMask type="text" id="taskPaymentRate" name="taskPaymentRate" label="ค่าแรง"
                                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            required
                                                            invalid={errors?.taskPaymentRate ? errors?.taskPaymentRate[1] : false}
                                                            disabled={mode == 'view' ? true : false}
                                                            onChange={(e) => onChange(e, "taskPaymentRate")}
                                                            value={timesheetDetail.taskPaymentRate} />
                                                        <InputGroupMask type="text" id="otAmount" name="otAmount" label="จำนวน OT"
                                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            onChange={(e) => { setOtAmount(e.target.value), onChange(e, "otAmount") }}
                                                            // value={otAmount}
                                                            disabled={mode == 'view' ? true : false}
                                                            value={timesheetDetail.otAmount}
                                                        />
                                                        <InputGroupMask type="text" id="otRate" name="otRate" label="อัตรา OT"
                                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            onChange={(e) => { setOtRate(e.target.value), onChange(e, "otRate") }}
                                                            // value={otRate}
                                                            disabled={mode == 'view' ? true : false}
                                                            value={timesheetDetail.otRate}
                                                        />
                                                        <InputGroupMask type="text" id="otTotal" name="otTotal" label="รวมเงิน OT"
                                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                                            onChange={(e) => onChange(e, "otTotal")}
                                                            value={timesheetDetail.otTotal}
                                                            disabled
                                                        />
                                                        <div class="col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                สถานะงาน
                                                                <span style={{ color: "#991B1E" }}> *</span>

                                                            </label>
                                                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                                                {operationStatus.map(function (item, inx) {
                                                                    return (
                                                                        <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                                            disabled={operationStatusCode === 'MD0028' ? true : mode == 'view' ? true : false}
                                                                            id={"operationStatus_" + inx} name={"operationStatus"} label={item.value1}
                                                                            onChange={(e) => onChange(e, "operationStatus")}
                                                                            value={item.code}
                                                                            checked={item.code === timesheetDetail.operationStatus.code ? true : false} />
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {!querySuccess &&
                                            <LoadingTemplate />
                                        }
                                    </div>
                                    {/* <CardTimesheet index={0} timeSheet={timesheetDetail} onChange={onChange} deleteAddOnService={deleteAddOnService} mode={mode} /> */}
                                    < footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">

                                        <div className="flex justify-center items-center overflow-y-auto p-4" >
                                            <div className="flex justify-center items-center">
                                                <button type="button"
                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                                    onClick={() => { setOpen(false) }}
                                                >
                                                    {mode === "edit" ? "ยกเลิก" : "ปิดหน้าต่าง"}
                                                </button>
                                                {mode === "edit" && <button
                                                    type="button"
                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    onClick={handleSave}
                                                >
                                                    บันทึก
                                                </button>}
                                            </div>
                                        </div>

                                    </footer>
                                {/* </div> */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}