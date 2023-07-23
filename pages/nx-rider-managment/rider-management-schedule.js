
import Timeline, { CustomMarker, DateHeader, SidebarHeader, TimelineHeaders, TimelineMarkers } from 'react-calendar-timeline'
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { Tooltip } from '../../components/Tooltip'
import { ArrowUturnUpIcon, CakeIcon, CalculatorIcon, ClipboardDocumentIcon, CubeIcon, FolderMinusIcon, IdentificationIcon, LockOpenIcon, TicketIcon } from '@heroicons/react/20/solid'
import LoadingOverlay from "react-loading-overlay";
import { createRef, useEffect, useState } from 'react'
import { DriverService } from '../api/driver.service'
import { JobService } from '../api/job.service'
import { convertFilter } from '../../helpers/utils'
// import Draggable from '../../components/drag-drop/Draggable'
import { InputGroup, InputGroupDate } from '../../components'
import { NotifyService } from '../api/notify.service'
import Breadcrumbs from '../../components/Breadcrumbs'
import Layout from '../../layouts'
import Draggable from 'react-draggable'
LoadingOverlay.propTypes = undefined
// import keys from "./keys";
const initial = {
    search: {
        shipmentDate: moment(new Date()).format("YYYY/MM/DD"),
        limit: 10000,
        offset: 1
    },
    jobList: []
}
export default function RiderManagementScheduleNew() {
    const [selectDate, setSelectDate] = useState(new Date())
    const [items, setItems] = useState([])
    const [itemsJobUnassign, setItemsJobUnassign] = useState([])
    const [itemsJobCancel, setItemsJobCancel] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParam, setSearchParam] = useState(initial.search)
    const [isLoading, setIsLoading] = useState(false)
    const [selectItems, setSelectItems] = useState({})
    const [selectItemsUnassign, setSelectItemsUnassign] = useState({})
    const [showJobDetailForm, setShowJobDetailForm] = useState(false)
    const [showModalUnassignJob, setModalUnassignJob] = useState(false)
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
        async function fetchData() {
            await getDriverList();
            await getJobList(searchParam);

        }
        fetchData();
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
    const getJobList = async (searchParam) => {
        setLoading(false)
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
                    ele.canMove = ele.lockFlag === 'Y' ? false : (ele.status === "NEW" || ele.status === "GOING_TO_PICKUP") ? true : false
                    ele.canResize = false
                })
                setItems(tempJobs)
                setIsLoading(true)
            } else {
                setItems([])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
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
        let temp = [...items, {
            ...e.data.item,
            id: items.length + 1,
            group: e.groupKey,
            start_time: e.start,
            end_time: e.start + ((e.data.item.bookingEstDuration * 60 * 1000)),
            select: 1,
        }]
        setItems(temp)
        //snap time
        const start = moment(e.start, "x");
        let dateTimes = 0
        let remainders = 0
        if (start.minute() === 15) {
            dateTimes = moment(start).format("HH:mm");
        } else {
            remainders = (start.minute() % 15);
            if (remainders < 8) {
                dateTimes = moment(start).add(-remainders, "minutes").format("HH:mm");
            } else {
                const timeNext = 15 - (start.minute() % 15);
                dateTimes = moment(start).add(timeNext, "minutes").format("HH:mm");
            }
        }
        // remainders = 15 - (start.minute() % 15);
        // dateTimes = moment(start).add(remainders, "minutes").format("HH:mm");
        let tempDate = moment(new Date()).format("YYYY/MM/DD")
        let estStartTime = dateTimes
        // let estStartTime = moment(e.start, "x").format("HH:mm:ss")
        var estEndTime = moment(tempDate + " " + estStartTime, "YYYY/MM/DD HH:mm:ss").add(e.data.item.bookingEstDuration, 'minutes').format("HH:mm:ss")
        let body = {
            driverId: e.groupKey,
            estStartTime: estStartTime,
            estEndTime: estEndTime
        }
        //Check over lap time
        if ((e.groupKey !== "" && e.groupKey !== null) && (estStartTime !== "" && estStartTime !== null)) {
            const respPrice = {}
            respPrice = await JobService.overLapTimeDriver(e.groupKey, moment(new Date(searchParam.shipmentDate)).format('YYYY-MM-DD'), estStartTime, estEndTime)
            if (respPrice.data.resultData.jobs.length > 0) {
                NotifyService.error(`ไม่สามารถ booking เวลานี้ได้ กรุณาเลือกอีกครั้ง`)
                getJobList(searchParam)
                return false
            }
        }
        //Check assign type job
        let driver = groups.find(ele => ele.id === e.groupKey)
        if (driver.jobTypeAll.indexOf(e.data.item.jobType) < 0) {
            NotifyService.error(`ไม่สามารถ Assign งานได้เนื่องจาก Job type ไม่ตรงกับของ Driver`)
            getJobList(searchParam)
            return false
        }

        const resBody = await JobService.assignJobToDriver(e.data.item.jobId, body).then(res =>
            getJobList(searchParam)
        )
    }
    const handleUpdateUnassignJob = async () => {
        console.log(selectItemsUnassign)
        let body = {
        }
        const resBody = await JobService.unassignJobDriver(selectItemsUnassign.jobId, body).then(res => {
            getJobList(searchParam)
            setModalUnassignJob(false)
            setSelectItemsUnassign({})
        })
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

        //Check assign type job
        if (group.jobTypeAll.indexOf(itemTemp.jobType) < 0) {
            NotifyService.error(`ไม่สามารถ Assign งานได้เนื่องจาก Job type ไม่ตรงกับของ Driver`)
            // getJobList(searchParam)
            return false
        }
        const itmsOverlap = items.filter((ele) => {
            // (StartA <= EndB) and (EndA >= StartB) isSameOrAfter

            if (parseInt(ele.id) == parseInt(itemId) || parseInt(ele.driverId) != parseInt(group.driverId)) {
                return false;
            }

            const startA = moment(itemTemp.start_time.format("HH:mm:ss"), "HH:mm:ss", true);
            const endA = moment(itemTemp.end_time.format("HH:mm:ss"), "HH:mm:ss", true);

            const startB = moment(ele.start_time.format("HH:mm:ss"), "HH:mm:ss", true);
            const endB = moment(ele.end_time.format("HH:mm:ss"), "HH:mm:ss", true);
            if (startA.isSameOrAfter(endB) || endA.isSameOrBefore(startB)) {
                return false;
            }
            console.log(itemId, ele.id, ele.driverId, group.driverId);
            console.log("overlap!!! ", startB.format("HH:mm:ss") + " - " + endB.format("HH:mm:ss"))
            return true;
        })
        if (itmsOverlap != null && itmsOverlap.length > 0) {
            return false; //all case overlap
            // for (let index = 0; index < itmsOverlap.length; index++) {
            //     const ele = itmsOverlap[index];
            //     console.log("lockFlag" ,ele.lockFlag ) 
            //     if(ele.lockFlag == 'Y'){
            //         return false; //only lockflag overlap
            //     }
            // }
        }

        let itemsMove = items.map(item => item.id === itemId
            ? Object.assign({}, item, {
                start_time: moment(dragTime),
                end_time: moment(dragTime + ((item.bookingEstDuration * 60 * 1000))),
                group: group.id
            }) : item)
        setItems(itemsMove)

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
                bg_color = "rgb(96 165 250)";//bg-blue-400
                break;
            case "GOING_TO_PICKUP":
                bg_color = "rgb(250 204 21)";//bg-yellow-400
                break;
            case "DELIVERING":
                bg_color = "rgb(129 140 248)";//bg-indigo-400
                break;
            case "COMPLETE":
                bg_color = "rgb(74 222 128)";//bg-green-400
                break;
            case "PENDING":
                bg_color = "rgb(244 114 182)";//bg-pink-400
                break;
            case "CANCEL":
                bg_color = "rgb(156 163 175)";//bg-gray-400
                break;
            case "EMERGENCY":
                bg_color = "rgb(248 113 113)";//bg-red-400
                break;
            case "HOLD":
                bg_color = "rgb(203 213 225)";//bg-slate-300
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
                        height: "72px",
                        width: '100%',
                        borderRadius: '8px',
                        // height: itemContext.dimensions.height,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '1rem',
                        border: itemContext.selected ? '2px solid black' : '',//itemContext.selected ?
                    }}>

                    <div className="flex items-between justify-between px-1 break-words"
                        style={{
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontSize: '10px',
                            lineHeight: '10px'
                        }}
                    >
                        <Tooltip message={item.jobTypeTxt} position="left-4 top-0">
                            {item.jobType === 'DOCUMENT' && <ClipboardDocumentIcon className="text-white-600 hover:text-white-900 h-3 w-3" />}
                            {item.jobType === 'FOOD' && <CakeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                            {item.jobType === 'PARCEL' && <CubeIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                            {item.jobType === 'CHECK' && <TicketIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                            {item.jobType === 'BILL' && <FolderMinusIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                            {item.jobType === 'ATTORNEY' && <IdentificationIcon className="text-white-600 hover:text-white-900 h-3 w-3 " />}
                        </Tooltip>
                        {item.lockFlag !== 'Y' && <Tooltip message="Unassign" position="right-4 top-0">
                            <button className='h-3 w-3 inline-flex w-full justify-center bg-black justify-center rounded-md border border-transparent hover:bg-indigo-700 focus:outline-none text-white-600' type="button"
                                onClick={() => {
                                    if (item.lockFlag !== 'Y') {
                                        setModalUnassignJob(true)
                                        setSelectItemsUnassign(item)
                                    }
                                }} >
                                <ArrowUturnUpIcon className="text-white hover:text-white-900 h-2 w-2" />
                            </button>
                        </Tooltip>}
                    </div>

                    <div className="flex items-start justify-start px-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                        <span style={{ fontSize: '8px', lineHeight: '10px' }}> {item.paymentTxtEn}</span>
                    </div>
                    <div className="flex items-end justify-end px-2" style={{ fontSize: '8px', lineHeight: '10px' }} >
                        {item.customerName.length > 15 ? item.customerName.substring(0, 15) + "..." : item.customerName}
                    </div>
                    <div className="flex items-between justify-between px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                        <span>{item.distance} km</span>
                        <span>{convertContactName(item.jobPoint).contactName}</span>
                    </div>
                    <div className="flex items-end justify-end px-2 bottom-0" style={{ fontSize: '8px', lineHeight: '10px' }}>
                        <span>{convertContactName(item.jobPoint).fullAddress?.length > 20 ? convertContactName(item.jobPoint).fullAddress?.substring(0, 20) + "..." : convertContactName(item.jobPoint).fullAddress}</span>
                    </div>
                </div>
                {itemContext.useResizeHandle ? (
                    <div {...rightResizeProps} />
                ) : null}
                {/* {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null} */}
            </div>
        )
    }
    const groupRenderer = ({ group }) => {
        return (
            <p className='text-xs text-center break-words inline-block align-middle'>{group.firstname} {group.lastname}</p>
        )
    }
    const handleCanvasClick = (groupId, time) => {
        console.log('Canvas clicked', groupId, moment(time).format())
        setSelectItems({})
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
        if (itemUnassign.lockFlag !== 'Y') {
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

    const moveResizeValidator = (action, item, time, resizeEdge) => {
        if (time < minTime) {
            var newTime = minTime
            return newTime
        }
        if (time > maxTime) {
            var newTime = maxTime - ((item.bookingEstDuration * 60 * 1000))
            return newTime
        }
        return time
    }
    const convertContactName = (data) => {
        if (data.length != 2) return ""
        return data[1];
    }
    return (
        <>
            {/* <Layout> */}
            {/* <Breadcrumbs title="Nx Rider Management" breadcrumbs={breadcrumbs} /> */}
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'hidden' : 'scroll'
                    }
                }}>
                <div className="md:container md:max-w-screen-2xl">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-12 mb-2">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 col-span-3 pl-2">
                            <InputGroupDate type="text" format="YYYY-MM-DD" id="shipmentDate" name="shipmentDate" label="Shipment Date:"
                                onChange={handleChange}
                                value={searchParam.shipmentDate} />
                            <InputGroup type="text" id="driverId" name="driverId" label="No. of Driver:" value={groups.length} disabled />
                        </div>
                        <div className="col-span-6 pr-2 pt-7">
                            <div className="flex items-end justify-end sm:px-6 lg:px-0 sm:py-0 lg:pt-0text-center" style={{ margin: "auto" }}>
                                <span className="inline-flex items-center rounded-md bg-blue-400 px-2.5 py-0.5  text-sm font-medium text-blue-100 h-6 w-14 mr-2">
                                    New
                                </span>
                                <span className="inline-flex items-center rounded-md bg-yellow-400 px-2.5 py-0.5 text-sm font-medium text-yellow-100 w-26 h-6 mr-2">
                                    Going to pickup
                                </span>
                                <span className="inline-flex items-center rounded-md bg-indigo-400 px-2.5 py-0.5 text-sm font-medium text-indigo-100 h-6 w-20 mr-2">
                                    Delivering
                                </span>
                                <span className="inline-flex items-center rounded-md bg-green-400 px-2.5 py-0.5 text-sm font-medium text-green-100 h-6 w-20 mr-2">
                                    Complete
                                </span>
                                <span className="inline-flex items-center rounded-md bg-pink-400 px-2.5 py-0.5 text-sm font-medium text-pink-100 h-6 w-16 mr-2">
                                    Pending
                                </span>
                                <span className="inline-flex items-center rounded-md bg-gray-400 px-2.5 py-0.5 text-sm font-medium text-gray-100 h-6 w-16 mr-0">
                                    Cancel
                                </span>
                            </div>
                        </div>
                        <div className="col-span-3 pl-2">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 mb-2 pt-7">
                                {selectItems.canMove &&
                                    <>
                                        <button type="button"
                                            onClick={() => { updateJobLock('Y') }}
                                            disabled={!selectItems.onSelect}
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-2 disabled:opacity-50">

                                            <LockOpenIcon className="h-4 w-4 mr-1" />Lock Order
                                        </button>
                                    </>
                                }
                                {selectItems && !selectItems.canMove &&
                                    <>
                                        <button type="button"
                                            onClick={() => { updateJobLock('N') }}
                                            disabled={!selectItems.onSelect}
                                            className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-1 pb-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mr-2  disabled:opacity-50">

                                            <LockOpenIcon className="h-4 w-4 mr-2" />UnLock Order
                                        </button>
                                    </>
                                }
                                <button type="button"
                                    className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-green-600 px-6 py-1 pb-1.5  text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <CalculatorIcon className="text-white-600 hover:text-white-900 h-4 w-4 mr-2" />  Recalculate
                                </button>
                            </div>
                        </div>
                    </div>
                    <Draggable bounds="parent" axis="x"{...dragHandlers}>
                        <dl className="rounded-lg bg-white shadow-lg cursor-move">
                            <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                                <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Aun</dt>
                                <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">5.7 km</dd>
                            </div>
                        </dl>
                    </Draggable>
                    <Draggable bounds="parent" axis="x" {...dragHandlers}>
                        <dl className="rounded-lg bg-white shadow-lg cursor-move">
                            <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                                <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Aun</dt>
                                <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">5.7 km</dd>
                            </div>
                        </dl>
                    </Draggable>
                    {/* <div className="flex items-start justify-start">
                        <div className='w-40 text-center px-8' style={{ margin: "auto" }}>
                            Unassign
                        </div>
                        <div className="rounded-md shadow-sm border border-gray-300 bg-gray-100" style={{ width: "100%" }}>
                            <div className="flex items-start justify-start" style={{ height: '80px' }}>
                                {itemsJobUnassign.length > 0 && itemsJobUnassign.map((item, index) => {
                                    return (
                                        <Draggable
                                            // {...dragHandlers}
                                            key={index}
                                            handleItemDrop={handleItemDrop}
                                            data={{ item }}
                                            timelineRef={timelineRef}
                                            scrollRef={scrollRef}
                                        >
                                            <div className='bg-blue-400 rounded-lg shadow-sm mr-1 h-20 w-28 pt-2'
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
                                        </Draggable>
                                    )
                                })}
                            </div>
                        </div>
                    </div> */}
                </div>
                <Timeline
                    style={{ textAlign: "center", marginTop: "5px", overflowY: 'scroll', marginBottom: "5px", width: '100%' }}
                    horizontalLineClassNamesForGroup={(group) => group.root ? ["row-root"] : []}
                    defaultTimeStart={moment().add(5, 'hour').add(0, 'minute')}
                    defaultTimeEnd={moment().add(13, 'hour').add(0, 'minute')}
                    ref={timelineRef}
                    scrollRef={onScrollRef}

                    itemHeightRatio={1}
                    lineHeight={75}
                    groups={groups}
                    items={items}
                    itemRenderer={itemRenderer}
                // onTimeChange={handleTimeChange}
                // defaultTimeStart={moment().add(-12, 'hour')}
                // defaultTimeEnd={moment().add(12, 'hour')}
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
                        // style={{ textAlign: "center", height: '75px', marginBottom: "0px", position: 'sticky' }}
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
            </LoadingOverlay>
            {/* </Layout> */}

        </>
    )
}
