import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {useAppSelector} from "../../../comon/hooks/useAppSelector.ts";
import {selectCurrentIndex, selectStatus} from "../../model/MusicPlayerSelector.ts";
import {useAppDispatch} from "../../../comon/hooks/useAppDispatch.ts";
import React from "react";
import {changeTrack, changeTrackPlayerStatus} from "../../model/MusicPlayerReducer.ts";

type Props = {
    mediaRef: React.RefObject<HTMLAudioElement>
    playerListLength: number
}

export const ControlPanel = ({mediaRef, playerListLength}: Props) => {
    const status = useAppSelector(selectStatus)
    const currentIndex = useAppSelector(selectCurrentIndex)
    const dispatch = useAppDispatch()

    const handlePlay = (index: number) => {
        dispatch(changeTrack(index))
        dispatch(changeTrackPlayerStatus('Playing'))
        if (mediaRef.current) {
            mediaRef.current.play();
        }
    }

    const handlePause = () => {
        dispatch(changeTrackPlayerStatus('Paused'))
        if (mediaRef.current) {
            mediaRef.current.pause();
        }
    }

    const handlePrevTrack = () => {
        const prevTrack = (currentIndex - 1 + playerListLength) % playerListLength
        if (status === 'Playing') {
            dispatch(changeTrack(prevTrack))
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        }
        dispatch(changeTrack(prevTrack))
    }

    const handleNextTrack = () => {
        const nextTrack = (currentIndex + 1) % playerListLength
        if (status === 'Playing') {
            dispatch(changeTrack(nextTrack))
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        }
        dispatch(changeTrack(nextTrack))
    }

    return (
        <Stack direction="row"
               spacing={3}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <IconButton aria-label='skipPrevious' color='warning' onClick={handlePrevTrack}
                        children={<SkipPreviousIcon/>}/>
            {status === 'Paused'
                ? <IconButton
                    aria-label='play'
                    color={'success'}
                    onClick={() => handlePlay(currentIndex)}
                    children={<PlayArrowIcon fontSize={'large'}/>}/>
                : <IconButton
                    aria-label={'pause'}
                    color={'primary'}
                    onClick={handlePause}
                    children={<PauseIcon fontSize={'large'}/>}/>
            }
            <IconButton aria-label='skipNext' color='warning' onClick={handleNextTrack}
                        children={<SkipNextIcon/>}/>
        </Stack>
    );
};
