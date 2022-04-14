/** @format */

import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

const Login = ({ providers }) => {
  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-black space-y-5'>
      <div className='relative w-52 h-52 mb-5 animate-bounce'>
        <Image src='/spotify.png' alt='spotify-logo' layout='fill' objectFit='cover' priority />
      </div>

      {Object.values(providers).map(provider => (
        <div className='group' key={provider.name}>
          <button
            className='bg-[#18D860] text-black font-extrabold p-5 rounded-full transition-all duration-200 group-hover:scale-105 group-hover:text-white'
            onClick={() => {
              signIn(provider.id, { callbackUrl: '/' });
            }}>
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
