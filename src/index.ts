import cheerio from 'cheerio'
import { format } from 'date-fns'
import { billboardChartStaticURL, billboardHot100URL } from './lib/constants'
import crawl from './lib/crawl'
import { BillBoardHot100Item } from './types'

export * from './types'

export const getBillBoardHot100 = async ({ date }: { date?: Date | number }): Promise<BillBoardHot100Item[] | null> => {
    try {
        let formattedDate = ""
        if (date) {
            formattedDate = format(date, 'yyyy-MM-dd')
        }
        let url = billboardHot100URL
        if (formattedDate) {
            url = `${billboardHot100URL}/${formattedDate}`
        }
        const { response, body } = await crawl(url)
        if (response.statusCode !== 200) {
            return null
        }
        const $ = cheerio.load(body)
        let dataCharts: string | undefined | any[] = $('#charts').attr(
            'data-charts'
        )
        if (!dataCharts) {
            return null
        }
        dataCharts = JSON.parse(dataCharts) as any[]
        dataCharts = dataCharts.map((data) => {
            let images: string[] = []
            if (data.title_images) {
                images = Object.keys(data.title_images.sizes).map((key) => {
                    return `${billboardChartStaticURL}${data.title_images.sizes[key].Name}`
                })
            } else if (data.artist_images) {
                images = Object.keys(data.artist_images.sizes).map((key) => {
                    return `${billboardChartStaticURL}${data.artist_images.sizes[key].Name}`
                })
            }
            return {
                rankNumber: data.rank,
                artistName: data.artist_name,
                songName: data.title,
                images,
            }
        })
        return dataCharts
    } catch (e) {
        return null
    }
}