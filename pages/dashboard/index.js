import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Layout from '../../layouts';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useState } from 'react';
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);
const localizer = momentLocalizer(moment)
const breadcrumbs = [{ index: 1, href: '/calendar-schedule', name: 'DPK MANAGMENT SYSTEM' }]
export default function MyCalendar(props) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
    const [chartDialy, setChartDialy] = useState({ "datasets": [] });
    const [openTab, setOpenTab] = useState(0);
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May'];
    const data = {
        labels,
        datasets: [
            {
                llabel: 'My First dataset',
                backgroundColor: '#D04848',
                borderColor: '#D04848',
                borderWidth: 1,
                stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My second dataset',
                backgroundColor: '#F3B95F',
                borderColor: '#F3B95F',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [54, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My 3 dataset',
                backgroundColor: '#FDE767',
                borderColor: '#FDE767',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [6, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'C',
                backgroundColor: '#6895D2',
                borderColor: '#6895D2',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [23, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'D',
                backgroundColor: '#0766AD',
                borderColor: '#0766AD',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [44, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'D',
                backgroundColor: '#29ADB2',
                borderColor: '#29ADB2',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [55, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'D',
                backgroundColor: '#C5E898',
                borderColor: '#C5E898',
                borderWidth: 1,
                // stack: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [76, 59, 80, 81, 56, 55, 40]
            },
            // {
            //     label: 'Dataset 1',
            //     data: [5, 6, 7, 5, 6, 7, 5, 6, 7],
            //     backgroundColor: 'rgba(255, 99, 132, 0.5)',
            // },
            // {
            //     label: 'Dataset 2',
            //     data: [5, 6, 7, 5, 6, 7, 5, 6, 7],
            //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // },
            // {
            //     label: 'Dataset 3',
            //     data: [[5, 6, 7, 5, 6, 7, 5, 6, 7]],
            //     backgroundColor: 'rgba(53, 162, 235, 0.8)',
            // },
        ],
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            // x: {
            //     stacked: true
            // },
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    // const options = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //         title: {
    //             display: true,
    //             text: 'Chart.js Bar Chart',
    //         },
    //     },
    // };
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return <>
        <Layout>
            <Breadcrumbs title="Calendar Schedule" breadcrumbs={breadcrumbs} />
            {/* <div className='p-2'> */}
            {/* <div className="relative h-48 w-full overflow-x-auto">
                                        <Bar data={data} options={options} />
                                    </div> */}
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
                                    <button type="button"

                                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 mr-2">
                                        รีเฟรชข้อมูล
                                    </button>
                                </div>
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">

                                    <div className="rounded-t mb-0 px-4 py-1 bg-transparent">
                                        <div className="py-4">
                                            <div className="flex items-between justify-between">

                                                <h2 className="text-blueGray-700 text-xl font-semibold">
                                                    สรุปค่าแรงของแต่ละสาขา/แปลง
                                                </h2>
                                                <h3 className="uppercase text-blueGray-400 mb-1 text-md font-semibold">
                                                    ประจำปี พ.ศ. 2567
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-auto">
                                        <div className="relative h-56 min-w-full overflow-x-auto">
                                            <Bar data={data} options={options} />
                                        </div>
                                    </div>
                                    <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                                        <div className="py-4">
                                            <div className="flex items-between justify-between">
                                                <h2 className="text-blueGray-700 text-xl font-semibold">
                                                    สรุปค่าแรงตามประเภทงาน
                                                </h2>
                                                <h3 className="uppercase text-blueGray-400 mb-1 text-md font-semibold">
                                                    ประจำปี พ.ศ. 2567
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-auto">
                                        <div className="relative h-56 min-w-full overflow-x-auto">
                                            <Bar data={data} options={options} />
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="relative h-350-px">
                                    <Bar data={data} options={options} />
                                </div>
                                <div className="relative h-350-px">
                                    <Bar data={data} options={options} />
                                </div> */}
                            </div>
                        </div>
                        <div className={classNames(openTab === 1 ? "block" : "hidden", "h-[calc(100vh-250px)] overflow-y-auto")}>
                            <div className="container px-8" id="tabs-tabContent">
                                <div className="flex items-end justify-end py-2">
                                    <button type="button"

                                        className="flex justify-center inline-flex items-center rounded-md border border-purple-600 bg-white-600 px-6 py-1.5 text-xs font-medium  shadow-sm hover:bg-white-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 mr-2">
                                        รีเฟรชข้อมูล
                                    </button>
                                </div>
                                <div class="flex flex-col">
                                    <div className="rounded-t mb-0 bg-transparent">
                                        <div className="py-4">
                                            <div className="flex items-between justify-between">
                                                <h2 className="text-blueGray-700 text-md font-semibold">
                                                    สรุปค่าใช้จ่ายซื้อสินค้าแต่ละรายการ (ประจำปี พ.ศ. 2567)
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                                        <div class="border-b border-gray-200 shadow">
                                            <table class="min-w-full divide-y divide-gray-300 ">
                                                <thead class="bg-gray-50">
                                                    <tr>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            ID
                                                        </th>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            Name
                                                        </th>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            Email
                                                        </th>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            Created_at
                                                        </th>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            Edit
                                                        </th>
                                                        <th class="px-6 py-2 text-xs text-gray-500">
                                                            Delete
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white divide-y divide-gray-300">
                                                    <tr class="whitespace-nowrap">
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            1
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-900">
                                                                Jon doe
                                                            </div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-500">jhondoe@example.com</div>
                                                        </td>
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            2021-1-12
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-full">Edit</a>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-full">Delete</a>
                                                        </td>
                                                    </tr>
                                                    <tr class="whitespace-nowrap">
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            1
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-900">
                                                                Jon doe
                                                            </div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-500">jhondoe@example.com</div>
                                                        </td>
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            2021-1-12
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-full">Edit</a>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-full">Delete</a>
                                                        </td>
                                                    </tr>
                                                    <tr class="whitespace-nowrap">
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            1
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-900">
                                                                Jon doe
                                                            </div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-gray-500">jhondoe@example.com</div>
                                                        </td>
                                                        <td class="px-6 py-4 text-sm text-gray-500">
                                                            2021-1-12
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-full">Edit</a>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <a href="#" class="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-full">Delete</a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col mt-8">
                                    <div className="rounded-t mb-0 bg-transparent">
                                        <div className="py-4">
                                            <div className="flex items-between justify-between">
                                                <h2 className="text-blueGray-700 text-md font-semibold">
                                                    สรุปจำนวนสินค้าที่ถูกกระจายไปแต่ละแปลง (ประจำปี พ.ศ. 2567)
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                                        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                                            <table class="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                            Name</th>
                                                        <th
                                                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                            สินค้า</th>
                                                        <th
                                                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                            Status</th>
                                                        <th
                                                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                            Edit</th>
                                                        <th
                                                            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                            Delete</th>
                                                    </tr>
                                                </thead>

                                                <tbody class="bg-white">
                                                    <tr>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <img class="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                                                        alt="admin dashboard ui" />
                                                                </div>

                                                                <div class="ml-4">
                                                                    <div class="text-sm font-medium leading-5 text-gray-900">
                                                                        John Doe
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="text-sm leading-5 text-gray-500">แมกนีเซียม</div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <span
                                                                class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                                                        </td>

                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <img class="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                                                        alt="admin dashboard ui" />
                                                                </div>

                                                                <div class="ml-4">
                                                                    <div class="text-sm font-medium leading-5 text-gray-900">
                                                                        John Doe
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="text-sm leading-5 text-gray-500">โกรแคล MGB</div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <span
                                                                class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                                                        </td>

                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 w-10 h-10">
                                                                    <img class="w-10 h-10 rounded-full" src="https://source.unsplash.com/user/erondu"
                                                                        alt="admin dashboard ui" />
                                                                </div>

                                                                <div class="ml-4">
                                                                    <div class="text-sm font-medium leading-5 text-gray-900">
                                                                        John Doe
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div class="text-sm leading-5 text-gray-500">แมมมอท ชูก้าร์ เอ็กซ์เพรส</div>
                                                        </td>

                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <span
                                                                class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                                                        </td>

                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
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
        </Layout>
    </>
}
