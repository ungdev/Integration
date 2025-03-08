import React from 'react';

interface NavbarProps {
  role: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  return (
    <nav>
      <ul>
        <li>Accueil</li>
        {role === 'admin' && <li>Admin</li>}
        {role && role !== 'admin' && <li>Utilisateur</li>}
      </ul>
    </nav>
  );
};

export default Navbar;
