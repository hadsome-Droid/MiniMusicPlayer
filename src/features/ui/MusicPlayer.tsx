import s from './MusicPlayer.module.css'
import {ChangeEvent, useRef, useState} from "react";
import {useAppDispatch} from "../../comon/hooks/useAppDispatch.ts";
import {useAppSelector} from "../../comon/hooks/useAppSelector.ts";
import {selectCurrentIndex, selectStatus} from "../model/MusicPlayerSelector.ts";
import {changeTrack, switchTrack} from "../model/MusicPlayerSlice.ts";
import {ControlPanel} from "./components/ControlPanel.tsx";
import {formatTime} from "../../comon/utils/FormatTime.ts";
import {parseBuffer} from 'music-metadata'
import { v4 as uuidv4 } from 'uuid';

type PlayerList = {
    id: string
    name: string | undefined
    artist: string | undefined
    srs: string
    cover: string | undefined
}

export const MusicPlayer = () => {
    const playerList = [
        {
            id: uuidv4(),
            name: 'Долбослав',
            artist: 'Powerwolf',
            src: '/src/assets/music/Powerwolf - Долбослав.mp3',
            cover: 'assets/1.jpg',
        },
        {
            id: uuidv4(),
            name: 'Фантом',
            artist: 'RADIO_TAPOK',
            src: '/src/assets/music/RADIO_TAPOK_-_antom_69069063.mp3',
            cover: 'assets/2.jpg',
        },
        {
            id: uuidv4(),
            name: 'Играть чтобы Жить',
            artist: 'Pavel_Plamenev',
            src: '/src/assets/music/Pavel_Plamenev_-_Igrat_chtoby_zhit_68906489.mp3',
            cover: 'assets/3.jpg',
        },
    ]
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector(selectCurrentIndex);
    const status = useAppSelector(selectStatus);

    const mediaRef = useRef<HTMLMediaElement | null>(null);

    const [playList, setPlayList] = useState(playerList);
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0);
    const [error, setError] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [audioSrc, setAudioSrc] = useState(null);


    const handleNextTrack = () => {
        const nextIndex = (currentIndex + 1) % playList.length;

        if (status === 'Playing') {
            // dispatch(changeTrack(nextIndex));
            dispatch(switchTrack({index: nextIndex}))
            if (mediaRef.current) {
                setTimeout(() => mediaRef.current?.play(), 0)
            }
        } else {
            // dispatch(changeTrack(nextIndex))
            dispatch(switchTrack({index: nextIndex}))
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

    const handleLoadedAudioData = async (e: ChangeEvent<HTMLInputElement>) => {
        // console.log(e)
        const file = e.currentTarget.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const metadata = await parseBuffer(uint8Array);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAudioSrc(e.target.result);
                };
                // reader.readAsDataURL(file)
                // reader.readAsArrayBuffer(file)
                // reader.readAsText(file)

                setMetadata(metadata);
                // const newTrack = {
                //     id: 1,
                //     name: metadata ? metadata.common.title : 'Some text',
                //     artist: metadata ? metadata?.common.artist : 'some artist',
                //     src: audioSrc,
                //     cover: 'dsf'
                // }
                setError(null);
                // setPlayList(newTrack)
            } catch (e: any) {
                setError(e.message);
            }
        }
    }

    return (
        <>
            <div className={s.container}>
                <div className={s.songInfo}>
                    <div className={s.artistName}>{playList[currentIndex].artist}</div>
                    <div className={s.songName}>{playList[currentIndex].name}</div>
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
                        src={playList[currentIndex].src}
                        onTimeUpdate={handleTimeUpdate} // Событие обновления времени
                        onLoadedMetadata={handleLoadedMetadata} // Событие загрузки метаданных
                    ></audio>
                </div>
                <div className={s.disk}>
                    <div className={s.circle}></div>
                    <div id="cover" className={`${s.cover} ${status === 'Playing' ? s.active : ''}`}></div>
                </div>
                <div className={s.controls}>
                    <ControlPanel mediaRef={mediaRef} playerListLength={playList.length}/>
                </div>
                <input type="file" onChange={handleLoadedAudioData} accept='audio/*' multiple/>
            </div>
        </>
    );
};
