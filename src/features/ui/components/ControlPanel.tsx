import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {useAppSelector} from "../../../comon/hooks/useAppSelector.ts";
import {selectCurrentIndex, selectIsRandomTrack, selectStatus} from "../../model/MusicPlayerSelector.ts";
import {useAppDispatch} from "../../../comon/hooks/useAppDispatch.ts";
import React from "react";
import {
    changeTrackStatus,
    randomTrack,
    Status,
    switchTrack
} from "../../model/MusicPlayerSlice.ts";
import {Volume} from "./Volume.tsx";
import {getRandomIndex} from "../../../comon/utils/GetRandomIndex.ts";

type Props = {
    mediaRef: React.RefObject<HTMLAudioElement>
    playerListLength: number
}

export const ControlPanel = ({mediaRef, playerListLength}: Props) => {
    const status = useAppSelector(selectStatus)
    const currentIndex = useAppSelector(selectCurrentIndex)
    const isRandomTrack = useAppSelector(selectIsRandomTrack)
    const dispatch = useAppDispatch()

    const isPlaying = (status: Status) => {
        if (mediaRef.current) {
            if (status === 'Playing') {
                mediaRef.current.play();
            }
            if (status === 'Paused') {
                mediaRef.current.pause();
            }
        }
    }

    const handlePlay = (index: number) => {
        // dispatch(changeTrack(index))
        dispatch(switchTrack({index}))
        // dispatch(changeTrackPlayerStatus('Playing'))
        dispatch(changeTrackStatus({status: 'Playing'}))
        isPlaying('Playing')
    }

    const handlePause = () => {
        dispatch(changeTrackStatus({status: 'Paused'}))
        isPlaying('Paused')
    }

    const handleSwitchTrack = (indexTrack: number) => {
        if (status === 'Playing') {
            // dispatch(changeTrack(indexTrack))
            dispatch(switchTrack({index: indexTrack}))
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        }
        dispatch(switchTrack({index: indexTrack}))
    }

    const handlePrevTrack = () => {
        const prevTrack = (currentIndex - 1 + playerListLength) % playerListLength
        const randomTrack = getRandomIndex(playerListLength)
        if (isRandomTrack === true) {
           return handleSwitchTrack(randomTrack)
        }
        handleSwitchTrack(prevTrack)
    }

    const handleNextTrack = () => {
        const nextTrack = (currentIndex + 1) % playerListLength
        const randomTrack = getRandomIndex(playerListLength)
        if (isRandomTrack === true) {
           return  handleSwitchTrack(randomTrack)
        }
        handleSwitchTrack(nextTrack)
    }

    const handleRandomTrack = () => {
        dispatch(randomTrack({isRandomTrack: !isRandomTrack}))
    }
    console.log(isRandomTrack, currentIndex)
    return (
        <Stack direction="row"
               spacing={3}
               sx={{
                   justifyContent: "center",
                   alignItems: "center",
               }}>
            <IconButton children={<ShuffleIcon/>} onClick={handleRandomTrack} color={isRandomTrack ? 'primary' : 'default'}/>
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
            <Volume mediaRef={mediaRef}/>
        </Stack>
    );
};
