import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { authService, getUser } from '../pages/api/auth/auth-service'
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState('')
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    useEffect(() => {
        let currentUser = getUser()
        if (currentUser != null || currentUser != undefined) {
            setCurrentUser(currentUser)
        }
    })
    const logout = async () => {
        await authService.logout().then(res => {
            router.push('/login');
        })
    }
    return (
        <>
            <Disclosure as="nav" className="bg-purple-600">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-8xl px-2 sm:px-3 lg:px-3">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute flex items-center pr-2 sm:static sm:ml-6 sm:pr-0 text-white text-2xl md:pl-14">
                                    <span className="not-sr-only">DPK MANAGMENT SYSTEM</span> 
                                    {/* <img src="/images/NXSameDay.png" alt="2" width="200px" height="60px" className='hidden lg:inline rounded-md pr-1'/> */}
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:ml-6 sm:pr-0 text-white text-2xl md:pl-12">
                                    <h6 className='text-sm p-4'>{currentUser}</h6>
                                    <Menu as="div" className="">
                                        <div>
                                            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                {/* <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                /> */}
                                                <UserCircleIcon className="h-8 w-8 rounded-full" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {/* <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/change-password"
                                                            // onClick={() => { router.push('/driver/change-password'); }}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Change Password
                                                        </a>
                                                    )}
                                                </Menu.Item> */}
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            // href="/login"
                                                            onClick={logout}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'cursor-pointer block px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Log out
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
        </>
    )
}