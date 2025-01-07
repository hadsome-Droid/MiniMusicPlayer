import {createSlice} from "@reduxjs/toolkit";

export type Status = 'Stopped' | 'Playing' | 'Paused'
type MusicPlayerState = {
    volume: number
    currentTrackIndex: number
    status: Status
    isRandomTrack: boolean
}

type Action = ReturnType<typeof changeTrack>
    | ReturnType<typeof changeTrackPlayerStatus>
    | ReturnType<typeof changeVolume>
    | ReturnType<typeof muteTrack>
    | ReturnType<typeof randomTrack>

const initialState: MusicPlayerState = {
    volume: 0.5,
    currentTrackIndex: 0,
    status: 'Paused' as Status,
    isRandomTrack: false
}

export const MusicPlayerSlice = createSlice({
    name: "musicPlayer",
    initialState,
    reducers: create => ({
        muteVolume: create.reducer((state, action) => {
            state.volume = 0
        }),
        switchTrack: create.reducer<{index: number}>((state, action) => {
            state.currentTrackIndex = action.payload.index
        }),
        changeVolume: create.reducer<{volume: number}>((state, action) => {
            state.volume = action.payload.volume
        }),
        randomTrack: create.reducer<{isRandomTrack: boolean}>((state, action) => {
            state.isRandomTrack = action.payload.isRandomTrack
        }),
        changeTrackStatus: create.reducer<{status: Status}>((state, action) => {
            state.status = action.payload.status
        })
    })
})

export const MusicPlayerReducer = MusicPlayerSlice.reducer
export const {muteVolume, changeVolume, switchTrack, randomTrack, changeTrackStatus} = MusicPlayerSlice.actions


// export const MusicPlayerReducer = (state: MusicPlayerState = initialState, action: Action): MusicPlayerState => {
//     switch (action.type) {
//         case "TRACK-MUTE-CHANGED":
//             return {...state, volume: 0}
//         case "TRACK-CHANGED":
//             return {...state, currentTrackIndex: action.payload}
//         case "TRACK-STATUS-CHANGED":
//             return {...state, status: action.payload}
//         case "TRACK-VOLUME-CHANGED":
//             return {...state, volume: action.payload}
//         case "RANDOM-TRACK":
//             return {...state, isRandomTrack: action.payload}
//         default:
//             return state
//     }
// }

// export const changeTrackPlayerStatus = (status: Status) => {
//     return {type: 'TRACK-STATUS-CHANGED', payload: status} as const
// }

// export const changeTrack = (index: number) => {
//     return {type: 'TRACK-CHANGED', payload: index} as const
// }

// export const changeVolume = (volume: number) => {
//     return {type: 'TRACK-VOLUME-CHANGED', payload: volume} as const
// }

// export const muteTrack = () => {
//     return {type: 'TRACK-MUTE-CHANGED'} as const
// }

// export const randomTrack = (isOn: boolean) => {
//     return {type: 'RANDOM-TRACK', payload: isOn} as const
// }