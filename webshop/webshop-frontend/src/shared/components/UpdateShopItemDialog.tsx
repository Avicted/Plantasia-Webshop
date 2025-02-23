import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../framework/store/rootReducer'
import { myProductsActions } from '../../pages/my-products/actions/MyProductsActions'
import { CSRFTokenHiddenInput } from './CSRFTokenHiddenInput'
import { ShopItem } from '../../models/ShopItem'
import { UpdateItemRequest } from '../../models/UpdateItemRequest'

interface UpdateShopItemDialogProps {}

type CustomFormData = {
    id: string
    price: number
}

export const UpdateShopItemDialog: React.FunctionComponent<UpdateShopItemDialogProps> = ({}) => {
    const open = useSelector((state: AppState) => state.myProducts.showEditMyProductDialog)
    const itemToBeUpdated: ShopItem | undefined = useSelector((state: AppState) => state.myProducts.itemToBeUpdated)
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isValid },
        trigger,
    } = useForm<CustomFormData>({
        mode: 'all',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        shouldUnregister: false,
        defaultValues: {
            price: itemToBeUpdated?.price,
        },
    })

    useEffect(() => {
        if (itemToBeUpdated) {
            setValue('price', itemToBeUpdated.price)
        }
    }, [itemToBeUpdated])

    const onSubmit = (data: UpdateItemRequest) => {
        console.log({ info: '[UpdateShopItemDialog]: onSubmit', data })

        if (itemToBeUpdated) {
            data.id = itemToBeUpdated.id
            dispatch(myProductsActions.UpdateItem(data))
        }
    }

    return (
        <>
            <Transition show={open} as={Fragment}>
                <Dialog
                    as="div"
                    open={open}
                    static
                    onClose={() => dispatch(myProductsActions.HideEditMyProductDialog())}
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gradient-to-t from-white transition-opacity backdrop-filter backdrop-blur-md" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-primary-dark shadow-2xl rounded-lg">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <CSRFTokenHiddenInput />

                                    <Dialog.Title className="text-lg mb-6 font-mono text-gray-700 font-bold">
                                        Update Shop Item
                                    </Dialog.Title>

                                    <div className="mt-2 grid grid-cols-12 gap-4">
                                        <div className="col-span-8">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                value={itemToBeUpdated?.name}
                                                disabled
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="text-gray-500 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                Price
                                            </label>
                                            <input
                                                {...register('price', {
                                                    required: 'Price is required to be 1 at a minimum',
                                                    min: 1,
                                                })}
                                                type="number"
                                                name="price"
                                                id="price"
                                                min="1"
                                                max="1000"
                                                required
                                                placeholder={(itemToBeUpdated?.price || 1).toString()}
                                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                                            />
                                            {errors.price && (
                                                <p className="text-xs text-red-400 font-bold mt-1 font-mono">
                                                    {errors.price.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-span-12">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                value={itemToBeUpdated?.description}
                                                disabled
                                                name="description"
                                                id="description"
                                                rows={4}
                                                required
                                                className="text-gray-500 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-row mt-4justify-end">
                                        <div className="w-full mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                className="disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                disabled={!isValid}
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                onClick={() => dispatch(myProductsActions.HideEditMyProductDialog())}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
