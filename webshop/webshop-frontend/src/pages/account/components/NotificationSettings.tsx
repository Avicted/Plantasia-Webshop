interface NotificationSettingsProps {}

export const NotificationSettings: React.FunctionComponent<NotificationSettingsProps> = ({}) => {
    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <form action="#" method="POST">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">Get notified when someone buys your flowers</p>
                        </div>

                        <fieldset>
                            <legend className="text-base font-medium text-gray-900">By Email</legend>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-start">
                                    <div className="h-5 flex items-center">
                                        <input
                                            id="item-sold"
                                            name="item-sold"
                                            type="checkbox"
                                            disabled
                                            checked
                                            className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="comments" className="font-medium text-gray-400">
                                            Item sold
                                        </label>
                                        <p className="text-gray-400">Get notified when someone buys an item from you</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-start ">
                                        <div className="h-5 flex items-center">
                                            <input
                                                id="item-purchased"
                                                name="item-purchased"
                                                disabled
                                                checked
                                                type="checkbox"
                                                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="candidates" className="font-medium text-gray-400">
                                                Item purchased
                                            </label>
                                            <p className="text-gray-400">Receive a receit when you purchase an item</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </form>
        </div>
    )
}
