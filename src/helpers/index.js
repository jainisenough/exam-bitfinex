import {WS_URL} from "../config";

export function socketConnection(msg) {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => ws.send(msg);
    ws.onmessage = console.log;
    ws.onclose = console.log;
    return ws;
}