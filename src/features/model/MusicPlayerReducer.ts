import Undi from './../../assets/music/Powerwolf - Долбослав.mp3'

type Status = 'Stopped' | 'Playing' | 'Paused'
type MusicPlayerState = {
    volume: number
    currentPlayPosition: number
    currentTrackIndex: number
    status: Status
}

type Action = ReturnType<typeof changeTrack>
    | ReturnType<typeof changeTrackPlayerStatus>
    | ReturnType<typeof changeVolume>
    | ReturnType<typeof muteTrack>

const initialState: MusicPlayerState = {
    volume: 0.5,
    currentPlayPosition: 0,
    currentTrackIndex: 0,
    status: 'Paused' as Status,
}

export const MusicPlayerReducer = (state: MusicPlayerState = initialState, action: Action): MusicPlayerState => {
    switch (action.type) {
        case "TRACK-MUTE-CHANGED":
            return {...state, volume: 0}
        case "TRACK-CHANGED":
            return {...state, currentTrackIndex: action.payload}
        case "TRACK-STATUS-CHANGED":
            return {...state, status: action.payload}
        case "TRACK-VOLUME-CHANGED":
            return {...state, volume: action.payload}
        default:
            return state
    }
}

export const changeTrackPlayerStatus = (status: Status) => {
    return {type: 'TRACK-STATUS-CHANGED', payload: status} as const
}

export const changeTrack = (index: number) => {
    return {type: 'TRACK-CHANGED', payload: index} as const
}

export const changeVolume = (volume: number) => {
    return {type: 'TRACK-VOLUME-CHANGED', payload: volume} as const
}

export const muteTrack = () => {
    return {type: 'TRACK-MUTE-CHANGED'} as const
}