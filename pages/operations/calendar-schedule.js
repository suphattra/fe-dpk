import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Layout from "../../layouts";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useEffect } from "react";
import { useState } from "react";
import { OperationsService } from "../api/operations.service";
import { convertFilter } from "../../helpers/utils";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";

const localizer = momentLocalizer(moment);
const breadcrumbs = [
  { index: 1, href: "/calendar-schedule", name: "DPK MANAGMENT SYSTEM" },
];
export default function MyCalendar(props) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  const [myEventsList, setMyEventsList] = useState([]);
  const [events, setEvents] = useState([]);
  const myEvents = [
    {
      title: "All Day Event very long title",
      allDay: true,
      start: new Date(),
      end: new Date(),
      color: "red",
    },
    {
      title: "Long Event",
      start: new Date(currentYear, currentMonth, randomDay),
      end: new Date(currentYear, currentMonth, randomDay),
    },

    {
      title: "DTS STARTS",
      start: new Date(currentYear, currentMonth, randomDay),
      end: new Date(currentYear, currentMonth, randomDay),
    },

    {
      title: "DTS ENDS",
      start: new Date(currentYear, currentMonth, randomDay),
      end: new Date(currentYear, currentMonth, randomDay),
    },

    {
      title: "Some Event",
      start: new Date(currentYear, currentMonth, randomDay),
      end: new Date(currentYear, currentMonth, randomDay),
    },
    {
      title: "Conference",
      start: new Date(currentYear, currentMonth, randomDay),
      end: new Date(currentYear, currentMonth, randomDay),
      desc: "Big conference for important people",
    },
    {
      title: "Meeting",
      start: new Date(2023, 6, 10, 10, 0),
      end: new Date(2023, 6, 10, 12, 0),
      desc: "Pre-meeting meeting, to prepare for the meeting",
      color: "blue",
    },
    {
      title: "Lunch",
      start: new Date(2023, 6, 11, 10, 0),
      end: new Date(2023, 6, 11, 12, 0),
      desc: "Power lunch",
      color: "green",
    },
  ];
  useEffect(() => {
    async function fetchData() {
      await getOperationsList();
    }
    fetchData();
  }, []);
  const getOperationsList = async (searchParam) => {
    let param = {
      limit: 1000,
      offet: 0,
    };
    await OperationsService.getOperationsList(param)
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
  useEffect(() => {
    let tempEvents = [];
    myEventsList.forEach((element) => {
      const data = {
        title: element.task.value1 + " " + element.mainBranch.branchName, //element.patient.name + ', ' + element.patient.phone,
        id: element.operationCode,
        start: moment.utc(element.startDate).toDate(),
        end: moment.utc(element.startDate).toDate(),
        color: _renderColor(element.task.code),
        icon: <CheckBadgeIcon />,
      };
      tempEvents.push(data);
      setEvents(tempEvents);
    });
  }, [myEventsList]);
  const _renderColor = (name) => {
    let _option = "red";
    switch (name) {
      case "MD0019":
        _option = "#facc15";
        break;
      case "MD0020":
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
    // return <CheckBadgeIcon className="h-4 w-4"></CheckBadgeIcon>
    return {
      style,
    };
  };
  const EventComponent = ({ event }) => (
    <div className="flex justify-between">
    
     {event.task.code} <CheckBadgeIcon className="h-4 w-4"></CheckBadgeIcon>{event.title}
    </div>
  );
  return (
    <>
      <Layout>
        <Breadcrumbs title="Calendar Schedule" breadcrumbs={breadcrumbs} />
        <div className="p-2">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            step={60}
            style={{ height: 600 }}
            resizable
            eventPropGetter={eventStyleGetter}
            components={{
              event: EventComponent,
            }}
          />
        </div>
      </Layout>
    </>
  );
}
