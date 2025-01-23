import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../store/rootReducer'
import { NotificationData, NotificationType } from '../../models/NotificationData'
import { accountActions } from '../../pages/account/actions/AccountActions'

interface NotificationProps {}

export const Notification: React.FunctionComponent<NotificationProps> = ({}) => {
    const dispatch = useDispatch()
    const notifications: NotificationData[] = useSelector((state: AppState) =>
        state.account.notifications.filter((n) => n.dismissed === false)
    )

    useEffect(() => {}, [notifications])

    const renderIcon = (notification: NotificationData | undefined): JSX.Element => {
        if (notification === undefined) return <></>

        switch (notification.type) {
            case NotificationType.Error:
                return <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
            case NotificationType.Success:
                return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
            case NotificationType.Info:
                return <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
            default:
                return <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
        }
    }

    const getNewestNotification = (): NotificationData => {
        return notifications[notifications.length - 1]
    }

    if (getNewestNotification() === undefined) return null

    return (
        <Transition
            show={getNewestNotification().dismissed === false}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed z-30 inset-0 flex items-end px-4 py-6 mt-24 pointer-events-none pt-8 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={getNewestNotification() === undefined ? false : true}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="max-w-sm w-full bg-white shadow-xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {getNewestNotification() !== undefined && renderIcon(getNewestNotification())}
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">
                                            {getNewestNotification().title}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">{getNewestNotification().message}</p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                dispatch(accountActions.HideNotification(getNewestNotification().id))
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    )
}
