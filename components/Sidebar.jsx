/** @format */

import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playListAtom';
const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playLists, setPlayLists] = useState([]);
  const [playListId, setPlayListId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then(data => {
        setPlayLists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='text-gray-500 p-5 text-sm md:text-base border-r border-gray-900 max-w-[190px] h-screen hidden sm:block pb-16'>
      <div className='space-y-4'>
        <button className='sidebar-button' type='button'>
          <HomeIcon className='h-5 w-5' />
          <p className=''>Home</p>
        </button>
        <button className='sidebar-button' type='button'>
          <SearchIcon className='h-5 w-5' />
          <p className=''>Search</p>
        </button>
        <button className='sidebar-button' type='button'>
          <LibraryIcon className='h-5 w-5' />
          <p className=''>Your Library</p>
        </button>
        <hr className='border border-t-[0.1px] border-gray-900' />
        <button className='sidebar-button' type='button'>
          <PlusCircleIcon className='h-5 w-5' />
          <p className=''>Create Playlist</p>
        </button>
        <button className='sidebar-button' type='button'>
          <HeartIcon className='h-5 w-5' />
          <p className=''>Liked Songs</p>
        </button>
        <button className='sidebar-button' type='button'>
          <RssIcon className='h-5 w-5' />
          <p className=''>Your episodes</p>
        </button>
        <hr className='border border-t-[0.1px] border-gray-900' />

        {/* PlayList */}
        <div className='flex flex-col space-y-4 overflow-y-scroll scrollbar-hide flex-grow h-[500px]'>
          {playLists.map(playList => (
            <p
              className={`cursor-pointer hover:text-white rounded-md  ${
                playListId === playList.id && 'text-white/90'
              }`}
              key={playList.id}
              onClick={() => setPlayListId(playList.id)}>
              {playList.name}
            </p>
          ))}
        </div>
        {/* Logout */}
        <button
          className='sidebar-button bg-[#18D860] w-full rounded-full justify-center text-black p-2'
          type='button'
          onClick={() => signOut()}>
          <LogoutIcon className='h-5 w-5' />
          <p className=''>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
