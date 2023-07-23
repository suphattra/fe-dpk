import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowUturnUpIcon, Bars3Icon, CakeIcon, CalculatorIcon, CheckIcon, ChevronRightIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon, CreditCardIcon, CubeIcon, DeviceTabletIcon, FolderMinusIcon, FunnelIcon, IdentificationIcon, LockClosedIcon, LockOpenIcon, NewspaperIcon, TicketIcon, WalletIcon } from '@heroicons/react/20/solid';
import { createRef, Fragment, useEffect, useMemo, useState } from 'react';
import { CardBasic, InputGroup, InputGroupDate } from '../../components';
// import Draggable from "react-draggable";
// import moment from 'moment'
import moment from 'moment-timezone';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TimelineMarkers, TodayMarker, CustomMarker, CursorMarker } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import { JobService } from '../api/job.service';
import { convertFilter, isEmpty } from '../../helpers/utils';
import { DriverService } from '../api/driver.service';
// import keys from '../../helpers/keys';
import { verticalLineClassNamesForTime } from '../../components/drag-drop/verticalLineClassNamesForTime';
import Draggable from '../../components/drag-drop/Draggable';
import ModalJobDetailPopUp from '../../components/drag-drop/ModalJobDetailPopUp';
import ModalUassignJob from '../../components/drag-drop/ModalUassignJob';
import { Tooltip } from '../../components/Tooltip';
import LoadingOverlay from "react-loading-overlay";
import { NotifyService } from '../api/notify.service';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowPathIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
LoadingOverlay.propTypes = undefined
const initial = {
    search: {
        shipmentDate: moment(new Date()).format("YYYY/MM/DD"),
        limit: 10000,
        offset: 1
    },
    jobList: []
}

export default function RiderManagementSchedule() {
    const [selectDate, setSelectDate] = useState(new Date())
    const [items, setItems] = useState([])
    const [itemsJobUnassign, setItemsJobUnassign] = useState([])
    const [itemsJobCancel, setItemsJobCancel] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [isLoading, setIsLoading] = useState(false)
    const [isDisableRecal, setIsDisableRecal] = useState(false)//return true/false
    const [selectItems, setSelectItems] = useState({})
    const [selectItemsUnassign, setSelectItemsUnassign] = useState({})
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [showModalUnassignJob, setModalUnassignJob] = useState(false)
    const [openConfirmRecal, setOpenConfirmRecal] = useState(false)
    const [timeSlot, setTimeSlot] = useState([])
    const onSetJobDetailModal = (value) => {
        setShowJobDetailForm(value)
    }
    const callBackToDashboard = async (value) => {
        await getJobList(searchParam);
    }
    const [scrollRef, setScrollRef] = useState({
        current: null,
    })
    const dragHandlers = {} //= { onStart: this.onStart, onStop: this.onStop };
    const timelineRef = createRef()
    var minTime = moment(selectDate).hours(9).minutes(0).seconds(0).valueOf()
    var maxTime = moment(selectDate).hours(21).minutes(0).seconds(0).valueOf()
    const onScrollRef = (ref) => {
        setScrollRef({
            current: ref,
        })
    }

    useEffect(() => {
        setIsDisableRecal(moment.utc(new Date()).tz("Asia/Bangkok").isSameOrAfter(moment(moment.utc(new Date(), "YYYY/MM/DD").tz("Asia/Bangkok").format("YYYY/MM/DD") + ' ' + '12:00:00')))
        async function fetchData() {
            await getDriverList();
            await getJobList(searchParam);

        }
        fetchData();
        const interval = setInterval(() => {
            getJobList(searchParam);
        }, 60 * 1000 * 15);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const dates = []
        for (let i = 1; i < 100; i++) {
            dates.push({
                id: i,
                date: moment(searchParam.shipmentDate).add(i * 15, 'minute')
            })
            setTimeSlot(dates)
        }
    }, [])

    const getDriverList = async (searchParam) => {
        setLoading(false)
        let param = {
            status: 'A',
            limit: 10000,
            offset: 1
        }
        await DriverService.getDriverList(param).then(res => {
            if (res.data.resultCode === "20000") {
                res.data.resultData.drivers.forEach((ele, index) => {
                    ele.id = ele.driverId
                    ele.title = ele.fullName
                })
                setGroups(res.data.resultData.drivers)
                setIsLoading(true)
            } else {
                setGroups([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const refresh = async () => {
        await getJobList(searchParam)
    }
    const getJobList = async (searchParam) => {
        setLoading(true)
        // setIsLoading(false)
        let param = convertFilter(searchParam)
        await JobService.getJobList(param).then(res => {
            if (res.data.resultCode === "20000") {
                let tempJobsCancel = res.data.resultData.jobs.filter((item, i) => item.status === 'CANCEL')
                let tempJobs = res.data.resultData.jobs.filter((item, i) => item.driverId !== null && item.status !== 'CANCEL')
                let tempJobsUnAssign = res.data.resultData.jobs.filter((item, i) => item.driverId === null && item.status !== 'CANCEL')
                setItemsJobCancel(tempJobsCancel)
                setItemsJobUnassign(tempJobsUnAssign)
                tempJobs.forEach((ele, index) => {
                    let tempDate = moment(new Date()).format("YYYY/MM/DD")
                    var estStartTime = moment(tempDate + " " + ele.estStartTime, "YYYY/MM/DD HH:mm:ss")
                    var estEndTime = moment(tempDate + " " + ele.estEndTime, "YYYY/MM/DD HH:mm:ss")
                    ele.group = ele.driverId
                    ele.id = index + 1
                    ele.type = ele.jobType
                    ele.start_time = moment().hours(moment(estStartTime).get('hour')).minutes(moment(estStartTime).get('minute')).seconds(0)
                    ele.end_time = moment().hours(moment(estEndTime).get('hour')).minutes(moment(estEndTime).get('minute')).seconds(0)
                    ele.canMove = ele.lockFlag === 'Y' ? false : (ele.status === "NEW" || ele.status === "HOLD" || ele.status === "EMERGENCY") ? true : false
                    ele.canResize = false
                })
                setItems(tempJobs)
                setIsLoading(true)
                setLoading(false)
            } else {
                setItems([])
                setLoading(false)
            }
            // setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const getAttorney = async (id, driverId) => {
        let param = {
            customerId: id,
            driverId: driverId
        }
        return await DriverService.getAttorney(param).then(res => {
            if (res.data.resultCode === "20000") {
                return res.data.resultData.driverAttorney
            } else {
                return false
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const updateJobLock = async (lockFlag) => {
        let data = {
            lockFlag: lockFlag
        }
        let param = selectItems.jobId
        await JobService.updateJobLock(param, data).then(res => {
            if (res.data.resultCode === "20000") {
                getJobList(searchParam)
            } else {
            }
            setLoading(false)
            setSelectItems({})
        }).catch(err => {
            setLoading(false)
        })
    }
    const handleChange = async (evt) => {
        const { name, value, checked, type } = evt.target;
        setSearchParam(data => ({ ...data, [name]: value }));
        await getJobList({ ...searchParam, [name]: value });
    }
    const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
            updateScrollCanvas(minTime, maxTime)
        } else if (visibleTimeStart < minTime) {
            updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
        } else if (visibleTimeEnd > maxTime) {
            updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
        } else {
            updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        }
    }

    const handleItemDrop = async (e) => {
        console.log("handleItemDrop", e)
        /* SET TO ITEM */
        let temp = [...items, {
            ...e.data.item,
            id: items.length + 1,
            group: e.groupKey,
            start_time: e.start,
            end_time: e.start + ((e.data.item.bookingEstDuration * 60 * 1000)),
            select: 1,
        }]
        setItems(temp)

        /*
            CHECK SNAP TIME 
        */
        const start = moment(e.start, "x");
        let estStartTime = 0
        let remainders = 0
        if (start.minute() === 15) {
            estStartTime = moment(start).format("HH:mm");
        } else {
            remainders = (start.minute() % 15);
            if (remainders < 8) {
                estStartTime = moment(start).add(-remainders, "minutes").format("HH:mm");
            } else {
                const timeNext = 15 - (start.minute() % 15);
                estStartTime = moment(start).add(timeNext, "minutes").format("HH:mm");
            }
        }
        var estEndTime = moment(moment(new Date()).format("YYYY/MM/DD") + " " + estStartTime, "YYYY/MM/DD HH:mm:ss").add(e.data.item.bookingEstDuration, 'minutes').format("HH:mm:ss")
        /*
            CHECK OVER LAP TIME
        */
        // if ((e.groupKey !== "" && e.groupKey !== null) && (estStartTime !== "" && estStartTime !== null)) {
        //     const respPrice = {}
        //     respPrice = await JobService.overLapTimeDriver(e.groupKey, moment(new Date(searchParam.shipmentDate)).format('YYYY-MM-DD'), estStartTime, estEndTime)
        //     if (respPrice.data.resultData.jobs.length > 0) {
        //         NotifyService.error(`ไม่สามารถ booking เวลานี้ได้ กรุณาเลือกอีกครั้ง`)
        //         getJobList(searchParam)
        //         return false
        //     }
        // }
        /*
           CHECK ASSIGN TYPE JOB TO DRIVER
        */
        let driver = groups.find(ele => ele.id === e.groupKey)
        if (driver.jobTypeAll && driver.jobTypeAll.indexOf(e.data.item.jobType) < 0) {
            NotifyService.error(`ไม่สามารถ Assign งานได้เนื่องจาก Job type ไม่ตรงกับของ Driver`)
            getJobList(searchParam)
            return false
        }
        /*
           CHECK ASSIGN TYPE JOB "ATTORNEY" TO DRIVER
        */
        if (e.data.item.jobType === "ATTORNEY") {
            let attorney = await getAttorney(e.data.item.customerId, driver.id)
            if (attorney.length <= 0) {
                NotifyService.error(`ไม่สามารถ Assign งานได้เนื่องจากไม่มีรายชื่อการมอบอำนาจ`)
                return false
            }
        }

        /* ASSIGN JOB TO DRIVER */
        let body = {
            driverId: e.groupKey,
            estStartTime: estStartTime,
            estEndTime: estEndTime
        }
        const resBody = await JobService.assignJobToDriver(e.data.item.jobId, body).then(res =>
            getJobList(searchParam)
        )
    }
    const handleUpdateUnassignJob = async () => {
        let body = {}
        const resBody = await JobService.unassignJobDriver(selectItemsUnassign.jobId, body).then(res => {
            getJobList(searchParam)
            setModalUnassignJob(false)
            setSelectItemsUnassign({})
        })
    }

    const recalculate = async (event) => {
        if (event === 'Ok') {
            setLoading(true)
            let param = {
                shipmentDate: searchParam.shipmentDate
            }
            const resBody = await JobService.recalculateJobPlan(param).then(res => {
                if (res.data.resultCode === "20000") {
                    getJobList(searchParam)
                    NotifyService.success('Recalculate Success')
                } else {
                    getJobList(searchParam)
                    NotifyService.error('Recalculate Faild')
                }
                setLoading(false)
                setOpenConfirmRecal(false)
            })
        } else {
            setOpenConfirmRecal(false)
        }
    }
    const handleChangeShipment = async (e) => {
        if (moment(new Date()).isSame(new Date(e.target.value), 'day')) {
            //Same day is Check time before 12.00
            setIsDisableRecal(moment.utc(new Date()).tz("Asia/Bangkok").isSameOrAfter(moment(moment.utc(new Date(), "YYYY/MM/DD").tz("Asia/Bangkok").format("YYYY/MM/DD") + ' ' + '12:00:00')))
            // setIsDisableRecal(moment(new Date()).isSameOrAfter(moment(moment(new Date(), "YYYY/MM/DD").format("YYYY/MM/DD") + ' ' + '12:00:00')))//return true/false
        } else {
            setIsDisableRecal(false)
            if (moment(new Date(e.target.value)).isSameOrAfter(moment(moment(new Date(), "YYYY/MM/DD").format("YYYY/MM/DD") + ' ' + '12:00:00'))) {
                setIsDisableRecal(false)
            } else {
                setIsDisableRecal(true)
            }
        }

    }
    const handleItemMove = async (itemId, dragTime, newGroupOrder) => {
        const group = groups[newGroupOrder]
        let itemOld = items.find(ele => ele.id === itemId)
        let itemTemp = Object.assign({}, itemOld, {
            start_time: moment(dragTime),
            end_time: moment(dragTime + ((itemOld.bookingEstDuration * 60 * 1000))),
            group: group.id
        })
        console.log("itemTemp", itemTemp)

        /*
           CHECK ASSIGN TYPE JOB TO DRIVER
        */
        if (group.jobTypeAll.indexOf(itemTemp.jobType) < 0) {
            NotifyService.error(`ไม่สามารถ Assign งานได้เนื่องจาก Job type ไม่ตรงกับของ Driver`)
            return false
        }
        /*
            CHECK TIME OVERLAP
        */

        const MAX_OVERLAP_COUNT = 5;

        // const itmsOverlap = items.filter((ele) => {
        //     if (parseInt(ele.id) == parseInt(itemId) || parseInt(ele.driverId) != parseInt(group.driverId)) {
        //         return false;
        //     }

        //     const startA = moment(itemTemp.start_time.format("HH:mm:ss"), "HH:mm:ss", true);
        //     const endA = moment(itemTemp.end_time.format("HH:mm:ss"), "HH:mm:ss", true);

        //     const startB = moment(ele.start_time.format("HH:mm:ss"), "HH:mm:ss", true);
        //     const endB = moment(ele.end_time.format("HH:mm:ss"), "HH:mm:ss", true);
        //     if (startA.isSameOrAfter(endB) || endA.isSameOrBefore(startB)) {
        //         return false;
        //     }
        //     console.log(itemId, ele.id, ele.driverId, group.driverId);
        //     console.log("overlap!!! ", startB.format("HH:mm:ss") + " - " + endB.format("HH:mm:ss"))
        //     return true;
        // })
        // if (itmsOverlap != null && itmsOverlap.length >= 5) {
        //     return false; //all case overlap
        // }

        const checkOverlapWithMaxCount = (newItem, existingItems) => {
            const sortedItems = [...existingItems, newItem].sort((a, b) => a.start_time - b.start_time);
            let overlapCount = 0;

            for (let i = 0; i < sortedItems.length - 1; i++) {
                const currentItem = sortedItems[i];
                const nextItem = sortedItems[i + 1];

                if (currentItem.end_time > nextItem.start_time) {
                    overlapCount++;

                    if (overlapCount >= MAX_OVERLAP_COUNT) {
                        return true; // Exceeded maximum chain overlap count
                    }
                }
            }

            return false; // Within the maximum chain overlap count
        };
        // Filter existing items by driver ID and exclude the item being moved
        const filteredItems = items.filter(
            (item) => item.driverId === itemTemp.driverId && item.id !== itemId
        );
        // Check if the updated item's new position would exceed the maximum chain overlap count
        const isExceededMaxOverlapCount = checkOverlapWithMaxCount(itemTemp, filteredItems);

        if (isExceededMaxOverlapCount) {
            console.log('Exceeded maximum chain overlap count');
            return false; // Prevent moving the item
        }

        /* SET TO ITEM */
        let itemsMove = items.map(item => item.id === itemId
            ? Object.assign({}, item, {
                start_time: moment(dragTime),
                end_time: moment(dragTime + ((item.bookingEstDuration * 60 * 1000))),
                group: group.id
            }) : item)
        setItems(itemsMove)


        /* ASSIGN JOB TO DRIVER */
        let tempDate = moment(new Date()).format("YYYY/MM/DD")
        let estStartTime = moment(dragTime, "x").format("HH:mm:ss")
        var estEndTime = moment(tempDate + " " + estStartTime, "YYYY/MM/DD HH:mm:ss").add(itemTemp.bookingEstDuration, 'minutes').format("HH:mm:ss")
        let body = {
            driverId: group.id,
            estStartTime: estStartTime,
            estEndTime: estEndTime
        }
        const resBody = await JobService.assignJobToDriver(itemTemp.jobId, body).then(res =>
            getJobList(searchParam)
        )
        console.log('Moved', itemId, dragTime, newGroupOrder)
    }
    const itemRenderer = ({ item,
        itemContext,
        getItemProps,
        getResizeProps }) => {
        let bg_color;
        switch (item.status) {
            case "NEW":
                bg_color = "#AED6F1";//bg-blue-400 rgb(96 165 250)
                break;
            case "GOING_TO_PICKUP":
                bg_color = "#FCF3CF";//bg-yellow-400 rgb(250 204 21)
                break;
            case "DELIVERING":
                bg_color = "#E8DAEF";//bg-indigo-400 rgb(129 140 248)
                break;
            case "COMPLETE":
                bg_color = "#D5F5E3";//bg-green-400 rgb(74 222 128)
                break;
            case "HOLD":
                bg_color = "#FBDDFB";//bg-pink-400 rgb(244 114 182)
                break;
            case "CANCEL":
                bg_color = "rgb(156 163 175)";//bg-gray-400
                break;
            case "EMERGENCY":
                bg_color = "#F1948A";//bg-red-400 rgb(248 113 113)
                break;
            default:
                bg_color = "rgb(248 113 113)";
        }
        const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
        return (
            <div
                {...getItemProps({
                    style: {
                        background: bg_color,
                        border: item.lockFlag !== "Y" ? '2px solid rgb(228 228 231)' : '2px solid red',//itemContext.selected ? '2px solid green' :
                        borderRadius: '8px',
                        color: 'black',
                        height: "75px",
                        // margin:"2px"
                        // boxShadow: `0 1px 5px 0 rgba(0, 0, 0, 0.2),
                        //          0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        //          0 3px 1px -2px rgba(0, 0, 0, 0.12)`
                        // borderLeftWidth: itemContext.selected ? 1 : 2,
                        // borderRightWidth: itemContext.selected ? 1 : 2,
                    },
                    onDoubleClick: () => {
                        console.log('on ondblclick')
                        item.onSelect = true
                        setSelectItems(item)
                        setShowJobDetailForm(true)
                    },
                    onMouseLeave: () => {
                        console.log('on onMouseLeave')
                    },
                    onMouseDown: () => {
                        console.log('on item click', item, itemContext, getResizeProps)
                        item.onSelect = true
                        setSelectItems(item)
                    },
                    onItemMove: (itemId, dragTime, newGroupOrder) => {
                        console.log('on item onItemMove', itemId, dragTime, newGroupOrder)
                    },
                })}
            >

                {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
                <div
                    className="rounded-lg shadow-sm mr-1 pt-1 "
                    style={{
                        // height: "72px",
                        height: "40px",
                        width: '100%',
                        borderRadius: '8px',
                        // height: itemContext.dimensions.height,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '1rem',
                        border: itemContext.selected ? '2px solid black' : '',//itemContext.selected ?
                    }}>

                    <div className="flex items-start justify-start px-1 break-words"
                        style={{
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontSize: '10px',
                            lineHeight: '10px',
                            paddingTop: '12px'
                        }}
                    >
                        <Tooltip message={item.jobTypeTxt} position="left-4 top-0">
                            {item.jobType === 'DOCUMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-2 w-2" />}
                            {item.jobType === 'FOOD' && <CakeIcon className="text-white-600 hover:text-white-900 h-2 w-2 " />}
                            {item.jobType === 'PARCEL' && <CubeIcon className="text-white-600 hover:text-white-900 h-2 w-2 " />}
                            {item.jobType === 'CHECK' && <TicketIcon className="text-white-600 hover:text-white-900 h-2 w-2 " />}
                            {item.jobType === 'BILL' && <FolderMinusIcon className="text-white-600 hover:text-white-900 h-2 w-2 " />}
                            {item.jobType === 'ATTORNEY' && <IdentificationIcon className="text-white-600 hover:text-white-900 h-2 w-2 " />}
                        </Tooltip>
                        <Tooltip message={item.paymentTxtEn} position="left-4 top-0">
                            {/* {item.paymentStatus === 'WAITING_PAYMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-3 w-3" />} */}
                            {item.paymentStatus === 'BILLING' && <NewspaperIcon className="text-white-600 hover:text-white-900 h-2 w-2 ml-0" />}
                            {item.paymentStatus === 'PAID' && <CurrencyDollarIcon className="text-white-600 hover:text-white-900 h-2 w-2  ml-0" />}

                        </Tooltip>
                        &nbsp;
                        <span style={{ fontSize: '8px', marginTop: '-2px' }}>{item.customerName}&nbsp;&gt;&nbsp;</span>
                        <span style={{ fontSize: '8px', lineHeight: '10px', marginTop: '-2px' }}>{convertContactName(item.jobPoint).fullAddress}</span>

                        {/* <span>{convertContactName(item.jobPoint).fullAddress}</span> */}
                        {/* {(item.lockFlag !== 'Y' && item.status !== "COMPLETE")
                            && <Tooltip message="Unassign" position="right-4 top-0">
                                <button className='h-3 w-3 inline-flex w-full justify-center bg-black justify-center rounded-md border border-transparent hover:bg-indigo-700 focus:outline-none text-white-600' type="button"
                                    onClick={() => {
                                        if (item.lockFlag !== 'Y' && item.status !== "COMPLETE") {
                                            setModalUnassignJob(true)
                                            setSelectItemsUnassign(item)
                                        }
                                    }} >
                                    <ArrowUturnUpIcon className="text-white hover:text-white-900 h-2 w-2" />
                                </button>
                            </Tooltip>} */}
                    </div>


                    {/* <div className="flex items-start justify-start px-2 pt-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                        <span>{item.customerName}</span>
                    </div>
                    <div className="flex items-start justify-start px-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                        <span style={{ fontSize: '8px', lineHeight: '10px' }}> {item.paymentTxtEn}</span>
                    </div>
                    <div className="flex items-start justify-start px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                        <span>{convertContactName(item.jobPoint).contactName}</span>
                    </div>
                    <div className="flex items-start justify-start px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                        <span>{convertContactName(item.jobPoint).fullAddress}</span>
                    </div> */}
                </div>
                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : null}
                {/* {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null} */}
            </div>
        )
    }
    const groupRenderer = ({ group }) => {
        let count = items.filter((item, i) => item.group == group.driverId)
        return (
            <p className='text-xs text-center break-words inline-block align-middle'>{group.firstname} {group.lastname}
                <span className="inline-flex items-center rounded-full  px-2 py-2 text-sm font-medium text-black-100 h-6 ml-1"
                    style={{
                        backgroundColor: "#D5F5E3"
                    }}>{count.length}</span>
            </p>
        )
    }
    const handleCanvasClick = (groupId, time) => {
        console.log('Canvas clicked', groupId, moment(time).format())
        setSelectItems({})
    }

    const moveResizeValidator = (action, item, time, resizeEdge) => {
        if (time < minTime) {
            var newTime = minTime
            return newTime
        }
        let endTime = time + ((item.bookingEstDuration * 60 * 1000))
        if (endTime > maxTime) {
            var newTime = maxTime - ((item.bookingEstDuration * 60 * 1000))
            return newTime
        }
        return time
    }
    const convertContactName = (data) => {
        if (data.length != 2) return ""
        return data[1];
    }

    const handleCanvasDoubleClick = (groupId, time) => {
        console.log('Canvas double clicked', groupId, moment(time).format())
    }

    const handleCanvasContextMenu = (group, time) => {
        console.log('Canvas context menu', group, moment(time).format())
    }

    const handleItemClick = (itemId, _, time) => {
        console.log('Clicked: ' + itemId, moment(time).format())
    }

    const handleItemSelect = (itemId, _, time) => {
        console.log('Selected: ' + itemId, moment(time).format())
    }

    const handleItemDoubleClick = (itemId, _, time) => {
        console.log('Double Click: ' + itemId, moment(time).format())
    }

    const handleItemContextMenu = (itemId, _, time) => {
        let itemUnassign = items.find(item => item.id === itemId)
        if (itemUnassign.lockFlag !== 'Y' && itemUnassign.status !== "COMPLETE") {
            setModalUnassignJob(true)
            setSelectItemsUnassign(itemUnassign)
        }
        console.log('Context Menu: ' + itemId, moment(time).format())
    }
    const handleItemResize = (itemId, time, edge) => {

        console.log('Resized', itemId, time, edge)
    }
    const handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
        console.log('handleItemDrag', itemId, time, edge, newGroupOrder)
    }

    return (
        <>

            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <div className="md:container md:mx-auto">
                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-4 flex flex-row mb-2 gap-2">
                            <InputGroupDate type="text" format="YYYY-MM-DD" id="shipmentDate" name="shipmentDate" label="Shipment Date:"
                                onChange={(e) => { handleChange(e); handleChangeShipment(e) }}
                                value={searchParam.shipmentDate} />
                            <InputGroup type="text" id="driverId" name="driverId" label="No. of Driver:" value={groups.length} disabled />
                            <InputGroup type="text" id="driverId" name="driverId" label="No. of Job:" value={itemsJobCancel.length + items.length + itemsJobUnassign.length} disabled />
                        </div>
                        <div class="col-span-5">
                            <div className="flex-auto pr-1 pt-7">
                                <div className="flex items-end justify-end sm:px-6 lg:px-0 sm:py-0 lg:pt-0text-center" style={{ margin: "auto" }}>
                                    <span className="inline-flex items-center rounded-md px-2.5 py-0.5  text-sm font-medium text-black-100 h-6 w-14 mr-1"
                                        style={{
                                            backgroundColor: "#AED6F1"
                                        }}>
                                        New
                                    </span>
                                    <span className="inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-100 w-26 h-6 mr-1"
                                        style={{
                                            backgroundColor: "#FCF3CF"
                                        }}>
                                        Going to pickup
                                    </span>
                                    <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium text-black-100 h-6 w-20 mr-1"
                                        style={{
                                            backgroundColor: "#E8DAEF"
                                        }}>
                                        Delivering
                                    </span>
                                    <span className="inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-100 h-6 w-20 mr-1"
                                        style={{
                                            backgroundColor: "#D5F5E3"
                                        }}>
                                        Complete
                                    </span>
                                    <span className="inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-100 h-6 w-16 mr-1"
                                        style={{
                                            backgroundColor: "#FBDDFB"
                                        }}>
                                        Pending
                                    </span>
                                    <span className="inline-flex items-center rounded-md  px-2.5 py-0.5 text-sm font-medium text-black-100 h-6 w-22 mr-0"
                                        style={{
                                            backgroundColor: "#F1948A"
                                        }}>
                                        Emergency
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-3">
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 mb-2 pt-7">
                                <button type="button"
                                    onClick={() => {
                                        // setLoading(true)
                                        refresh()
                                    }}
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-0 py-1 pb-1.5  text-xs font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-2 disabled:opacity-50"
                                >
                                    <ArrowPathIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  Refresh
                                </button>
                                {selectItems.canMove &&
                                    <>
                                        <button type="button"
                                            onClick={() => { updateJobLock('Y') }}
                                            disabled={!selectItems.onSelect}
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-0 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-2 disabled:opacity-50">

                                            <LockClosedIcon className="h-4 w-4 mr-1" />Lock Order
                                        </button>
                                    </>
                                }
                                {selectItems && !selectItems.canMove &&
                                    <>
                                        <button type="button"
                                            onClick={() => { updateJobLock('N') }}
                                            disabled={!selectItems.onSelect}
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-0 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-2  disabled:opacity-50">

                                            <LockOpenIcon className="h-4 w-4 mr-1" />UnLock Order
                                        </button>
                                    </>
                                }
                                <button type="button"
                                    onClick={() => setOpenConfirmRecal(true)}
                                    // disabled={isDisableRecal}
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-0 py-1 pb-1.5  text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    <CalculatorIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  Recalculate
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:container md:mx-auto p-2">
                    <div className="flex flex-col md:flex-row">
                        <div id="unsign-job" className="w-full md:w-1/5 ">
                            <div className='w-40 text-center px-8' style={{ margin: "16px auto;" }}>
                                Unassign &nbsp;
                                <span className="inline-flex items-center rounded-full  px-2 py-2 text-sm font-medium text-black-100 h-6"
                                    style={{
                                        backgroundColor: "#D5F5E3"
                                    }}>{itemsJobUnassign.length}</span>
                            </div>
                            <div id="draggable" className="rounded-md shadow-sm border border-gray-300 bg-gray-100 overflow-y-auto  h-[calc(100vh-15rem)]"
                                style={{ width: '98%', overflowX: 'hidden', overflowY: 'scroll', scrollSnapAlign: 'center' }}   >
                                <div className="grid grid-cols-2 gap-2 p-2">

                                    {itemsJobUnassign.length > 0 && itemsJobUnassign.map((item, index) => {
                                        return (
                                            <div style={{ position: "inherit", width: '115px' }}  >
                                                <div style={{ position: "" }}>
                                                    <Draggable
                                                        // {...dragHandlers}
                                                        id={"item" + index}
                                                        key={index}
                                                        handleItemDrop={handleItemDrop}
                                                        data={{ item }}
                                                        timelineRef={timelineRef}
                                                        scrollRef={scrollRef}
                                                    >
                                                        <button className='rounded-lg shadow-sm mr-1 h-20 w-28 hover:border-2 hover:border-blue-500 active:border-slate-900 focus:border-2  focus:border-slate-900'
                                                            style={{
                                                                backgroundColor: "#AED6F1",
                                                                fontSize: '8px',
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis"
                                                            }}
                                                            onDoubleClick={(e) => {
                                                                setSelectItems(item)
                                                                setShowJobDetailForm(true)
                                                            }}>
                                                            <div className="flex items-between justify-between px-2 break-words" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '10px' }} >
                                                                <Tooltip message={item.jobTypeTxt} position="left-4 top-0">
                                                                    {item.jobType === 'DOCUMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-3 w-3" />}
                                                                    {item.jobType === 'FOOD' && <CakeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                                    {item.jobType === 'PARCEL' && <CubeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                                    {item.jobType === 'CHECK' && <TicketIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                                    {item.jobType === 'BILL' && <FolderMinusIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                                    {item.jobType === 'ATTORNEY' && <IdentificationIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                                </Tooltip>

                                                            </div>
                                                            <div className="flex items-between justify-between px-2" style={{
                                                                fontSize: '8px',
                                                                width: "90%",
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis"
                                                            }}>
                                                                {item.customerName}
                                                                {/* {item.customerName.length > 20 ? item.customerName.substring(0, 20) + "..." : item.customerName} */}
                                                            </div>
                                                            <div className="flex items-between justify-between px-2" style={{ fontSize: '8px', }}>
                                                                {item.paymentTxtEn}
                                                            </div>

                                                            <div className="flex items-between justify-between px-2 bottom-0" style={{ fontSize: '8px', }}>
                                                                {/* <span>{item.distance} km</span> */}
                                                                <span>{convertContactName(item.jobPoint).contactName}</span>
                                                            </div>
                                                            <div className="flex items-between justify-between px-2 bottom-0" style={{
                                                                fontSize: '8px',
                                                                width: "90%",
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis"
                                                            }}>
                                                                <span>{convertContactName(item.jobPoint).fullAddress}</span>
                                                                {/* <span>{convertContactName(item.jobPoint).fullAddress?.length > 20 ? convertContactName(item.jobPoint).fullAddress?.substring(0, 20) + "..." : convertContactName(item.jobPoint).fullAddress}</span> */}
                                                            </div>
                                                        </button>
                                                    </Draggable>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {/* temp div for scrolling*/}
                                    <div style={{ width: "20px" }}></div>
                                </div>
                            </div>
                        </div>

                        <div id="rider-mng-schedule" className="w-full md:w-4/5">
                            <div className="py-2 " style={{}} >
                                {isLoading &&
                                    <Timeline
                                        className="rounded-md shadow-md border border-gray-300 h-[calc(100vh-20rem)]"
                                        ref={timelineRef}
                                        scrollRef={onScrollRef}
                                        style={{ textAlign: "center", marginTop: "5px", overflowY: 'scroll', overflowX: 'hidden', marginBottom: "5px", width: '100%' }}
                                        // keys={keys}
                                        keys={{
                                            groupIdKey: 'id',
                                            groupTitleKey: 'title',
                                            groupRightTitleKey: 'id',
                                            itemIdKey: 'id',
                                            itemTitleKey: 'title',    // key for item div content
                                            itemDivTitleKey: 'title', // key for item div title (<div title="text"/>)
                                            itemGroupKey: 'group',
                                            itemTimeStartKey: 'start_time',
                                            itemTimeEndKey: 'end_time',
                                        }}
                                        itemHeightRatio={1}
                                        itemsSorted
                                        dragSnap={15 * 60 * 1000}
                                        horizontalLineClassNamesForGroup={(group) => group.root ? ["row-root"] : []}
                                        // defaultTimeStart={moment(searchParam.shipmentDate).add(-12, 'hour')}
                                        // defaultTimeEnd={moment(searchParam.shipmentDate).add(12, 'hour')}
                                        defaultTimeStart={moment(searchParam.shipmentDate).add(9, 'hour').add(0, 'minute')}
                                        defaultTimeEnd={moment(searchParam.shipmentDate).add(17, 'hour').add(0, 'minute')}
                                        minZoom={moment(searchParam.shipmentDate).add(9, 'hour').add(0, 'minute')}
                                        maxZoom={moment(searchParam.shipmentDate).add(17, 'hour').add(0, 'minute')}
                                        // visibleTimeStart={moment().hours(9).minutes(0).seconds(0)}
                                        // visibleTimeEnd={moment().add(22, 'hour').add(0, 'minute')}
                                        // visibleTimeStart={moment().add(5, 'hour').add(45, 'minute')}
                                        // visibleTimeEnd={moment().add(18, 'hour').add(0, 'minute')}
                                        // visibleTimeStart={moment(selectDate).hours(9).minutes(0).seconds(0)}
                                        // visibleTimeEnd={moment(selectDate).hours(21).minutes(0).seconds(0)}
                                        onTimeChange={handleTimeChange}
                                        onItemMove={handleItemMove}
                                        groupRenderer={groupRenderer}
                                        // sidebarContent={<GroupRenderer />}
                                        // rightSidebarContent={<GroupRenderer />}
                                        // rightSidebarContent="Skills"
                                        // rightSidebarContent={<div>Above The Right</div>}
                                        // fixedHeader={"sticky"}
                                        // stickyOffset="50"
                                        // buffer={3}
                                        // canResize={"right"}
                                        // itemTouchSendsClick={true}
                                        // showCursorLine
                                        groups={groups}
                                        items={items}
                                        fullUpdate={false}
                                        stackItems={true}
                                        itemRenderer={itemRenderer}
                                        // rightSidebarWidth={150}
                                        // rightSidebarContent={<div>Above The Right</div>}
                                        lineHeight={45}
                                        // lineHeight={75}
                                        verticalLineClassNamesForTime={verticalLineClassNamesForTime}
                                        onCanvasClick={handleCanvasClick}
                                        onCanvasDoubleClick={handleCanvasDoubleClick}
                                        onCanvasContextMenu={handleCanvasContextMenu}
                                        onItemClick={handleItemClick}
                                        onItemSelect={handleItemSelect}
                                        onItemContextMenu={handleItemContextMenu}
                                        onItemResize={handleItemResize}
                                        onItemDoubleClick={handleItemDoubleClick}
                                        moveResizeValidator={moveResizeValidator}
                                        onItemDrag={handleItemDrag}
                                    >
                                        <TimelineMarkers>
                                            {timeSlot
                                                .map(marker =>
                                                    <CustomMarker
                                                        key={marker.id}
                                                        date={Number(marker.date)}>
                                                        {({ styles }) => {
                                                            const customStyles = {
                                                                ...styles,
                                                                background: `repeating-linear-gradient(0deg, transparent, transparent 5px, white 5px, rgb(166 167 171 / 100%) 8px )`,
                                                                width: '1px',
                                                            }
                                                            return <div style={customStyles} />
                                                        }}
                                                    </CustomMarker>
                                                )}
                                        </TimelineMarkers>
                                        <TimelineHeaders
                                            style={{ position: "sticky", top: "0", zIndex: "2000", height: '45px' }}
                                            className="sticky">
                                            <SidebarHeader >
                                                {({ getRootProps }) => {
                                                    return <div  {...getRootProps()}>
                                                        <h1 className='bg-gray-300 border-b border-gray-400 text-black w-100 p-2' style={{ height: '45px', textAlign: 'center', margin: 'auto' }}>Driver Name</h1></div>
                                                }}
                                            </SidebarHeader>
                                            {/* <SidebarHeader variant="right" headerData={{ title: 'select', someData: groups }} >
                                                {({ getRootProps, data }) => {
                                                    return <div {...getRootProps()}>
                                                        <h1 className='bg-indigo-700 border-red-800 text-white p-2' style={{ height: '45px' }}>
                                                            {data.title}</h1>
                                                    </div>
                                                }}
                                            </SidebarHeader> */}
                                            {/* <DateHeader unit="primaryHeader" style={{ height: 50 }} className='bg-indigo-700 border-red-800 text-black-800' /> */}
                                            <DateHeader
                                                unit="hour"
                                                labelFormat="HH:mm"
                                                style={{ height: 30, borderColor: 'red' }}
                                                data={{ someData: 'example' }}
                                                intervalRenderer={({ getIntervalProps, intervalContext, data }) => {
                                                    if (intervalContext.intervalText === "12:00") {
                                                        return <div {...getIntervalProps()}>
                                                            <h4 className='bg-red-100 border-r border-gray-300 text-gray-800 p-2' style={{ height: '75px', fontSize: '14px' }}>{intervalContext.intervalText}-{moment(intervalContext.intervalText, "HH:mm").add(+1, 'hour').format('HH:mm')}</h4>

                                                        </div>
                                                    } else {
                                                        return <div {...getIntervalProps()}>
                                                            <h4 className='bg-gray-300 border-r border-gray-400 text-gray-800 p-2' style={{ height: '75px', fontSize: '14px' }}>{intervalContext.intervalText}-{moment(intervalContext.intervalText, "HH:mm").add(+1, 'hour').format('HH:mm')}</h4>

                                                        </div>
                                                    }

                                                }}
                                            />
                                        </TimelineHeaders>
                                    </Timeline>
                                }
                            </div>

                            <div id="cancel-job" className="flex items-start justify-start pb-4">
                                <div className='w-40 text-center px-8' style={{ margin: "auto" }}>
                                    Cancel
                                </div>
                                <div className="rounded-md shadow-sm border border-gray-300 bg-gray-100" style={{ width: "100%" }} >
                                    <div className="flex items-start justify-start" style={{ height: '80px' }}>
                                        {itemsJobCancel.length > 0 && itemsJobCancel.map((item, index) => {
                                            return (
                                                <div className='bg-gray-400 rounded-lg shadow-sm mr-1 h-20 w-28 pt-2 cursor-pointer' onDoubleClick={(e) => {
                                                    setSelectItems(item)
                                                    setShowJobDetailForm(true)
                                                }}>
                                                    <div className="flex items-between justify-between px-2 break-words" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '10px' }} >
                                                        <Tooltip message={item.jobTypeTxt} position="left-4 top-0">
                                                            {item.jobType === 'DOCUMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-3 w-3" />}
                                                            {item.jobType === 'FOOD' && <CakeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                            {item.jobType === 'PARCEL' && <CubeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                            {item.jobType === 'CHECK' && <TicketIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                            {item.jobType === 'BILL' && <FolderMinusIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                            {item.jobType === 'ATTORNEY' && <IdentificationIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                                                        </Tooltip>
                                                        {item.customerName.length > 15 ? item.customerName.substring(0, 15) + "..." : item.customerName}
                                                    </div>
                                                    <div className="flex items-between justify-between px-2" style={{ fontSize: '8px', }}>
                                                        {item.paymentTxtEn}
                                                    </div>
                                                    <div className="flex items-end justify-end px-2" style={{ fontSize: '8px', }}>
                                                        ผู้รับ
                                                    </div>
                                                    <div className="flex items-between justify-between px-2 bottom-0" style={{ fontSize: '8px', }}>
                                                        <span>{item.distance} km</span>
                                                        <span>{convertContactName(item.jobPoint).contactName}</span>
                                                    </div>
                                                    <div className="flex items-end justify-end px-2 bottom-0" style={{ fontSize: '8px', }}>
                                                        <span>{convertContactName(item.jobPoint).fullAddress?.length > 20 ? convertContactName(item.jobPoint).fullAddress?.substring(0, 20) + "..." : convertContactName(item.jobPoint).fullAddress}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalJobDetailPopUp
                        open={showJobDetailForm}
                        setOpen={onSetJobDetailModal}
                        mode={"view"}
                        id={selectItems.jobId}
                        callBackToDashboard={callBackToDashboard}
                    />
                    <ModalUassignJob
                        open={showModalUnassignJob}
                        setOpen={(e) => setModalUnassignJob(false)}
                        selectItems={selectItemsUnassign}
                        handleUpdateUnassignJob={handleUpdateUnassignJob}
                    />
                </div >
                <Transition.Root show={openConfirmRecal} >
                    <Dialog as="div" className="relative z-10" onClose={setOpenConfirmRecal}>
                        <Transition.Child
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
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                    Confirm
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Please confirm to recalculate shipment plan. Current plan will be refresh.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                                onClick={() => { recalculate('Ok') }}
                                            >
                                                OK
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                onClick={() => { recalculate('Cancel') }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </LoadingOverlay>
        </>
    )
}