import { Fragment, useState } from 'react'
import { _resObjConfig } from '../../helpers/utils';
import CardTimesheet from './CardTimesheet';
import { Dialog, Transition } from '@headlessui/react'
import moment from 'moment';
import { NotifyService } from '../../pages/api/notify.service';
import { OperationsService } from '../../pages/api/operations.service';
import { useRouter } from 'next/router';
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
    subBranch: {
        "_id": "64c1557f95d25869bb895389",
        "branchCode": "BC10001",
        "branchName": "ทรัพย์ประเมิน",
        "branchType": {
            "code": "MD0023",
            "value1": "แปลงย่อย"
        }
    },
    mainBranch: {
        "_id": "64c1557f95d25869bb89538a",
        "branchCode": "BC10002",
        "branchName": "บ้านแหลม",
        "branchType": {
            "code": "MD0022",
            "value1": "แปลงใหญ่"
        }
    },
    inventory: [
        //     {
        //     index: 1,
        //     inventoryCode: "",
        //     inventoryName: "",
        //     unit: "",
        //     pickupAmount: ""
        // }
    ]
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
    const onChange = (e, index,) => {
        const { name, value, checked, type } = e.target;
        setTimeSheetForm((data) => ({ ...data, [name]: value }));
    }
    const handleSave = async () => {
        let temp = [];
        temp.push(timeSheetForm)
        let dataList = {
            dataList: temp
        }
        await OperationsService.createOperations(dataList).then(res => {
            if (res.data.resultCode === 200) {
                NotifyService.success('บันทึกข้อมูลเรียบร้อยเเล้ว')
                setOpen(false)
                callbackLoad()
            } else {
                NotifyService.error(res.data.resultDescription)
            }
        })
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
                                <CardTimesheet mode={mode} index={0} timeSheet={timeSheetForm} onChange={onChange} dateSelect={dateSelect} />
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