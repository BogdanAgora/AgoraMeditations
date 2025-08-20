import Image from 'next/image';
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { FaTiktok, FaPinterest, FaReddit } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/agorameditations?igsh=MXQ2aGs1c2ZhbTdlMA==', 
      icon: Instagram 
    },
    { 
      name: 'TikTok', 
      url: 'https://www.tiktok.com/@agorameditations', 
      icon: FaTiktok 
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/profile.php?id=61579235378242', 
      icon: Facebook 
    },
    { 
      name: 'Pinterest', 
      url: 'https://www.pinterest.com/thelovingsounds/_profile/', 
      icon: FaPinterest 
    },
    { 
      name: 'Reddit', 
      url: 'https://www.reddit.com/user/AgoraMeditations/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button', 
      icon: FaReddit 
    }
  ];

  return (
    <footer className="bg-card shadow-t-md py-8 text-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-4">
          <Image 
            src="/icon.png" 
            alt="AgoraMeditations Logo" 
            width={24} 
            height={24} 
            className="h-6 w-6"
            data-ai-hint="logo"
          />
          <p className="ml-2 text-sm text-muted-foreground" data-ai-hint="copyright text">
            AgoraMeditations &copy; {currentYear}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 mb-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label={`Follow us on ${social.name}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Cultivating peace and mindfulness, one breath at a time.
        </p>
      </div>
    </footer>
  );
}
