import React, {ChangeEvent, useCallback, useEffect} from "react";
import s from "../MusicPlayer.module.css";
import {useAppSelector} from "../../../comon/hooks/useAppSelector.ts";
import {selectVolume} from "../../model/MusicPlayerSelector.ts";
import {useAppDispatch} from "../../../comon/hooks/useAppDispatch.ts";
import {changeVolume, muteTrack} from "../../model/MusicPlayerReducer.ts";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

type Props = {
    mediaRef: React.RefObject<HTMLAudioElement>
}

export const Volume = ({mediaRef}: Props) => {
    const volume = useAppSelector(selectVolume)
    const dispatch = useAppDispatch()

    const updateVolume = useCallback(() => {
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
        }
    }, [mediaRef, volume]);

    useEffect(() => {
        updateVolume()
    }, [volume, updateVolume]);

    const handleChangeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeVolume(+e.currentTarget.value))
    }

    const handleMute = () => {
        dispatch(muteTrack())
    }

    const calculateBackgroundSize = (value: number, min: number, max: number) => {
        return `${100 - ((max - value) / (max - min)) * 100}% 100%`;
    };

    const rangeStyle = {
        backgroundSize: calculateBackgroundSize(volume, 0, 1),
        marginLeft: '5px',
    };

    return (
        <>
            <IconButton
                aria-label={'mute'}
                children={volume > 0
                    ? <VolumeUpIcon color={'primary'} fontSize={'small'}/>
                    : <VolumeOffIcon color={'error'} fontSize={'small'}/>
                }
                onClick={handleMute}
            />
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
        </>
    );
};
