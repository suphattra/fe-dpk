import { Fragment, useState } from 'react'
import { _resObjConfig } from '../../helpers/utils';
import CardTimesheet from './CardTimesheet';
import { Dialog, Transition } from '@headlessui/react'
import moment from 'moment';
import { NotifyService } from '../../pages/api/notify.service';
import { OperationsService } from '../../pages/api/operations.service';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
const initial = {
    jobDetail: {},
    wageType: {
        code: 'MD0024',
        value1: "รายวัน",
        value2: "daily"
    },
    operationStatus: {
        "code": "MD0027",
        "value1": "รอการอนุมัติ",
        "value2": "รอการอนุมัติ"
    },
    task: {},
    employee: {},
    subBranch: {},
    mainBranch: {},
    inventory: []
}
export default function ModalCreateTimesheet(props) {
    const { open, setOpen, mode, dateSelect, jobEntry, timesheet, callbackLoad } = props;
    const router = useRouter();
    const [timeSheetForm, setTimeSheetForm] = useState({
        index: 1,
        startDate: moment(new Date(dateSelect)).format('YYYY-MM-DD'),
        employee: {},
        mainBranch: initial.mainBranch,
        subBranch: initial.subBranch,
        task: initial.task,
        inventory: initial.inventory,
        wageType: initial.wageType,
        operationStatus: initial.operationStatus
    })
    const createValidationSchema = () => {
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, getValues, setError, clearErrors, formState: { errors } } = useForm(formOptions);
    const onChange = (e, index,) => {
        const { name, value, checked, type } = e.target;
        setTimeSheetForm((data) => ({ ...data, [name]: value }));
        if (errors) {
            if (e.target.value) {
                if ((name === "inventory" || name === "pickupAmount") && e.target.value?.length > 0) {
                    for (let inventory of e.target.value) {
                        if (inventory?.inventoryCode) {
                            clearErrors(`${name}[1].inventoryCode[${inventory.index}]`)
                        }
                        if (inventory?.pickupAmount) {
                            clearErrors(`${name}[1].pickupAmount[${inventory.index}]`)
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
        if (!timeSheetForm.startDate) {
            errorList.push({ field: `startDate[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.employee) {
            errorList.push({ field: `employee[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.mainBranch.branchCode) {
            errorList.push({ field: `mainBranch[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.task.code) {
            errorList.push({ field: `task[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.wageType) {
            errorList.push({ field: `wageType[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.operationStatus) {
            errorList.push({ field: `operationStatus[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.taskAmount) {
            errorList.push({ field: `taskAmount[1]`, type: "custom", message: "custom message" });
        }
        if (!timeSheetForm.taskPaymentRate) {
            errorList.push({ field: `taskPaymentRate[1]`, type: "custom", message: "custom message" });
        }
        if (timeSheetForm.inventory?.length > 0) {
            for (let inventory of timeSheetForm.inventory) {
                if (!inventory.inventoryCode) {
                    errorList.push({ field: `inventory[1].inventoryCode[${inventory.index}]`, type: "custom", message: "custom message" });
                }
                if (!inventory.pickupAmount) {
                    errorList.push({ field: `inventory[1].pickupAmount[${inventory.index}]`, type: "custom", message: "custom message" });
                }
            }
        }
        if (errorList.length === 0) {
            let temp = [];
            temp.push(timeSheetForm)
            let dataList = {
                dataList: temp
            }
            await OperationsService.createOperations(dataList).then(res => {
                if (res.data.resultCode === 200) {
                    NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
                    // window.location.reload()
                    setOpen(false)
                    callbackLoad()
                } else {
                    NotifyService.error(res.data.message)
                }
            })
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
                                <CardTimesheet mode={mode} index={0} timeSheet={timeSheetForm} onChange={onChange} dateSelect={dateSelect} onErrors={errors} />
                                <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4">
                                    <div className="flex justify-center items-center overflow-y-auto p-4" >
                                        <div className="flex justify-center items-center">
                                            <button type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                                onClick={() => { setOpen(false) }}
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                type="button"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                onClick={handleSave}
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