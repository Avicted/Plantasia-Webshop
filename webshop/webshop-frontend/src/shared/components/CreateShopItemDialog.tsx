import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../framework/store/rootReducer'
import { CreateItemRequest } from '../../models/CreateItemRequest'
import { myProductsActions } from '../../pages/my-products/actions/MyProductsActions'
import { CSRFTokenHiddenInput } from './CSRFTokenHiddenInput'
import { CheckCircleIcon } from '@heroicons/react/solid'

interface CreateShopItemDialogProps { }

interface CustomFormData extends CreateItemRequest {
    // @Note(Victor) Additional fields can be added here
}

export const CreateShopItemDialog: React.FunctionComponent<CreateShopItemDialogProps> = ({ }) => {
    const open = useSelector((state: AppState) => state.myProducts.showAddNewProductDialog)
    const [picture, setPicture] = useState<File | undefined>(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!open) {
            setPicture(undefined)
            reset()
        }
    }, [open])

    const {
        register,
        handleSubmit,
        control,
        watch,
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
            name: '',
            description: '',
            price: 1,
        },
    })

    const onSubmit = (data: CreateItemRequest) => {
        console.log({ info: '[CreateShopItemDialog]: onSubmit', data: data, picture })

        if (picture) {
            data.image_src = picture
        }

        dispatch(myProductsActions.CreateItem(data))
    }

    return (
        <>
            <Transition show={open} as={Fragment}>
                <Dialog
                    as="div"
                    open={open}
                    static
                    onClose={() => dispatch(myProductsActions.HideAddNewProductDialog())}
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
                                        Create Shop Item
                                    </Dialog.Title>

                                    <div className="mt-2 grid grid-cols-12 gap-4">
                                        <div className="col-span-8">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                {...register('name', {
                                                    required: 'Name is required',
                                                    maxLength: {
                                                        value: 64,
                                                        message: 'Name max length is 64',
                                                    },
                                                })}
                                                required
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-red-400 font-bold mt-1 font-mono">
                                                    {errors.name.message}
                                                </p>
                                            )}
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
                                                {...register('description', {
                                                    required: 'Description is required',
                                                    maxLength: {
                                                        value: 256,
                                                        message: 'Name max length is 256',
                                                    },
                                                })}
                                                name="description"
                                                id="description"
                                                rows={3}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                            />
                                            {errors.description && (
                                                <p className="text-xs text-red-400 font-bold mt-1 font-mono">
                                                    {errors.description.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-span-12">
                                            <label
                                                htmlFor="cover-photo"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Photograph
                                            </label>
                                            <div
                                                className={`mt-1 justify-center px-6 pt-5 pb-6 border-2 ${picture ? 'border-green-300' : 'border-gray-300'
                                                    } border-dashed rounded-md`}
                                            >
                                                <div className="space-y-1 text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="pb-6">
                                                        <div className="text-sm text-gray-600 justify-center">
                                                            <label
                                                                htmlFor="image_src"
                                                                className="cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                                                            >
                                                                <span>Upload a {picture ? 'new' : ''} picture</span>
                                                                <input
                                                                    {...(register('image_src'),
                                                                    {
                                                                        onChange: (e) => {
                                                                            console.log(e.target?.files)
                                                                            if (e.target.files) {
                                                                                setPicture(e.target.files[0])
                                                                            }
                                                                        },
                                                                    })}
                                                                    accept="image/png, image/jpeg"
                                                                    id="image_src"
                                                                    name="image_src"
                                                                    type="file"
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, an JPG up to 10MB</p>
                                                    </div>

                                                    {picture && (
                                                        <div className="rounded-md bg-green-50 p-4">
                                                            <div className="flex">
                                                                <div className="flex-shrink-0">
                                                                    <CheckCircleIcon
                                                                        className="h-5 w-5 text-green-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                </div>
                                                                <div className="flex ml-3 text-left text-sm grid font-bold text-green-600 break-all">
                                                                    <span className="truncate">{picture.name}</span>
                                                                    <p className="inline-">
                                                                        <span className="font-medium">
                                                                            Successfully uploaded
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row mt-4justify-end">
                                        <div className="w-full mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                className="disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => { }}
                                                disabled={!isValid}
                                            >
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                onClick={() => dispatch(myProductsActions.HideAddNewProductDialog())}
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
