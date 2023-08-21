import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import CardTimesheet from './CardTimesheet';
import moment from 'moment/moment';
export default function ModalUpdateTimesheet(props) {
    const initial = {
        inventory: [{
            index: 1,
            // inventoryCode: "",
            // inventoryName: "",
            // unit: "",
            // pickupAmount: ""
        }]
    }
    const { open, setOpen, mode, id, jobEntry, timesheet } = props;
    const onChange = (e, index, name,) => {
        // console.log('dddddddddddddd', JSON.parse(JSON.stringify(e.target.value)), index, name)
        // let _newValue = [...timeSheetForm]
        // _newValue[index][name] = e.target.value
        // setTimeSheetForm(_newValue)
    }

    const deleteAddOnService = (rowIndex) => {
        // console.log("rowIndex", rowIndex)
        // // let newData = newData.filter((_, i) => i != rowIndex - 1)
        // const newData = timeSheetForm.filter(item => item.index !== rowIndex);
        // console.log("newData", newData)
        // setTimeSheetForm(newData)
    }


    const [timeSheetForm, setTimeSheetForm] = useState([{
        // index: 1,
        // startDate: moment(new Date).format('YYYY-MM-DD'),
        // employee: {},
        // mainBranch: initial.mainBranch,
        // subBranch: initial.subBranch,
        // task: initial.task,
        // inventory: initial.inventory,
        // wageType: initial.wageType,
        // operationStatus: initial.operationStatus
    }])
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
                            <CardTimesheet index={0} timeSheet={timesheet} onChange={onChange} deleteAddOnService={deleteAddOnService} mode={mode}/>
                            
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