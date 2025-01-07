import {combineReducers, legacy_createStore, UnknownAction} from "redux";
import {MusicPlayerReducer} from "../features/model/MusicPlayerSlice.ts";
import {ThunkDispatch} from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        player: MusicPlayerReducer,
    }
})

// const rootReducer = combineReducers({
//     player: MusicPlayerReducer
// })

// export const store = legacy_createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>