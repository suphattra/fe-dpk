import React, { Fragment, useState } from 'react'
import { Bars3Icon, DocumentTextIcon, Squares2X2Icon, TicketIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react'
import Link from 'next/link';
const navigation = [
    { name: 'Dashboard', icon: Squares2X2Icon, href: '/calendar-schedule', current: true },
    { name: 'บันทึกการทำงาน', icon: DocumentTextIcon, href: '/operations', count: 3, current: false },
    { name: 'พนักงาน', icon: UserIcon, href: '/driver', count: 4, current: false },
    { name: 'สาขา&แปลงงาน', icon: UsersIcon, href: '/customer', count: 4, current: false },
    { name: 'Package', icon: TicketIcon, href: '/package', current: false }
]
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
export default function Sidebar({ sidebarOpenCallback }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const activeRoute = (routeName) => {
        return router.asPath.indexOf(routeName) > -1 ? true : false;
    };
    return (
        <Transition
            as={Fragment}
            show={true}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div className={classNames(sidebarOpen ? 'w-56 ' : 'w-24', " flex flex-col fixed top-0")} >
                <div className="flex flex-1 flex-col pt-5 pb-10 ">
                    <div className="flex flex-1 items-center justify-start flex-shrink-0 items-rigth pb-3 pl-4">
                        <button onClick={() => { setSidebarOpen(!sidebarOpen), sidebarOpenCallback(!sidebarOpen) }} className="hover:bg-indigo-600 rounded-md pt-1 pb-1">
                            <Bars3Icon className='w-6 h-6 ml-5 mr-5 text-white' />
                        </button>
                    </div>

                    <div className='h-screen  bg-gray-100'>
                        <nav className="mt-1 flex-1 space-y-1 px-2 py-1" aria-label="Sidebar">
                            {navigation.map((item) => (
                                <Link href={item.href}  key={item.name}>
                                    <a
                                        key={item.name}
                                        // href={item.href}
                                        className={classNames(
                                            activeRoute(item.href) ? 'bg-purple-600 text-white' : 'text-indigo-900 hover:bg-indigo-600 hover:bg-opacity-50 hover:text-white text-black',
                                            'group flex items-center px-2 py-2 text-sm font-bold rounded-md'
                                        )}
                                    >
                                        <span className={classNames(sidebarOpen ? '' : 'hidden', "flex-1")}>{item.name}</span>
                                        <item.icon
                                            className={classNames(
                                                activeRoute(item.href) ? 'text-gray-300' : 'text-gray-400 group-hover:text-indigo-600',
                                                'ml-5 mr-0 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                    </a>
                                </Link>
                            ))}
                        </nav>
                    </div>

                </div>
            </div >
        </Transition>

    )
}