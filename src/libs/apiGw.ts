type JSONPrimitive = string | number | boolean | null
type JSONObject = { [k: string]: JSONValue }
type JSONArray = JSONValue[]
export type JSONValue = JSONArray | JSONObject | JSONPrimitive

interface IFormatJSONResponseInput {statusCode?:number; data?: any}

export function formatJSONResponse ({ statusCode = 200, data = {} }: IFormatJSONResponseInput) {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
}