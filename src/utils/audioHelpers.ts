import { audioEngine } from '../services/AudioEngine.service';

/**
 * Загружает аудио из base64 encoded_audio
 */
/**
 * Проверяет, является ли декодированные данные валидным аудио файлом
 */
const isValidAudioData = (audioData: string): boolean => {
  if (!audioData || audioData.length < 4) {
    return false;
  }

  // Проверяем первые байты на наличие аудио сигнатур
  const firstBytes = new Uint8Array(
    Array.from(audioData.substring(0, 4)).map(c => c.charCodeAt(0))
  );

  // MP3 файлы начинаются с:
  // - 0xFF 0xFB или 0xFF 0xFA (MPEG-1 Layer 3)
  // - 0xFF 0xF3 или 0xFF 0xF2 (MPEG-2 Layer 3)
  // - "ID3" (ID3v2 тег)
  // - "RIFF" (WAV файлы)
  // - "OggS" (OGG файлы)
  // - "fLaC" (FLAC файлы)

  // Проверка на ID3 тег
  if (audioData.substring(0, 3) === 'ID3') {
    return true;
  }

  // Проверка на RIFF (WAV)
  if (audioData.substring(0, 4) === 'RIFF') {
    return true;
  }

  // Проверка на OGG
  if (audioData.substring(0, 4) === 'OggS') {
    return true;
  }

  // Проверка на FLAC
  if (audioData.substring(0, 4) === 'fLaC') {
    return true;
  }

  // Проверка на MP3 sync word (0xFF 0xFB, 0xFF 0xFA, 0xFF 0xF3, 0xFF 0xF2)
  if (firstBytes[0] === 0xFF && 
      (firstBytes[1] === 0xFB || firstBytes[1] === 0xFA || 
       firstBytes[1] === 0xF3 || firstBytes[1] === 0xF2)) {
    return true;
  }

  // Если данные начинаются с текста "Audio data for...", это не валидное аудио
  if (audioData.substring(0, 10).toLowerCase().includes('audio data')) {
    return false;
  }

  // Если данные слишком маленькие (меньше 1KB), вероятно это не аудио
  if (audioData.length < 1024) {
    return false;
  }

  return false;
};

export const loadAudioFromEncoded = async (encodedAudio: string): Promise<void> => {
  try {
    // Декодируем base64
    const audioData = atob(encodedAudio);
    
    // Проверяем, является ли это валидным аудио
    const isValid = isValidAudioData(audioData);
    
    if (!isValid) {
      // Если данные выглядят как текст (начинаются с "Audio data for..."), это точно не аудио
      if (audioData.substring(0, 10).toLowerCase().includes('audio data')) {
        const errorMessage = `Данные не являются валидным аудио файлом. Сервер возвращает в поле encoded_audio текстовую строку вместо реальных аудио данных.`;
        throw new Error(errorMessage);
      }
    }
    
    const bytes = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      bytes[i] = audioData.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    
    await audioEngine.load(audioUrl);
  } catch (error) {
    throw error;
  }
};

