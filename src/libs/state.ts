import { EventEmitter } from 'events'

const state = new Map<string,any>([
    ['stillAlive', true]
])
const reservedKey = ['shutdown']

const event = new EventEmitter()
export const EVENT_SHUTDOWN = Symbol("Shutdown")

export const bind = (evt_name: symbol, listener: ()=>void):void => {
    event.on(evt_name, listener)
}

export const setState = (key:string, value:any):boolean => {
    if (reservedKey.indexOf(key) >= 0) return false
    state.set(key, value)

    return true
}

export const getState = (key:string, default_value?:any):any => {
    return state.get(key) || default_value
}

process.on('SIGINT', () => {
    state.set('shutdown', true)
    event.emit(EVENT_SHUTDOWN)
})

process.on('SIGTERM', () => {
    state.set('shutdown', true)
    event.emit(EVENT_SHUTDOWN)
})

console.log(`[STATE Libs] initialize`)