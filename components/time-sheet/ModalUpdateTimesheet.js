import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import CardTimesheet from './CardTimesheet';
import moment from 'moment/moment';
import { OperationsService } from '../../pages/api/operations.service';
import { EmployeeService } from '../../pages/api/employee.service';
import CardTimesheetForm from './CardTimesheetForm';
import InputSelectGroup from '../InputSelectGroup';
import { renderOptions } from '../../helpers/utils';
import { isEmpty } from 'lodash';
import InputGroupDate from '../InputGroupDate';
import { BranchService } from '../../pages/api/branch.service';
import { MasterService } from '../../pages/api/master.service';
export default function ModalUpdateTimesheet(props) {

    const { open, setOpen, mode, operationCode, jobEntry, timesheet } = props;
    const [timesheetDetail, setTimesheetDetail] = useState({})
    const [querySuccess, setQuerySuccess] = useState(false)
    const [employeesOption, setEmployeesOption] = useState([])
    const [mainBranchOption, setMainBranchOption] = useState([])
    const [productOption, setProductOption] = useState([])
    const [subBranchOption, setSubBranchOption] = useState([])
    const [taskOption, setTaskption] = useState([])
    const [wageType, setWageType] = useState([])
    const [operationStatus, setOperationStatus] = useState([])

    useEffect(() => {
        async function fetchData() {
            await getEmployeeUnassignList();
            // await getConfigList('WAGE_TYPE');
            // await getConfigList('OPERATION_STATUS');
            await getConfigList('TASK');
            // await getInventoryList();
            await getMainBranchList();
            await getSubBranchList();
            getOperationDetail(operationCode)
            setQuerySuccess(true)
        }
        fetchData()

    }, []);
    const getOperationDetail = async (operationCode) => {
        await OperationsService.getOperationsDetail(operationCode).then(res => {
            if (res.data.resultCode === 200) {
                console.log(res.data.resultData)
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
    const onChange = (e, name,) => {
        // let _newValue = timesheetDetail
        // _newValue[name] = e.target.value
        // console.log('_newValue', _newValue)
        // setTimesheetDetail(_newValue)
        let obj = {}
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
        }
        if (name === 'mainBranch' || name === 'subBranch') {
            if (name === 'mainBranch') {
                obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
            } else {
                // obj = subBranchOption.find((ele => { return ele.branchCode === e.target.value }))
            }

            if (!isEmpty(obj)) {
                let branch = {
                    _id: obj._id,
                    branchCode: obj.branchCode,
                    branchName: obj.branchName,
                    branchType: obj.branchType
                }
                setTimesheetDetail(data => ({ ...data, [name]: branch }));

                // onChange({ target: { name: name, value: emp } }, index, name)
            }
        }

    }
    const onChangeMainBranch = (e) => {
        let obj = []
        obj = mainBranchOption.find((ele => { return ele.branchCode === e.target.value }))
        console.log("onChangeMainBranch", obj)
        if (!isEmpty(obj)) {
            setProductOption(obj.product)
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

                <div className="fixed inset-0 z-10 overflow-y-auto w-100">
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-5/6 h-3/6 md:h-auto p-6">
                                <div className="rounded-md p-4 shadow-md">
                                    {querySuccess &&
                                        <div className="flex flex-1 items-stretch">
                                            <div className='relative w-0 flex-1 mr-6 border-r'>
                                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mr-6">
                                                    <InputGroupDate
                                                        type="date" id={"startDate"} name="startDate" label="วัน/เดือน/ปี"
                                                        format="YYYY-MM-DD"
                                                        onChange={(e) => { getEmployeeUnassignList(e.target.value); onChange(e, index, "startDate") }}
                                                        value={timesheetDetail.startDate ? moment(new Date(timesheetDetail.startDate)).format('YYYY-MM-DD') : ""}
                                                        required />
                                                    <InputSelectGroup type="text" id={"employee"} name="employee" label="พนักงาน"
                                                        options={renderOptions(employeesOption, "firstName", "employeeCode", "lastName")}
                                                        onChange={(e) => {
                                                            onChange(e, "employee")
                                                        }}
                                                        isSearchable
                                                        value={timesheetDetail.employee?.employeeCode}
                                                        required />
                                                    <InputSelectGroup type="text" id={"mainBranch"} name="mainBranch" label="แปลงใหญ่"
                                                        options={renderOptions(mainBranchOption, "branchName", "branchCode")}
                                                        onChange={(e) => {
                                                            onChangeMainBranch(e);
                                                            onChange(e, "mainBranch")
                                                        }}
                                                        isSearchable
                                                        value={timesheetDetail.mainBranch?.branchCode}
                                                        required />
                                                    <InputSelectGroup type="text" id={"subBranch"} name="subBranch" label="แปลงย่อย"
                                                        options={renderOptions(subBranchOption, "branchName", "branchCode")}
                                                        onChange={(e) => onChange(e, "subBranch")}
                                                        value={timesheetDetail.subBranch?.branchCode}
                                                        isSearchable
                                                    />
                                                    <InputSelectGroup type="text" id={"task"} name="task" label="งาน"
                                                        options={renderOptions(taskOption, "value1", "code")}
                                                        onChange={(e) => {
                                                            onChange(e, "task")
                                                        }}
                                                        isSearchable
                                                        value={timesheetDetail.task?.code}
                                                        required />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 ml-2 py-4 mr-6">
                                                </div>
                                            </div>
                                            <div className="relative w-0 flex-1">
                                            </div>
                                        </div>
                                    }
                                </div>
                                {/* <CardTimesheet index={0} timeSheet={timesheetDetail} onChange={onChange} deleteAddOnService={deleteAddOnService} mode={mode} /> */}
                                <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                                    <div className="flex justify-center items-center overflow-y-auto p-4" >
                                        <div className="flex justify-center items-center">
                                            <button type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                            // onClick={() => { router.push('/operations'); }}
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            // onClick={handleSave}
                                            >
                                                บันทึก
                                            </button>
                                        </div>
                                    </div>
                                </footer>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}