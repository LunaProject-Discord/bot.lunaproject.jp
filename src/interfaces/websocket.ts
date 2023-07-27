export type WebSocketResponseType =
    'ok'
    | 'created'
    | 'no_content'
    | 'bad_request'
    | 'unauthorized'
    | 'forbidden'
    | 'not_found'
    | 'internal_server_error';

export interface WebSocketResponse {
    type: WebSocketResponseType;
}
