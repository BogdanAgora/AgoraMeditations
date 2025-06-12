import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-card shadow-t-md py-8 text-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-4">
          <Image 
            src="/Agora_logo_bkg_negru.png" 
            alt="AgoraMeditation Logo" 
            width={24} 
            height={24} 
            className="h-6 w-6"
            data-ai-hint="logo"
          />
          <p className="ml-2 text-sm text-muted-foreground">
            AgoraMeditation &copy; {new Date().getFullYear()}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Cultivating peace and mindfulness, one breath at a time.
        </p>
      </div>
    </footer>
  );
}
