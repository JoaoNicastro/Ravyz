import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { testAudioPlayback } from '../lib/audio-utils';

interface CustomAudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded?: () => void;
  className?: string;
  variant?: 'inline' | 'floating';
  showWaveform?: boolean;
}

export function CustomAudioPlayer({ 
  audioUrl, 
  isPlaying, 
  onPlayPause, 
  onEnded,
  className = '',
  variant = 'inline',
  showWaveform = false
}: CustomAudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setCurrentTime(0);
      onEnded?.();
    };
    const handleError = () => {
      console.error('Audio player error');
      setHasError(true);
      setCanPlay(false);
    };
    const handleCanPlay = () => {
      setHasError(false);
      setCanPlay(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
  }, [isPlaying, canPlay, hasError]);

  useEffect(() => {
    // Test audio playback capability when URL changes
    if (audioUrl) {
      testAudioPlayback(audioUrl).then(setCanPlay);
    }
  }, [audioUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickTime = (clickX / progressWidth) * duration;
    
    audio.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>

            <div className="flex items-center gap-3 min-w-[200px]">
              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)}
              </span>
              
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                
                {showWaveform && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-white/40 rounded-full mx-0.5"
                        style={{ height: `${20 + Math.random() * 60}%` }}
                        animate={isPlaying ? {
                          height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 40}%`, `${20 + Math.random() * 60}%`]
                        } : {}}
                        transition={{
                          duration: 0.5 + Math.random() * 0.5,
                          repeat: isPlaying ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <span className="text-white text-sm">
                {formatTime(duration)}
              </span>
            </div>

            <Button
              size="sm"
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl} preload="none" onEnded={onEnded} />
      </motion.div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 ${className}`}>
      {hasError ? (
        <div className="flex items-center gap-3 text-white">
          <AlertTriangle className="w-5 h-5 text-orange-300 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Não foi possível reproduzir o áudio</p>
            <p className="text-xs text-white/70">Formato não suportado ou erro de rede</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            onClick={onPlayPause}
            disabled={!canPlay}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white p-0 flex-shrink-0 disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">
                {canPlay ? 'Resposta do AI Mentor' : 'Carregando áudio...'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <Button
                  size="sm"
                  onClick={toggleMute}
                  disabled={!canPlay}
                  className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 text-white p-0 disabled:opacity-50"
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            <div 
              ref={progressRef}
              onClick={handleProgressClick}
              className={`h-2 bg-white/20 rounded-full relative overflow-hidden ${canPlay ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Pulse effect when playing */}
              {isPlaying && canPlay && (
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-full"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={audioUrl} preload="none" onEnded={onEnded} />
    </div>
  );
}