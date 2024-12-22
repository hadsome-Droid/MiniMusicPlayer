import {combineReducers, legacy_createStore, UnknownAction} from "redux";
import {MusicPlayerReducer} from "../features/model/MusicPlayerReducer.ts";
import {ThunkDispatch} from "redux-thunk";


const rootReducer = combineReducers({
    player: MusicPlayerReducer
})

export const store = legacy_createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>