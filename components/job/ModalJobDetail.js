import { Fragment, useState, useRef, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { Dialog, Transition } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
export default function ModalJobDetail(props) {

    const { open, setOpen, handleSaveForm, pointSeqno, jobEntry, jobPoint } = props;
    const isParcel = () => {
        return jobEntry.jobType == "PARCEL" ? true : false
    }
    const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

    const createValidationSchema = () => {
        let ObjectSchema = {
            contactName: Yup.string().required('กรุณาระบุ ชื่อผู้ติดต่อ')
                .max(255, 'ระบุได้สูงสุดไม่เกิน 255 อักษร')
            ,
            contactPhone: Yup.string().required('กรุณาระบุ เบอร์โทร')
                .min(8, 'หมายเลขโทรศัพท์ไม่ถูกต้อง')
                .max(50, 'ระบุได้สูงสุดไม่เกิน 50 อักษร')
                .matches(phoneRegExp, 'หมายเลขโทรศัพท์ไม่ถูกต้อง')
            ,
            locationDesc: Yup.string()
                .nullable()
                .max(500, 'ระบุได้สูงสุดไม่เกิน 500 อักษร')
            // .test('len', 'ระบุได้สูงสุดไม่เกิน 500 อักษร', val => val.length <= 500)
            ,
            remark: Yup.string()
                .nullable()
                .max(500, 'ระบุได้สูงสุดไม่เกิน 500 อักษร')
        }

        if (pointSeqno == 0 && isParcel()) {
            let packageSchema = {
                package: Yup.string(),
                width: Yup.number().typeError('กรุณาระบุตัวเลข')
                    .transform((value) => (isNaN(value) ? 0 : value))
                    .when("package", {
                        is: val => { return val === "" },
                        then: Yup.number().required("กรุณาระบุ ความกว้าง")
                            .min(1, "ความกว้าง ต้องมีค่ามากกว่าศูนย์").max(300, 'Very costly!')
                    }),
                length: Yup.number().typeError('กรุณาระบุตัวเลข')
                    .transform((value) => (isNaN(value) ? 0 : value))
                    .when("package", {
                        is: val => { return val === "" },
                        then: Yup.number().required("กรุณาระบุ ความยาว")
                            .min(1, "ความยาว ต้องมีค่ามากกว่าศูนย์").max(300, 'Very costly!')
                    }),
                height: Yup.number().typeError('กรุณาระบุตัวเลข')
                    .transform((value) => (isNaN(value) ? 0 : value))
                    .when("package", {
                        is: val => { return val === "" },
                        then: Yup.number().required("กรุณาระบุ ความสูง")
                            .min(1, "ความสูง ต้องมีค่ามากกว่าศูนย์").max(300, 'Very costly!')
                    }),
                parcelWeight: Yup.number().typeError('กรุณาระบุตัวเลข')
                    .transform((value) => (isNaN(value) ? 0 : value))
                    .min(1, "น้ำหนัก ต้องมีค่ามากกว่าศูนย์").max(300, 'น้ำหนัก ต้องมีไม่เกินค่าที่กำหนด')
            }

            ObjectSchema = { ...ObjectSchema, ...packageSchema };
        }

        // console.log("ObjectSchema = " + JSON.stringify(ObjectSchema))

        return Yup.object().shape({ ...ObjectSchema });
    }

    const validationSchema = createValidationSchema();

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm(formOptions);

    const watchPackage = watch("package", "NONE"); // you can supply default value as second argument

    const onSubmitPoint = (data, e) => {
        e.preventDefault()

        // console.log("JobPointForm.onSubmit")
        handleSaveForm(data)

        setOpen(false) //Close modal
    };

    useEffect(() => {
        //Set value to form
        let defaultValues = {};
        defaultValues.contactName = jobPoint.contactName
        defaultValues.contactPhone = jobPoint.contactPhone
        defaultValues.remark = jobPoint.remark
        defaultValues.width = jobPoint.width
        defaultValues.length = jobPoint.length
        defaultValues.height = jobPoint.height
        defaultValues.parcelWeight = jobPoint.parcelWeight
        defaultValues.locationDesc = jobPoint.locationDesc

        reset({ ...defaultValues }); //call reset useForm() hook

    }, [jobPoint])


    const FormPackaging = () => {

        return (
            <>
                <div className="mb-4">
                    <label htmlFor="package" className="block text-sm font-medium text-gray-700">
                        Packaging
                    </label>
                    <select
                        id="package"
                        name="package"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        {...register("package")}
                    >
                        <option value="">กำหนดเอง</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                    </select>
                </div>

                {/* based on yes selection to display Age Input*/}
                {!watchPackage &&
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            ขนาดพัสดุ(ซม.)
                        </label>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                                กว้าง
                            </label>
                            <input
                                id="width"
                                name="width"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="number" {...register("width", { min: 0, max: 100 })}
                            >
                            </input>
                            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                                ยาว
                            </label>
                            <input
                                id="length"
                                name="length"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="number" {...register("length", { min: 0, max: 100 })}
                            >
                            </input>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                สูง
                            </label>
                            <input
                                id="height"
                                name="height"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="number" {...register("height", { min: 0, max: 100 })}
                            >
                            </input>
                        </div>
                        <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                            <ul>
                                <li>{errors.width?.message}</li>
                                <li>{errors.length?.message}</li>
                                <li>{errors.height?.message}</li>
                            </ul>
                        </div>
                    </div>
                }

                <div className="mb-4">
                    <label htmlFor="parcelWeight" className="block text-sm font-medium text-gray-700">
                        น้ำหนักพัสดุ(กก.)
                    </label>
                    <input
                        id="parcelWeight"
                        name="parcelWeight" step="any"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        type="number" {...register("parcelWeight")}
                    >
                    </input>
                    <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.parcelWeight?.message}</div>
                </div>
            </>
        )
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

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                        {/* CSS Triangle */}
                        <div className="w-11 overflow-hidden inline-block">
                            <div className="h-16 bg-white -rotate-45 transform origin-top-right"></div>
                        </div>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all w-full max-w-md h-full md:h-auto">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title as="h3" className="text-sm font-medium leading-6 text-gray-900">{pointSeqno + 1 === 1 ? "ชื่อผู้ติดต่อต้นทาง" : "ชื่อผู้ติดต่อปลายทาง"} </Dialog.Title>

                                        <div className="w-full max-w-md">
                                            <form className="pt-6 pb-8 mb-4">
                                                <div className="mb-4">
                                                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 required">
                                                        ชื่อผู้ติดต่อ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contactName"
                                                        id="contactName" placeholder='ชื่อผู้ติดต่อ'
                                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                        {...register("contactName", { required: true })}
                                                    />
                                                    <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.contactName?.message}</div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 required">
                                                        เบอร์โทรศัพท์
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="contactPhone"
                                                        id="contactPhone" placeholder='เบอร์โทรศัพท์'
                                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                        {...register("contactPhone", { required: true })}
                                                    />
                                                    <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.contactPhone?.message}</div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="locationDesc" className="block text-sm font-medium text-gray-700">
                                                        รายละเอียดสถานที่
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="locationDesc"
                                                        id="locationDesc" placeholder='รายละเอียดสถานที่'
                                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                        {...register("locationDesc", { required: false })}
                                                    />
                                                    <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.locationDesc?.message}</div>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                                                        รายละเอียดงาน
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="remark"
                                                        id="remark" placeholder='รายละเอียดงาน'
                                                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm placeholder-gray-300"
                                                        {...register("remark", { required: false })}
                                                    />
                                                    <div className="invalid-feedback font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">{errors.remark?.message}</div>
                                                </div>
                                                {(pointSeqno + 1) == 1 && isParcel() &&
                                                    <FormPackaging />
                                                }

                                                <div className="mt-5 sm:mt-6">
                                                    <button
                                                        type="button" onClick={handleSubmit(onSubmitPoint)}
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                                    >
                                                        บันทึก
                                                    </button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}