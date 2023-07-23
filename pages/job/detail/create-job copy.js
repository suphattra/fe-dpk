import React, { Fragment, StrictMode, useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Layout from "../../../layouts";
import { PencilIcon, PencilSquareIcon, PlusIcon, PlusIcon as PlusIconMini, PrinterIcon, Squares2X2Icon as Squares2X2IconMini } from '@heroicons/react/20/solid'
import { InputGroup, InputRadioGroup, InputSelectGroup } from "../../../components";
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
        shipmentDate: moment(new Date).format('YYYY-MM-DD'),
        cancelledDate: '',
        estStartTime: '00:00',
        estEndTime: '23:00',
        actualDate: '',
        actualStartTime: '09:00',
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
const breadcrumbs = [{ index: 1, href: '/job', name: 'job' }, { index: 2, href: '/job/detail/create-job', name: 'detail' }]
function reducer(state, action) {
    if (action.type === 'CAL_PRICE') {
        return {
            age: state.age + 1
        };
    }
    throw Error('Unknown action.');
}
export default function CreateJob() {

    let USER_ID = ""
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const id = router.query["id"];
    const [mode, setMode] = useState(router.query["mode"])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [jobDetail, setJobDetail] = useState(initial.jobDetail)
    const [jobTypeTemp, setJobTypeTemp] = useState("");

    const [openTab, setOpenTab] = useState(0);

    const [jobpoint, setJobpoint] = useState([{ pointSeq: 1, fullAddress: '', lat: "", long: "" }, { pointSeq: 2, fullAddress: '', lat: "", long: "" }])
    const [jobExtraCharge, setJobExtraCharge] = useState([])
    const [errAddOnService, setErrAddOnService] = useState(null)
    const [sumExtraCharge, setSumExtraCharge] = useState(0.0)
    //Master
    const [jobType, setJobType] = useState([])
    const [jobDesc, setJobDesc] = useState([])
    const [jobPackageType, setJobPackageType] = useState([])
    const [jobStatus, setJobStatus] = useState([])
    const [paymentType, setPayment] = useState([])
    const [customerType, setCustomerType] = useState([])
    const [paymentStatus, setPaymentStatus] = useState([])
    const [driverList, setDriverList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [extraCharge, setExtraCharge] = useState([])
    //End Master



    const [packageCus, setPackageCus] = useState({ packageCode: '' })

    //Payment
    const [scannableCode, setScannableCode] = useState(null)
    const googlemapRef = useRef(null);
    const [omise, setOmise] = useState()
    const [paymentResult, setPaymentResult] = useState(null)
    //Map
    const [myMap, setMyMap] = useState()
    //Distance
    const [distance, setDistance] = useState(null)
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    useEffect(() => {
        setLoading(true)
        console.log(mode)
        USER_ID = authService.getUserId()
        setValue('shipmentDate', jobDetail.shipmentDate)
        setValue('status', jobDetail.status)
        setValue('jobType', jobDetail.jobType)
        setJobTypeTemp(jobDetail.jobType)
        async function fetchData() {
            await getConfig('PAYMENT_TYPE')
            await getConfig('JOB_PACKAGE_TYPE')
            await getConfig('JOB_TYPE')
            await getConfig('JOB_DESC')
            await getConfig('JOB_STATUS')
            await getConfig('PAYMENT_STATUS')
            await getConfig('CUSTOMER_TYPE')
            await getConfig('EXTRA_CHARGE_TYPE')
            await getDriverList()
            await getCustomerList()
            setLoading(false)
            if (mode === "edit" || mode === "view") {
                await getJobDetail();
            }
        }
        fetchData();

        // Load Map
        const loader = new Loader({
            apiKey: "AIzaSyAZwkIoSUWsWQwXOSvZ1JZTeYFC3pP2bWk",
            version: 'weekly',
            language: "th",
            libraries: ["places"]
        });
        let map;

        loader.load().then(async () => {
            const google = window.google;
            map = new google.maps.Map(googlemapRef.current, {
                center: { lat: 13.7970244, lng: 100.5519849 },
                zoom: 15,
                mapTypeId: "roadmap",
                streetViewControl: false,
            });
            setMyMap(map)
            MapService.setMap(map)
        });
    }, []);

    useEffect(() => {
        if (jobType == null) return

        console.log("jobType state changes. ", jobType)
    }, [jobType]) // Only re-subscribe if myMap changes
    // useEffect(() => {
    //     if (sumExtraCharge == null) return
    //     console.log("jobTypeTemp state changes. ", sumExtraCharge)
    // }, [sumExtraCharge]) // Only re-subscribe if jobDetail changes
    useEffect(() => {
        if (jobDetail && jobDetail === undefined) {
            console.log('ssssssssssss')
            return
        } else {
            console.log('dddddddddddddddddd')
            // calculateNetTotal()// This will always use latest value of count
        }

    }, [jobDetail]);
    useEffect(() => {
        console.log('useEffect jobExtraCharge', jobExtraCharge)
        // if (jobExtraCharge.length > 0) {
        calculateNetTotal()
        // }

    }, [jobExtraCharge]);

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
    const getDriverList = async () => {
        let param = {
            limit: 10000,
            offset: 1
        }
        await DriverService.getDriverList(param)
            .then(res => {
                setDriverList(res.data.resultData.drivers)
            })
    }
    const getCustomerList = async () => {
        let param = {
            limit: 10000,
            offset: 1
        }
        await CustomerService.getCustomerList(param)
            .then(res => {
                setCustomerList(res.data.resultData.customers)
            })
    }
    const getJobDetail = async () => {
        setLoading(true)
        await JobService.getJobDetail(id).then(async res => {
            if (res.data.resultCode === "20000") {
                // await getPackageCustomer(res.data.resultData.job.customerId)

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
                let extraCharge = res.data.resultData.job.jobPoint

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
        setValue(evt.target.name, evt.target.value, { shouldValidate: true });
        if (name === "jobType") {
            setJobTypeTemp(value)
            calDuration(value)
            /**
                      * Calulate Price
                      */
            // calculateNetTotal()
        }
    };
    const getPackageCustomer = async (id) => {
        await CustomerService.getCustomerCustomer(id, id)
            .then(res => {
                console.log(res.data.resultData.customerPackage)
                setPackageCus(res.data.resultData.customerPackage)
            })
    }
    // Add Extra Charge
    const insertAddOnService = async () => {
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
        // if (newData) {
        //     const sum = newData.reduce((accumulator, object) => {
        //         if (object.extraCharge) return accumulator + Number(object.extraCharge);
        //     }, 0);

        //     // sumExtraCharge = sum
        //     setSumExtraCharge(sum)
        // }
        setJobExtraCharge((jobExtraCharge) => [...jobExtraCharge, newService]);
        // await calculateNetTotal()
        // setJobExtraCharge(newData)
        // setTimeout(() => {
        //     calculateNetTotal()
        // }, 1000);

    }
    const deleteAddOnService = async (rowIndex) => {
        console.log("rowIndex", rowIndex)
        let newData = jobExtraCharge.filter((_, i) => i !== rowIndex)//jobExtraCharge.splice(rowIndex, 1)
        console.log("newData", newData)
        setJobExtraCharge(newData)
        /**
           * Calulate Price
           */
        // if (newData) {
        //     const sum = newData.reduce((accumulator, object) => {
        //         if (object.extraCharge) return accumulator + Number(object.extraCharge);
        //     }, 0);

        //     // sumExtraCharge = sum
        //     setSumExtraCharge(sum)
        // }
        // setTimeout(() => {
        //     calculateNetTotal()
        // }, 1000);

    }
    const callbackValueOnChangePointExtra = async (e) => {
        console.log(e)
        setJobExtraCharge(e)
        /**
         * Calulate Price
         */
        // let sumExtraCharge = 0.0
        // console.log("calculateNetTotal jobExtraCharge", e)
        // if (e) {
        //     const sum = e.reduce((accumulator, object) => {
        //         if (object.extraCharge) return accumulator + Number(object.extraCharge);
        //     }, 0);

        //     // sumExtraCharge = sum
        //     setSumExtraCharge(sum)
        // }
        // setTimeout(() => {
        //     calculateNetTotal()
        // }, 3000);
        // await calculateNetTotal()
    }
    // End Extra Charge

    // Add job point
    const callbackValueJobPoint = async (e) => {
        setJobpoint(e)
        try {
            if (jobpoint.length != 2) return

            for (var i = 0; i < jobpoint.length; i++) {
                const p = jobpoint[i]
                if (!p.lat || !p.long) {
                    return
                }
            }
            setMapPoint(jobpoint)
            // const requestRouteInit = await JobService.getDirectionRequestInitialCharge(jobpoint)
            // const statInitRoute = await MapService.getDirectionAsyncInitCharge(requestRouteInit)

            // const requestRoute = await JobService.getDirectionRequestForGoogleMap(jobpoint)
            // const statRequestRoute = await MapService.getDirectionAsync(requestRoute)
            // console.log(`Initial distance : ${statInitRoute.distance} km.`)
            // console.log(`Initial duration : ${statInitRoute.duration} minutes`)
            // console.log(`Request distance : ${statRequestRoute.distance} km.`)
            // console.log(`Request duration : ${statRequestRoute.duration} minutes`)
            // const payload = {
            //     "route0": statInitRoute,
            //     "route1": statRequestRoute,
            // }
            // setDistance(payload)
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
            /**
            * Calulate Price
            */
            await calculateNetTotal(payload)
            /**
            * OverPackage
            */
            // let initOverPackage = Object.assign({}, statInitRoute)
            // let bookOverPackage = Object.assign({}, statRequestRoute)
            // try {
            //     const { route0, route1, usePackage } = getDistanceOverPackage()

            //     if (usePackage) {
            //         r.packageId = profilePackage.packageId //jobInfo.packageCode
            //     }

            //     r.jobPackageType = (r.packageId != null ? "PACKAGE" : "NORMAL")

            //     // #Calculate price
            //     const respPrice = await JobService.calculatePrice(session.userId, route0.distance, route1.distance, extraCharge)
            //     bookingDispatch({ type: "SET_PRICE", payload: respPrice })
            //     netTotal = respPrice.resultData.netTotal
            //     console.log("Set Net Total : " + netTotal)
            // } catch (error) {
            //     console.error(error)
            //     NotifyService.error(`${error.code} ${error.message}`)
            //     return
            // }
        } catch (err) {
            console.log(err)
            // NotifyService.error(`${error.code} ${error.message}`)
        }
    }

    const getDistanceOverPackage = () => {
        try {
            const { route0, route1 } = bookingDistance
            let initOverPackage = Object.assign({}, route0)
            let bookOverPackage = Object.assign({}, route1)

            if (profile.package != null) {
                console.log(`Profile.package : ${JSON.stringify(profile.package)}`)

                const packageInfo = profile.package

                //Check distance
                if (packageInfo.distanceLimit) {

                    const burnPackageFlag = ((packageInfo.distanceLeft - route0.distance - route1.distance) >= 0)
                    if (burnPackageFlag) {
                        initOverPackage.distance = 0
                        bookOverPackage.distance = 0

                        const payload = {
                            packageWarning: null
                        }

                        bookingDispatch({ type: "SET_PACAKGE_WARNING", payload: payload })

                    } else {

                        const payload = {
                            packageWarning: `เกินระยะทาง ${packageInfo.distanceLeft} กิโลเมตร`
                        }

                        bookingDispatch({ type: "SET_PACAKGE_WARNING", payload: payload })

                        //Not support partial
                        throw Error("Not support partial.")
                    }
                }

                return { "route0": initOverPackage, "route1": bookOverPackage, "usePackage": true }

            } else {
                return { "route0": initOverPackage, "route1": bookOverPackage, "usePackage": false }
            }

        } catch (error) {
            console.error(error)
            NotifyService.error(`${error.message}`)

        } finally {

        }

        const { route0, route1 } = bookingDistance
        //Not support partial
        return { "route0": route0, "route1": route1, "usePackage": false }
    }
    // End job point

    const onChangePaymentMethod = async (event) => {
        console.log(event.target.value)
        if (event.target.value === "QR") {
            if (scannableCode == null) {
                const amount = jobDetail.netTotal
                let res = await PaymentService.confirmCharges(jobDetail.jobId, amount)
                const respData = res.data.resultData
                console.log(`respData :`, res)
                const chargeId = respData?.chargeId
                const paymentId = respData?.paymentId
                const downloadUri = respData?.downloadUri

                console.log(`chargeId : ${chargeId}`)
                console.log(`paymentId : ${paymentId}`)
                console.log(`downloadUri : ${downloadUri}`)

                setScannableCode(downloadUri)

                const result = await PaymentService.polling(chargeId)
                const paymentResult = await PaymentService.getPaymentResult()
                console.log("PaymentService.getPaymentResult() : " + JSON.stringify(paymentResult))

                if (paymentResult == "successful") {
                    setPaymentResult(true)
                } else {
                    setPaymentResult(false)
                }
            }
        }
    }

    //Submit
    const submitOrderJobEntry = async () => {
        console.log(jobDetail)
        setLoading(true)
        if (id) {
            //validate jobExtraCharge
            let valid = true
            valid = await validateData()
            if (valid) {
                /**
                 * Calulate Price
                 */
                let resultCal = await calculateNetTotal()
                if (resultCal) {
                    const resBody = await JobService.updateJob(id, jobDetail)
                    console.log(resBody)
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
                            }
                        }
                        console.log(`Call JobService.updateJobPointDetail() ${point.jobPointId} request : `, point)
                        return JobService.updateJobPointDetail(point.jobPointId, point)
                    })).then((resultsArr) => {
                        console.log(resultsArr)
                        NotifyService.success('Update Job Success')
                        setMode('view')
                        setLoading(false)
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
            }

        } else {
            //Mode create job new
            let valid = true
            valid = await validateData()
            if (valid) {
                let resultCal = await calculateNetTotal()
                if (resultCal) {
                    //POST JOB
                    const resBody = await JobService.createJob(jobDetail)
                    let jobId = resBody.data.resultData.jobId
                    console.log(`Create Job ID : ${jobId}`)
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
                        router.push('/job')
                        setLoading(false)
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
            }

        }
    }
    const validateData = async () => {
        let valid = true
        const unique = [...new Set(jobExtraCharge.map(item => parseInt(item.pointSeq)))]; // [ 'A', 'B']
        if (unique.length != jobExtraCharge.length) {
            NotifyService.error(`สามารถเลือกบริการเสริม 1 รายการ/จุดจัดส่ง`)
            valid = false
        }

        let errorMsg = []
        jobpoint.forEach(function callback(p, index) {
            const pointSeqNo = index + 1
            if (!p.fullAddress) {
                errorMsg.push(`Point ${pointSeqNo}, Full Address is required.`)
                NotifyService.error(`กรุณาระบุที่อยู่ จุด ${pointSeqNo}`)
                valid = false
            }

            if (!p.contactName) {
                errorMsg.push(`Point ${pointSeqNo}, Contact name is required.`)
                NotifyService.error(`กรุณาระบุชื่อผู้ติดต่อ จุด ${pointSeqNo}`)
                valid = false
            }

            if (!p.contactPhone) {
                errorMsg.push(`Point ${pointSeqNo}, Contact phone is required.`)
                NotifyService.error(`กรุณาระบุเบอร์ผู้ติดต่อ จุด ${pointSeqNo}`)
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
        setPackageCus(e)
        setJobDetail(data => ({ ...data, "jobPackageType": "PACKAGE" }));
    }
    const calDuration = async (jobTypeDetail) => {

        if (distance) {
            let duration = 0.0
            const { route0, route1 } = distance
            const jobTypeObj = jobType.find(t => t.configCode == jobTypeDetail)
            // console.log("jobType", jobType)
            // console.log("jobTypeDetail", jobTypeDetail)
            // console.log("jobTypeObj", jobTypeObj)
            if (jobTypeObj) {
                duration += Number(route0.duration) + Number(jobTypeObj.configValue2)
                duration = await JobService.adjustTimeDuration(duration)
                duration += Number(route1.duration) + Number(jobTypeObj.configValue2)
                duration = await JobService.adjustTimeDuration(duration)
                console.log(`Total duration after adjust = ${duration}`)
            }
            setJobDetail(data => ({
                ...data,
                ...{
                    "bookingEstDuration": duration
                }
            }));
        }
        //  else {
        //     setJobDetail(data => ({
        //         ...data,
        //         ...{
        //             "bookingEstDuration": duration
        //         }
        //     }));
        // }
    }
    async function calculateNetTotal(payload) {
        const { route0, route1 } = distance !== null ? distance : payload
        let sumExtraCharge = 0.0
        let netTotal = 0.0
        // #Find Extra Charge
        console.log("calculateNetTotal jobExtraCharge", jobExtraCharge)
        if (jobExtraCharge.length > 0) {
            const sum = jobExtraCharge.reduce((accumulator, object) => {
                if (object.extraCharge) return accumulator + Number(object.extraCharge);
            }, 0);

            sumExtraCharge = sum
        }
        // #Calculate price 
        const respPrice = await JobService.calculatePrice(jobDetail.customerId, route0.distance, route1.distance, sumExtraCharge)

        netTotal = respPrice.data.resultData.netTotal
        console.log("Set Net Total : " + netTotal)
        console.log("sumExtraCharge : " + sumExtraCharge)
        setJobDetail(data => ({
            ...data,
            ...{
                "netTotal": netTotal,
                "totalExtraCharge": sumExtraCharge,
                // "bookingEstDuration": duration,
                "startingDistance": route0.distance,
                "distance": route1.distance
            }
        }));
        calDuration(jobDetail.jobType)
        return true

        // setJobDetail(data => ({ ...data, "totalExtraCharge": sumExtraCharge }));
        // setJobDetail(data => ({ ...data, "bookingEstDuration": duration }));
        // setJobDetail(data => ({ ...data, "startingDistance": route0.distance }));
        // setJobDetail(data => ({ ...data, "distance": route1.distance }));
        // return false
    }
    return (
        <Layout>
            <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript} />
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{ overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }) }}>
                <Breadcrumbs title="Job Detail" breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 items-stretch overflow-hidden">
                    <div className='flex flex-1 justify-between border-b border-gray-200'>
                        <div className="w-full">
                            <main className="flex-1">
                                <div className="mx-auto w-full max-w-full pt-6">
                                    <div className="flex justify-end px-2">
                                        <button type="button"
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                            <PrinterIcon className="h-4 w-4 mr-2" aria-hidden="true" />PRINT TAX INV
                                        </button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="mt-3 sm:mt-2 sm:pl-6 lg:pl-8">
                                        <div className="hidden sm:block">
                                            <div className="flex items-center border-b border-gray-200">
                                                <nav className="-mb-px flex flex-1 space-x-6 xl:space-x-8" id="tabs-tab" role="tablist">
                                                    <a onClick={() => setOpenTab(0)} key={0}
                                                        className={classNames(
                                                            openTab === 0
                                                                ? 'border-indigo-500 text-indigo-600'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                            'whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm cursor-pointer'
                                                        )}>
                                                        Job Detail
                                                    </a>
                                                    {mode === "edit" || mode === "view" && <a onClick={() => setOpenTab(1)} key={1}
                                                        className={classNames(
                                                            openTab === 1
                                                                ? 'border-indigo-500 text-indigo-600'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                            'whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm cursor-pointer'
                                                        )}>
                                                        Payment
                                                    </a>}
                                                </nav>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={openTab === 0 ? "block" : "hidden"}>
                                        {/* Form Job Detail*/}
                                        <div className="tab-content" id="tabs-tabContent">

                                            <section className="w-full mt-4 pb-16 pt-0 overflow-y-auto h-[calc(100vh-300px)] sm:px-6 lg:px-8" id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
                                                <form className="space-y-4" onSubmit={handleSubmit(submitOrderJobEntry)} id='inputForm'>
                                                    <div className="flex justify-end">
                                                        {mode === 'view' && <button type="button"
                                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                            onClick={() => setMode('edit')}>
                                                            <PencilSquareIcon className="h-4 w-4 mr-2" aria-hidden="true" />EDIT
                                                        </button>}
                                                        {mode === 'edit' && <button type="button"
                                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                            onClick={() => setMode('view')}>
                                                            <XCircleIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />CANCEL
                                                        </button>}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <Lookup type="text" id="packageCode" name="packageCode" label="Package Code"
                                                            onChange={(e) => { selectPackageCus(e) }}
                                                            value={packageCus.packageCode}
                                                            disabled={mode === 'view'}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4 mt-4">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Customer Type:
                                                        </label>
                                                        {customerType.map((item, index) => (
                                                            <InputRadioGroup key={index} classes="h-4 w-4" type={"radio"}
                                                                id={item.configCode} name="customerType" label={item.configValue}
                                                                onChange={onChange} value={jobDetail.customerType}
                                                                disabled={mode === 'view'}
                                                                checked={item.configCode === jobDetail.customerType ? true : false} />
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4 mt-4">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Package Type:
                                                        </label>
                                                        {jobPackageType.map((item, index) => (
                                                            <InputRadioGroup key={index} classes="h-4 w-4" type={"radio"}
                                                                id={item.configCode} name="jobPackageType" label={item.configValue}
                                                                onChange={(e) => { setPackageCus({ packageCode: '' }); onChange(e) }} value={jobDetail.jobPackageType}
                                                                disabled={mode === 'view'}
                                                                checked={item.configCode === jobDetail.jobPackageType ? true : false} />
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputGroup type="text" id="trackingNo" name="trackingNo" label="tracking #"
                                                            onChange={onChange} value={jobDetail.trackingNo} disabled={mode === 'view'} />
                                                        <InputGroup type="date" id="shipmentDate" name="shipmentDate" label="Shipment Date"
                                                            {...register("shipmentDate", { required: "This field is required." })}
                                                            invalid={errors.shipmentDate ? true : false}
                                                            onChange={onChange}
                                                            value={jobDetail.shipmentDate ? moment(jobDetail.shipmentDate).format('YYYY-MM-DD') : ""} disabled={mode === 'view'} required />
                                                        {/* 
                                                        <Select
                                                            // className="flex-1 w-fit mt-1 block w-full rounded-md border-gray-300 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                            // inputRef={ref}
                                                            // value={masterConfig.BOOKING_STARTTIME.filter(c => value == c.value)}
                                                            onChange={valObj => {
                                                                onChange(valObj.value)
                                                            }}
                                                            disabled={mode === 'view'}
                                                            options={[...BOOKING_STARTTIME]}
                                                            // isOptionDisabled={(option) => option.isdisabled} // disable an option
                                                        /> */}

                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputSelectGroup type="text" id="bookingStartTime" name="bookingStartTime" label="Booking Start Time:"
                                                            {...register("bookingStartTime", { required: "This field is required." })}
                                                            options={[...BOOKING_STARTTIME]}
                                                            onChange={onChange} value={jobDetail.bookingStartTime}
                                                            invalid={errors.bookingStartTime ? true : false}
                                                            disabled={mode === 'view'} required />
                                                        <InputSelectGroup type="text" id="bookingEndTime" name="bookingEndTime" label="Booking End Time:"
                                                            {...register("bookingEndTime", { required: "This field is required." })}
                                                            options={[...BOOKING_FINISHTIME]}
                                                            onChange={onChange} value={jobDetail.bookingEndTime}
                                                            invalid={errors.bookingEndTime ? true : false}
                                                            disabled={mode === 'view'} required />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="Start Time:"
                                                            options={[...BOOKING_STARTTIME]}
                                                            onChange={onChange} value={jobDetail.estStartTime}
                                                            disabled={mode === 'view'} />
                                                        <InputGroup type="text" id="bookingEstDuration" name="bookingEstDuration" label="Estimate End Time:"
                                                            options={[...BOOKING_FINISHTIME]}
                                                            onChange={onChange} value={jobDetail.bookingEstDuration}
                                                            disabled={mode === 'view'} />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputSelectGroup type="text" id="estStartTime" name="estStartTime" label="Actual Start Time:"
                                                            options={[...BOOKING_STARTTIME]}
                                                            onChange={onChange} value={jobDetail.estStartTime}
                                                            disabled={mode === 'view'} />
                                                        <InputSelectGroup type="text" id="estEndTime" name="estEndTime" label="Actual End Time:"
                                                            options={[...BOOKING_FINISHTIME]}
                                                            onChange={onChange} value={jobDetail.estEndTime}
                                                            disabled={mode === 'view'} />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <InputSelectGroup type="select" id="jobType" name="jobType" label="Job Type"
                                                                {...register("jobType", { required: "This field is required." })}
                                                                options={renderConfigOptions(jobType)}
                                                                onChange={onChange}
                                                                invalid={errors.jobType ? true : false}
                                                                value={jobDetail.jobType}
                                                                disabled={mode === 'view'} required />
                                                            {/* {errors.jobType && <span className="text-sm tracking-tight text-red-800">This field is required</span>} */}
                                                        </div>
                                                        <InputSelectGroup type="select" id="jobDesc" name="jobDesc" label="Job Description"
                                                            {...register("jobDesc", { required: "This field is required." })}
                                                            options={renderConfigOptions(jobDesc)}
                                                            onChange={onChange}
                                                            value={jobDetail.jobDesc}
                                                            invalid={errors.jobDesc ? true : false}
                                                            disabled={mode === 'view'} required />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputSelectGroup type="text" id="driverId" name="driverId" label="Driver"
                                                            options={renderOptions(driverList, "fullName", "driverId")}
                                                            onChange={onChange}
                                                            value={jobDetail.driverId}
                                                            disabled={mode === 'view'} />
                                                        {jobDetail.jobPackageType === "PACKAGE" &&
                                                            <InputGroup type="text" id="customerId" name="customerId" label="Sender"
                                                                value={packageCus.customerFullName}
                                                                disabled />}
                                                        {jobDetail.jobPackageType === "NORMAL" &&
                                                            <InputSelectGroup type="text" id="customerId" name="customerId" label="Sender"
                                                                options={renderOptions(customerList, "fullName", "customerId")}
                                                                onChange={onChange}
                                                                value={jobDetail.customerId}
                                                                disabled={mode === 'view'} />}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputSelectGroup type="text" id="status" name="status" label="Status"
                                                            options={renderOptions(jobStatus, "configValue", "configCode")}
                                                            {...register("status", { required: "This field is required." })}
                                                            onChange={onChange}
                                                            value={jobDetail.status}
                                                            invalid={errors.status ? true : false}

                                                            disabled={mode === 'view'} required />
                                                        <InputSelectGroup type="select" id="statusDetail" name="statusDetail" label="Status Detail"
                                                            options={renderOptions(jobStatus, "configValue2", "configCode")}
                                                            onChange={onChange} value={jobDetail.status}
                                                            disabled />
                                                    </div>
                                                    {/* {jobDetail.status === 'CANCEL' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                        <InputGroup type="date" id="cancelledDate" name="cancelledDate" label="Cancelled Date"
                                                            {...register("cancelledDate", { required: "This field is required." })}
                                                            invalid={errors.cancelledDate ? true : false}
                                                            onChange={onChange}
                                                            value={jobDetail.cancelledDate} disabled={mode === 'view'} required />
                                                    </div>} */}
                                                    <JobPoint jobpoint={jobpoint}
                                                        disabled={mode === 'view'}
                                                        callbackValue={callbackValueJobPoint}
                                                        jobDetail={jobDetail} />
                                                    <JobExtraCharge
                                                        jobExtraCharge={jobExtraCharge}
                                                        extraCharge={extraCharge}
                                                        jobDetail={jobDetail}
                                                        deleteAddOnService={deleteAddOnService}
                                                        callbackValueOnChangePointExtra={callbackValueOnChangePointExtra}
                                                        disabled={mode === 'view'} />
                                                    {/* <div className="relative">
                                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                            <div className="w-full border-t border-gray-300" />
                                                        </div>
                                                        <div className="relative flex justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => { setOpen(true) }}
                                                                className="inline-flex items-center rounded-full border border-gray-300 bg-purple-600 px-4 py-1.5 text-sm font-medium leading-5 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                            >
                                                                <PlusIcon className="-ml-1.5 mr-1 h-5 w-5 text-white" aria-hidden="true" />
                                                                <span> ADD DESTINATION</span>
                                                            </button>
                                                        </div>
                                                    </div> */}
                                                    <div className="flex justify-start mb-4">
                                                        <button type="button"
                                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-indigo-800 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-90"
                                                            disabled={mode === 'view' || jobDetail.paymentStatus === 'PAID'}
                                                            onClick={insertAddOnService} >
                                                            <PlusCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />Add Extra Charge
                                                        </button>

                                                    </div>
                                                    {errAddOnService && <span className="text-sm font-medium tracking-tight text-red-800">{errAddOnService}</span>}
                                                </form>
                                            </section>
                                        </div>
                                        <footer className="flex items-center justify-end sm:px-6 lg:px-8 sm:py-4 lg:py-4 bg-gray-100">
                                            <button type="submit"
                                                form="inputForm"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            // onClick={() => submitOrderJobEntry()}
                                            >
                                                SAVE
                                            </button>
                                            <h5 className="px-2">${jobDetail.netTotal}</h5>
                                        </footer>
                                    </div>
                                    <div className={openTab === 1 ? "block" : "hidden"}>
                                        {/* Form Payment*/}
                                        <div className="tab-content" id="tabs-tabContent">
                                            <section className="w-full mt-4 pb-16 pt-2 overflow-y-auto h-[calc(100vh-300px)] sm:px-6 lg:px-8" id="tabs-home" role="tabpanel" aria-labelledby="tabs-home-tab">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                    <InputSelectGroup type="select" id="paymentType" name="paymentType" label="Payment Type"
                                                        options={renderConfigOptions(paymentType)}
                                                        onChange={(e) => { onChange(e); onChangePaymentMethod(e) }}
                                                        value={jobDetail.paymentType} />
                                                    <InputSelectGroup type="select" id="paymentStatus" name="paymentStatus" label="Status Payment"
                                                        options={renderConfigOptions(paymentStatus)}
                                                        onChange={onChange} value={jobDetail.paymentStatus} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                    <div className="mt-4">
                                                        <span className="block text-left text-lg font-semibold text-indigo-600 mb-4">รายละเอียดค่าบริการ</span>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                            <p className="text-sm leading-8 text-gray-500">ราคาระยะทาง( {jobDetail.distance} Km.)</p>
                                                            <p className="text-sm leading-8 text-gray-500">{jobDetail.netTotal - jobDetail.totalExtraCharge}</p>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                                                            <p className="text-sm leading-8 text-gray-500">บริการเสริม</p>
                                                            <p className="text-sm leading-8 text-gray-500">{(jobDetail.totalExtraCharge)} </p>
                                                        </div>
                                                        <span className="block text-left text-sm font-semibold text-red-600 mb-4">หมายเหตุ: ไม่รวมค่าธรรมเนียมอื่นๆ เช่น ค่าที่จอดรถ</span>
                                                    </div>
                                                    <div className="px-10 py-5 min-h-80 min-h-full text-center">
                                                        {jobDetail.paymentType == "QR" && scannableCode &&
                                                            <>
                                                                <center>
                                                                    {scannableCode &&
                                                                        <img src={scannableCode} alt="React Logo" className="max-h-80" />
                                                                    }
                                                                </center>
                                                            </>
                                                        }
                                                        <h5 className="text-gray-900 text-xl font-medium mb-2">จำนวนเงินที่ต้องชำระ (บาท)</h5>
                                                        <span className="block text-center text-6xl font-bold leading-8 text-indigo-600 mt-4">฿{jobDetail.netTotal}</span>
                                                    </div>
                                                    <div className="m-auto">

                                                    </div>
                                                </div>

                                            </section>
                                        </div>
                                        <footer className="flex items-center justify-end sm:px-6 lg:px-8 sm:py-4 lg:py-4 bg-gray-100">
                                            <button type="submit"
                                                form="inputFormPayment"
                                                className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            // onClick={() => onsave()}
                                            >
                                                SAVE
                                            </button>
                                            <h5 className="px-2">฿{jobDetail.netTotal}</h5>
                                        </footer>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="relative w-0 flex-1 lg:block text-center">
                        {/* <div className="col-span-6 lg:col-span-3">
                            <div id="map" ref={googlemapRef} className="h-[calc(100vh-100px)] w-full">
                                Google Map
                            </div>
                        </div> */}
                        <div id="map" ref={googlemapRef} className="h-[calc(100vh-100px)] w-full">
                            Google Map
                        </div>
                    </div>
                </div >
            </LoadingOverlay>
        </Layout >
    )
}