import jsmediatags from 'jsmediatags';


// Функция для чтения метаданных
export function readAudioMetadata(file) {
    jsmediatags.read(file, {
        onSuccess: (tag) => {
            const { title, artist, album, picture } = tag.tags;

            console.log("Название трека:", title);
            console.log("Исполнитель:", artist);
            console.log("Альбом:", album);

            // Если есть изображение альбома
            if (picture) {
                const base64String = arrayBufferToBase64(picture.data);
                const imageUrl = `data:${picture.format};base64,${base64String}`;
                console.log("Изображение альбома:", imageUrl);
            }
        },
        onError: (error) => {
            console.error("Ошибка чтения метаданных:", error);
        },
    });
}

// Функция для преобразования ArrayBuffer в Base64
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Пример использования
// const audioFile = new File([/* ваш аудиофайл */], "example.mp3", {
//     type: "audio/mpeg",
// });

// readAudioMetadata(audioFile);