import moment from 'moment'
import { ArrowLeftIcon, Bars3Icon, CalculatorIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon, DeviceTabletIcon, FolderMinusIcon, FunnelIcon, LockClosedIcon, WalletIcon } from '@heroicons/react/20/solid';


const getMinutesOfDay = (date) => {
    return date.hours() * 60 + date.minutes()
}
export const verticalLineClassNamesForTime = (timeStart, timeEnd) => {
    const currentTimeStart = moment(timeStart)
    const currentTimeEnd = moment(timeEnd)

    let classes = [];
    const lunchStart = moment().hours(12).minutes(0).seconds(0);
    const lunchEnd = moment().hours(13).minutes(0).seconds(0);
    if (getMinutesOfDay(currentTimeStart) >= getMinutesOfDay(lunchStart) &&
        getMinutesOfDay(currentTimeEnd) <= getMinutesOfDay(lunchEnd)) {
        classes.push("bg-red-100");
    }

    return classes;
}