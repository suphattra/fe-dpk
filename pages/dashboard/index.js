import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Layout from '../../layouts';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from 'chart.js/auto';
import { OperationsService } from '../api/operations.service';
import LoadingOverlay from 'react-loading-overlay';
import { InputSelectGroup } from '../../components';
import { renderOptions } from '../../helpers/utils';
import DownloadExcel from '../../components/DownloadExcel';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useRef } from 'react';
Chart.register(CategoryScale);
const localizer = momentLocalizer(moment)
const breadcrumbs = [{ index: 1, href: '/calendar-schedule', name: 'DPK MANAGMENT SYSTEM' }]
export default function MyCalendar(props) {
    const currentDate = new Date();
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const [costOfWorkPerBranch, setCostOfWorkPerBranch] = useState({ data: {}, resultTable: [] });
    const [costOfWorkPerBranchTable, setCostOfWorkPerBranchTable] = useState([]);
    const [costOfWorkPerTask, setCostOfWorkPerTask] = useState({ data: {} });
    const [costOfWorkPerTaskTable, setCostOfWorkPerTaskTable] = useState([]);

    const [costOfWorkAllBranchTable, setCostOfWorkAllBranchTable] = useState([]);
    const [taskGroup, setTaskGroup] = useState([]);
    const [reportData, setReportData] = useState([]);

    const [monthGroup, setMonthGroup] = useState([]);

    const [openTab, setOpenTab] = useState(0);
    const [openTabInside, setOpenTabInside] = useState(2);
    const [success, setSuccess] = useState(false);
    const [optionYear, setOptionYear] = useState([]);
    const [yearBranch, setYearBranch] = useState(new Date().getFullYear());
    const [period, setPeriod] = useState(1);
    const [yearInv, setYearInv] = useState(new Date().getFullYear());
    const [successCost, setSuccessCost] = useState(false);
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May'];
    const [optionPeriod, setOptionPeriod] = useState([
        { value: 1, name: 'ไตรมาสที่ 1 (ม.ค. - มี.ค.)' },
        { value: 2, name: 'ไตรมาสที่ 2 (เม.ย. -มิ.ย.)' },
        { value: 3, name: 'ไตรมาสที่ 3 (ก.ค. - ก.ย.)' },
        { value: 4, name: 'ไตรมาสที่ 4 (ต.ค. - ธ.ค.)' }
    ]);
    const [periodLabel, setPeriodLabel] = useState('ไตรมาสที่ 1 (ม.ค. - มี.ค.)');

    /**
     * inventory
     */
    const [optionMonth, setOptionMonth] = useState([
        { value: "01", name: 'มกราคม' },
        { value: "02", name: 'กุมพาพันธ์' },
        { value: "03", name: 'มีนาคม' },
        { value: "04", name: 'เมษายน' },
        { value: "05", name: 'พฤษภาคม' },
        { value: "06", name: 'มิถุนายน' },
        { value: "07", name: 'กรกฎาคม' },
        { value: "08", name: 'สิงหาคม' },
        { value: "09", name: 'กันยายน' },
        { value: "10", name: 'ตุลาคม' },
        { value: "11", name: 'พฤศจิกายน' },
        { value: "12", name: 'ธันวาคม' },
    ]);
    const [periodInv, setPeriodInv] = useState("01");
    const [periodInvLabel, setPeriodInvLabel] = useState('ไตรมาสที่ 1 (ม.ค. - มี.ค.)');
    const [inventoryTable, setInventoryTable] = useState([]);
    const [inventoryBranchTable, setInventoryBranchTable] = useState([]);
    const [reportDatainventory, setReportDatainventory] = useState([]);


    const data = {
        // labels,
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November ', 'December'],
        datasets: [
            // {
            //     label: "BR10068",
            //     data: [16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     branchCode: "BR10068",
            //     borderWidth: 1,
            //     stack: 1,
            //     backgroundColor: '#F3B95F',
            //     borderColor: '#F3B95F',
            //     hoverBackgroundColor: "rgba(255,99,132,0.4)",
            //     hoverBorderColor: "rgba(255,99,132,1)"
            // },
            // {
            //     "label": "BR10069",
            //     "data": [
            //         121,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0,
            //         0
            //     ],
            //     branchCode: "BR10068",
            //     borderWidth: 1,
            //     stack: 1,
            //     backgroundColor: '#FDE767',
            //     borderColor: '#FDE767',
            //     hoverBackgroundColor: "rgba(255,99,132,0.4)",
            //     hoverBorderColor: "rgba(255,99,132,1)"
            // },
            // {
            //     "label": "BR10051",
            //     "data": [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     branchCode: "BR10068",
            //     borderWidth: 1,
            //     stack: 1,
            //     "backgroundColor": "#D10484",
            //     "borderColor": "#D10484",
            //     hoverBackgroundColor: "rgba(255,99,132,0.4)",
            //     hoverBorderColor: "rgba(255,99,132,1)"
            // },
            {
                label: 'My First dataset 3',
                backgroundColor: '#D10484',
                borderColor: '#D10484',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
            },
            {
                label: 'My First dataset',
                backgroundColor: '#D04848',
                borderColor: '#D04848',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
            },
            {
                label: 'My second dataset',
                backgroundColor: '#F3B95F',
                borderColor: '#F3B95F',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                "data": [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                label: 'My 3 dataset',
                backgroundColor: '#FDE767',
                borderColor: '#FDE767',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                "data": [6, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                label: 'C',
                backgroundColor: '#6895D2',
                borderColor: '#6895D2',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [40, 59, 80, 81, 56, 55, 40]
            },
            // {
            //     label: 'D',
            //     backgroundColor: '#0766AD',
            //     borderColor: '#0766AD',
            //     borderWidth: 1,
            //     // stack: 1,
            //     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            //     hoverBorderColor: 'rgba(255,99,132,1)',
            //     data: [50, 59, 80, 81, 56, 55, 40]
            // },
            // {
            //     label: 'D',
            //     backgroundColor: '#29ADB2',
            //     borderColor: '#29ADB2',
            //     borderWidth: 1,
            //     // stack: 1,
            //     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            //     hoverBorderColor: 'rgba(255,99,132,1)',
            //     data: [60, 59, 80, 81, 56, 55, 40]
            // },
            // {
            //     label: 'D',
            //     backgroundColor: '#C5E898',
            //     borderColor: '#C5E898',
            //     borderWidth: 1,
            //     // stack: 1,
            //     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            //     hoverBorderColor: 'rgba(255,99,132,1)',
            //     data: [70, 59, 80, 81, 56, 55, 40]
            // }
        ],
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            xAxes: [{
                barPercentage: 1
            }]
        },
        scales: {
            y: {
                grid: {
                    drawBorder: false, // <-- this removes y-axis line
                    lineWidth: 1
                    // lineWidth: function (context) {
                    //   return context?.index === 0 ? 0 : 1; // <-- this removes the base line
                    // }
                }
            },
            x: {
                grid: {
                    drawBorder: false,
                    lineWidth: 1 // <-- this removes vertical lines between bars
                }
            }
        },
        // layout: {
        //     padding: 20
        // },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        },
        datalabels: {
            display: true,
        }
        // scales: {
        //     x: {
        //         stacked: false
        //     },
        //     yAxes: [
        //         {
        //             ticks: {
        //                 beginAtZero: false,
        //             },
        //         },
        //     ],
        // },
        // plugins: {
        //     title: {
        //         display: true,
        //         text: 'Work per Branch',
        //     },
        //     zoom: { // This should be zoom not plugins
        //         pan: {
        //             enabled: true,
        //             mode: 'y',
        //         },
        //         limits: {
        //             x: { min: 5, max: 7 },
        //         },
        //         zoom: {
        //             pan: {
        //                 enabled: true,
        //             },
        //         },
        //     },
        // },
    };
    useEffect(() => {
        async function fetchData() {
            await getCostOfWorkPerBranch(new Date().getFullYear(), 1)
            await getCostOfWorkPerTask(new Date().getFullYear(), 1)
            await getCostOfWorkAllBranch(new Date().getFullYear(), 1)
            await getInventoryReport(new Date().getFullYear(), 1)
        }
        fetchData();
    }, []);
    useEffect(() => {
        let month = new Date().getMonth() + 1
        console.log("month", month)
        if (month >= 1 && month < 4) {
            setPeriod(1)
            setPeriodLabel(optionPeriod.find(ele => ele.value == 1).name)
            setPeriodInvLabel(optionPeriod.find(ele => ele.value == 1).name)
        } else if (month >= 4 && month < 6) {
            setPeriod(2)
            setPeriodLabel(optionPeriod.find(ele => ele.value == 2).name)
            setPeriodInvLabel(optionPeriod.find(ele => ele.value == 2).name)
        } else if (month >= 6 && month < 9) {
            setPeriod(3)
            setPeriodLabel(optionPeriod.find(ele => ele.value == 3).name)
            setPeriodInvLabel(optionPeriod.find(ele => ele.value == 3).name)
        } else if (month >= 9 && month < 12) {
            setPeriod(4)
            setPeriodLabel(optionPeriod.find(ele => ele.value == 4).name)
            setPeriodInvLabel(optionPeriod.find(ele => ele.value == 4).name)
        }

    }, []);
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        let listYear = []
        for (let i = 0; i < 3; i++) {
            const year = currentYear - i;
            console.log(currentYear)
            console.log(year)
            listYear.push({ value: year, text: "ประจำปี ค.ศ. " + year })

        }
        setOptionYear(listYear)
    }, []);

    const getCostOfWorkPerBranch = async (searchParam, period) => {
        console.log(searchParam)
        setLoading(true)
        setPeriodLabel(optionPeriod.find(ele => ele.value == period).name)
        await OperationsService.getCostOfWorkPerBranch({ year: searchParam, period: period }).then(res => {
            if (res.data.resultCode === 200) {
                setSuccess(true)
                setCostOfWorkPerBranch(res.data.resultData)
                setCostOfWorkPerBranchTable(res.data.resultTable)
                setMonthGroup(res.data.monthGroup)
                setLoading(false)
            } else {
                setCostOfWorkPerBranch([])
                setLoading(false)
            }
        }).catch(err => {
            setLoading(false)
        })
    }
    const getCostOfWorkPerTask = async (searchParam, period) => {
        setLoading(true)
        await OperationsService.costOfWorkPerTask({ year: searchParam, period: period }).then(res => {
            if (res.data.resultCode === 200) {
                setSuccessCost(true)
                setCostOfWorkPerTask(res.data.resultData)
                setCostOfWorkPerTaskTable(res.data.resultTable)
                setLoading(false)
            } else {
                setCostOfWorkPerTask([])
                setLoading(false)
            }
        }).catch(err => {
        })
    }
    const getCostOfWorkAllBranch = async (searchParam, period) => {
        await OperationsService.costOfWorkAllBranch({ year: searchParam, period: period }).then(async res => {
            if (res.data.resultCode === 200) {
                setSuccessCost(true)
                await setCostOfWorkAllBranchTable(res.data.resultData)
                await setTaskGroup(res.data.taskGroup)
                await initExport(res.data.resultData, res.data.taskGroup, res.data.monthGroup, searchParam)
                setLoading(false)
            } else {
                setCostOfWorkAllBranchTable([])
                setLoading(false)
            }
        }).catch(err => {
        })
    }
    const initExport = async (resultData, taskGroup, monthGroup, year) => {
        const styleHeader = {
            fill: { fgColor: { rgb: "6aa84f" } },
            font: { sz: "12", bold: true },
            alignment: { horizontal: "center" },
        };
        const styleData = {
            font: { sz: "10", bold: false },
            alignment: { horizontal: "center" },
        };
        let columnTask = taskGroup.map((item, index) => {
            return { title: item.value1, style: styleHeader, width: { wpx: 90 } }
        })
        const column = [
            { title: 'แปลงใหญ่', style: styleHeader, width: { wpx: 200 } },
            ...columnTask,
            { title: 'รวม/เดือน', style: { ...styleHeader, fill: { fgColor: { rgb: "F4F98B" } }, width: { wpx: 120 } } },
        ];
        let dataRecord = [];
        let dataRecord2 = [];
        let dataRecord3 = [];
        if (resultData && resultData.length > 0) {
            dataRecord = resultData[0]?.map((item, index) => {
                let task = []
                for (const name of item.task) {

                    Object.keys(name).forEach(key => {
                        if (key != 'name' && key != 'value') {
                            const value = name[key];
                            task.push({ value: value, style: styleData })
                        }
                    });

                }
                let sumcolumn = 0
                sumcolumn = task.reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0);
                task.push({ value: sumcolumn, style: styleData })
                return [
                    { value: item.branchName, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    ...task
                ];
            });
            dataRecord2 = resultData[1]?.map((item, index) => {
                let task = []
                for (const name of item.task) {
                    Object.keys(name).forEach(key => {
                        if (key != 'name' && key != 'value') {
                            const value = name[key];
                            task.push({ value: value, style: styleData })
                        }
                    });
                }
                let sumcolumn = 0
                sumcolumn = task.reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0);
                task.push({ value: sumcolumn, style: styleData })
                return [
                    { value: item.branchName, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    ...task
                ];
            });
            dataRecord3 = resultData[2]?.map((item, index) => {
                let task = []
                for (const name of item.task) {
                    Object.keys(name).forEach(key => {
                        if (key != 'name' && key != 'value') {
                            const value = name[key];
                            task.push({ value: value, style: styleData })
                        }
                    });
                }
                let sumcolumn = 0
                sumcolumn = task.reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0);
                task.push({ value: sumcolumn, style: styleData })
                return [
                    { value: item.branchName, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    ...task
                ];
            });
        }
        console.log('dataRecord', dataRecord, dataRecord2, dataRecord3)
        let multiDataSet = [];
        //sum
        // let sum = dataRecord.reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0)
        // dataRecord.map(ele => {
        //     // console.log(Object.values(ele).slice(1, task.length))
        //     sum = Object.values(ele).slice(1, task.length).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)

        //     // console.log(Object.values(ele).slice(1, task.length).reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0))
        // })
        // console.log('sum', sum)
        // if (dataRecord.length > 0) {
        multiDataSet = [
            {
                xSteps: column.length + 1,
                columns: [
                    { title: '' },
                ],
                data: [],
            },
            {
                xSteps: 2,
                columns: [
                    { title: 'สรุปค่าแรงของสาขา/ประเภทงาน (หน่วย บาท) ประจำเดือน ' + monthGroup[0].display + ' ' + year, style: { colSpan: 2 } },
                ],
                data: [],
            },
            {
                columns: column,
                data: dataRecord ? dataRecord : [],
            },
            {
                columns: [],
                data: [],
            },
            {
                xSteps: 2,
                columns: [
                    { title: 'สรุปค่าแรงของสาขา/ประเภทงาน (หน่วย บาท) ประจำเดือน ' + monthGroup[1].display + ' ' + year, style: { colSpan: 2 } },
                ],
                data: [],
            },
            {
                columns: column,
                data: dataRecord2 ? dataRecord2 : [],
            },
            {
                columns: [],
                data: [],
            },
            {
                xSteps: 2,
                columns: [
                    { title: 'สรุปค่าแรงของสาขา/ประเภทงาน (หน่วย บาท) ประจำเดือน ' + monthGroup[2].display + ' ' + year, style: { colSpan: 2 } },
                ],
                data: [],
            },
            {
                columns: column,
                data: dataRecord3 ? dataRecord3 : [],
            },
        ];
        // }
        setReportData(multiDataSet);
    }

    const getInventoryReport = async (year, month) => {
        setPeriodInvLabel(optionMonth.find(ele => ele.value == month).name)
        let monthLabel = optionMonth.find(ele => ele.value == month).name
        await OperationsService.inventoryReport({ year: year, month: month }).then(async res => {
            if (res.data.resultCode === 200) {
                setInventoryTable(res.data.resultTable)
                setInventoryBranchTable(res.data.branchs)
                await initExportInv(res.data.resultTable, res.data.branchs, year, monthLabel)
                setLoading(false)
            } else {
                setLoading(false)
            }
        }).catch(err => {
        })
    }

    const initExportInv = async (resultData, branchs, year, month) => {
        const styleHeader = {
            fill: { fgColor: { rgb: "6aa84f" } },
            font: { sz: "10", bold: false },
            alignment: { horizontal: "center" },
        };
        const styleData = {
            font: { sz: "10", bold: false },
            alignment: { horizontal: "center" },
        };
        let columnTask = branchs.map((item, index) => {
            return { title: item.branchName, style: styleData, width: { wpx: 90 } }
        })
        const column = [
            { title: 'ลำดับ', style: styleHeader, width: { wpx: 50 } },
            { title: 'รหัสสินค้า', style: styleHeader, width: { wpx: 100 } },
            { title: 'ชื่อสินค้า', style: styleHeader, width: { wpx: 200 } },
            { title: 'หน่วย', style: styleHeader, width: { wpx: 100 } },
            { title: 'ราคา/หน่วย', style: styleHeader, width: { wpx: 100 } },
            ...columnTask,
            { title: 'รวม', style: { ...styleHeader, fill: { fgColor: { rgb: "F4F98B" } }, width: { wpx: 120 } } },
        ];
        let dataRecord = [];
        if (resultData && resultData.length > 0) {
            dataRecord = resultData.map((item, index) => {
                let task = []
                inventoryBranchTable.length > 0 && inventoryBranchTable.map((inv) => (
                    task.push({ value: item.distribution.filter((ele) => ele.branchCode == inv.branchCode).reduce((acc, entry) => acc + parseFloat(entry.amount), 0), style: { ...styleData, alignment: { horizontal: "right" }, } })
                ))
                return [
                    { value: index + 1, style: { ...styleData, alignment: { horizontal: "center" }, } },
                    { value: item.inventoryCode, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    { value: item.inventoryTradeName, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    { value: item.unit, style: { ...styleData, alignment: { horizontal: "left" }, } },
                    { value: item.pricePerUnit, style: { ...styleData, alignment: { horizontal: "right" }, } },
                    ...task,
                    { value: item.distribution.reduce((acc, val) => acc + (parseFloat(val.amount) || 0), 0).toLocaleString(), style: styleData }
                ];
            });
        }
        let multiDataSet = [
            {
                xSteps: 5,
                columns: [
                    { title: 'สรุปค่าแรงของสาขา/ประเภทงาน (หน่วย บาท) ประจำเดือน ' + month + ' ' + year, merge: { colSpan: 2 }, style: { ...styleData }, across: 5 },
                ],
                data: [],
            },
            {
                columns: column,
                data: dataRecord,
            }
        ];
        setReportDatainventory(multiDataSet)
    }
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const optionsr = {
        legend: {
            display: false
        },
        responsive: false,
        tooltips: {
            mode: 'label'
        },
        elements: {
            line: {
                fill: false
            }
        },
        scales: {
            xAxes: [
                {
                    barThickness: 'flex',
                    display: true,
                    gridLines: {
                        display: false
                    },
                    // labels: x,
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            ],
            yAxes: [
                {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    gridLines: {
                        display: true
                    },
                    labels: {
                        show: false
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
    // function calculateWidth() {
    //     const { x } = this.props
    //     let length = x ? x.length : 0
    //     switch (true) {
    //         case length >= 0 && length <= 3:
    //             return 400
    //         case length >= 4 && length <= 50:
    //             return 1200
    //         case length >= 51 && length <= 100:
    //             return 2000
    //         default:
    //             return 5000
    //     }
    // }
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 10//Math.max(...costOfWorkPerBranch.values) + 1, // Adjust the max value based on your data
            },
        },
    };

    return <>
        <Layout>
            <LoadingOverlay active={loading} className="h-[calc(100vh-4rem)]" spinner text='Loading...'
                styles={{
                    overlay: (base) => ({ ...base, background: 'rgba(215, 219, 227, 0.6)' }), spinner: (base) => ({ ...base, }),
                    wrapper: {
                        overflowY: loading ? 'scroll' : 'scroll'
                    }
                }}>
                <Breadcrumbs title="Calendar Schedule" breadcrumbs={breadcrumbs} />
                <main className="flex-1">

                    <div className="mx-auto w-full max-w-full pt-1">

                        <div className="mt-2 sm:mt-2 sm:p-4 lg:p-4">
                            <div className="hidden sm:block">
                                <div className="flex items-center border-b-2 drop-shadow-xl border-indigo-900">
                                    <nav className="-mb-px flex flex-1 space-x-6 xl:space-x-2" id="tabs-tab" role="tablist">
                                        <button
                                            className={classNames(
                                                openTab === 0
                                                    ? 'border-indigo-300 text-white bg-indigo-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                'whitespace-nowrap py-2 px-1 border-b-2 font-bold text-sm cursor-pointer w-36 rounded-t-md'
                                            )}
                                            onClick={() => setOpenTab(0)} key={0}>
                                            งาน
                                        </button>
                                        {<button onClick={() => setOpenTab(1)} key={1}
                                            className={classNames(
                                                openTab === 1
                                                    ? 'border-indigo-300 text-white bg-indigo-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                'whitespace-nowrap py-2 px-1 border-b-2 font-bold text-sm cursor-pointer w-36 rounded-t-md'
                                            )}>
                                            สินค้าคงคลัง
                                        </button>}
                                    </nav>
                                </div>
                            </div>
                            <div className={classNames(openTab === 0 ? "block" : "hidden", "h-[calc(100vh-200px)] overflow-y-auto")}>
                                <div className="container " id="tabs-tabContent">
                                    <div className="flex items-end justify-end py-2">
                                        <div className="uppercase text-blueGray-400 mb-0 text-md font-semibold mr-4">
                                            <InputSelectGroup
                                                type="text"
                                                id={"period"}
                                                name="period"
                                                label=""
                                                onChange={async (e) => {
                                                    setPeriod(e.target.value)
                                                    getCostOfWorkPerBranch(yearBranch, e.target.value)
                                                    getCostOfWorkPerTask(yearBranch, e.target.value)
                                                    getCostOfWorkAllBranch(yearBranch, e.target.value)

                                                }}
                                                isDefault={true}
                                                options={[
                                                    { value: 1, name: 'ไตรมาสที่ 1 (ม.ค. - มี.ค.)' },
                                                    { value: 2, name: 'ไตรมาสที่ 2 (เม.ย. -มิ.ย.)' },
                                                    { value: 3, name: 'ไตรมาสที่ 3 (ก.ค. - ก.ย.)' },
                                                    { value: 4, name: 'ไตรมาสที่ 4 (ต.ค. - ธ.ค.)' }
                                                ]}
                                                value={period}
                                            />

                                        </div>
                                        <div className="uppercase text-blueGray-400 mb-0 text-md font-semibold mr-4">
                                            <InputSelectGroup
                                                type="text"
                                                id={"year"}
                                                name="year"
                                                label=""
                                                onChange={async (e) => {
                                                    console.log(e)
                                                    setYearBranch(e.target.value)
                                                    getCostOfWorkPerBranch(e.target.value, period)
                                                    getCostOfWorkPerTask(e.target.value, period)
                                                    getCostOfWorkAllBranch(e.target.value, period)
                                                }}
                                                isDefault={true}
                                                options={renderOptions(optionYear, "text", "value")}
                                                value={yearBranch}
                                            />

                                        </div>
                                        {/* </div> */}
                                        {reportData.length > 0 && (
                                            <div className='pb-1'>
                                                <DownloadExcel
                                                    reportData={reportData}
                                                    name="สร้างรายงาน"
                                                    filename={"สรุปค่าแรงของสาขาตามประเภทงาน " + periodLabel + " ประจำปี " + yearBranch}
                                                />
                                            </div>
                                        )}
                                        {/* <button type="button"
                                            onClick={() => {
                                                getCostOfWorkAllBranch(yearBranch, period)
                                            }}
                                            className="flex justify-center inline-flex items-center mb-1 rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
                                                <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                                            </svg>
                                            สร้างรายงาน
                                        </button> */}
                                        <button type="button"
                                            onClick={() => {
                                                getCostOfWorkPerBranch(yearBranch, period)
                                                getCostOfWorkPerTask(yearBranch, period)
                                                getCostOfWorkAllBranch(yearBranch, period)
                                            }}
                                            className="flex justify-center inline-flex items-center mb-1 rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 mr-2">
                                            รีเฟรชข้อมูล
                                        </button>
                                    </div>
                                    <div className="flex items-center border-b-2 drop-shadow-xl border-indigo-900">
                                        <nav className="-mb-px flex flex-1 space-x-6 xl:space-x-2" id="tabs-tab" role="tablist">
                                            <button
                                                className={classNames(
                                                    openTabInside === 2
                                                        ? 'border-indigo-300 text-white bg-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                    'whitespace-nowrap py-2 px-1 border-b-2 font-bold text-sm cursor-pointer w-36 rounded-t-md'
                                                )}
                                                onClick={() => setOpenTabInside(2)} key={2}>
                                                แสดงแบบกราฟ
                                            </button>
                                            {<button onClick={() => setOpenTabInside(3)} key={3}
                                                className={classNames(
                                                    openTabInside === 3
                                                        ? 'border-indigo-300 text-white bg-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                    'whitespace-nowrap py-2 px-1 border-b-2 font-bold text-sm cursor-pointer w-36 rounded-t-md'
                                                )}>
                                                แสดงแบบตาราง
                                            </button>}
                                        </nav>
                                    </div>
                                    <div className={classNames(openTabInside === 2 ? "block" : "hidden", "")}>
                                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">

                                            <div className="rounded-t mb-0 px-4 py-1 bg-transparent">
                                                <div className="py-4">
                                                    <div className="flex items-between justify-between">

                                                        <h2 className="text-blueGray-700 text-xl font-semibold">
                                                            สรุปค่าแรงของแต่ละสาขา/แปลง
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-auto  ">
                                                <div className="relative h-96 min-w-full overflow-y-auto" >
                                                    {success && <Bar data={costOfWorkPerBranch} options={options} />}
                                                </div>
                                            </div>
                                            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                                <div className="py-4">
                                                    <div className="flex items-between justify-between">
                                                        <h2 className="text-blueGray-700 text-xl font-semibold">
                                                            สรุปค่าแรงตามประเภทงาน
                                                        </h2>
                                                        <div className="uppercase text-blueGray-400 mb-1 text-md font-semibold w-1/6">
                                                            {/* <InputSelectGroup
                                                                type="text"
                                                                id={"year"}
                                                                name="year"
                                                                label=""
                                                                onChange={async (e) => {
                                                                    console.log(e)
                                                                    // setYearTask(e.target.value)
                                                                    getCostOfWorkPerTask(e.target.value)
                                                                }}
                                                                options={renderOptions(optionYear, "text", "value")}
                                                                value={yearBranch}
                                                            /> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-auto">
                                                <div className="relative h-96 min-w-full overflow-x-auto">
                                                    {successCost && <Bar data={costOfWorkPerTask} options={options} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classNames(openTabInside === 3 ? "block" : "hidden", "")}>
                                        <h2 className="text-blueGray-700 text-xl font-semibold p-2">
                                            สรุปค่าแรงตามประเภทงานและสาขา
                                        </h2>
                                        {costOfWorkAllBranchTable && costOfWorkAllBranchTable.length > 0 && costOfWorkAllBranchTable.map((item, index) => (
                                            <>
                                                <h2 className="text-blueGray-700 text-sm font-semibold p-2 text-center">
                                                    สรุปค่าแรงของสาขา/ประเภทงาน (หน่วย บาท) ประจำเดือน {monthGroup[index].display}</h2>
                                                <div className='w-full overflow-y-auto'>
                                                    <table className="min-w-full divide-y divide-gray-300 border rounded-md">
                                                        <thead className="bg-gray-50">
                                                            <tr className='text-center'>
                                                                <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-20">
                                                                    แปลงใหญ่/แปลงย่อย
                                                                </th>
                                                                {taskGroup.length > 0 && taskGroup.map((item) => (
                                                                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold border text-gray-900 w-24">
                                                                        {item.value1}
                                                                    </th>
                                                                ))}
                                                                <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900 w-24">
                                                                    รวม
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                            <>
                                                                {item.map((item2) => (
                                                                    <tr className='text-center'>
                                                                        <td className="whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-24">
                                                                            {item2.branchName}
                                                                        </td>
                                                                        {item2.task.length > 0 && item2.task.map((task) => (
                                                                            <td scope="col" className="px-3 py-3.5 text-sm font-medium border text-gray-900 w-24">
                                                                                {/* {item.task.find(ele=>ele.name)} */}
                                                                                {task.value.toLocaleString()}
                                                                            </td>
                                                                        ))}
                                                                        <td colSpan="20" className='bg-green-50 whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-30'>{item2.task.reduce((acc, val) => acc + (parseFloat(val.value) || 0), 0).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                                {item.length <= 0 &&
                                                                    <tr className='text-center bg-red-50 p-2'>
                                                                        <td colSpan="20" className='p-2'>ไม่มีข้อมูล</td>
                                                                    </tr>}

                                                            </>

                                                        </tbody>


                                                    </table>
                                                </div>
                                            </>
                                        ))}
                                        <h2 className="text-blueGray-700 text-xl font-semibold p-4">
                                            สรุปค่าแรงของแต่ละสาขา/แปลง
                                        </h2>
                                        <table className="min-w-full divide-y divide-gray-300 border rounded-md">
                                            <thead className="bg-gray-50">
                                                <tr className='text-center'>
                                                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                        สาขา/แปลง
                                                    </th>
                                                    {monthGroup.length > 0 && monthGroup.map((item) => (
                                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                            {item.display}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {costOfWorkPerBranchTable && costOfWorkPerBranchTable.length > 0 && costOfWorkPerBranchTable.sort().map((item) => (
                                                    <>
                                                        <tr className='text-center'>
                                                            <td className="whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-1/5">
                                                                {item.branchName}
                                                            </td>
                                                            {monthGroup.length > 0 && monthGroup.map((label) => (
                                                                <td className="whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-1/5">
                                                                    {item[label.display] ? item[label.display].toLocaleString() : 0}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                        <h2 className="text-blueGray-700 text-xl font-semibold p-4">
                                            สรุปค่าแรงตามประเภทงาน
                                        </h2>
                                        <table className="min-w-full divide-y divide-gray-300 border rounded-md">
                                            <thead className="bg-gray-50">
                                                <tr className='text-center'>
                                                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                        ประเภทงาน
                                                    </th>
                                                    {monthGroup.length > 0 && monthGroup.map((item) => (
                                                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                            {item.display}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {costOfWorkPerTaskTable && costOfWorkPerTaskTable.length > 0 && costOfWorkPerTaskTable.sort().map((item) => (
                                                    <>
                                                        <tr className='text-center'>
                                                            <td className="whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-1/5">
                                                                {item.taskName}
                                                            </td>
                                                            {monthGroup.length > 0 && monthGroup.map((label) => (
                                                                <td className="whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-1/5">
                                                                    {item[label.display] ? item[label.display].toLocaleString() : 0}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className={classNames(openTab === 1 ? "block" : "hidden", "h-[calc(100vh-200px)] overflow-y-auto")}>
                                <div className="container px-8" id="tabs-tabContent">
                                    <div className="flex items-end justify-end py-2">
                                        <div className="uppercase text-blueGray-400 mb-0 text-md font-semibold mr-4">
                                            <InputSelectGroup
                                                type="text"
                                                id={"periodInv"}
                                                name="periodInv"
                                                label=""
                                                onChange={async (e) => {
                                                    setPeriodInv(e.target.value)
                                                    getInventoryReport(yearInv, e.target.value)

                                                }}
                                                isDefault={true}
                                                options={optionMonth}
                                                value={periodInv}
                                            />

                                        </div>
                                        <div className="uppercase text-blueGray-400 mb-0 text-md font-semibold mr-4">
                                            <InputSelectGroup
                                                type="text"
                                                id={"yearInv"}
                                                name="yearInv"
                                                label=""
                                                onChange={async (e) => {
                                                    console.log(e)
                                                    setYearInv(e.target.value)
                                                    getInventoryReport(e.target.value, periodInv)
                                                }}
                                                isDefault={true}
                                                options={renderOptions(optionYear, "text", "value")}
                                                value={yearInv}
                                            />

                                        </div>
                                        {/* {reportDatainventory.length > 0 && (
                                            <div className='pb-1'>
                                                <DownloadExcel
                                                    reportData={reportDatainventory}
                                                    name="สร้างรายงาน"
                                                    filename={"สรุปรายการสินค้าที่ถูกกระจายตามสาขา (จำนวนหน่วย) ประจำเดือน " + periodInvLabel + " ประจำปี " + yearInv}
                                                />
                                            </div>
                                        )} */}
                                        <div className='pb-1'>
                                            <DownloadTableExcel
                                                filename={"สรุปรายการสินค้าที่ถูกกระจายตามสาขา (จำนวนหน่วย) ประจำเดือน " + periodInvLabel + " ประจำปี " + yearInv}
                                                sheet={periodInvLabel + yearInv}
                                                currentTableRef={tableRef.current}
                                            >

                                                <button className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium shadow-sm hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2 disabled:text-gray-800 disabled:bg-gray-50 disabled:text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48" className='mr-2'>
                                                        <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
                                                    </svg> สร้างรายงาน </button>

                                            </DownloadTableExcel></div>
                                        <button type="button"
                                            onClick={() => {
                                                getInventoryReport(yearInv, periodInv)
                                            }}
                                            className="flex justify-center inline-flex items-center mb-1 rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 mr-2">
                                            รีเฟรชข้อมูล
                                        </button>
                                    </div>
                                    <div class="flex flex-col">
                                        <div className="rounded-t mb-0 bg-transparent">
                                            <div className="py-4">
                                                <div className="flex items-between justify-between">
                                                    <h2 className="text-blueGray-700 text-md font-semibold">
                                                        สรุปรายการสินค้าที่ถูกกระจายไปแต่ละแปลง
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                                            <div class="border-b border-gray-200 shadow">
                                                <div className='w-full overflow-y-auto'>
                                                    <table ref={tableRef} id="table-inv" class="min-w-full divide-y divide-gray-300 border rounded-md">
                                                        <thead class="bg-gray-50">
                                                            <tr className='text-center'>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border text-center bg-lime-100" rowspan="2">
                                                                    ลำดับ
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border text-center bg-lime-100" rowspan="2">
                                                                    รหัสสินค้า
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border text-center bg-lime-100" rowspan="2">
                                                                    ชื่อสินค้า
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border text-center bg-lime-100" rowspan="2">
                                                                    หน่วย
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border whitespace-nowrap text-center bg-lime-100" rowspan="2">
                                                                    ราคา/หน่วย
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 row-span-3 border text-center bg-lime-200" colSpan={inventoryBranchTable.length}>
                                                                    จำนวนการกระจายสินค้า/สาขา(หน่วย)
                                                                </th>
                                                                <th class="px-6 py-2 text-xs text-gray-900 border whitespace-nowrap text-center bg-lime-100" rowspan="2">
                                                                    รวม
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                {inventoryBranchTable.length > 0 && inventoryBranchTable.map((item) => (
                                                                    <th scope="col" className="px-6 py-2 text-xs text-gray-900 border whitespace-nowrap" style={{ width: "200px" }}>
                                                                        {item.branchName}
                                                                    </th>
                                                                ))}

                                                            </tr>

                                                        </thead>
                                                        <tbody class="bg-white divide-y divide-gray-300">
                                                            <>
                                                                {inventoryTable.map((inv, index) => (
                                                                    <tr class="whitespace-nowrap">
                                                                        <td class="px-6 py-4 text-sm text-gray-900 border">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td class="px-6 py-4 text-sm text-gray-900 border">
                                                                            {inv.inventoryCode}
                                                                        </td>
                                                                        <td class="px-6 py-4 text-sm text-gray-900 border">
                                                                            {inv.inventoryTradeName}
                                                                        </td>
                                                                        <td class="px-6 py-4 text-sm text-gray-900 border text-center">
                                                                            {inv.unit}
                                                                        </td>
                                                                        <td class="px-6 py-4 text-sm text-gray-900 border text-center">
                                                                            {inv.pricePerUnit}
                                                                        </td>
                                                                        {inventoryBranchTable.length > 0 && inventoryBranchTable.map((item) => (
                                                                            // {inv.distribution.length > 0 && inv.distribution.map((item) => (
                                                                            <td scope="col"
                                                                                className={classNames("px-6 py-4 text-sm text-gray-500 border whitespace-nowrap text-center",
                                                                                    inv.distribution.filter((ele) => ele.branchCode == item.branchCode).reduce((acc, entry) => acc + parseFloat(entry.amount), 0) == "0" ? "text-gray-500" : "text-red-700 font-bold")}
                                                                                style={{ width: "150px" }}
                                                                            >
                                                                                {inv.distribution.filter((ele) => ele.branchCode == item.branchCode).reduce((acc, entry) => acc + parseFloat(entry.amount), 0)}
                                                                            </td>
                                                                        ))}
                                                                        <td className='bg-green-50 whitespace-nowrap border py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>{inv.distribution.reduce((acc, val) => acc + (parseFloat(val.amount) || 0), 0).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                                {inventoryTable.length <= 0 &&
                                                                    <tr className='text-center bg-red-50 p-2'>
                                                                        <td colSpan="20" className='p-2'>ไม่มีข้อมูล</td>
                                                                    </tr>}
                                                            </>


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                {/* <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    step={60}
                    style={{ height: 600 }}
                    resizable
                    eventPropGetter={eventStyleGetter}
                /> */}
                {/* </div> */}
            </LoadingOverlay>
        </Layout>
    </>
}
