/** @format */

import { RefreshIcon, SwitchHorizontalIcon, VolumeUpIcon } from '@heroicons/react/outline';
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  VolumeOffIcon,
} from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(100);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        console.log('Now playing:', data.body?.item.name);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then(data => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
    }
  }, [currentTrackIdState, spotifyApi, session]);

  function debounce(func, delay = 250) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedAdjustVolume = useCallback(
    debounce(value => {
      spotifyApi.setVolume(value).catch(err => console.log(err));
    }, 500),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    } else {
      spotifyApi.setVolume(volume).catch(err => console.log(err));
    }
  }, [volume]);

  return (
    <div className='sticky bottom-0'>
      <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 justify-between'>
        {/* Left */}
        <div className='flex items-center space-x-6 justify-start'>
          <div className='relative w-16 h-16 rounded-sm'>
            <Image
              src={songInfo?.album?.images?.[0]?.url || '/spotify.png'}
              alt='playing-image'
              layout='fill'
              objectFit='cover'
            />
          </div>
          <div className=''>
            <h3 className=''>{songInfo?.name}</h3>
            <p className=''>{songInfo?.artists?.[0]?.name}</p>
          </div>
        </div>
        {/* Center */}
        <div className='flex space-x-5 items-center justify-center'>
          <SwitchHorizontalIcon
            className='player-button'
            onClick={() => spotifyApi.skipToPrevious()}
          />
          <RewindIcon className='player-button' />
          {isPlaying ? (
            <PauseIcon
              className='player-button h-14 w-14 text-white/90'
              onClick={handlePlayPause}
            />
          ) : (
            <PlayIcon className='player-button h-14 w-14 text-white/90' onClick={handlePlayPause} />
          )}
          <FastForwardIcon className='player-button' onClick={() => spotifyApi.skipToNext()} />
          <RefreshIcon className='player-button' />
        </div>

        {/* Right */}
        <div className='flex items-center space-x-2 justify-end'>
          <VolumeOffIcon
            className='player-button'
            onClick={() => volume > 0 && setVolume(Number(volume - 10))}
          />
          <input
            type='range'
            className='w-14 md:w-28'
            value={volume}
            min={0}
            max={100}
            onChange={e => {
              setVolume(Number(e.target.value));
            }}
          />
          <VolumeUpIcon
            className='player-button'
            onClick={() => {
              volume < 100 && setVolume(Number(volume + 10));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
