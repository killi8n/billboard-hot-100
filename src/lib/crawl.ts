import request, { Response } from 'request'

const crawl = (url: string): Promise<{ response: Response; body: any }> => {
    return new Promise((resolve, reject) => {
        request(url, (error: any, response: Response, body: any) => {
            if (error) {
                reject(error)
                return
            }
            resolve({
                response,
                body,
            })
        })
    })
}

export default crawl