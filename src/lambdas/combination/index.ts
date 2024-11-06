import { APIGatewayProxyEvent } from 'aws-lambda';
import fetch from 'axios';
import { formatJSONResponse } from '../../libs/apiGw';
import { TDeals, transformDeal } from './util';

export async function handler(event: APIGatewayProxyEvent) {
    try {
        const { queryStringParameters = {} } = event;

        if (!queryStringParameters?.currency) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: 'Error: Missing currency query parameter',
                },
            });
        }

        if (!process.env.API_STEAM_ENDP) {
            return formatJSONResponse({
                statusCode: 500,
                data: {
                    message: 'Error: Invalid environment config',
                },
            });
        }
        
        const deals: TDeals = await fetch(process.env.API_STEAM_ENDP);

        const currencyResp = await fetch(process.env.API_CURR_ENDP + queryStringParameters.currency + '.json');

        const currencyConvRate = currencyResp.data[queryStringParameters.currency].usd;

        const repricedDeals = deals.data.map((deal) => transformDeal(deal, currencyConvRate));

        return formatJSONResponse({
            statusCode: 200,
            data: repricedDeals,
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error ::" ,err.message);
            console.info(JSON.stringify(err.stack));
            return formatJSONResponse({
                statusCode: 502,
                data: {
                    message: err.message,
                },
            });
        } else {
            console.error('Unknown error ::', err);
            return formatJSONResponse({
                statusCode: 500,
                data: {
                    message: "Unknown error",
                },
            });
        }
    }
}