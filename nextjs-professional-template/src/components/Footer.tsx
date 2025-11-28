const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-800 p-4 text-white">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} My Awesome App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
