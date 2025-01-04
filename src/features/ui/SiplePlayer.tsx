import React, { useRef, useState } from "react";

// Пример массива объектов с аудиофайлами
const audioFiles = [
    { id: 1, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "Song 1" },
    { id: 2, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "Song 2" },
    { id: 3, src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", title: "Song 3" },
];

const AudioPlayer: React.FC = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0); // Индекс текущего трека
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Обработчик воспроизведения трека
    const handlePlay = (index: number) => {
        setCurrentTrackIndex(index);
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    // Обработчик паузы
    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    // Обработчик остановки
    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Обработчик переключения на следующий трек
    const handleNextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % audioFiles.length;
        setCurrentTrackIndex(nextIndex);
    };

    // Обработчик переключения на предыдущий трек
    const handlePrevTrack = () => {
        const prevIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
        setCurrentTrackIndex(prevIndex);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Аудиоплеер</h1>
            <div style={{ marginBottom: "20px" }}>
                <p>{audioFiles[currentTrackIndex].title}</p>
                <audio
                    ref={audioRef}
                    controls
                    src={audioFiles[currentTrackIndex].src}
                    onEnded={handleNextTrack} // Автоматически переключает на следующий трек после окончания
                    onVolumeChange={() => {}}
                >
                    Ваш браузер не поддерживает тег audio.
                </audio>
            </div>

            <div>
                <button onClick={() => handlePlay(currentTrackIndex)}>Воспроизвести</button>
                <button onClick={handlePause}>Пауза</button>
                <button onClick={handleStop}>Стоп</button>
                <button onClick={handlePrevTrack}>Предыдущий</button>
                <button onClick={handleNextTrack}>Следующий</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Список треков:</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {audioFiles.map((file, index) => (
                        <li key={file.id} style={{ marginBottom: "10px" }}>
                            <button onClick={() => handlePlay(index)}>{file.title}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AudioPlayer;