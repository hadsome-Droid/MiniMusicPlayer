import {RootState} from "../../app/store.ts";

export const selectStatus = (state: RootState) => state.player?.status;
export const selectCurrentIndex = (state: RootState) => state.player?.currentTrackIndex
export const selectVolume = (state: RootState) => state.player.volume;
export const selectIsRandomTrack = (state: RootState) => state.player?.isRandomTrack;