import cheerio from 'cheerio'
import { billboardChartStaticURL, billboardHot100URL } from './lib/constants'
import crawl from './lib/crawl'
import { BillBoardHot100Item } from './types'

export const getBillBoardHot100 = async (): Promise<BillBoardHot100Item[] | null> => {
    try {
        const { response, body } = await crawl(billboardHot100URL)
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