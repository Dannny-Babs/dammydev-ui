'use client'

import './spinner.css'

export function IOSpinner( { className, light = false }: { className?: string, light?: boolean } ) {
  return (
    <div className={`ispinner ${className} ${light ? 'light' : 'dark'}`}>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
      <div className="ispinner-blade"></div>
    </div>
  )
}
