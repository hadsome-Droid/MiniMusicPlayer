import d from './../../assets/music/Pavel_Plamenev_-_Igrat_chtoby_zhit_68906489.mp3'
import s from './MusicPlayer.module.css'
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import {ChangeEvent, useRef, useState} from "react";
import {useAppDispatch} from "../../comon/hooks/useAppDispatch.ts";
import {useAppSelector} from "../../comon/hooks/useAppSelector.ts";
import {selectCurrentIndex, selectStatus, selectVolume} from "../model/MusicPlayerSelector.ts";
import {changeTrack, changeTrackPlayerStatus} from "../model/MusicPlayerReducer.ts";

export const MusicPlayer = () => {
    const playerList = [
        {
            id: 1,
            name: 'Долбослав',
            artist: 'Kevin',
            src: '/src/assets/music/Powerwolf - Долбослав.mp3',
            cover: 'assets/1.jpg',
        },
        {
            id: 2,
            name: 'Фантом',
            artist: 'Kevin MacLeod',
            src: '/src/assets/music/RADIO_TAPOK_-_antom_69069063.mp3',
            cover: 'assets/2.jpg',
        },
        {
            id: 3,
            name: 'Играть чтобы Жить',
            artist: 'Kleo Leo',
            src: '/src/assets/music/Pavel_Plamenev_-_Igrat_chtoby_zhit_68906489.mp3',
            cover: 'assets/3.jpg',
        },
    ]
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector(selectCurrentIndex);
    const volume = useAppSelector(selectVolume);
    const status = useAppSelector(selectStatus);
    console.log(playerList[currentIndex].src);
    const mediaRef = useRef<HTMLMediaElement | null>(null);

    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const second = Math.floor(seconds % 60)
        return `${minutes}:${second < 10 ? '0' : ''}${second}`
    }

    const handlePlay = (index: number) => {
        dispatch(changeTrack(index));
        dispatch(changeTrackPlayerStatus('Playing'))
        if (mediaRef.current) {
            mediaRef.current.play();
        }
    }

    const handlePause = () => {
        // dispatch(changeTrack(index));
        dispatch(changeTrackPlayerStatus('Paused'))
        if (mediaRef.current) {
            mediaRef.current.pause();
        }
    }

    const handleNextTrack = () => {
        const nextIndex = (currentIndex + 1) % playerList.length;
        console.log(nextIndex);
        if (status === 'Playing') {
            dispatch(changeTrack(nextIndex));
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        } else {
            dispatch(changeTrack(nextIndex))
        }
    }

    const handlePrevTrack = () => {
        const prevIndex = (currentIndex - 1 + playerList.length) % playerList.length;
        if (status === 'Playing') {
            dispatch(changeTrack(prevIndex))
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        }
        dispatch(changeTrack(prevIndex))
    }

    const handleTimeUpdate = () => {
        if (mediaRef.current) {
            setCurrentTime(mediaRef.current.currentTime);
        }
    }

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(e.currentTarget.value)
        if (mediaRef.current) {
            mediaRef.current.currentTime = seekTime
            setCurrentTime(seekTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (mediaRef.current) {
            setDuration(mediaRef.current.duration)
        }
    }

    return (
        <>
            <div className={s.container}>
                <div className={s.songInfo}>
                    <div className={s.artistName}>{playerList[currentIndex].artist}</div>
                    <div className={s.songName}>{playerList[currentIndex].name}</div>
                    <div >
                        {/*<div className={s.fillBar} style={{width: `${(currentTime / duration) * 100}%`}}*/}
                        {/*     onChange={handleSeek}></div>*/}
                        <input
                            type="range"
                            min="0"
                            max={mediaRef.current?.duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className={s.fillBar}
                            // style={{width: `${(currentTime / duration) * 100}%`}}
                        />
                    </div>
                    <div className={s.time}>{
                        formatTime(+currentTime.toFixed(2))} - {formatTime(+duration.toFixed(2))}</div>
                    {/*<div className={s.time}>{Math.floor(mediaRef.current?.duration.toFixed(2) % 60)}</div>*/}
                    <audio
                        ref={mediaRef}
                        onEnded={handleNextTrack}
                        src={playerList[currentIndex].src}
                        onTimeUpdate={handleTimeUpdate} // Событие обновления времени
                        onLoadedMetadata={handleLoadedMetadata} // Событие загрузки метаданных
                        onVolumeChange={() => {
                        }}
                    ></audio>
                </div>
                <div className={s.disk}>
                    <div className={s.circle}></div>
                    <div id="cover" className={s.cover}></div>
                </div>
                <div className={s.controls}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label='skipPrevious' onClick={handlePrevTrack}><SkipPreviousIcon/></IconButton>
                        {status === 'Paused'
                            ? <IconButton
                                aria-label='play'
                                color={'success'}
                                onClick={() => handlePlay(currentIndex)
                                }>
                                <PlayArrowIcon/>
                            </IconButton>
                            : <IconButton
                                aria-label={'pause'}
                                color={'primary'}
                                onClick={handlePause}
                            >
                                <PauseIcon/>
                            </IconButton>
                        }
                        <IconButton aria-label='skipNext' onClick={handleNextTrack}><SkipNextIcon/></IconButton>
                    </Stack>
                </div>

            </div>
        </>
    );
};
