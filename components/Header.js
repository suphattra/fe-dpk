import React from 'react'
import { Disclosure } from '@headlessui/react'

export default function Header() {
    return (
        <>
            <Disclosure as="nav" className="bg-purple-600">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-center">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 text-white text-2xl">
                                    DPK MANAGMENT SYSTEM
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
        </>
    )
}