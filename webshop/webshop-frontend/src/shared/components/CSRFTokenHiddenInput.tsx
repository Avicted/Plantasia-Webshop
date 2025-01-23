import React from 'react'
import { getCookieByName } from '../../CSRFCookieHandler'

interface CSRFTokenHiddenInputProps {}

export const CSRFTokenHiddenInput: React.FunctionComponent<CSRFTokenHiddenInputProps> = ({}) => {
    return <input type="hidden" name="csrfmiddlewaretoken" value={getCookieByName('csrftoken')} />
}
