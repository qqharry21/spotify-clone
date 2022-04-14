/** @format */

import { NextSeo } from 'next-seo';
import React from 'react';
import { Sidebar, Player } from '.';

const Layout = ({ children, title, description, className }) => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <NextSeo title={title} description={description} openGraph={{ title, description }} />
      <main className='flex'>
        <Sidebar />
        {children}
      </main>
      <Player />
    </div>
  );
};

export default Layout;
