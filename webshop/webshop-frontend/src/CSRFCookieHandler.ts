export const getCookieByName = (name: string): string => {
    let cookieValue = '';

    if (document.cookie && document.cookie !== '') {
        let cookies: string[] = document.cookie.split(';');

        for (let i: number = 0; i < cookies.length; i++) {
            let cookie: string = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}