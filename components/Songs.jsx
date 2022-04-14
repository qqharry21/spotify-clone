/** @format */

import Image from 'next/image';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playListAtom';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';

const Songs = ({}) => {
  const playList = useRecoilValue(playlistState);
  return (
    <div className='text-white flex flex-col px-8 pb-28 space-y-2'>
      {playList?.tracks?.items?.map((track, index) => (
        <Song key={track.track.id} track={track} order={index} />
      ))}
    </div>
  );
};

const convertMillisecondToMinutesAndSeconds = millisecond => {
  var minutes = Math.floor(millisecond / 60000);
  var seconds = ((millisecond % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

const Song = ({ track, order }) => {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className='grid grid-cols-2 text-gray-400 px-5 hover:bg-gray-500/50 rounded-md cursor-pointer hover:text-white py-1'
      onClick={playSong}>
      <div className='flex space-x-4 items-center'>
        <p className=''>{order + 1}</p>
        <div className='relative w-10 h-10 min-w-[2.5rem]'>
          <Image
            src={track.track.album.images[0].url}
            alt={track.track.name}
            layout='fill'
            objectFit='contain'
          />
        </div>
        <div className=''>
          <p className='w-36 lg:w-64 truncate text-white'>{track.track.name}</p>
          <p className='w-40'>{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='w-40 hidden md:inline'>{track.track.album.name}</p>
        <p className=''>{convertMillisecondToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Songs;
