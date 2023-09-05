// import { BigCalendar, momentLocalizer } from "react-big-calendar";
import BigCalendar, { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../layouts";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useEffect } from "react";
import { useState } from "react";
import { OperationsService } from "../api/operations.service";
import { convertFilter, renderOptions } from "../../helpers/utils";
import {
  CheckBadgeIcon,
  EyeDropperIcon,
  FunnelIcon,
  GlobeAmericasIcon,
  MapIcon,
  ScissorsIcon,
} from "@heroicons/react/20/solid";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CardBasic } from "../../components";
import InputSelectGroupInline from "../../components/InputSelectGroupInline";
import { BranchService } from "../api/branch.service";
import { MasterService } from "../api/master.service";
import { useRouter } from "next/router";

const localizer = momentLocalizer(moment);
// BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
// const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const breadcrumbs = [
  { index: 1, href: "/operations", name: "บันทึกการทำงาน" },
  { index: 2, href: "/calendar-schedule", name: "ตารางการทำงาน" },
];
export default function MyCalendarBig(props) {
  const router = useRouter();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  const [myEventsList, setMyEventsList] = useState([]);
  const [events, setEvents] = useState([]);
  const [mainBranchOption, setMainBranchOption] = useState([]);
  const [jobStatus, setJobStatus] = useState([]);
  const [taskOption, setTaskption] = useState([]);
  const [searchParam, setSearchParam] = useState({});
  useEffect(() => {
    async function fetchData() {
      await getOperationsList({ limit: 1000, offet: 0 });
      await getMainBranchList();
      await getConfig("OPERATION_STATUS");
      await getConfig("TASK");
    }
    fetchData();
  }, []);
  useEffect(() => {
    let tempEvents = [];
    setEvents([]);
    myEventsList.forEach((element) => {
      const data = {
        title:
          element.task.value1 +
          " (" +
          element.employee.firstName +
          " " +
          element.employee.lastName +
          ")", //element.patient.name + ', ' + element.patient.phone,
        code: element.task.code,
        desc: element.task.value1,
        id: element.operationCode,
        start: moment.utc(element.startDate).toDate(),
        end: moment.utc(element.startDate).toDate().setHours(18),
        color: _renderColor(element.task.code),
        icon: <CheckBadgeIcon />,
      };
      tempEvents.push(data);
      setEvents(tempEvents);
    });
  }, [myEventsList]);
  const getOperationsList = async (searchParam) => {
    // let param = searchParam
    //  {
    //   limit: 1000,
    //   offet: 0,
    // };
    await OperationsService.getOperationsList(searchParam)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setMyEventsList(res.data.resultData);
          // setTotal(res.data.total)
        } else {
          setMyEventsList([]);
        }
      })
      .catch((err) => {
        console.log("==> list job3");
      });
  };
  const getMainBranchList = async () => {
    let param = {
      branchType: "MD0014",
    };
    await BranchService.getBranchList(param)
      .then((res) => {
        if (res.data.resultCode === 200) {
          setMainBranchOption(res.data.resultData);
        } else {
          setMainBranchOption([]);
        }
      })
      .catch((err) => {});
  };
  const getConfig = async (configCategory) => {
    let paramquery = {
      subType: configCategory,
    };
    await MasterService.getConfig(paramquery)
      .then((res) => {
        if (res.data.resultCode === 200) {
          if (configCategory === "OPERATION_STATUS")
            setJobStatus(res.data.resultData);
          if (configCategory === "TASK") setTaskption(res.data.resultData);
        } else {
          setJobStatus([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = async (evt) => {
    const { name, value, checked, type } = evt.target;
    setSearchParam((data) => ({ ...data, [name]: value }));
    let param = {
      ...searchParam,
      limit: 10000,
      offset: 0,
    };
    console.log("searchParam", searchParam);
    if (name === "task") {
      param.task = value;
    }
    if (name === "operationStatus") {
      param.operationStatus = value;
    }
    if (name === "mainBranch") {
      param.mainBranch = value;
    }

    if (searchParam.startDate) {
      param.startDate = searchParam.startDate;
    }
    param.limit = 1000;
    param.offset = 0;
    getOperationsList(param);
  };

  const _renderColor = (name) => {
    let _option = "red";
    switch (name) {
      case "MD0019": //ฉีดดิน
        _option = "#facc15";
        break;
      case "MD0020": //ฉีดดิน
        _option = "#a3e635";
        break;
      case "MD0021":
        _option = "#7dd3fc";
        break;
      case "MD0022":
        _option = "#f87171";
        break;
      case "MD0023":
        _option = "#d8b4fe";
        break;
      default:
    }
    return _option;
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = event.color; // Get the custom color from the event object
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      fontSize: "10px",
    };
    return {
      style,
    };
  };
  const EventComponent = ({ event }) => {
    const [showAllEvents, setShowAllEvents] = useState(false);
    const maxEventsToShow = 3;
    if (Array.isArray(event) && event.length > 0) {
      const visibleEvents = showAllEvents
        ? event
        : event.slice(0, maxEventsToShow);

      return (
        <div>
          <strong>
            {showAllEvents
              ? `All Events (${event.length})`
              : `Up to ${maxEventsToShow} Events`}
          </strong>
          <ul>
            {visibleEvents.map((singleEvent, index) => (
              <li key={index}>
                <strong>{singleEvent.title}</strong>
                <p>{singleEvent.description}</p>
              </li>
            ))}
          </ul>
          {!showAllEvents && event.length > maxEventsToShow && (
            <button onClick={() => setShowAllEvents(true)}>Show More</button>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex justify-between">
          {event.code === "MD0019" && (
            <GlobeAmericasIcon className="h-4 w-4 text-black"></GlobeAmericasIcon>
          )}
          {event.code === "MD0020" && (
            <EyeDropperIcon className="h-4 w-4 text-black"></EyeDropperIcon>
          )}
          {event.code === "MD0021" && (
            <ScissorsIcon className="h-4 w-4 text-black"></ScissorsIcon>
          )}
          {event.code === "MD0022" && (
            <FunnelIcon className="h-4 w-4 text-black"></FunnelIcon>
          )}
          {event.code === "MD0023" && (
            <MapIcon className="h-4 w-4 text-black"></MapIcon>
          )}
          {/* <p className="text-black">{event.desc}</p> */}
          <p className="text-black">{event.title}</p>
        </div>
      );
    }
  };
  // const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

  return (
    <>
      <Layout>
        <Breadcrumbs title="Calendar Schedule" breadcrumbs={breadcrumbs} />
        <div className="px-1 py-1">
          <div className="flex justify-end w-full max-w-screen pt-0">
            <button
              type="button"
              onClick={() => {
                router.push("/operations/detail");
              }}
              className="flex justify-center inline-flex items-center rounded-md border border-transparent bg-purple-600 px-6 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
            >
              สร้างบันทึก
            </button>
          </div>
        </div>
        <div className="px-2 pt-0">
          <hr></hr>
          <CardBasic>
            <div className="flex justify-center grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-1 ">
              <InputSelectGroupInline
                type="text"
                id="mainBranch"
                name="mainBranch"
                label="แปลงใหญ่"
                options={renderOptions(
                  mainBranchOption,
                  "branchName",
                  "branchCode"
                )}
                value={searchParam.mainBranch}
                placeholder="ทั้งหมด"
                onChange={handleChange}
                // isMulti
              />
              <InputSelectGroupInline
                type="text"
                id="task"
                name="task"
                label="งาน"
                options={renderOptions(taskOption, "value1", "code")}
                // isMulti
                isSearchable
                value={searchParam.task}
                placeholder="ทั้งหมด"
                onChange={handleChange}
              />
              <InputSelectGroupInline
                type="text"
                id="operationStatus"
                name="operationStatus"
                label="สถานะงาน"
                options={renderOptions(jobStatus, "value1", "code")}
                // isMulti
                placeholder="ทั้งหมด"
                isSearchable
                value={searchParam.operationStatus}
                onChange={handleChange}
              />
            </div>
          </CardBasic>
        </div>
        <div className="p-2 calendar-container">
          <BigCalendar
          // localizer={localizer}
            events={events}
            step={60}
            views={'month'}
            
            defaultDate={new Date(2015, 3, 1)}
            popup={false}
            // onShowMore={(events, date) =>
            //   this.setState({ showModal: true, events })
            // }
          />
          {/* <Calendar
            localizer={localizer}
            events={events || []}
            startAccessor="start"
            endAccessor="end"
            // step={60}
            showAllEvents
            // showAllEvents={false}
            // max={5}
            // timeslots={10}
            // length={3}
            views={["month"]}
            // resizable
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
          /> */}
        </div>
      </Layout>
    </>
  );
}
