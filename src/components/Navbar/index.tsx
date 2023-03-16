import AccountSelectMenu from 'components/Accounts/AccountSelectMenu';
import Menu from 'components/Menu/DotMenu';
import NavLinks from './NavLinks';
import ChainSelector from './ChainSelector';
import ZkAccountButton from './ZkAccountButton';

export type NavbarProps = {
  showZkBtn?: boolean;
};

export const Navbar = ({ showZkBtn }: NavbarProps) => {
  const isSendPage = window?.location?.pathname?.includes('/transact');
  return (
    <div className="h-20 py-4 px-10 flex justify-between items-center relative sticky left-0 right-0 top-0 z-50 bg-primary">
      <div className="flex items-center">
        <ChainSelector/>
        <NavLinks />
      </div>
      <div className="h-10 gap-4 flex flex-wrap justify-end items-center">
      {showZkBtn && <ZkAccountButton />}
        <AccountSelectMenu />
        <Menu />
      </div>
    </div>
  );
};

export default Navbar;
