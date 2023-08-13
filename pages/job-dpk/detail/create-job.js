import React, { createContext, Fragment, StrictMode, useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Layout from "../../../layouts";
import { CheckIcon, PencilIcon, PencilSquareIcon, PlusIcon, PlusIcon as PlusIconMini, PrinterIcon, Squares2X2Icon as Squares2X2IconMini, XMarkIcon } from '@heroicons/react/20/solid'
import { InputGroup, InputGroupCurrency, InputGroupDate, InputGroupMask, InputRadioGroup, InputSelectGroup } from "../../../components";
import { JobService } from "../../api/job.service";
import { useRouter } from "next/router";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { MasterService } from "../../api/master.service";
import { renderConfigOptions, renderOptions } from "../../../helpers/utils";
import { Controller, useForm } from "react-hook-form";
import LoadingOverlay from "react-loading-overlay";
import Lookup from "../../../components/Lookup";
import Select from 'react-select';
import Script from 'next/script'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

LoadingOverlay.propTypes = undefined
const BOOKING_STARTTIME = [
    { value: '', name: 'Please Select' },
    { name: "09:00", value: '09:00:00' },
    { name: "13:00", value: '13:00:00' },
]

const BOOKING_FINISHTIME = [
    { value: '', name: 'Please Select' },
    { name: "12:00", value: '12:00:00' },
    { name: "17:00", value: '17:00:00' },
]
const EST_BOOKING_FINISHTIME = [
    { value: '', name: 'Please Select' },
    { name: "09:00", value: '09:00' },
    { name: "09:15", value: '09:15' },
    { name: "09:30", value: '09:30' },
    { name: "09:45", value: '09:45' },
    { name: "10:00", value: '10:00' },
    { name: "10:15", value: '10:15' },
    { name: "10:30", value: '10:30' },
    { name: "10:45", value: '10:45' },
    { name: "11:00", value: '11:00' },
    { name: "11:15", value: '11:15' },
    { name: "11:30", value: '11:30' },
    { name: "11:45", value: '11:45' },
    { name: "12:00", value: '12:00' },
    { name: "12:15", value: '12:15' },
    { name: "12:30", value: '12:30' },
    { name: "12:45", value: '12:45' },
    { name: "13:00", value: '13:00' },
    { name: "13:15", value: '13:15' },
    { name: "13:30", value: '13:30' },
    { name: "13:45", value: '13:45' },
    { name: "14:00", value: '14:00' },
    { name: "14:15", value: '14:15' },
    { name: "14:30", value: '14:30' },
    { name: "14:45", value: '14:45' },
    { name: "15:00", value: '15:00' },
    { name: "15:15", value: '15:15' },
    { name: "15:30", value: '15:30' },
    { name: "15:45", value: '15:45' },
    { name: "16:00", value: '16:00' },
    { name: "16:15", value: '16:15' },
    { name: "16:30", value: '16:30' },
    { name: "16:45", value: '16:45' },
    { name: "17:00", value: '17:00' },
    { name: "17:15", value: '17:15' },
    { name: "17:30", value: '17:30' },
    { name: "17:45", value: '17:45' },
    { name: "18:00", value: '18:00' },
    { name: "18:15", value: '18:15' },
    { name: "18:30", value: '18:30' },
    { name: "18:45", value: '18:45' },
    { name: "19:00", value: '19:00' },
    { name: "19:15", value: '19:15' },
    { name: "19:30", value: '19:30' },
    { name: "19:45", value: '19:45' },
    { name: "20:00", value: '20:00' },
    { name: "20:15", value: '20:15' },
    { name: "20:30", value: '20:30' },
    { name: "20:45", value: '20:45' },
]
const initial = {
    jobDetail: {
        userLogin: '',
        jobNo: '',
        customerId: '',
        driverId: '',
        packageId: '',
        customerType: 'CASH',
        jobPackageType: 'NORMAL',
        trackingNo: '',
        jobType: 'DOCUMENT',
        jobDesc: '',
        status: 'NEW',
        distance: 0,
        shipmentDate: moment(new Date()).format('YYYY-MM-DD'),
        cancelledDate: '',
        estStartTime: '',
        estEndTime: '',
        actualDate: '',
        actualStartTime: '',
        actualEndTime: '',
        paymentType: '',
        paymentStatus: 'WAITING_PAYMENT',
        totalExtraCharge: '',
        netTotal: 0,
        recordStatus: 'A'
    },
    jobList: []
}
import { Loader } from '@googlemaps/js-api-loader';
import JobExtraCharge from "../../../components/job/job-extra-charge";
import { PaymentService } from "../../api/payment.service";
import { CustomerService } from "../../api/customer.service";
import { MapService } from "../../api/map.service";
import JobPoint from "../../../components/job/jobpoint-route-job";
import { NotifyService } from "../../api/notify.service";
import { DriverService } from "../../api/driver.service";
import { authService } from "../../api/auth/auth-service";
import ListFile from "../../../components/ListFile";
import { PackageService } from "../../api/package.service";
import MaskedInput from "react-text-mask";
import ModalPrintTax from "../../../components/report/ModalPrintTax";
const breadcrumbs = [{ index: 1, href: '/job', name: 'job' }, { index: 2, href: '/job/detail/create-job', name: 'detail' }]

export default function CreateJob() {
    const elRef = useRef(null);

    let USER_ID = ""
    const router = useRouter();
    const id = router.query["id"];
    const [mode, setMode] = useState(router.query["mode"])
    const [modePayment, setModePayment] = useState(router.query["mode"])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [jobDetail, setJobDetail] = useState(initial.jobDetail)

    const [openTab, setOpenTab] = useState(0);

    const [jobpoint, setJobpoint] = useState([{ pointSeq: 1, fullAddress: '', lat: "", long: "" }, { pointSeq: 2, fullAddress: '', lat: "", long: "" }])
    const [errOverPackage, setOverPackage] = useState(null)
    const [jobExtraCharge, setJobExtraCharge] = useState([])
    const [errAddOnService, setErrAddOnService] = useState(null)
    const [isErrorJobPoint, setIsErrorJobPoint] = useState({})
    //Master
    const [jobType, setJobType] = useState([])
    const [jobDesc, setJobDesc] = useState([])
    const [jobPackageType, setJobPackageType] = useState([])
    const [jobStatus, setJobStatus] = useState([])
    const [paymentType, setPayment] = useState([])
    const [customerType, setCustomerType] = useState([])
    const [paymentStatus, setPaymentStatus] = useState([])
    const [processingPayment, setProcessingPayment] = useState(true)
    const [driverList, setDriverList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [extraCharge, setExtraCharge] = useState([])
    //End Master
    const didMount = React.useRef(false);


    const [packageCus, setPackageCus] = useState({ packageCode: '' })

    //Payment
    const [scannableCode, setScannableCode] = useState(null)
    const googlemapRef = useRef(null);
    const [omise, setOmise] = useState()
    const [paymentResults, setPaymentResult] = useState(null)
    const [paymentStatusTx, setPaymentStatusTx] = useState("")
    const [showTooltip, isShowTooltip] = useState(false)
    const [chargeId, setChargeId] = useState(null)
    //file
    const [listFile, setListFile] = useState([])
    const [listFileDefault, setListFileDefault] = useState([])
    const [isOpenPrintTax, setIsOpenPrintTax] = useState(false)
    //Map
    const [myMap, setMyMap] = useState()
    //Distance
    const [distance, setDistance] = useState({})
    const createValidationSchema = () => {
        let ObjectSchema = {
            bookingStartTime: Yup.string()
                .required(),
            bookingEndTime: Yup.string()
                .required(),
            shipmentDate: Yup.string()
                .required(),
            jobDesc: Yup.string()
                .required(),
            jobPackageType: Yup.string()
                .required(),
            status: Yup.string()
                .required(),
        }
        if (jobDetail.jobPackageType === "PACKAGE") {
            let packageSchema = {
                customerId: Yup.string()
                    .when('jobPackageType', {
                        is: (jobPackageType) => jobPackageType == 'NORMAL',
                        then: Yup.string().required(),
                    })
                    // .when('jobPackageType', {
                    //     is: (jobPackageType) => jobPackageType == 'PACKAGE',
                    //     then: Yup.string().notRequired(),
                    // })
                    .transform((v, o) => o === '' ? null : v),
                packageCode: Yup.string()
                    .when('jobPackageType', {
                        is: (jobPackageType) => jobPackageType === 'PACKAGE',
                        then: Yup.string().required(),
                    })
                    // .when('jobPackageType', {
                    //     is: (jobPackageType) => jobPackageType === 'NORMAL',
                    //     then: Yup.string().notRequired(),
                    // })
                    .transform((v, o) => o === '' ? null : v),
            }
            ObjectSchema = { ...ObjectSchema, ...packageSchema };
        }
        if (jobDetail.jobPackageType === "NORMAL") {
            let packageSchema = {
                customerId: Yup.string()
                    .required(),
            }
            ObjectSchema = { ...ObjectSchema, ...packageSchema };
        }
        if (jobDetail.status === "CANCEL") {
            let packageSchema = {
                cancelledDate: Yup.string()
                    .when('status', {
                        is: (status) => status == 'CANCEL',
                        then: Yup.string().required(),
                    })
            }
            ObjectSchema = { ...ObjectSchema, ...packageSchema };
        }
        return Yup.object().shape({ ...ObjectSchema });
    }
    const validationSchema = createValidationSchema();
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm(formOptions);
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // useEffect(() => {
    //     setLoading(true)
    //     console.log(mode)
    //     USER_ID = authService.getUserId()
    //     setValue('shipmentDate', jobDetail.shipmentDate)
    //     setValue('status', jobDetail.status)
    //     setValue('jobType', jobDetail.jobType)
    //     setValue('jobPackageType', jobDetail.jobPackageType)
    //     async function fetchData() {
    //         await getConfig('PAYMENT_TYPE')
    //         await getConfig('JOB_PACKAGE_TYPE')
    //         await getConfig('JOB_TYPE')
    //         await getConfig('JOB_DESC')
    //         await getConfig('JOB_STATUS')
    //         await getConfig('PAYMENT_STATUS')
    //         await getConfig('CUSTOMER_TYPE')
    //         await getConfig('EXTRA_CHARGE_TYPE')
    //         await getCustomerList("")
    //         setLoading(false)
    //         if (mode === "edit" || mode === "view") {
    //             await getJobDetail();
    //             await getAttach()
    //         } else {
    //             await getDriverList(jobDetail.jobType)
    //         }
    //     }
    //     fetchData();

    //     // Load Map
    //     const loader = new Loader({
    //         apiKey: "AIzaSyAZwkIoSUWsWQwXOSvZ1JZTeYFC3pP2bWk",
    //         version: 'weekly',
    //         language: "th",
    //         libraries: ["places"]
    //     });
    //     let map;

    //     loader.load().then(async () => {
    //         const google = window.google;
    //         map = new google.maps.Map(googlemapRef.current, {
    //             center: { lat: 13.7970244, lng: 100.5519849 },
    //             zoom: 15,
    //             mapTypeId: "roadmap",
    //             streetViewControl: false,
    //         });
    //         setMyMap(map)
    //         MapService.setMap(map)
    //     });

    // }, []);

    useEffect(() => {
        /**
         * Calulate Price when distance and jobExtraCharge change
         */
        if (mode !== "view") {
            calculateNetTotal()
        }
    }, [jobExtraCharge, distance, jobDetail.customerId, jobDetail.adjustFee]);

    useEffect(() => {
        /**
         * Calulate Price when distance and jobExtraCharge change
         */
        if (mode !== "view") {
            calDuration(jobDetail.jobType)
        }
    }, [jobDetail.estStartTime, jobExtraCharge]);

    useEffect(() => {
        if (myMap == null) return

        console.log("myMap state changes. ", myMap)
    }, [myMap])

    const handleLoadScript = () => {
        Omise = window.Omise
        Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || "pkey_test_5te08cxtsk2cku77r0b")

        setOmise(Omise)

        PaymentService.initial(Omise)
    }
    const getConfig = async (configCategory) => {
        let paramquery = {
            configCategory: configCategory,
            configCode: '',
            status: ''
        }
        await MasterService.getConfig(paramquery).then(res => {
            if (res.data.resultCode === "20000") {
                if (configCategory === 'PAYMENT_TYPE') setPayment(res.data.resultData.configs)
                if (configCategory === 'JOB_PACKAGE_TYPE') setJobPackageType(res.data.resultData.configs)
                if (configCategory === 'JOB_TYPE') setJobType(res.data.resultData.configs)
                if (configCategory === 'JOB_DESC') setJobDesc(res.data.resultData.configs)
                if (configCategory === 'JOB_STATUS') setJobStatus(res.data.resultData.configs)
                if (configCategory === 'PAYMENT_STATUS') setPaymentStatus(res.data.resultData.configs)
                if (configCategory === 'CUSTOMER_TYPE') setCustomerType(res.data.resultData.configs)
                if (configCategory === 'EXTRA_CHARGE_TYPE') setExtraCharge(res.data.resultData.configs)
            } else {
                setJobType([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getDriverList = async (jobType) => {
        let param = {
            limit: 10000,
            offset: 1,
            status: 'A',
            jobType: jobType
        }
        await DriverService.getDriverList(param)
            .then(res => {
                setDriverList(res.data.resultData.drivers)
            })
    }
    const getAttorney = async (id) => {
        let param = {
            customerId: id
        }
        return await DriverService.getAttorney(param).then(res => {
            if (res.data.resultCode === "20000") {
                if (res.data.resultData.driverAttorney.length > 0) {
                    let driverAttorney = []
                    res.data.resultData.driverAttorney.forEach(ele => {
                        ele.driverId = ele.driverId
                        ele.fullName = ele.driverName
                        driverAttorney.push(ele)
                    })
                    setDriverList(driverAttorney)
                }

            } else {
                setDriverList([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const getCustomerList = async (customerType) => {
        let param = {
            status: 'A',
            limit: 10000,
            offset: 1
        }
        if (customerType !== "") {
            param.customerType = customerType
        }
        await CustomerService.getCustomerList(param)
            .then(res => {
                setCustomerList(res.data.resultData.customers)

                // CASE change Customer Type == bill but list customer not have
                if (jobDetail.customerId) {
                    let cusType = res.data.resultData.customers.find(ele => { return ele.customerId === jobDetail.customerId })
                    if (!cusType) {
                        setJobDetail(data => ({ ...data, ["customerId"]: "" }));
                        setValue('customerId', "")
                    }
                }
            })
    }
    const getJobDetail = async (jobId) => {
        setLoading(true)
        let _id = id ? id : jobId
        await JobService.getJobDetail(_id).then(async res => {
            if (res.data.resultCode === "20000") {
                await getPackageCustomer(res.data.resultData.job.packageCode, res.data.resultData.job.shipmentDate)

                setJobDetail(res.data.resultData.job)
                setJobpoint(res.data.resultData.job.jobPoint)
                //set Value
                setValue('customerType', res.data.resultData.job.customerType)
                setValue('shipmentDate', res.data.resultData.job.shipmentDate)
                setValue('jobType', res.data.resultData.job.jobType)
                setValue('jobDesc', res.data.resultData.job.jobDesc)
                setValue('status', res.data.resultData.job.status)
                setValue('bookingStartTime', res.data.resultData.job.bookingStartTime)
                setValue('bookingEndTime', res.data.resultData.job.bookingEndTime)
                setValue('customerId', res.data.resultData.job.customerId)
                setValue('jobPackageType', res.data.resultData.job.jobPackageType)
                setValue('packageCode', res.data.resultData.job.packageCode)
                setValue('cancelledDate', res.data.resultData.job.cancelledDate)
                if (res.data.resultData.job.jobType === "ATTORNEY") {
                    await getAttorney(res.data.resultData.job.customerId)
                } else {
                    await getDriverList(res.data.resultData.job.jobType)
                }
                let extraCharge = []
                extraCharge = res.data.resultData.job.jobPoint
                if (res.data.resultData.job.jobPoint.length < 2) {
                    extraCharge.push({ pointSeq: 2, fullAddress: '', lat: "", long: "" })
                }
                await setMapPoint(extraCharge)
                let temp = []
                extraCharge.map((ele, index) => {
                    if (ele.extraChargeType) {
                        let newService = {
                            "extraChargeType": ele.extraChargeType,
                            "extraChargeTypeTxt": ele.extraChargeTypeTxt,
                            "extraCharge": ele.extraCharge,
                            "pointSeq": ele.pointSeq,
                        }
                        temp.push(newService)

                    }
                })
                setLoading(false)
                setJobExtraCharge(temp)
            } else {
                setJobDetail({})
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const onChange = async (evt) => {
        const { name, value, checked, type, id } = evt.target;
        setJobDetail(data => ({ ...data, [name]: type === 'radio' ? id : value }));
        setValue(evt.target.name, type === 'radio' ? id : value, { shouldValidate: true });
        if (name === "jobType") {
            calDuration(value)
            setJobDetail(data => ({ ...data, ["driverId"]: "" }));

            if (value === "ATTORNEY") {
                await getAttorney(jobDetail.customerId)
            } else {
                await getDriverList(value)
            }

        }
        if (name === "bookingStartTime" && value === "13:00:00") {
            setJobDetail(data => ({ ...data, ["bookingEndTime"]: type === 'radio' ? id : "17:00:00" }));
            setValue("bookingEndTime", "17:00:00", { shouldValidate: true });
        }
        if (name === "status" && value !== "CANCEL") {
            setJobDetail(data => ({ ...data, ["cancelledDate"]: "" }));
        }
        if (name === "jobPackageType") {
            setJobDetail(data => ({ ...data, ["customerId"]: "" }));
            setJobDetail(data => ({ ...data, ["packageCode"]: "" }));
            setJobDetail(data => ({ ...data, ["packageId"]: "" }));
        }
        if (name === "customerType") {
            let type = value === "BILL" ? "BILL" : ""
            await getCustomerList(type)
        }
        if (name === "customerId") {
            let cusType = customerList.find(ele => { return ele.customerId === value })
            if (cusType && cusType.customerType === "BILL") {
                setJobDetail(data => ({ ...data, ["customerType"]: "BILL" }));
            }
        }

    };
    const getPackageCustomer = async (packageCode, shipmentDate) => {
        // await CustomerService.packageCustomer(userId, customerId)
        if (packageCode) {
            let param = {
                effectiveDate: moment(new Date(shipmentDate)).format("YYYY/MM/DD"),
                packageCode: packageCode,
                offset: 1,
                limit: 1
            }
            await PackageService.getPackageList(param)
                .then(res => {
                    if (res.data.resultCode === "20000") {
                        if (res.data.resultData.packages.length > 0) {
                            setPackageCus(res.data.resultData.packages[0])
                        } else {
                            setPackageCus({})
                        }
                    }
                })
        }
    }
    // Add Extra Charge
    const insertAddOnService = async () => {
        // e.preventDefault();
        if (jobExtraCharge.length === 2) {
            setErrAddOnService("สามารถเพิ่มบริการเสริมสูงสุด 2 รายการ")
            return
        }
        let newService = {
            extraChargeType: "WAITING",//"",
            extraChargeTypeTxt: extraCharge.find(c => "WAITING" === c.configCode)?.configValue,//"",
            extraCharge: extraCharge.find(c => "WAITING" === c.configCode)?.configValue2,//"",
            pointSeq: jobExtraCharge.length + 1
        }
        // let newData = [...jobExtraCharge, newService]
        setJobExtraCharge((jobExtraCharge) => [...jobExtraCharge, newService]);
    }
    const deleteAddOnService = async (rowIndex) => {
        console.log("rowIndex", rowIndex)
        let newData = jobExtraCharge.filter((_, i) => i !== rowIndex)
        console.log("newData", newData)
        setJobExtraCharge(newData)
        /**
         * Calulate Price when distance change
         */
        // await calculateNetTotal()
    }
    const callbackValueOnChangePointExtra = async (e) => {
        console.log(e)
        setJobExtraCharge(e)
        /**
         * Calulate Price when distance change
         */
        // await calculateNetTotal()
    }
    // End Extra Charge

    // Add job point
    const callbackJobPointDetail = async (type, e) => {
        setJobpoint(e)
        const _jobpoint = e
        try {
            if (_jobpoint.length != 2) return

            for (var i = 0; i < _jobpoint.length; i++) {
                const p = _jobpoint[i]
                if (!p.lat || !p.long) {
                    return
                }
            }
            if (type === "CHANGE_MAP") setMapPoint(_jobpoint)
            // /**
            // * Calulate Price
            // */
            // await calculateNetTotal(payload)
        } catch (error) {
            console.error(error)
            NotifyService.error(`${error.code} ${error.message}`)
        } finally {

        }
    }

    //Map cal for edit
    const setMapPoint = async (jobPoints) => {
        try {
            const requestRouteInit = await JobService.getDirectionRequestInitialCharge(jobPoints)
            const statInitRoute = await MapService.getDirectionAsyncInitCharge(requestRouteInit)

            const requestRoute = await JobService.getDirectionRequestForGoogleMap(jobPoints)
            const statRequestRoute = await MapService.getDirectionAsync(requestRoute)
            console.log(`Initial distance : ${statInitRoute.distance} km.`)
            console.log(`Initial duration : ${statInitRoute.duration} minutes`)
            console.log(`Request distance : ${statRequestRoute.distance} km.`)
            console.log(`Request duration : ${statRequestRoute.duration} minutes`)
            const payload = {
                "route0": statInitRoute,
                "route1": statRequestRoute,
            }
            setDistance(payload)

        } catch (err) {
            console.log(err)
            // NotifyService.error(`${error.code} ${error.message}`)
        }
    }

    const getDistanceOverPackage = () => {
        try {
            if (Object.keys(distance).length === 0) {
                return
            }
            const { route0, route1 } = distance
            if (packageCus != null) {
                console.log(`Profile.package : `, packageCus)
                console.log(`route0.distance : `, route0.distance)
                console.log(`route1.distance : `, route1.distance)
                const packageInfo = packageCus
                //Check tripleft  
                // if (packageInfo.tripLeft > 0) {
                if (packageInfo.status === 'Consumed' || packageInfo.status === 'New') {//--> check status
                    if (packageInfo.distanceLimit) {

                        const burnPackageFlag = ((packageInfo.distanceLeft - route0.distance - route1.distance) >= 0)
                        console.log("burnPackageFlag", burnPackageFlag)
                        console.log(`distanceLeft ${packageInfo.distanceLeft} - distance(1)=${route0.distance} -distance(2)=${route1.distance} `, packageInfo.distanceLeft - route0.distance - route1.distance)
                        if (burnPackageFlag) {
                            return { usePackage: true }
                        } else {
                            setOverPackage(`Package Code ${packageInfo.packageCode} : เกินระยะทาง ${packageInfo.distanceLeft} กิโลเมตร`)
                            //Using Package
                            var packageRemain = packageInfo.distanceLeft
                            var origin = 0
                            var receive = 0
                            if (route0.distance >= packageRemain) {
                                origin = (route0.distance - packageRemain)
                                receive = route1.distance //40
                                packageRemain = 0

                            } else if (route0.distance < packageRemain) {
                                packageRemain = (packageRemain - route0.distance)
                                origin = 0
                                receive = (route1.distance - packageRemain)
                            }

                            return { usePackage: true, origin: origin, receive: receive }
                        }
                    }
                } else {
                    if (mode === "edit" || mode === "view") { ///if mode edit booking not check tripLeft 
                        if (packageInfo.distanceLimit) {

                            const burnPackageFlag = ((packageInfo.distanceLeft - route0.distance - route1.distance) >= 0)
                            console.log(burnPackageFlag)
                            console.log(`distanceLeft ${packageInfo.distanceLeft} - distance(1)=${route0.distance} -distance(2)=${route1.distance} `, packageInfo.distanceLeft - route0.distance - route1.distance)
                            if (burnPackageFlag) {
                                return { usePackage: true }
                            } else {
                                setOverPackage(`Package Code ${packageInfo.packageCode} : เกินระยะทาง ${packageInfo.distanceLeft} กิโลเมตร`)
                                //Using Package
                                var packageRemain = packageInfo.distanceLeft
                                var origin = 0
                                var receive = 0
                                if (route0.distance >= packageRemain) {
                                    origin = (route0.distance - packageRemain)
                                    receive = route1.distance
                                    packageRemain = 0

                                } else if (route0.distance < packageRemain) {
                                    packageRemain = (packageRemain - route0.distance)
                                    origin = 0
                                    receive = (route1.distance - packageRemain)
                                }

                                return { usePackage: true, origin: origin, receive: receive }
                            }
                        }
                    }
                    // console.log(`Package Code ${packageInfo.packageCode} : เกิน Trip Limit Per Day ${packageInfo.tripLeft} ครั้ง`)
                    return { usePackage: false }
                }
            } else {
                return { usePackage: false }
            }

        } catch (error) {
            console.error(error)
            NotifyService.error(`${error.message}`)

        } finally {

        }

        // const { route0, route1 } = bookingDistance
        // //Not support partial
        // return { "route0": route0, "route1": route1, "usePackage": false }
    }
    // End job point

    //Submit
    const submitOrderJobEntry = async (data) => {
        console.log(data)
        console.log(jobDetail)
        setLoading(true)
        if (id && (mode === "edit" || mode === "view")) {
            //validate jobExtraCharge
            let valid = true
            valid = await validateData()
            if (valid) {

                /**
                 * Calulate Price
                 */
                let resultCal = await calculateNetTotal()
                /**
                 * Over Package
                 */
                if (jobDetail.jobPackageType === "PACKAGE") {
                    let usePackage = await getDistanceOverPackage()
                    console.log(usePackage)
                    if (usePackage) {
                        jobDetail.packageId = packageCus.packageId
                        jobDetail.packageCode = packageCus.packageCode
                        jobDetail.jobPackageType = "PACKAGE"
                    } else {
                        jobDetail.packageId = ""
                        jobDetail.packageCode = ""
                        jobDetail.jobPackageType = "NORMAL"
                    }
                }
                jobDetail.adjustFee = parseFloat(jobDetail.adjustFee) ? parseFloat(jobDetail.adjustFee) : ""
                if (resultCal) {
                    const resBody = await JobService.updateJob(id, jobDetail)
                    console.log(resBody)
                    if (listFile.length > 0) {
                        listFile.forEach(ele => {
                            ele.jobId = id
                            if (ele.action && ele.action === 'add') {
                                const files = ele.file;
                                let formData = new FormData();
                                formData.append('jobId', id);
                                formData.append('attachType', "SIGN");
                                formData.append('fileName', ele.fileName);
                                formData.append('file', files);
                                formData.append('recordStatus', 'A');
                                JobService.attachfile(id, formData).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                JobService.deleteAttachfile(ele.attachId).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    const resultAll = await Promise.allSettled(jobpoint.map(async (point) => {
                        point.jobId = id
                        point.recordStatus = "A"
                        //Extra
                        console.log('jobExtraCharge', jobExtraCharge)
                        if (jobExtraCharge.length > 0) {
                            var extraCharge = jobExtraCharge.find(item => Number(item.pointSeq) == point.pointSeq)
                            console.log("extraCharge", extraCharge)
                            if (extraCharge) {
                                point.extraCharge = Number(extraCharge.extraCharge)
                                point.extraChargeType = extraCharge.extraChargeType
                                point.extraChargeTypeTxt = extraCharge.extraChargeTypeTxt
                            } else {
                                point.extraCharge = ""
                                point.extraChargeType = ""
                                point.extraChargeTypeTxt = ""
                            }
                        }

                        console.log(`Call JobService.updateJobPointDetail() ${point.jobPointId} request : `, point)
                        return JobService.updateJobPointDetail(point.jobPointId, point)
                    })).then(async (resultsArr) => {
                        console.log("listFile", listFile)

                        console.log(resultsArr)
                        NotifyService.success('Update Job Success')
                        setMode('view')
                        setLoading(false)
                        await getJobDetail();
                        await getAttach()
                        // resultsArr.forEach((resultItem) => {

                        //     let respJobPoint = resultItem.value
                        //     if (respJobPoint.resultCode !== "20000") {
                        //         throw Error(respJobPoint.resultDescription)
                        //     } else {
                        //         console.log("Create jobPoint ID : " + respJobPoint.resultData.jobPointId)
                        //     }
                        // })
                    });
                }
                setLoading(false)
            } else {
                setLoading(false)
            }

        } else {
            //Mode create job new
            let valid = true
            valid = await validateData()
            if (valid) {
                let resultCal = await calculateNetTotal()
                /**
                 * Over Package
                 */
                if (jobDetail.jobPackageType === "PACKAGE") {
                    let usePackage = await getDistanceOverPackage()
                    console.log(usePackage)
                    if (usePackage) {
                        jobDetail.packageId = packageCus.packageId
                        jobDetail.packageCode = packageCus.packageCode
                        jobDetail.jobPackageType = "PACKAGE"
                    } else {
                        jobDetail.packageId = ""
                        jobDetail.packageCode = ""
                        jobDetail.jobPackageType = "NORMAL"
                    }
                }
                jobDetail.adjustFee = parseFloat(jobDetail.adjustFee) ? parseFloat(jobDetail.adjustFee) : ""
                if (resultCal) {
                    //POST JOB
                    const resBody = await JobService.createJob(jobDetail)
                    let jobId = resBody.data.resultData.jobId
                    console.log(`Create Job ID : ${jobId}`)
                    console.log("listFile", listFile)
                    if (listFile.length > 0) {
                        listFile.forEach(ele => {
                            ele.jobId = jobId
                            if (ele.action && ele.action === 'add') {
                                const files = ele.file;
                                let formData = new FormData();
                                formData.append('jobId', jobId);
                                formData.append('attachType', "SIGN");
                                formData.append('fileName', ele.fileName);
                                formData.append('file', files);
                                formData.append('recordStatus', 'A');
                                JobService.attachfile(jobId, formData).then(res => {
                                    if (res.data.resultCode === "20000") {

                                    } else {
                                    }
                                }).finally(() => {
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else if (ele.action && ele.action === 'delete') {
                                JobService.deleteAttachfile(ele.attachId).then(res => {

                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        })
                    }
                    //POST /job-point
                    const resultAll = await Promise.allSettled(jobpoint.map(async (point) => {
                        point.jobId = jobId
                        point.userLogin = USER_ID
                        //Extra
                        if (jobExtraCharge.length > 0) {
                            var extraCharge = jobExtraCharge.find(item => Number(item.pointSeq) == point.pointSeq)
                            console.log("extraCharge", extraCharge)
                            if (extraCharge) {
                                point.extraCharge = Number(extraCharge.extraCharge)
                                point.extraChargeType = extraCharge.extraChargeType
                                point.extraChargeTypeTxt = extraCharge.extraChargeTypeTxt
                            }
                        }

                        point.recordStatus = "A"
                        console.log(`Call JobService.createJobPoint() ${point.uuid} request : ` + JSON.stringify(point))

                        return JobService.createJobPointDetail(point)
                    })).then(async (resultsArr) => {
                        console.log(resultsArr)
                        NotifyService.success('Create Job Success')
                        // router.push('/job')
                        await getJobDetail(jobId);
                        router.push('/job/detail/create-job?mode=view&id=' + jobId)
                        setLoading(false)
                        // setShowBookResult(true)

                        setMode('view')
                        // resultsArr.forEach((resultItem) => {

                        //     let respJobPoint = resultItem.value
                        //     if (respJobPoint.resultCode !== "20000") {
                        //         throw Error(respJobPoint.resultDescription)
                        //     } else {
                        //         console.log("Create jobPoint ID : " + respJobPoint.resultData.jobPointId)
                        //     }
                        // })

                    });
                    // return JobService.createJobPoint(req)
                }
                setLoading(false)
            } else {
                setLoading(false)
            }

        }
    }
    const validateData = async () => {
        let valid = true
        //Check duplicate time for driver
        if ((jobDetail.driverId !== "" && jobDetail.driverId !== null) && (jobDetail.estStartTime !== "" && jobDetail.estStartTime !== null)) {
            const respPrice = {}
            respPrice = await JobService.overLapTimeDriver(jobDetail.driverId, moment(new Date(jobDetail.shipmentDate)).format('YYYY-MM-DD'), jobDetail.estStartTime, jobDetail.estEndTime)
            if (respPrice.data.resultData.jobs.length > 0) {
                NotifyService.error(`ไม่สามารถ booking เวลานี้ได้ กรุณาเลือก start time อีกครั้ง`)
                valid = false
            }
        }
        const unique = [...new Set(jobExtraCharge.map(item => parseInt(item.pointSeq)))]; // [ 'A', 'B']
        if (unique.length != jobExtraCharge.length) {
            NotifyService.error(`สามารถเลือกบริการเสริม 1 รายการ/จุดจัดส่ง`)
            valid = false
        }

        //Check validate info jobpoint and show modal
        let err = jobpoint.map((ele, index) => {
            if (!ele.contactName || !ele.contactPhone) return { index: index, err: !ele.contactName || !ele.contactPhone } // { index: 0, err: true }
        }).filter(item => item)
        if (err.length > 0) {
            valid = false
            setIsErrorJobPoint(err)
            return
        }

        let errorMsg = []
        jobpoint.forEach(function callback(p, index) {
            const pointSeqNo = index + 1
            if (!p.fullAddress) {
                errorMsg.push(`Point ${pointSeqNo}, Full Address is required.`)
                NotifyService.error(`กรุณาระบุที่อยู่ จุด ${pointSeqNo}`)
                valid = false
            }

            if (p.lat == null || p.long == null) {
                errorMsg.push(`Point ${pointSeqNo}, Latitude & Longitude are required.`)
                valid = false
            }
        })
        return valid
    }

    const selectPackageCus = async (e) => {
        if (Object.keys(e).length > 0) {
            setPackageCus(e)
            setJobDetail(data => ({ ...data, "jobPackageType": "PACKAGE" }));
            setJobDetail(data => ({ ...data, ["customerId"]: e.customerId }));
            setJobDetail(data => ({ ...data, ["customerName"]: e.customerFullName }));
            setJobDetail(data => ({ ...data, ["packageCode"]: e.packageCode }));
            setJobDetail(data => ({ ...data, ["shipmentDate"]: e.effectiveDateFrom }));
            setValue("customerId", e.customerId, { shouldValidate: true });
            setValue("packageCode", e.packageCode, { shouldValidate: true });
            setValue("shipmentDate", moment(new Date(e.effectiveDateFrom)).format('YYYY-MM-DD'), { shouldValidate: true });

            //set default panjathaniL
            let jobPoint = jobpoint[0]
            jobPoint.lat = 13.696248694330697
            jobPoint.long = 100.53760124006553
            jobPoint.fullAddress = "อาคารปัญจธานีทาวเวอร์ ถนนรัชดาภิเษก แขวงช่องนนทรี เขตยานนาวา กทม.10120."
            jobPoint.houseNo = ""
            jobPoint.building = null
            jobPoint.subDistrict = "ช่องนนทรี"
            jobPoint.subDistrict = "ยานนาวา"
            jobPoint.subDistrict = "กรุงเทพ"
            jobPoint.subDistrict = "10120"
        }

        //Set value packageCode required when select package type
    }
    const calDuration = async (jobTypeDetail) => {
        if (Object.keys(distance).length === 0) {
            return
        }
        if (distance) {
            let duration = 0.0
            const { route0, route1 } = distance
            const jobTypeObj = jobType.find(t => t.configCode == jobTypeDetail)
            if (jobTypeObj) {
                duration += Number(route0.duration) + Number(route1.duration) + Number(jobTypeObj.configValue2)
                duration = await JobService.adjustTimeDuration(duration)
                // duration += Number(route1.duration) + Number(jobTypeObj.configValue2)
                // duration = await JobService.adjustTimeDuration(duration)
                console.log(`Total duration after adjust = ${duration} mins`)
            }
            //ไม่สนใจ extra chrge
            // console.log("Calculate Duration Job Extra Charge each Point 30 mins", jobExtraCharge)
            // if (jobExtraCharge.length > 0) {
            //     const sumTime = jobExtraCharge.reduce((accumulator, object) => {
            //         if (object.extraCharge) return accumulator + 30;
            //     }, 0);
            //     duration += sumTime
            //     console.log(`Total duration after adjust Extra Charge ${jobExtraCharge.length} Point = ${sumTime} mins, Total : ${duration}`)
            // }

            let tempDate = moment(new Date()).format("YYYY/MM/DD")
            let estStartTime = jobDetail.estStartTime ? jobDetail.estStartTime : jobDetail.bookingStartTime
            var estEndTime = moment(tempDate + " " + estStartTime, "YYYY/MM/DD HH:mm:ss")
                .add(duration, 'minutes').format("HH:mm:ss")
            console.log(`Start Time = ${estStartTime} and Est End Time = ${estEndTime}`)
            setJobDetail(data => ({
                ...data,
                ...{
                    "bookingEstDuration": duration,
                    "estEndTime": estEndTime
                }
            }));
        }
    }
    const calculateNetTotal = async (payload) => {
        // const { route0, route1 } = distance !== null ? distance : payload
        if ((distance === undefined || Object.keys(distance).length === 0) && (payload === undefined || Object.keys(payload).length === 0)) {
            return false
        } else {

            const { route0, route1 } = payload ? payload : distance
            let sumExtraCharge = 0.0
            let netTotal = 0.0
            let isPackage = true;
            /**
             * Calulate Job Extra Charge
             */
            if (jobExtraCharge.length > 0) {
                const sum = jobExtraCharge.reduce((accumulator, object) => {
                    if (object.extraCharge) return accumulator + Number(object.extraCharge);
                }, 0);

                sumExtraCharge = sum
                console.log("Sum Extra Charge : " + sumExtraCharge)
            }
            /**
            * Check Package Type
            */
            if (jobDetail.jobPackageType === "NORMAL") {
                isPackage = false
            }
            /**
             * Check status payment = PAID send distance=0 , jobPackage = PACKAGE and Status=WAITING_PAYMENT send distance=0
             */
            // && jobDetail.paymentStatus === "WAITING_PAYMENT"
            // if ((jobDetail.jobPackageType === "PACKAGE")) {
            //     isCalculatewithPackage = true
            // }
            /**
             * Check limit distance left when change job point
             */
            // if (jobDetail.distanceOld && jobDetail.distanceOld !== route1.distance) {
            //     isCalculatewithPackage = true
            // }
            const respPrice = {}
            let route0OverPackage = Object.assign({}, route0)
            let route1OverPackage = Object.assign({}, route1)
            let usePackageCal = "N"
            if (isPackage) {
                let { usePackage, origin, receive, } = await getDistanceOverPackage()
                console.log("Use Package : " + usePackage, origin, receive)
                if (usePackage) {

                    if (origin !== undefined && receive !== undefined) {
                        console.log("Use Package and OverPackage: ", origin, receive)
                        route0OverPackage.distance = origin//distanceLeft//route1.distance
                        route1OverPackage.distance = receive
                        usePackageCal = "Y"
                    } else {
                        route0OverPackage.distance = 0
                        route1OverPackage.distance = 0
                        usePackageCal = "Y"
                    }
                }
            }
            // #Calculate price 

            respPrice = await JobService.calculatePrice(jobDetail.customerId, route0OverPackage.distance, route1OverPackage.distance, sumExtraCharge, usePackageCal)
            netTotal = respPrice.data.resultData.netTotal
            if (jobDetail.adjustFee) {
                netTotal += parseFloat(jobDetail.adjustFee) ? parseFloat(jobDetail.adjustFee) : 0
            }
            console.log("Set Net Total : " + netTotal)

            let paymentStatus = jobDetail.paymentStatus
            // if (jobDetail.paymentStatus !== 'PAID') {
            if (netTotal > 0) {
                paymentStatus = "WAITING_PAYMENT"
            } else {
                paymentStatus = "PAID"
            }
            if (jobDetail.customerType === "BILL") {
                paymentStatus = "BILLING"
            }
            // }

            await calDuration(jobDetail.jobType)

            setJobDetail(data => ({
                ...data,
                ...{
                    "netTotal": netTotal,
                    "totalExtraCharge": sumExtraCharge,
                    // "bookingEstDuration": duration,
                    "startingDistance": route0.distance,
                    "distance": route1.distance,
                    "paymentStatus": paymentStatus
                }
            }));


            return true
        }

    }
    //File
    const getAttach = async () => {
        let _id = id ? id : jobId
        return await JobService.getAttach(_id).then(res => {
            if (res.data.resultCode === "20000") {
                res.data.resultData.attachs.forEach((ele, index) => {
                    ele.index = index
                })
                setListFile(res.data.resultData.attachs)
                setListFileDefault(res.data.resultData.attachs)
            } else {
                setListFile([])
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const onDeleteFile = async (e) => {
        console.log(e)
        var foundDel = listFileDefault.find((item, i) => item.attachId === e.attachId)
        console.log(foundDel)
        if (foundDel) {
            let obj = {
                attachId: foundDel.attachId, fileName: foundDel.fileName, fileSizeKb: foundDel.fileName, recordStatus: 'A', action: 'delete', filePath: foundDel.filePath
            }
            let temp = listFileDefault.filter((item, i) => item.attachId !== e.attachId)
            let arr = [...temp, obj]
            setListFileDefault(arr);
            setListFile(arr)

        } else {
            setListFile(listFile.filter((item, i) => item.index !== e.index))
        }
    }
    const handleFileChange = async (e) => {
        e.preventDefault();
        const files = e.target.files
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

    /*===================================PAYMENT======================*/
    const timer = useRef(null);
    useEffect(() => {
        console.log("jobDetail.paymentType", jobDetail.paymentType)
        if (jobDetail.paymentType === "QR" && jobDetail.paymentStatus !== "PAID") {
            timer.current = setInterval(() => reConnectpolling(chargeId), 3000);
            return () => {
                clearInterval(timer.current);
            };
        }
        // else if (jobDetail.paymentType === "QR" && jobDetail.paymentStatus === "WAITING_PAYMENT") {
        //     getConfirmCharge(jobDetail.paymentType)
        //     timer.current = setInterval(() => reConnectpolling(chargeId), 3000);
        //     return () => {
        //         clearInterval(timer.current);
        //     };
        // }
    }, [chargeId]);

    const reConnectpolling = async (event) => {
        if (!chargeId) return
        var paymentRes = ""
        const response = await PaymentService.polling(chargeId)
        if (response.status == 200) {
            const respPayload = await response.data
            const resultCode = respPayload.resultCode
            const resultData = respPayload.resultData
            const { chargeId, failureMessage, paymentId, status } = resultData.paymentStatus

            if (resultData?.paymentStatus?.status !== "pending") {
                //status === "successful"
                //status === "failed"
                if (status == "successful") {
                    setPaymentStatusTx("ชำระเงินสำเร็จเเล้ว")
                    setPaymentResult(true)
                    await getJobDetail();
                } else {
                    setPaymentStatusTx("ชำระเงินไม่สำเร็จ")
                    setPaymentResult(false)
                    setScannableCode(null)
                }
                clearInterval(timer.current);
                return Promise.resolve(paymentRes)
            }
        }
    }
    const getConfirmCharge = async (paymentType) => {
        if (paymentType === 'QR') {
            setProcessingPayment(false)
            if (scannableCode === null) {
                const amount = jobDetail.netTotal
                let res = await PaymentService.confirmCharges(jobDetail.jobId, amount)
                const respData = res.data.resultData
                console.log(`respData :`, res)
                const chargeId = respData?.chargeId
                const paymentId = respData?.paymentId
                const downloadUri = respData?.downloadUri
                setChargeId(chargeId)
                console.log(`chargeId : ${chargeId}`)
                console.log(`paymentId : ${paymentId}`)
                console.log(`downloadUri : ${downloadUri}`)
                setScannableCode(downloadUri)
            }
        }
    }
    const onChangePaymentMethod = async (event) => {
        setPaymentResult(null)
        if (event.target.value === "QR" || event.target.value !== "PAID") {
            await getConfirmCharge(event.target.value)
        }
    }
    //Submit
    const submitOrderPayment = async (data) => {
        console.log("jobDetail", jobDetail)

        const resBody = await JobService.updateJob(id, jobDetail)
        NotifyService.success('Update Payment Success')
        setModePayment('view')
        setMode('view')
        setPaymentResult(null)
        setScannableCode(null)
        setProcessingPayment(true)
        clearInterval(timer.current);
        return () => {
            console.log('ddd')
            clearInterval(timer.current);
        };
    }
    return (
        <Layout>
            <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript} />
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                {/* <Breadcrumbs title="Job Detail" breadcrumbs={breadcrumbs} /> */}
                <div className="flex flex-1 items-stretch overflow-hidden">
                    <div className='flex flex-1 justify-between border-b border-gray-200'>
                        <div className="w-full">
                            <main className="flex-1">
                                <div className="mx-auto w-full max-w-full pt-6">
                                    {(mode === "edit" || mode === "view") &&
                                        <div className="flex justify-between px-2 pl-8">
                                            {jobDetail.jobNo &&
                                                <p>Job No. :
                                                    <span className="bg-blue-100 inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-bold text-indigo-800 w-26 h-6 mr-2"
                                                    >
                                                        #{jobDetail.jobNo}
                                                    </span>
                                                </p>
                                            }
                                            <button type="button"
                                                onClick={() => setIsOpenPrintTax(true)}
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                                <PrinterIcon className="h-4 w-4 mr-2" aria-hidden="true" />PRINT TAX INV
                                            </button>
                                        </div>}

                                    {/* Tabs */}
                                    <div className="mt-3 sm:mt-2 sm:pl-6 lg:pl-8">
                                        <div className="hidden sm:block">
                                            <div className="flex items-center border-b border-gray-200">
                                                <nav className="-mb-px flex flex-1 space-x-6 xl:space-x-8" id="tabs-tab" role="tablist">
                                                    <a onClick={() => { router.push('/job') }}>
                                                        บันทึกการทำงาน
                                                    </a>
                                                    <a >
                                                        สร้างบันทึก
                                                    </a>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={openTab === 0 ? "block" : "hidden"}>
                                        {/* Form Job Detail*/}
                                        <div className="tab-content" id="tabs-tabContent">
                                            <section className={classNames((mode === 'edit' || mode === 'view') ? 'h-[calc(100vh-300px)]' : 'h-[calc(100vh-270px)]', 'w-full mt-4 pb-16 pt-0 overflow-y-auto  sm:px-6 lg:px-8')}
                                                id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
                                                <form className="space-y-4" onSubmit={handleSubmit(submitOrderJobEntry)} id='inputForm'>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 mt-4">
                                                        <>
                                                            <InputGroupDate
                                                                type="date" id="shipmentDate" name="shipmentDate" label="วัน/เดือน/ปี"
                                                                format="YYYY-MM-DD"
                                                                {...register("shipmentDate", { required: "This field is required." })}
                                                                invalid={errors.shipmentDate ? true : false}
                                                                onChange={onChange}
                                                                // onChange={(e) => { setPackageCus({ packageCode: '' }); onChange(e) }}
                                                                value={jobDetail.shipmentDate ? moment(new Date(jobDetail.shipmentDate)).format('YYYY-MM-DD') : ""}
                                                                disabled={mode === 'view' || jobDetail.jobPackageType === "PACKAGE"} required />

                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="พนักงาน"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                // options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                options={[{ name: "นวลเพ็ญ", value: 1 }, { name: "ทอมมี่(แมว)", value: 2 }, { name: "ปีโป้(นวล)", value: 3 }]}
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <td className=" whitespace-nowrap py-2 text-sm font-medium text-gray-900 lg:pl-6 pr-6"
                                                            >
                                                                <p className="ml-2">ประเภทค่าเเรง</p>
                                                                <div className="flex items-center">
                                                                    <InputRadioGroup type="radio" name="status" />
                                                                    <span className="ml-2 mr-2">รายวัน</span>
                                                                    <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                    <span className="ml-2 mr-2">เหมาจ่าย</span>
                                                                    <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                    <span className="ml-2">เหมาจ่าย</span>
                                                                </div>
                                                                {/* <div className="flex items-center">
                                                                        <InputRadioGroup type="radio" name="status" />
                                                                        <span className="ml-2">อนุมัติงาน</span>
                                                                    </div> */}
                                                            </td>
                                                          
                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="แปลงใหญ่"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="แปลงย่อย"
                                                                options={[...EST_BOOKING_FINISHTIME]}
                                                                onChange={onChange} value={jobDetail.estStartTime}
                                                                isSearchable
                                                                disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวนงาน"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="ค่าแรง"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />

                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="งาน"
                                                                {...register("customerId", { required: "This field is required." })}
                                                                options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                isSearchable
                                                                value="นวลเพ็ญ"
                                                                invalid={errors.customerId ? true : false}
                                                                disabled={mode === 'view' || mode === 'edit'} required />
                                                            <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="ผลผลิต"
                                                                options={[...EST_BOOKING_FINISHTIME]}
                                                                onChange={onChange} value={jobDetail.estStartTime}
                                                                isSearchable
                                                                disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="จำนวน OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="อัตรา OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                            <div className="block w-full">
                                                                <label htmlFor={"taxAddress"} className="block text-sm font-medium text-gray-700">
                                                                    {"Tax Address:"}
                                                                </label>
                                                                <textarea
                                                                    id="taxAddress" name="หมายเหตุ"
                                                                    rows={3}
                                                                    className="mt-1 block w-9/12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:text-gray-800 disabled:bg-gray-50"
                                                                />

                                                            </div>
                                                            <InputGroup type="text" id="trackingNo" name="trackingNo" label="รวมเงิน OT"
                                                                onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />

                                                            <div>
                                                                <td className=" border border-gray-300 whitespace-nowrap py-2 text-sm font-medium text-gray-900 lg:pl-6 pr-6">
                                                                    <p className="ml-2">สถานะงาน</p>
                                                                    <div className="flex items-center">
                                                                        <InputRadioGroup type="radio" name="status" />
                                                                        <span className="ml-2 mr-2">รอการอนุมัติ</span>
                                                                        <InputRadioGroup type="radio" name="status" className="ml-2" />
                                                                        <span className="ml-2">อนุมัติงาน</span>
                                                                    </div>
                                                                    {/* <div className="flex items-center">
                                                                        <InputRadioGroup type="radio" name="status" />
                                                                        <span className="ml-2">อนุมัติงาน</span>
                                                                    </div> */}
                                                                </td>


                                                            </div>
                                                        </>

                                                    </div>

                                                    <div className="grid grid-cols-12 md:grid-cols-10 lg:grid-cols-10 gap-4 mb-4">
                                                        เบิกสินค้าคลัง
                                                        <InputRadioGroup
                                                            type={"checkbox"}
                                                            name="status"
                                                        />
                                                    </div>

                                                </form>

                                            </section>
                                        </div>
                                        <footer className="flex items-center justify-center sm:px-6 lg:px-8 sm:py-4 lg:py-4 bg-gray-100">
                                            <div className="flex justify-center items-center overflow-y-auto p-4" >
                                                <button type="button"
                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-gray-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                                // onClick={handleReset}
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button type="button"
                                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1 pb-1.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                // onClick={handleSearch}
                                                >
                                                    บันทึก
                                                </button>
                                            </div>

                                        </footer>
                                    </div>

                                </div>

                            </main>
                        </div>
                    </div>

                </div >
            </LoadingOverlay >
        </Layout >
    )
}
