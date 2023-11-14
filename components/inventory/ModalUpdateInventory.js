import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { _resObjConfig, isEmpty, renderOptions } from '../../helpers/utils';
import { BranchService } from '../../pages/api/branch.service';
import { InventoryService } from '../../pages/api/inventory.service';
import { NotifyService } from '../../pages/api/notify.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CardInventory from './CardInventory';
export default function ModalUpdateInventory(props) {
    const [querySuccess, setQuerySuccess] = useState(false)
    const { open, setOpen, mode, inventoryCode, jobEntry, timesheet, callbackLoad } = props;
    const [inventoryDetail, setInventoryDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const createValidationSchema = () => { };
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm(formOptions);
    useEffect(() => {
        async function fetchData() {
            await getInventoryDetail(inventoryCode);
            setQuerySuccess(true)
        }
        fetchData()

    }, []);
    const getInventoryDetail = async (inventoryCode) => {
        await InventoryService.getInventoryDetail(inventoryCode).then(res => {
            if (res.data.resultCode === 200) {
                console.log(res.data.resultData[0])
                setInventoryDetail(res.data.resultData[0])
                setQuerySuccess(true)
            } else {
                setInventoryDetail({})
                setQuerySuccess(false)
            }
        }).catch(err => {
            console.log("==> list job3")
        })
    }
    const onChange = (e, index) => {

        const { name, value, checked, type } = e.target;
        console.log(name, value, checked, type)
        setInventoryDetail((data) => ({ ...data, [name]: value }));
        // if (errors) {
        //     if (e.target.value) {
        //         console.log(name)
        //         if (
        //             (name === "product" || name === "amount") &&
        //             e.target.value?.length > 0
        //         ) {
        //             for (let product of e.target.value) {
        //                 if (product?.code) {
        //                     clearErrors(
        //                         `${name}[${_newValue[index].index}].code[${product.index}]`
        //                     );
        //                 }
        //                 if (product?.amount) {
        //                     clearErrors(
        //                         `${name}[${_newValue[index].index}].amount[${product.index}]`
        //                     );
        //                 }
        //             }
        //         } else {
        //             clearErrors(`${name}[${_newValue[index].index}]`);
        //         }
        //     }
        // }
    };
    const handleSave = async () => {
        const errorList = [];
        if (!inventoryDetail.branchName) {
            errorList.push({
                field: `branchName[1]`,
                type: "custom",
                message: "custom message",
            });
        }
        if (!inventoryDetail.branchType.code) {
            errorList.push({
                field: `branchType[1]`,
                type: "custom",
                message: "custom message",
            });
        }
        if (!inventoryDetail.supervisor.employeeCode) {
            errorList.push({
                field: `supervisor[1]`,
                type: "custom",
                message: "custom message",
            });
        }
        if (inventoryDetail.product.length > 0) {
            for (let product of inventoryDetail.product) {
                // if (!product.code) {
                //     errorList.push({
                //         field: `product[${branch.index}].code[${product.index}]`,
                //         type: "custom",
                //         message: "custom message",
                //     });
                // }
                // if (!product.amount) {
                //     errorList.push({
                //         field: `product[${branch.index}].amount[${product.index}]`,
                //         type: "custom",
                //         message: "custom message",
                //     });
                // }
            }
        }
        console.log(errorList)
        if (errorList.length === 0) {
            setLoading(true)
            let dataList = {
                dataList: inventoryDetail
            }
            await BranchService.updateBranch(inventoryCode, inventoryDetail).then(res => {
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
                                {querySuccess &&
                                    <CardInventory
                                        index={1}
                                        inventory={inventoryDetail}
                                        onChange={onChange}
                                        mode={mode}
                                        // deleteAddOnService={deleteAddOnService}
                                        onErrors={errors}
                                    />
                                }
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

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}