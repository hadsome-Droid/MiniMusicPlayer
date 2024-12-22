import s from './MusicPlayer.module.css'
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../comon/hooks/useAppDispatch.ts";
import {useAppSelector} from "../../comon/hooks/useAppSelector.ts";
import {selectCurrentIndex, selectStatus, selectVolume} from "../model/MusicPlayerSelector.ts";
import {changeTrack, changeVolume} from "../model/MusicPlayerReducer.ts";
import {ControlPanel} from "./components/ControlPanel.tsx";
import {formatTime} from "../../comon/utils/FormatTime.ts";

export const MusicPlayer = () => {
    const playerList = [
        {
            id: 1,
            name: 'Долбослав',
            artist: 'Powerwolf',
            src: '/src/assets/music/Powerwolf - Долбослав.mp3',
            cover: 'assets/1.jpg',
        },
        {
            id: 2,
            name: 'Фантом',
            artist: 'RADIO_TAPOK',
            src: '/src/assets/music/RADIO_TAPOK_-_antom_69069063.mp3',
            cover: 'assets/2.jpg',
        },
        {
            id: 3,
            name: 'Играть чтобы Жить',
            artist: 'Pavel_Plamenev',
            src: '/src/assets/music/Pavel_Plamenev_-_Igrat_chtoby_zhit_68906489.mp3',
            cover: 'assets/3.jpg',
        },
    ]
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector(selectCurrentIndex);
    const volume = useAppSelector(selectVolume);
    const status = useAppSelector(selectStatus);

    const mediaRef = useRef<HTMLMediaElement | null>(null);


    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0);


    useEffect(() => {
        if (mediaRef.current) {
            mediaRef.current.volume = volume
        }
    }, []);

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

    const handleChangeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeVolume(parseFloat(e.target.value)))
        if (mediaRef.current) {
            mediaRef.current.volume = volume
        }
    }

    const calculateBackgroundSize = (value: number, min: number, max: number) => {
        const valuePercent = `${100 - ((max - value) / (max - min)) * 100}% 100%`;
        return valuePercent;
    };

    const rangeStyle = {
        backgroundSize: calculateBackgroundSize(volume, 0, 1),
    };
    return (
        <>
            <div className={s.container}>
                <div className={s.songInfo}>
                    <div className={s.artistName}>{playerList[currentIndex].artist}</div>
                    <div className={s.songName}>{playerList[currentIndex].name}</div>
                    <div className={s.fillBarWrap}>
                        <input
                            type="range"
                            min="0"
                            max={mediaRef.current?.duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className={s.fillBar}
                        />
                    </div>
                    <div className={s.time}>
                        {formatTime(+currentTime.toFixed(2))} / {formatTime(+duration.toFixed(2))}
                    </div>
                    <audio
                        ref={mediaRef}
                        onEnded={handleNextTrack}
                        src={playerList[currentIndex].src}
                        onTimeUpdate={handleTimeUpdate} // Событие обновления времени
                        onLoadedMetadata={handleLoadedMetadata} // Событие загрузки метаданных
                    ></audio>
                </div>
                <div className={s.disk}>
                    <div className={s.circle}></div>
                    <div id="cover" className={`${s.cover} ${status === 'Playing' ? s.active : ''}`}></div>
                </div>
                <div className={s.controls}>
                    <ControlPanel mediaRef={mediaRef} playerListLength={playerList.length}/>
                    <input
                        type="range"
                        className={s.volume}
                        min='0'
                        max='1'
                        value={volume}
                        step='0.01'
                        onChange={handleChangeVolume}
                        style={rangeStyle}
                    />
                </div>

            </div>
        </>
    );
};
