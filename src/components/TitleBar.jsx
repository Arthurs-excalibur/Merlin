import { useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import './TitleBar.css';

export default function TitleBar() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClose = () => getCurrentWindow().close();
  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();

  return (
    <div className="titlebar">
      <div 
        className="mac-window-controls"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="mac-btn close" 
          onClick={handleClose}
        >
          {isHovered && (
            <svg width="8" height="8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div 
          className="mac-btn minimize" 
          onClick={handleMinimize}
        >
          {isHovered && (
            <svg width="8" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1H13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div 
          className="mac-btn maximize" 
          onClick={handleMaximize}
        >
          {isHovered && (
             <svg width="8" height="8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1 1H6L1 6V1Z" fill="black" />
               <path d="M13 13H8L13 8V13Z" fill="black" />
             </svg>
          )}
        </div>
      </div>
      <div data-tauri-drag-region className="drag-region" style={{ flex: 1, height: '100%' }}></div>
    </div>
  );
}
