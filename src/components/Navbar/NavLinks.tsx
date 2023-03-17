import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useConfig } from 'contexts/configContext';
import { dolphinConfig } from 'config';

const NAVLINKPATH = {
  Transact: '/transact',
  Bridge: '/bridge',
  Stake: '/stake',
  NPO: '/sbt'
};

const NavLinks = () => {
  const { NETWORK_NAME } = useConfig();
  const location = useLocation();
  const networkUrlParam = `/${NETWORK_NAME.toLowerCase()}`;

  const isDolphinPage = NETWORK_NAME === dolphinConfig.NETWORK_NAME;
  const isActiveTransactPage = location.pathname.includes(NAVLINKPATH.Transact);
  const isActiveBridgePage = location.pathname.includes(NAVLINKPATH.Bridge);
  const isActiveStakePage = location.pathname.includes(NAVLINKPATH.Stake);
  const isActiveNPOPage = location.pathname.includes(NAVLINKPATH.NPO);

  return (
    <div className="ml-5 flex flex-row justify-between w-128 shadow-2xl items-center text-sm font-red-hat-text">
      <NavLink
        to={`${networkUrlParam}${NAVLINKPATH.Transact}`}
        className={classNames(
          'py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold',
          {
            ' text-white text-opacity-100 font-bold': isActiveTransactPage
          }
        )}>
        MantaPay
      </NavLink>
      <NavLink
        to={`${networkUrlParam}${NAVLINKPATH.Bridge}`}
        className={classNames(
          'py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold',
          {
            'text-white text-opacity-100 font-bold': isActiveBridgePage
          }
        )}>
        Bridge
      </NavLink>
      <NavLink
        to={`${networkUrlParam}${NAVLINKPATH.NPO}`}
        className={classNames(
          'py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold',
          {
            'text-white text-opacity-100 font-bold': isActiveNPOPage
          }
        )}>
        NPO
      </NavLink>
      {!isDolphinPage && (
        <NavLink
          to={`${networkUrlParam}${NAVLINKPATH.Stake}`}
          className={classNames(
            'py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold',
            {
              ' text-white text-opacity-100 font-bold': isActiveStakePage
            }
          )}>
          Staking
        </NavLink>
      )}
      <a
        href="https://forum.manta.network/"
        className="py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold"
        target="_blank"
        rel="noreferrer">
        Govern
      </a>
      <a
        href={`https://${NETWORK_NAME.toLowerCase()}.subscan.io/`}
        className="py-3 text-white text-opacity-60 text-center hover:text-white hover:text-opacity-100 hover:font-bold"
        target="_blank"
        rel="noreferrer">
        Block Explorer
      </a>
    </div>
  );
};

export default NavLinks;
