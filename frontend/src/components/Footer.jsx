import { FaHeart } from 'react-icons/fa';

const Footer = () => (
  <footer className="mt-auto py-8 bg-gradient-to-r from-church-purple to-church-pink text-white text-center">
    <p className="text-lg font-bold flex items-center justify-center gap-2">
      Developed By Phelobater Bassem 
    </p>
    <p className="text-sm opacity-80 mt-2">© {new Date().getFullYear()} خدمة خامسة وسادسة ابتدائي </p>
  </footer>
);

export default Footer;
