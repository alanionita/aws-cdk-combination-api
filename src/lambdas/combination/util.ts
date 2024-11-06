import { JSONValue } from '../../libs/apiGw';

type TDeal = {
    title: string,
    storeID: string,
    salePrice: number,
    normalPrice: number,
    savings: number,
    steamRatingPercent: string,
    releaseDate: number,
}

type TDealOutput = TDeal | {
    releaseDate: string,
    savingsPercent: number
}

export type TDeals = {
    data: JSONValue & TDeal[]
}; 

export function transformDeal(deal: TDeal, conversionRate: number): TDealOutput {
    const {
        title,
        storeID,
        salePrice,
        normalPrice,
        savings,
        steamRatingPercent,
        releaseDate,
    } = deal;

    return {
        title,
        storeID,
        steamRatingPercent,
        salePrice: salePrice / conversionRate,
        normalPrice: normalPrice / conversionRate,
        savingsPercent: savings,
        releaseDate: new Date(releaseDate * 1000).toDateString(), // ms not seconds
    };
}