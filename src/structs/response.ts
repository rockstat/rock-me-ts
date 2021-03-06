export const STATUS_OK = 200;
export const STATUS_OK_NO_CONTENT = 204;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_NOT_FOUND = 404;
export const STATUS_TEAPOT = 418;
export const STATUS_INT_ERROR = 500;
export const STATUS_TEMP_REDIR = 302;
export const STATUS_PERSIST_REDIR = 301;
export const STATUS_SEE_OTHERS_REDIR = 303;
export const STATUS_UNKNOWN = 'Unknown Status';


export const STATUS_DESCRIPTIONS = {
  [STATUS_OK]: 'Ok',
  [STATUS_OK_NO_CONTENT]: 'No Content',
  [STATUS_BAD_REQUEST]: 'Bad Request',
  [STATUS_NOT_FOUND]: 'Not Found',
  [STATUS_TEAPOT]: "I'm a teapot",
  [STATUS_INT_ERROR]: 'Internal Error',
  [STATUS_TEMP_REDIR]: 'Temporary Redirect',
  [STATUS_PERSIST_REDIR]: 'Temporary Redirect',
  [STATUS_SEE_OTHERS_REDIR]: 'See Others'
}
export type HTTPCodes = keyof typeof STATUS_DESCRIPTIONS;

// === Header

export type HTTPHeader = [string, number | string | string[]];
export type HTTPHeaders = Array<HTTPHeader>;

const RESP_TYPE_KEY = 'type__';
const RESP_PIXEL = 'pixel'
const RESP_REDIRECT = 'redirect'
const RESP_ERROR = 'error'
const RESP_DATA = 'data'

export {
  RESP_TYPE_KEY,
  RESP_PIXEL,
  RESP_REDIRECT,
  RESP_ERROR,
  RESP_DATA
}

export type ResponseTypeRedirect = typeof RESP_REDIRECT;
export type ResponseTypePixel = typeof RESP_PIXEL;
export type ResponseTypeError = typeof RESP_ERROR;
export type ResponseTypeData = typeof RESP_DATA;

export type BandResponseDataType = { [k: string]: any } | Array<any> | string | number | null;

export interface BandResponseBase {
  type__: ResponseTypeRedirect | ResponseTypePixel | ResponseTypeError | ResponseTypeData;
  id__?: string;
  native__?: boolean;
  headers: HTTPHeaders;
  statusCode: number;
}

export type BandResponseRedirect = {
  type__: ResponseTypeRedirect;
  location: string;
} & BandResponseBase;

export type BandResponsePixel = {
  type__: ResponseTypePixel;
} & BandResponseBase;

export type BandResponseError = {
  type__: ResponseTypeError;
  errorMessage: string;
} & BandResponseBase;

export type BandResponseData = {
  type__: ResponseTypeData;
  contentType?: string;
  data: BandResponseDataType;
} & BandResponseBase;

// export type ResponseTypes = ResponseTypeRedirect | ResponseTypeError | ResponseTypePixel | ResponseTypeData | ResponseTypeEmpty;
// export interface BandResponseFull {
//   location?: string;
//   statusCode?: number;
//   type: ResponseTypes;
//   errorMessage?: string;
//   data?: { [k: string]: any } | Buffer | string | number | null;
// }

export type BandResponse = BandResponseData
  | BandResponsePixel
  | BandResponseRedirect
  | BandResponseError


export type UnknownResponse = BandResponse | string | number | Array<any> | Object;

export type BandRedirectResponseBuilder = (params: { location: string, statusCode?: HTTPCodes, headers?: HTTPHeaders }) => BandResponseRedirect;

const redirect: BandRedirectResponseBuilder = ({ location, statusCode, headers }) => {
  return {
    type__: RESP_REDIRECT,
    headers: headers || [],
    location,
    statusCode: statusCode || STATUS_TEMP_REDIR,
  }
}

export type BandPixelResponseBuilder = (params: { statusCode?: HTTPCodes, headers?: HTTPHeaders }) => BandResponsePixel;

const pixel: BandPixelResponseBuilder = ({ statusCode, headers }) => {
  return {
    type__: RESP_PIXEL,
    headers: headers || [],
    statusCode: statusCode || STATUS_OK,
    type: RESP_PIXEL
  }
}

export type BandErrorResponseBuilder = (params: { statusCode?: HTTPCodes, errorMessage?: string, headers?: HTTPHeaders }) => BandResponseError;

const error: BandErrorResponseBuilder = ({ statusCode, errorMessage, headers }) => {
  statusCode = statusCode || STATUS_INT_ERROR;
  return {
    type__: RESP_ERROR,
    headers: headers || [],
    statusCode: statusCode,
    errorMessage: errorMessage || STATUS_DESCRIPTIONS[statusCode],
  }
}

export type BandDataResponsdeBuilder = (params: { data?: BandResponseData['data'], statusCode?: HTTPCodes, headers?: HTTPHeaders, contentType?: string }) => BandResponseData;

const data: BandDataResponsdeBuilder = ({ data, statusCode, headers, contentType }) => {
  return {
    type__: RESP_DATA,
    headers: headers || [],
    statusCode: statusCode || STATUS_OK,
    contentType: contentType,
    data: data || {}
  }
}

/**
 * Check is correct band response
 * @param msg 
 */
export const isBandResponse = (msg: UnknownResponse) => {
  return msg !== undefined
    && msg !== null
    && typeof msg === 'object'
    && !Array.isArray(msg)
    && RESP_TYPE_KEY in msg;
}

export const response = {
  redirect,
  pixel,
  error,
  data
}
