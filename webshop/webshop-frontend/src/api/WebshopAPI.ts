import { getCookieByName } from '../CSRFCookieHandler'
import { ApiPaginatedResponse, ApiResponse } from '../models/ApiResponse'
import { AuthenticationRequest } from '../models/AuthenticationRequest'
import { RefreshTokenResponse } from '../models/RefreshTokenResponse'
import { RegisterNewUserRequest } from '../models/RegisterNewUserRequest'
import { ChangePasswordRequest } from '../models/ChangePasswordRequest'
import { ShopItem } from '../models/ShopItem'
import mockupProducts from './marketplace_api_mock.json'
import { PlantImages } from './marketplace_images_mock'
import { CreateItemRequest } from '../models/CreateItemRequest'
import { User } from '../models/User'
import { UpdateItemRequest } from '../models/UpdateItemRequest'
import { CheckoutRequest } from '../models/CheckoutRequest'
import { CheckoutErrorResponse } from '../models/CheckoutErrorResponse'
import { CheckoutError } from '../pages/shop/actions/ShoppingCartActions'

//  @Note(Victor): The refresh token is longer lived than the access token
// Fetch a new access token with the refresh token, once the access token expires
const getBearer = (): string => {
    let access_token = localStorage.getItem('access_token')
    let refresh_token = localStorage.getItem('refresh_token')
    let token = ''

    if (access_token) {
        token = access_token
    } else if (refresh_token) {
        token = refresh_token
    }

    const bearer = `Bearer ${token}`

    if (token.length <= 0) {
        return ''
    }

    return bearer
}

const customHeaders = (isForm: boolean = false): HeadersInit => {
    const bearer: string = getBearer()

    let headers: HeadersInit = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookieByName('csrftoken'),
    }

    if (bearer.length > 0) {
        headers.Authorization = bearer
    }

    return headers
}

export class WebshopAPI {
    // When suddenly hit with a 401 Unauthorized, try to refresh the access token
    // else redirect the user to the login page
    // @Todo(Victor): Not used at the moment
    refreshAccessTokenWithRefreshToken = async (responseStatus: number): Promise<void> => {
        if (responseStatus !== 401) return

        try {
            const res: Response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token/refresh/`)

            if (!res.ok) {
                let msg = '[Error]: Could not refresh the access token with the refresh token'

                alert(msg)
                window.location.href = '/login'
                throw Error(msg)
            } else {
                // Update the access token
                const response: ApiResponse<RefreshTokenResponse> = await res.json()
                localStorage.setItem('access_token', response.data.access)
            }
        } catch (error) {
            console.error({
                info: 'refreshAccessTokenWithRefreshToken',
                error,
            })
        }
    }

    register = async (registerNewUserRequest: RegisterNewUserRequest): Promise<ApiResponse<undefined>> => {
        try {
            const res: Response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register/`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    // 'X-CSRFToken': getCookieByName('csrftoken'),
                },
                method: 'POST',
                body: JSON.stringify(registerNewUserRequest),
            })

            const data: ApiResponse<undefined> = await res.json()
            console.log({ info: '[WebshopAPI]: register', data })

            if (!res.ok) {
                if (data.errors) throw data.errors
                throw data.error
            }

            return data
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    authenticate = async (loginRequest: AuthenticationRequest): Promise<ApiResponse<User | undefined>> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token/`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookieByName('csrftoken'),
                },
                method: 'POST',
                body: JSON.stringify(loginRequest),
            })

            const apiResponse: ApiResponse<User> = await res.json()
            console.log({ info: '[WebshopAPI]: authenticate', apiResponse })

            if (!res.ok) {
                if (apiResponse.errors) throw apiResponse.errors
                throw apiResponse.error
            }

            // Save the access and refresh token in the browser local storage
            localStorage.setItem('access_token', apiResponse.data.accessToken)
            localStorage.setItem('refresh_token', apiResponse.data.refreshToken)

            return apiResponse
        } catch (error) {
            return { error } as ApiResponse<undefined>
        }
    }

    changePassword = async (ChangePasswordRequest: ChangePasswordRequest): Promise<ApiResponse<any>> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/change-password/`, {
                method: 'PUT',
                headers: customHeaders(),
                body: JSON.stringify(ChangePasswordRequest),
            })

            const data: ApiResponse<any> = await res.json()
            console.log({ info: '[WebshopAPI]: ChangePassword', data })

            if (!res.ok) {
                if (data) return data as ApiResponse<undefined>
                throw data
            }

            return data
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getMyUserData = async (): Promise<ApiResponse<User | undefined>> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/me/`, {
                headers: customHeaders(),
                method: 'GET',
            })

            const apiResponse: ApiResponse<User> = await res.json()
            console.log({ info: '[WebshopAPI]: getMyUserDatadawdawdawdawd', apiResponse })

            if (!res.ok) {
                if (apiResponse.errors) throw apiResponse.errors
                throw apiResponse.error
            }

            // Save the access and refresh token in the browser local storage
            localStorage.setItem('access_token', apiResponse.data.accessToken)
            localStorage.setItem('refresh_token', apiResponse.data.refreshToken)

            return apiResponse
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    searchProductsByName = async (
        name: string,
        nextPage: string | null
    ): Promise<ApiResponse<ApiPaginatedResponse | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/shop-items/`

                if (nextPage) {
                    URI = nextPage
                } else {
                    URI = `${URI}?name=${name}`
                }

                const res: Response = await fetch(URI, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        // 'X-CSRFToken': getCookieByName('csrftoken'),
                        // Authentication: getBearer(),
                    },
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<ApiPaginatedResponse> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI: searchProductsByName', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < items.length; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<ApiPaginatedResponse> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    createItem = async (item: CreateItemRequest): Promise<ApiResponse<any>> => {
        try {
            console.log({ info: '[WebshopAPI] createItem', item })

            let createItemFormData: FormData = new FormData()
            createItemFormData.append('name', item.name)
            createItemFormData.append('description', item.description)
            createItemFormData.append('price', item.price.toString())
            if (item.image_src) createItemFormData.append('image_src', item.image_src)

            console.log({ info: 'createItem', createItemFormData })

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/shop-items/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    // -'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': getCookieByName('csrftoken'),
                    Authorization: getBearer(),
                },
                body: createItemFormData,
            })

            const data: ApiResponse<any> = await res.json()

            console.log({ info: '[WebshopAPI]: CreateItem', data })

            if (!res.ok) {
                if (data.errors) return data as ApiResponse<undefined>
                throw data
            }

            return data
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    updateItem = async (item: UpdateItemRequest): Promise<ApiResponse<any>> => {
        try {
            console.log({ info: '[WebshopAPI] updateItem', item })

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/shop-items/${item.id}/`, {
                method: 'PATCH',
                headers: customHeaders(),
                body: JSON.stringify(item),
            })

            const data: ApiResponse<any> = await res.json()
            console.log({ info: '[WebshopAPI]: UpdateItem', data })

            if (!res.ok) {
                if (data.errors) return data as ApiResponse<undefined>
                throw data
            }

            return data
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    deleteItem = async (id: string): Promise<ApiResponse<undefined>> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/shop-items/${id}/`, {
                method: 'DELETE',
                headers: customHeaders(),
            })

            const data: ApiResponse<any> = await res.json()
            console.log({ info: '[WebshopAPI]: deleteItem', data })

            if (!res.ok) {
                if (data.errors) return data as ApiResponse<undefined>
                throw data
            }

            const apiResponse: ApiResponse<any> = {
                data: {
                    message: `Item ${id} has successfully been deleted`,
                },
            }

            return apiResponse
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    checkout = async (checkoutRequest: CheckoutRequest): Promise<ApiResponse<any> | CheckoutErrorResponse> => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/checkout/`, {
                method: 'POST',
                headers: customHeaders(),
                body: JSON.stringify(checkoutRequest),
            })

            const data: ApiResponse<any> | CheckoutErrorResponse = await res.json()
            console.log({ info: '[WebshopAPI]: checkout', data })

            if (!res.ok) {
                throw data
            }

            return data
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getAllProducts = async (nextPage: string | null): Promise<ApiResponse<ApiPaginatedResponse | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/shop-items/`

                if (nextPage) {
                    URI = nextPage
                }

                const res: Response = await fetch(URI, {
                    headers: customHeaders(),
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<ApiPaginatedResponse> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < items.length; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<ApiPaginatedResponse> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getSingleProduct = async (id: string): Promise<ApiResponse<any | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/shop-items/${id}/`

                const res: Response = await fetch(URI, {
                    headers: customHeaders(),
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<any> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI: [getSingleProduct]', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < 1; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<any> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getMyProductsForSale = async (nextPage: string | null): Promise<ApiResponse<ApiPaginatedResponse | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/my-items-for-sale/`

                if (nextPage) {
                    URI = nextPage
                }

                const res: Response = await fetch(URI, {
                    headers: customHeaders(),
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<ApiPaginatedResponse> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < items.length; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<ApiPaginatedResponse> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getMySoldProducts = async (nextPage: string | null): Promise<ApiResponse<ApiPaginatedResponse | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/my-sold-items/`

                if (nextPage) {
                    URI = nextPage
                }

                const res: Response = await fetch(URI, {
                    headers: customHeaders(),
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<ApiPaginatedResponse> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < items.length; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<ApiPaginatedResponse> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }

    getMyPurchasedProducts = async (
        nextPage: string | null
    ): Promise<ApiResponse<ApiPaginatedResponse | undefined>> => {
        try {
            if (process.env.REACT_APP_USE_LIVE_DATA_API === 'true') {
                let URI: string = `${process.env.REACT_APP_API_BASE_URL}/my-purchased-items/`

                if (nextPage) {
                    URI = nextPage
                }

                const res: Response = await fetch(URI, {
                    headers: customHeaders(),
                })

                if (!res.ok) throw res.statusText

                const data: ApiResponse<ApiPaginatedResponse> = {
                    error: undefined,
                    data: await res.json(),
                }

                console.log({ info: 'WebshopAPI', data })

                return data
            } else {
                let items = mockupProducts as unknown as ShopItem[]

                for (let i: number = 0; i < items.length; i++) {
                    items[i].image_src = PlantImages[i].default
                    items[i].image_alt = `${items[i].name} ${items[i].image_alt}`
                }

                const response: ApiResponse<ApiPaginatedResponse> = {
                    data: {
                        count: items.length,
                        next: null,
                        previous: null,
                        results: items,
                    },
                }

                return response
            }
        } catch (error) {
            return error as ApiResponse<undefined>
        }
    }
}
