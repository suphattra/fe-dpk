import InputGroupDate from "../InputGroupDate";
import InputSelectGroup from "../InputSelectGroup";
import { _resObjConfig, isEmpty, renderOptions } from "../../helpers/utils";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import ListFile from "../ListFile";
import { MasterService } from "../../pages/api/master.service";
import moment from "moment/moment";
import ImageUploading from 'react-images-uploading';
import LoadingTemplate from "../LoadingTemplate";
import InputRadioGroup from "../InputRadioGroup";
import InputGroupMask from "../InputGroupMask";


export default function CardFinancialsEmployee({ index, employee, timeSheet, onChange, dateSelect, deleteAddOnService, mode, onErrors }) {
    const [errors, setErrors] = useState({});
    const [listFile, setListFile] = useState([])
    const [financialTypeOption, setFinancialTypeOption] = useState([])
    const [typeOption, setTypeOption] = useState([])
    const [paymentOption, setPaymentOption] = useState([])
    const [nationalityOption, setNationaliyOption] = useState([])
    const [roleOption, setRoleOption] = useState([])
    const [images, setImages] = useState([]);
    const [querySucess, setQuerySucess] = useState(false);
    const [wageType, setWageType] = useState([])
    const maxNumber = 69;

    useEffect(() => {
        async function fetchData() {
            await getConfigList('FINANCIAL_TYPE');
            await getConfigList('PAYMENT_TYPE');
            setQuerySucess(true);
        }
        fetchData()
    }, [])
    useEffect(() => {
        async function fetchData() {
            if (employee.financialType?.code === 'MD0089') {
                await getConfigList('PAYMENT');
            } else {
                await getConfigList('WITHDRAWAL');
            }
        }
        fetchData()
    }, [employee.financialType]);
    useEffect(() => {
        if (!isEmpty(employee.receipt)) {
            let a = []
            a.push({
                data_url: employee.receipt?.filePath,
                file: employee.receipt?.filePath
            })
            setImages(a);
        }

    }, [employee.receipt]);
    useEffect(() => {
        setErrors(onErrors);
    }, [onErrors]);

    const handleChange = (e, index, name) => {
        let obj = {}
        if (name === 'financialTopic' || name === 'paymentType' || name === 'financialType') {
            let _option = []
            switch (name) {
                case "financialTopic":
                    _option = typeOption
                    break;
                case "paymentType":
                    _option = paymentOption;
                    break;
                case "financialType":
                    _option = financialTypeOption;
                    break;
                default:
            }
            obj = _resObjConfig(e.target.value, _option)
            onChange({ target: { name: name, value: obj } }, index, name)
        }
        if (name === "receipt") {
            console.log(e)
            if (!isEmpty(e)) {
                let obj = {
                    filePath: e[0].data_url
                }
                onChange({ target: { name: name, value: obj } }, index, name);
            } else {
                let obj = {
                    filePath: {}
                }
                onChange({ target: { name: name, value: obj } }, index, name);
            }
        }
    }

    const handleFileChange = async (e) => {
        e.preventDefault();
        const files = e.target.files
        console.log(files)
        if (files.length > 0) {
            let param = {
                index: listFile.length + 1,
                file: files[0],
                fileName: files[0].name,
                fileSizeKb: files[0].size,
                recordStatus: 'A',
                filePath: files[0].name,
                action: 'add'
            };
            setListFile([...listFile, param])
        }

    }

    const onChangeImg = (imageList, addUpdateIndex, index) => {
        setImages(imageList);
        handleChange(imageList, index, 'receipt')
    };

    const getConfigList = async (code) => {
        let param = {
            subType: code,
            status: 'Active',
            type: 'EMPLOYEE'
        }
        await MasterService.getConfig(param).then(res => {
            if (res.data.resultCode === 200) {
                console.log(res.data)
                if (code === 'FINANCIAL_TYPE') setFinancialTypeOption(res.data.resultData)
                if (code === 'WITHDRAWAL') setTypeOption(res.data.resultData)
                if (code === 'PAYMENT') setTypeOption(res.data.resultData)
                if (code === 'PAYMENT_TYPE') setPaymentOption(res.data.resultData)
            } else {
                if (code === 'FINANCIAL_TYPE') setFinancialTypeOption([])
                if (code === 'WITHDRAWAL') setTypeOption([])
                if (code === 'PAYMENT') setTypeOption([])
                if (code === 'PAYMENT_TYPE') setPaymentOption(res.data.resultData)
            }
        }).catch(err => {
        })
    }
    return (
        <div className="mt-4 flex flex-col">
            {mode != 'edit' && <div className="flex flex-row-reverse py-2 px-2 border border-gray-200 rounded-t-md">
                <button type="button"
                    className="flex justify-center inline-flex items-center rounded-md border border-transparent  text-xs font-medium text-black shadow-sm hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-80"
                    onClick={(e) => deleteAddOnService(employee.index)}
                >
                    <XMarkIcon className="h-8 w-8  pointer" aria-hidden="true" />
                </button>

            </div>}
            {querySucess &&
                <div className="rounded-md p-4 shadow-md">
                    {/* items-stretch overflow-hidden */}
                    {/* {querySucess && */}
                    <div className="flex flex-1 items-stretch">
                        <div className='relative w-0 flex-1'>
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mr-6">
                                <InputGroupDate
                                    type="date"
                                    id={"transactionDate" + employee.index}
                                    name="transactionDate" label="วัน/เดือน/ปี"
                                    format="YYYY-MM-DD"
                                    onChange={(e) => { onChange(e, index, "transactionDate") }}
                                    value={moment().format('YYYY-MM-DD')}
                                    invalid={
                                        errors?.transactionDate ? errors?.transactionDate[employee.index] : false
                                    }
                                    required
                                />
                                <div class="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        ประเภทบันทึก
                                        <span style={{ color: "#991B1E" }}> *</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-2 mt-4">
                                        {financialTypeOption && financialTypeOption.map(function (item, inx) {
                                            return (
                                                <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                    id={"financialType_" + inx + employee.index} name={"financialType" + employee.index} label={item.value1}
                                                    onChange={(e) => handleChange(e, index, "financialType")}
                                                    value={item.code}
                                                    required
                                                    disabled={mode == 'edit' ? true : false}
                                                    checked={item.code === employee.financialType?.code ? true : false} />
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                            <hr className="mt-5 mb-2"></hr>
                            <div className="flex flex-1 items-stretch">
                                <div className='relative w-0 flex-1 mr-6 border-r'>
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mr-6">

                                        <InputSelectGroup type="text" label="รายการ"
                                            id={"financialTopic" + employee.index}
                                            name="financialTopic"
                                            onChange={(e) => handleChange(e, index, "financialTopic")}
                                            isSearchable
                                            value={employee.financialTopic.code}
                                            options={renderOptions(typeOption, "value1", "code")}
                                            invalid={
                                                errors?.financialTopic ? errors?.financialTopic[employee.index] : false
                                            }
                                            required />
                                        <InputGroupMask type="text" id="amount" name="amount" label="จำนวน"
                                            mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                            onChange={(e) => onChange(e, index, "amount")}
                                            required
                                            value={employee.amount}
                                            unit="บาท"
                                            invalid={errors?.amount ? errors?.amount[employee.index] : false}
                                        />
                                        {employee.financialType?.code === 'MD0089' && 
                                            <div class="col-span-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    ช่องทางการจ่าย
                                                    <span style={{ color: "#991B1E" }}> *</span>
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-2 mt-4">
                                                    {paymentOption && paymentOption.map(function (item, inx) {
                                                        return (
                                                            <InputRadioGroup key={inx} classes="h-4 w-4" type={"radio"}
                                                                id={"paymentType_" + inx + employee.index} name={"paymentType" + employee.index} label={item.value1}
                                                                onChange={(e) => handleChange(e, index, "paymentType")}
                                                                value={item.code}
                                                                required
                                                                checked={item.code === employee.paymentType?.code ? true : false} />
                                                        )
                                                    })}

                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="relative w-0 flex-1">
                                    <div className="block w-full">
                                        <ListFile
                                            data={listFile}
                                        />
                                        <label htmlFor="" className="block text-sm font-medium text-gray-700">อัพโหลดไฟล์:</label>
                                        <ImageUploading
                                            value={images}
                                            onChange={(e, addUpdateIndex) => { onChangeImg(e, addUpdateIndex, index) }}
                                            maxNumber={maxNumber}
                                            dataURLKey="data_url"
                                            acceptType={["jpg"]}
                                        >
                                            {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps
                                            }) => (
                                                <div className="upload__image-wrapper ">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        {imageList.length <= 0 && <div className="w-100 border rounded-md" for="photo" style={{ textAlign: "center", width: "50%" }} {...dragProps}>
                                                            <div onClick={onImageUpload} className="icon-add-photo" style={{
                                                                backgroundColor: "white",
                                                                width: "max-content",
                                                                margin: "0 auto",
                                                                padding: "0ยป",
                                                                borderRadius: "50%"
                                                            }}>

                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 42 43"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M33.25 12.5413V17.8984C33.25 17.8984 29.7675 17.9163 29.75 17.8984V12.5413H24.5C24.5 12.5413 24.5175 8.97592 24.5 8.95801H29.75V3.58301H33.25V8.95801H38.5V12.5413H33.25ZM28 19.708V14.333H22.75V8.95801H8.75C6.825 8.95801 5.25 10.5705 5.25 12.5413V34.0413C5.25 36.0122 6.825 37.6247 8.75 37.6247H29.75C31.675 37.6247 33.25 36.0122 33.25 34.0413V19.708H28ZM8.75 34.0413L14 26.8747L17.5 32.2497L22.75 25.083L29.75 34.0413H8.75Z"
                                                                        fill="#DF3062"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div onClick={onImageUpload} style={{ color: "#344358", paddingTop: "5px", paddingBottom: "10px" }}>
                                                                <h3 style={{ margin: "0" }}>อัพโหลดรูปภาพ</h3>
                                                                <span>หรือลากไฟล์วางที่นี่</span>
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>

                                                    <div className="flex items-center justify-center space-x-4 mt-4">
                                                        {imageList.map((image, index) => (

                                                            <div key={index} className="image-item" style={{ textAlign: "center", width: "40%" }}>
                                                                <img src={image.data_url} alt="" width="100%" style={{ textAlign: "center" }} className="p-4 border rounded-md" />
                                                                <hr />
                                                                <div className="flex justify-between ">
                                                                    <button
                                                                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                                                        type="button" onClick={() => onImageUpdate(index)}>
                                                                        <PencilIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                                                        แก้ไข</button>
                                                                    <button
                                                                        className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-white-800 px-2 py-1.5 text-xs font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-white-500 focus:ring-offset-0 disabled:opacity-80"
                                                                        type="button" onClick={() => onImageRemove(index)}>
                                                                        <TrashIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                                                                        ลบ</button>
                                                                </div>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                    <div className="block w-full">
                                        <label htmlFor={"remark"} className="block text-sm font-medium text-gray-700">
                                            {"หมายเหตุ:"}
                                        </label>
                                        <textarea
                                            onChange={(e) => onChange(e, index, "remark")}
                                            id="remark"
                                            name="remark"
                                            value={employee.remark}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* } */}
                </div>
            }
            {!querySucess && <LoadingTemplate />}
        </div >

    )
}