/** @format */

import { ChevronDownIcon, ChevronUpIcon, LogoutIcon } from '@heroicons/react/outline';
import { getSession, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, playlistIdState } from '../atoms/playListAtom';
import { Songs } from '../components';
import Layout from '../components/Layout';
import useSpotify from '../hooks/useSpotify';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-orange-500',
  'from-red-500',
  'from-purple-500',
  'from-pink-500',
  'from-teal-500',
  'from-gray-500',
];

const Home = () => {
  const { data: session, status } = useSession();
  const [color, setColor] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const spotifyApi = useSpotify();
  const playlistId = useRecoilValue(playlistIdState);
  const [playList, setPlayList] = useRecoilState(playlistState);

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then(data => {
          setPlayList(data.body);
        })
        .catch(err => console.log('err', err));
    }
  }, [spotifyApi, playlistId]);

  return (
    <Layout title='Home' className=''>
      {!session || !playList ? (
        <div className='flex w-full h-screen justify-center items-center'>
          <div className='relative w-40 h-40'>
            <Image src='/loader.gif' alt='loading' layout='fill' objectFit='cover' priority />
          </div>
        </div>
      ) : (
        <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
          <header className='absolute top-5 right-5'>
            <div
              className='rounded-full flex items-center bg-black space-x-3 text-white/90 group cursor-pointer p-2 pr-3 mb-2'
              onClick={() => setOpenMenu(prev => !prev)}>
              <div className='relative w-10 h-10'>
                <Image
                  src={session?.user.image}
                  alt='user-image'
                  layout='fill'
                  objectFit='cover'
                  className='rounded-full'
                />
              </div>
              <div className='flex space-x-2 items-center group-hover:opacity-80'>
                <h2 className=''>{session?.user.name}</h2>
                {openMenu ? (
                  <ChevronUpIcon className='w-5 h-5' />
                ) : (
                  <ChevronDownIcon className='w-5 h-5' />
                )}
              </div>
            </div>
            {openMenu && (
              <div className='w-full'>
                <button
                  className='sidebar-button bg-[#18D860] w-full rounded-full justify-center text-black p-2'
                  type='button'
                  onClick={() => signOut()}>
                  <LogoutIcon className='h-5 w-5' />
                  <p className=''>Logout</p>
                </button>
              </div>
            )}
          </header>

          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 w-full text-white p-8`}>
            <div className='relative h-44 w-44 shadow-2xl'>
              <Image
                src={playList?.images?.[0]?.url || '/spotify.png'}
                alt='playlist-image'
                layout='fill'
                objectFit='cover'
                priority
              />
            </div>
            <div className=''>
              <p className='mb-4'>播放清單</p>
              <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playList?.name}</h1>
            </div>
          </section>
          {/* Songs */}
          <div className=''>
            <Songs />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;

export const getServerSideProps = async context => {
  const session = await getSession(context);
  return {
    props: { session },
  };
};
