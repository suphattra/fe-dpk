import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Layout from '../../layouts';
import Breadcrumbs from '../../components/Breadcrumbs';

const localizer = momentLocalizer(moment)
const breadcrumbs = [{ index: 1, href: '/calendar-schedule', name: 'DPK MANAGMENT SYSTEM' }]
export default function MyCalendar(props) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
    const myEventsList = [{
        'title': 'All Day Event very long title',
        'allDay': true,
        'start': new Date(),
        'end': new Date(),
        'color': 'red',
    },
    {
        'title': 'Long Event',
        'start': new Date(currentYear, currentMonth, randomDay),
        'end': new Date(currentYear, currentMonth, randomDay)
    },

    {
        'title': 'DTS STARTS',
        'start': new Date(currentYear, currentMonth, randomDay),
        'end': new Date(currentYear, currentMonth, randomDay),
    },

    {
        'title': 'DTS ENDS',
        'start': new Date(currentYear, currentMonth, randomDay),
        'end': new Date(currentYear, currentMonth, randomDay),
    },

    {
        'title': 'Some Event',
        'start': new Date(currentYear, currentMonth, randomDay),
        'end': new Date(currentYear, currentMonth, randomDay),
    },
    {
        'title': 'Conference',
        'start': new Date(currentYear, currentMonth, randomDay),
        'end': new Date(currentYear, currentMonth, randomDay),
        desc: 'Big conference for important people'
    },
    {
        'title': 'Meeting',
        start: new Date(2023, 6, 10, 10, 0),
        end: new Date(2023, 6, 10, 12, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting',
        color: 'blue',
    },
    {
        'title': 'Lunch',
        start: new Date(2023, 6, 11, 10, 0),
        end: new Date(2023, 6, 11, 12, 0),
        desc: 'Power lunch',
        color: 'green',
    }];
    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color; // Get the custom color from the event object
        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };
        return {
            style,
        };
    };
    return <>
        <Layout>
            <Breadcrumbs title="Calendar Schedule" breadcrumbs={breadcrumbs} />
            <div className='p-2'>
                <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    step={60}
                    style={{ height: 600 }}
                    resizable
                    eventPropGetter={eventStyleGetter}
                />
            </div>
        </Layout>
    </>
}
